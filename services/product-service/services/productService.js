const { Product, UserSnapshot } = require('../models');
const { Op } = require('sequelize');
const rabbitMQUserConsumer = require('../config/rabbitmqUserConsumer'); // New consumer for user_events
const rabbitMQPublisher = require('../config/rabbitmqPublisher'); // New publisher for product_events
const logger = require('../../../shared/utils/logger');

class ProductService {
  constructor() {
    this.publisher = rabbitMQPublisher;
    this.initializeRabbitMQ();
  }

  async initializeRabbitMQ() {
    try {
      await this.publisher.connect();
      const userQueue = await rabbitMQUserConsumer.connect();
      await rabbitMQUserConsumer.consumeEvent(userQueue, async msg => {
        try {
          const event = JSON.parse(msg.content.toString());
          if (event.eventType === 'user_created' || event.eventType === 'user_updated') {
            await this.handleUserEvent(event.data);
          } else if (event.eventType === 'user_deleted') {
            await this.handleUserDeletedEvent(event.data);
          }
        } catch (error) {
          logger.error('Error processing user RabbitMQ message:', error);
        }
      });

      logger.info('Product-Service RabbitMQ initialized (consumer and publisher)');
    } catch (error) {
      logger.error('Failed to initialize RabbitMQ:', error);
    }
  }

  async handleUserEvent(data) {
    try {
      await UserSnapshot.upsert({
        id: data.id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        isActive: data.isActive,
      });
      logger.info(`User snapshot handled: ${data.id}`);
    } catch (error) {
      logger.error(`Failed to handle user event for ${data.id}:`, error);
    }
  }

  async handleUserDeletedEvent({ id }) {
    try {
      await UserSnapshot.destroy({ where: { id } });
      logger.info(`User snapshot deleted: ${id}`);
    } catch (error) {
      logger.error(`Failed to delete user snapshot ${id}:`, error);
    }
  }

  async createProduct(productData) {
    const { userId } = productData;
    const userSnapshot = await UserSnapshot.findByPk(userId);
    if (!userSnapshot) {
      throw new Error('Invalid userId: User does not exist');
    }
    const product = await Product.create(productData);
    const productJson = product.toJSON();
    await this.publisher.publishEvent('product_created', productJson);
    return productJson;
  }

  async getAllProducts(limit, offset, includeUsers = false) {
    const { count, rows } = await Product.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    let products = rows.map(product => product.toJSON());

    if (includeUsers) {
      const userIds = products.map(p => p.userId);
      const uniqueUserIds = [...new Set(userIds)];
      const userSnapshots = await UserSnapshot.findAll({
        where: { id: { [Op.in]: uniqueUserIds } },
      });
      const userMap = new Map();
      userSnapshots.forEach(us => {
        userMap.set(us.id, us.toJSON());
      });
      products = products.map(p => ({
        ...p,
        user: userMap.get(p.userId) || null,
      }));
    }

    return {
      products,
      pagination: { total: count, limit, offset, pages: Math.ceil(count / limit) },
    };
  }

  async getProductById(id) {
    const product = await Product.findByPk(id);
    if (!product) throw new Error('Product not found');
    return product.toJSON();
  }

  async updateProduct(id, updateData) {
    const product = await Product.findByPk(id);
    if (!product) throw new Error('Product not found');
    await product.update(updateData);
    const productJson = product.toJSON();
    await this.publisher.publishEvent('product_updated', productJson);
    return productJson;
  }

  async deleteProduct(id) {
    const product = await Product.findByPk(id);
    if (!product) throw new Error('Product not found');
    await this.publisher.publishEvent('product_deleted', { id });
    await product.destroy();
  }

  async getProductsByIds(productIds) {
    if (!Array.isArray(productIds) || !productIds.length) throw new Error('Invalid product IDs');
    const products = await Product.findAll({ where: { id: productIds } });
    return products.map(product => product.toJSON());
  }

  async getProductsByUserIds(userIds) {
    if (!Array.isArray(userIds) || !userIds.length) throw new Error('Invalid user IDs');
    const products = await Product.findAll({
      where: { userId: userIds },
      order: [['createdAt', 'DESC']],
    });
    return products.map(product => product.toJSON());
  }
}

module.exports = new ProductService();
