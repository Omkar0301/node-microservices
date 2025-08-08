/* eslint-disable no-unused-vars */
require('dotenv').config({ path: require('path').join(__dirname, '/.env.development') });
const express = require('express');
const cors = require('cors');
const logger = require('../../shared/utils/logger');
const ApiResponse = require('../../shared/utils/responseFormatter');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('../../shared/middleware/errorHandler');

const app = express();
const PORT = process.env.AUTH_SERVICE_PORT || 3003;

app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path} -> Auth Service`, {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json(ApiResponse.success({ status: 'OK', message: 'Auth Service is running' }));
});

// Routes
app.use('/api/auth', authRoutes);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`🚀 Auth Service started on port ${PORT}`);
});

module.exports = app;
