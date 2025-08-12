const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rabbitMQClient = require('../config/rabbitmq');
const { setAuthCookies, clearAuthCookies } = require('../../../shared/utils/authUtils');
const logger = require('../../../shared/utils/logger');
const { Auth } = require('../models');

class AuthService {
  constructor() {
    this.initializeRabbitMQ();
  }

  async initializeRabbitMQ() {
    try {
      await rabbitMQClient.connect();
      logger.info('RabbitMQ initialized for Auth-Service');
    } catch (error) {
      logger.error('Failed to initialize RabbitMQ:', error);
    }
  }

  async register(email, password, firstName, lastName) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await Auth.create({
      email,
      password: hashedPassword,
      isActive: true,
    });

    const userResponse = {
      id: user.id,
      email,
      firstName,
      lastName,
      isActive: user.isActive,
    };

    const accessToken = this.generateAccessToken({ userId: user.id });
    const refreshToken = this.generateRefreshToken({ userId: user.id });

    await rabbitMQClient.publishEvent('user_created', userResponse);

    return { user: userResponse, accessToken, refreshToken };
  }

  async login(email, password) {
    const user = await Auth.findOne({ where: { email } });
    if (!user || !user.isActive || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials or inactive user');
    }

    const userResponse = user.toJSON();
    delete userResponse.password;

    const accessToken = this.generateAccessToken({ userId: user.id });
    const refreshToken = this.generateRefreshToken({ userId: user.id });

    return { user: userResponse, accessToken, refreshToken };
  }

  async refreshToken(refreshToken) {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await Auth.findByPk(decoded.userId);
    if (!user || !user.isActive) {
      throw new Error('Invalid or inactive user');
    }

    const accessToken = this.generateAccessToken({ userId: decoded.userId });
    const newRefreshToken = this.generateRefreshToken({ userId: decoded.userId });

    return { accessToken, newRefreshToken };
  }

  async emailReset(userId, newEmail) {
    const user = await Auth.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const existing = await Auth.findOne({ where: { email: newEmail } });
    if (existing && existing.id !== userId) {
      throw new Error('Email already in use');
    }
    user.email = newEmail;
    await user.save();

    const eventData = {
      id: user.id,
      email: newEmail,
      isActive: user.isActive,
    };
    await rabbitMQClient.publishEvent('user_email_updated', eventData);

    return {
      id: user.id,
      email: newEmail,
      isActive: user.isActive,
    };
  }

  async passwordReset(email, newPassword) {
    const user = await Auth.findOne({ where: { email } });
    if (!user || !user.isActive) {
      throw new Error('User not found or inactive');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });
  }

  generateAccessToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
  }

  generateRefreshToken(payload) {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  }

  setAuthCookies(res, accessToken, refreshToken) {
    setAuthCookies(res, accessToken, refreshToken);
  }

  clearAuthCookies(res) {
    clearAuthCookies(res);
  }
}

module.exports = new AuthService();
