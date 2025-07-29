const path = require('path');
const sharedConfig = require('../../../shared/config/database');

module.exports = {
  development: {
    ...sharedConfig.development,
    database: process.env.DB_NAME || 'product_service_db',
  },
  test: {
    ...sharedConfig.test,
    database: process.env.DB_NAME || 'product_service_test_db',
  },
  production: {
    ...sharedConfig.production,
    database: process.env.DB_NAME,
  },
};
