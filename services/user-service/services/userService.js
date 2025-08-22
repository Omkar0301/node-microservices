const { User, ProductSnapshot } = require('../models');
const { Op } = require('sequelize');
const rabbitMQAuthConsumer = require('../config/rabbitmqAuthConsumer'); // Renamed for clarity (original consumer for auth_events)
const rabbitMQProductConsumer = require('../config/rabbitmqProductConsumer'); // New consumer for product_events
const rabbitMQPublisher = require('../config/rabbitmqPublisher'); // New publisher for user_events
const logger = require('../../../shared/utils/logger');

class UserService {
  constructor() {
    this.publisher = rabbitMQPublisher;
    this.initializeRabbitMQ();
  }

  async initializeRabbitMQ() {
    try {
      await this.publisher.connect();

      const authQueue = await rabbitMQAuthConsumer.connect();
      await rabbitMQAuthConsumer.consumeEvent(authQueue, async msg => {
        try {
          const event = JSON.parse(msg.content.toString());
          let user = null;

          if (event.eventType === 'user_created') {
            await this.handleUserCreatedEvent(event.data);
            user = await User.findByPk(event.data.id, {
              attributes: { exclude: ['password'] },
            });
          } else if (event.eventType === 'user_email_updated') {
            await this.handleUserEmailUpdatedEvent(event.data);
            user = await User.findByPk(event.data.id, {
              attributes: { exclude: ['password'] },
            });
          }

          if (user) {
            await this.publisher.publishEvent('user_updated', user.toJSON());
          }
        } catch (error) {
          logger.error('Error processing RabbitMQ message:', error);
        }
      });
      const productQueue = await rabbitMQProductConsumer.connect();
      await rabbitMQProductConsumer.consumeEvent(productQueue, async msg => {
        try {
          const event = JSON.parse(msg.content.toString());
          if (event.eventType === 'product_created' || event.eventType === 'product_updated') {
            await this.handleProductEvent(event.data);
          } else if (event.eventType === 'product_deleted') {
            await this.handleProductDeletedEvent(event.data);
          }
        } catch (error) {
          logger.error('Error processing product RabbitMQ message:', error);
        }
      });

      logger.info('User-Service RabbitMQ initialized (consumers and publisher)');
    } catch (error) {
      logger.error('Failed to initialize RabbitMQ:', error);
    }
  }

  async handleUserCreatedEvent({ id, email, firstName, lastName, isActive }) {
    try {
      const [user, created] = await User.findOrCreate({
        where: { email },
        defaults: {
          id,
          email,
          firstName,
          lastName,
          isActive,
        },
      });
      if (created) {
        logger.info(`User created: ${email}`);
      } else {
        logger.info(`User already exists: ${email}`);
      }
    } catch (error) {
      logger.error(`Failed to handle user_created event for ${email}:`, error);
    }
  }

  async handleUserEmailUpdatedEvent({ id, email, isActive }) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        logger.warn(`User not found for email update: ${id}`);
        return;
      }
      await user.update({ email, isActive });
      logger.info(`User email updated successfully for user ID ${id}: ${email}`);
    } catch (error) {
      logger.error(`Failed to handle user_email_updated event for user ID ${id}:`, error);
    }
  }

  async handleProductEvent(data) {
    try {
      await ProductSnapshot.upsert(data);
      logger.info(`Product snapshot handled: ${data.id}`);
    } catch (error) {
      logger.error(`Failed to handle product event for ${data.id}:`, error);
    }
  }

  async handleProductDeletedEvent({ id }) {
    try {
      await ProductSnapshot.destroy({ where: { id } });
      logger.info(`Product snapshot deleted: ${id}`);
    } catch (error) {
      logger.error(`Failed to delete product snapshot ${id}:`, error);
    }
  }

  async createUser(userData) {
    const user = await User.create(userData);
    const userResponse = user.toJSON();
    delete userResponse.password;
    await this.publisher.publishEvent('user_created', userResponse);
    return userResponse;
  }

  async getAllUsers(limit, offset, includeProducts = false) {
    const { count, rows } = await User.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['password'] },
    });

    let users = rows.map(user => user.toJSON());

    if (includeProducts) {
      const userIds = users.map(u => u.id);
      const products = await ProductSnapshot.findAll({
        where: { userId: { [Op.in]: userIds } },
      });
      const productMap = new Map();
      products.forEach(p => {
        const userId = p.userId;
        if (!productMap.has(userId)) {
          productMap.set(userId, []);
        }
        productMap.get(userId).push(p.toJSON());
      });
      users = users.map(u => ({
        ...u,
        products: productMap.get(u.id) || [],
      }));
    }

    return {
      users,
      pagination: { total: count, limit, offset, pages: Math.ceil(count / limit) },
    };
  }

  async getUserById(id) {
    const user = await User.findByPk(id, { attributes: { exclude: ['password'] } });
    if (!user) throw new Error('User not found');
    return user.toJSON();
  }

  async getUserByEmail(email) {
    const user = await User.findOne({ where: { email }, attributes: { include: ['password'] } });
    if (!user) throw new Error('User not found');
    return user.toJSON();
  }

  async updateUser(id, updateData) {
    if ('email' in updateData) {
      throw new Error('Email cannot be updated');
    }
    const user = await User.findByPk(id);
    if (!user) throw new Error('User not found');
    await user.update(updateData);
    const userResponse = user.toJSON();
    delete userResponse.password;
    await this.publisher.publishEvent('user_updated', userResponse);
    return userResponse;
  }

  async deleteUser(id) {
    const user = await User.findByPk(id);
    if (!user) throw new Error('User not found');
    await this.publisher.publishEvent('user_deleted', { id });
    await user.destroy();
  }

  async getUsersByIds(userIds) {
    if (!Array.isArray(userIds) || !userIds.length) throw new Error('Invalid user IDs');
    const users = await User.findAll({
      where: { id: userIds },
      attributes: { exclude: ['password'] },
    });
    return users.map(user => user.toJSON());
  }
}

module.exports = new UserService();
