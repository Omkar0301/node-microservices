const amqp = require('amqplib');
const logger = require('../../../shared/utils/logger');

class RabbitMQClient {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.retryAttempts = 5;
    this.retryDelay = 3000;
  }

  async connect() {
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        this.connection = await amqp.connect(process.env.RABBITMQ_URL);
        this.channel = await this.connection.createChannel();
        await this.channel.assertExchange('auth_events', 'fanout', { durable: true });
        const q = await this.channel.assertQueue('', { exclusive: true });
        await this.channel.bindQueue(q.queue, 'auth_events', '');
        logger.info('RabbitMQ connected and queue bound to auth_events');
        return q.queue;
      } catch (error) {
        logger.error(`RabbitMQ connection attempt ${attempt} failed:`, error);
        if (attempt === this.retryAttempts) {
          throw new Error('Failed to connect to RabbitMQ after retries');
        }
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
      }
    }
  }

  async consumeEvent(queue, callback) {
    if (!this.channel) {
      throw new Error('RabbitMQ channel not initialized');
    }
    await this.channel.consume(queue, msg => {
      if (msg) {
        callback(msg);
        this.channel.ack(msg);
      }
    });
    logger.info(`Started consuming messages from queue: ${queue}`);
  }

  async close() {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
    logger.info('RabbitMQ connection closed');
  }
}

module.exports = new RabbitMQClient();
