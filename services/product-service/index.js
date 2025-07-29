require('dotenv').config({ path: '.env.development' });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const logger = require('../../shared/utils/logger');
const errorHandler = require('../../shared/middleware/errorHandler');
const healthRoutes = require('./routes/health');
const productRoutes = require('./routes/productsRoutes');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });
  next();
});

// Routes
app.use('/health', healthRoutes);
app.use('/api/products', productRoutes);

// 404 handler
app.use('*', (req, res) => {
  const ApiResponse = require('../../../shared/utils/responseFormatter');
  const response = ApiResponse.notFound('Route not found');
  res.status(response.statusCode).json(response);
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`Product service running on port ${PORT}`);
});

module.exports = app;
