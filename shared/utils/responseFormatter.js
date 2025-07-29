const logger = require('../utils/logger');

class ApiResponse {
  static success(data = null, message = 'Success', statusCode = 200) {
    return {
      success: true,
      message,
      data,
      statusCode,
    };
  }

  static error(message = 'Internal Server Error', statusCode = 500, errors = null) {
    const response = {
      success: false,
      message,
      statusCode,
    };

    if (errors) {
      response.errors = errors;
    }

    if (statusCode >= 500) {
      logger.error(`API Error: ${message}`, { errors, statusCode });
    }

    return response;
  }

  static validation(errors) {
    return this.error('Validation failed', 422, errors);
  }

  static notFound(message = 'Resource not found') {
    return this.error(message, 404);
  }

  static unauthorized(message = 'Unauthorized') {
    return this.error(message, 401);
  }

  static forbidden(message = 'Forbidden') {
    return this.error(message, 403);
  }
}

module.exports = ApiResponse;
