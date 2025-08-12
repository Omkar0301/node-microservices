const { User } = require('../models');
const rabbitMQClient = require('../config/rabbitmq');
const dataJoiner = require('../../../shared/utils/dataJoiner');
const logger = require('../../../shared/utils/logger');

class UserService {
  constructor() {
    this.initializeRabbitMQ();
  }

  async initializeRabbitMQ() {
    try {
      const queue = await rabbitMQClient.connect();
      await rabbitMQClient.consumeEvent(queue, async msg => {
        try {
          const event = JSON.parse(msg.content.toString());
          if (event.eventType === 'user_created') {
            await this.handleUserCreatedEvent(event.data);
          } else if (event.eventType === 'user_email_updated') {
            await this.handleUserEmailUpdatedEvent(event.data);
          }
        } catch (error) {
          logger.error('Error processing RabbitMQ message:', error);
        }
      });
      logger.info('User-Service RabbitMQ consumer initialized');
    } catch (error) {
      logger.error('Failed to initialize RabbitMQ consumer:', error);
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

  async createUser(userData) {
    const user = await User.create(userData);
    const userResponse = user.toJSON();
    delete userResponse.password;
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
      users = await dataJoiner.joinData(users, {
        serviceName: 'productService',
        endpointName: 'getProductsByUserIds',
        foreignKey: 'id',
        joinKey: 'userId',
        as: 'products',
        internal: true,
      });
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
    return userResponse;
  }

  async deleteUser(id) {
    const user = await User.findByPk(id);
    if (!user) throw new Error('User not found');
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
