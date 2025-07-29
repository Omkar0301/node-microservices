const express = require('express');
const { sequelize } = require('../models');
const ApiResponse = require('../../../shared/utils/responseFormatter');
const asyncHandler = require('../../../shared/utils/asyncHandler');

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const healthcheck = {
      uptime: process.uptime(),
      message: 'OK',
      timestamp: new Date().toISOString(),
      service: 'product-service',
    };

    try {
      await sequelize.authenticate();
      healthcheck.database = 'connected';
      const response = ApiResponse.success(healthcheck, 'Health check passed');
      res.status(response.statusCode).json(response);
    } catch (error) {
      healthcheck.database = 'disconnected';
      healthcheck.error = error.message;
      const response = ApiResponse.error('Health check failed', 503, healthcheck);
      res.status(response.statusCode).json(response);
    }
  })
);

module.exports = router;
