const amqp = require('amqplib');
const logger = require('../../../shared/utils/logger');

class RabbitMQClient {
  constructor() {
    this.connection = null;
    this.channel = null;
  }

  async connect() {
    try {
      this.connection = await amqp.connect(process.env.RABBITMQ_URL);
      this.channel = await this.connection.createChannel();
      await this.channel.assertExchange('user_events', 'fanout', { durable: true });
      logger.info('RabbitMQ connected and exchange initialized for user_events');
    } catch (error) {
      logger.error('Failed to connect to RabbitMQ:', error);
      throw error;
    }
  }

  async publishEvent(eventType, data) {
    if (!this.channel) {
      logger.error('RabbitMQ channel not initialized');
      throw new Error('RabbitMQ channel not initialized');
    }
    const message = JSON.stringify({ eventType, data, timestamp: new Date().toISOString() });
    this.channel.publish('user_events', '', Buffer.from(message));
    logger.info(`Published event: ${eventType}`);
  }

  async close() {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
    logger.info('RabbitMQ connection closed');
  }
}

module.exports = new RabbitMQClient();
