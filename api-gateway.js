/* eslint-disable no-unused-vars */
require('dotenv').config({ path: '.env.development' });
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('./shared/utils/logger');
const ApiResponse = require('./shared/utils/responseFormatter');
const { authenticateJWT } = require('./shared/utils/authUtils');

const app = express();
const PORT = process.env.GATEWAY_PORT || 3000;
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002';
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3003';

app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path} -> Gateway`, {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  const healthData = {
    status: 'OK',
    message: 'API Gateway is running',
    services: {
      userService: USER_SERVICE_URL,
      productService: PRODUCT_SERVICE_URL,
      authService: AUTH_SERVICE_URL,
    },
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  };

  res.json(ApiResponse.success(healthData, 'Gateway health check successful'));
});

// Proxy middleware for Auth Service
const authServiceProxy = createProxyMiddleware({
  target: AUTH_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/auth': '/api/auth',
  },
  onError: (err, req, res) => {
    logger.error('Auth Service Error', {
      error: err.message,
      service: 'auth-service',
      method: req.method,
      path: req.path,
    });

    if (!res.headersSent) {
      res
        .status(503)
        .json(ApiResponse.error('Auth Service unavailable', 503, { originalError: err.message }));
    }
  },
  onProxyReq: (proxyReq, req, res) => {
    logger.info(`${req.method} ${req.path} -> Auth Service (${AUTH_SERVICE_URL})`, {
      method: req.method,
      path: req.path,
      target: 'auth-service',
    });
  },
});

// Proxy middleware for User Service
const userServiceProxy = createProxyMiddleware({
  target: USER_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/users': '/api/users',
  },
  onError: (err, req, res) => {
    logger.error('User Service Error', {
      error: err.message,
      service: 'user-service',
      method: req.method,
      path: req.path,
    });

    if (!res.headersSent) {
      res
        .status(503)
        .json(ApiResponse.error('User Service unavailable', 503, { originalError: err.message }));
    }
  },
  onProxyReq: (proxyReq, req, res) => {
    logger.info(`${req.method} ${req.path} -> User Service (${USER_SERVICE_URL})`, {
      method: req.method,
      path: req.path,
      target: 'user-service',
    });
  },
});

// Proxy middleware for Product Service
const productServiceProxy = createProxyMiddleware({
  target: PRODUCT_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/products': '/api/products',
  },
  onError: (err, req, res) => {
    logger.error('Product Service Error', {
      error: err.message,
      service: 'product-service',
      method: req.method,
      path: req.path,
    });

    if (!res.headersSent) {
      res
        .status(503)
        .json(
          ApiResponse.error('Product Service unavailable', 503, { originalError: err.message })
        );
    }
  },
  onProxyReq: (proxyReq, req, res) => {
    logger.info(`${req.method} ${req.path} -> Product Service (${PRODUCT_SERVICE_URL})`, {
      method: req.method,
      path: req.path,
      target: 'product-service',
    });
  },
});

// Route requests to appropriate services
app.use('/api/auth', authServiceProxy);
app.use('/api/users', authenticateJWT, userServiceProxy);
app.use('/api/products', authenticateJWT, productServiceProxy);

// Default route
app.get('/', (req, res) => {
  const gatewayInfo = {
    message: 'API Gateway is running',
    endpoints: {
      auth: '/api/auth/*',
      users: '/api/users/*',
      products: '/api/products/*',
      health: '/health',
    },
    services: {
      authService: AUTH_SERVICE_URL,
      userService: USER_SERVICE_URL,
      productService: PRODUCT_SERVICE_URL,
    },
    documentation: '/docs',
  };

  res.json(ApiResponse.success(gatewayInfo, 'API Gateway is operational'));
});

// Handle 404 for undefined routes
app.use('*', (req, res) => {
  res.status(404).json(ApiResponse.notFound(`Endpoint '${req.originalUrl}' does not exist.`));
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Gateway Error', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    path: req.path,
    ip: req.ip,
  });

  res
    .status(500)
    .json(ApiResponse.error('Internal Server Error', 500, { originalError: err.message }));
});

// Start the gateway
app.listen(PORT, () => {
  logger.info(`🚀 API Gateway started successfully`, {
    port: PORT,
    authService: AUTH_SERVICE_URL,
    userService: USER_SERVICE_URL,
    productService: PRODUCT_SERVICE_URL,
    endpoints: {
      auth: `http://localhost:${PORT}/api/auth/*`,
      users: `http://localhost:${PORT}/api/users/*`,
      products: `http://localhost:${PORT}/api/products/*`,
      health: `http://localhost:${PORT}/health`,
    },
  });
});

module.exports = app;
