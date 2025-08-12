/* eslint-disable node/no-unsupported-features/es-syntax */
const sharedConfig = require('../../../shared/config/database');

module.exports = {
  development: {
    ...sharedConfig.development,
    database: process.env.DB_NAME || 'auth_service_db',
  },
  test: {
    ...sharedConfig.test,
    database: process.env.DB_NAME || 'auth_service_test_db',
  },
  production: {
    ...sharedConfig.production,
    database: process.env.DB_NAME,
  },
};
