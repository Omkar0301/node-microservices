const axios = require('axios');
const logger = require('./logger');
const serviceRegistry = require('./serviceRegistry');

class HttpClient {
  constructor() {
    this.instance = axios.create({
      timeout: 5000,
      maxContentLength: 50 * 1024 * 1024,
    });
  }

  async request(serviceName, endpointName, params = {}, data = null) {
    const { url, endpoint } = serviceRegistry.getServiceEndpoint(serviceName, endpointName);
    try {
      const finalUrl = this.buildUrl(url, endpoint.path, params);
      const response = await this.instance({
        method: endpoint.method,
        url: finalUrl,
        data,
      });
      return response.data.data || response.data;
    } catch (error) {
      logger.error(`HTTP request failed to ${serviceName}.${endpointName}: ${error.message}`);
      throw error;
    }
  }

  buildUrl(baseUrl, path, params) {
    let finalUrl = `${baseUrl}${path}`;
    for (const [key, value] of Object.entries(params)) {
      finalUrl = finalUrl.replace(`:${key}`, value);
    }
    return finalUrl;
  }
}

module.exports = new HttpClient();
