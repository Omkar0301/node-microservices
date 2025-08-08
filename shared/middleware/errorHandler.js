/* eslint-disable no-unused-vars */
/* eslint-disable node/no-unsupported-features/es-syntax */
const ApiResponse = require('../utils/responseFormatter');
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  const error = { ...err };
  error.message = err.message;

  // Log error
  logger.error(err.message, {
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(error => ({
      field: error.path,
      message: error.message,
    }));
    const response = ApiResponse.validation(errors);
    return res.status(response.statusCode).json(response);
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    const errors = err.errors.map(error => ({
      field: error.path,
      message: `${error.value} already exists`,
    }));
    const response = ApiResponse.validation(errors);
    return res.status(response.statusCode).json(response);
  }

  // Sequelize foreign key constraint error
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    const response = ApiResponse.error('Invalid reference provided', 422);
    return res.status(response.statusCode).json(response);
  }

  // Sequelize record not found
  if (err.name === 'SequelizeEmptyResultError') {
    const response = ApiResponse.notFound();
    return res.status(response.statusCode).json(response);
  }

  // Default 500 server error
  const response = ApiResponse.error(error.message || 'Server Error');
  res.status(response.statusCode).json(response);
};

module.exports = errorHandler;
