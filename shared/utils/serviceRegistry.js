require('dotenv').config({ path: require('path').join(__dirname, '../../.env.development') });

class ServiceRegistry {
  constructor() {
    this.services = {
      userService: {
        url: process.env.USER_SERVICE_URL,
        endpoints: {
          createUser: { method: 'POST', path: '/api/users' },
          getUsersByIds: { method: 'POST', path: '/api/users/batch' },
          getUserById: { method: 'GET', path: '/api/users/:id' },
          getUserByEmail: { method: 'GET', path: '/api/users/by-email?email=:email' },
        },
      },
      productService: {
        url: process.env.PRODUCT_SERVICE_URL,
        endpoints: {
          getProductsByUserIds: { method: 'POST', path: '/api/products/by-users' },
          getProductsByIds: { method: 'POST', path: '/api/products/batch' },
          getProductById: { method: 'GET', path: '/api/products/:id' },
        },
      },
      authService: {
        url: process.env.AUTH_SERVICE_URL,
        endpoints: {
          register: { method: 'POST', path: '/api/auth/register' },
          login: { method: 'POST', path: '/api/auth/login' },
          refreshToken: { method: 'POST', path: '/api/auth/refresh-token' },
          logout: { method: 'POST', path: '/api/auth/logout' },
        },
      },
    };
  }

  getServiceEndpoint(serviceName, endpointName) {
    const service = this.services[serviceName];
    if (!service) throw new Error(`Service ${serviceName} not found`);
    const endpoint = service.endpoints[endpointName];
    if (!endpoint) throw new Error(`Endpoint ${endpointName} not found in ${serviceName}`);
    return { url: service.url, endpoint };
  }
}

module.exports = new ServiceRegistry();
