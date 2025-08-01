require('dotenv').config({ path: require('path').join(__dirname, '../../.env.development') });

class ServiceRegistry {
  constructor() {
    this.services = {
      userService: {
        url: process.env.USER_SERVICE_URL,
        endpoints: {
          getUsersByIds: { method: 'POST', path: '/api/users/batch' },
          getUserById: { method: 'GET', path: '/api/users/:id' },
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
