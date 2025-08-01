/* eslint-disable node/no-unsupported-features/es-syntax */
const httpClient = require('./httpClient');
const logger = require('./logger');

class DataJoiner {
  async joinData(mainData, { serviceName, endpointName, foreignKey, joinKey, as }) {
    const dataArray = Array.isArray(mainData) ? mainData : [mainData];
    const joinIds = [...new Set(dataArray.map(item => item[foreignKey]).filter(id => id))];

    if (!joinIds.length) {
      logger.warn(`No valid IDs for joining ${serviceName}.${endpointName}`);
      return dataArray.map(item => ({ ...item, [as]: [] }));
    }

    try {
      logger.info(`Joining data from ${serviceName}.${endpointName} with IDs: ${joinIds}`);
      const joinedData = await httpClient.request(serviceName, endpointName, {}, { ids: joinIds });
      const joinedDataMap = new Map();
      joinedData.forEach(item => {
        const key = item[joinKey];
        if (!joinedDataMap.has(key)) {
          joinedDataMap.set(key, []);
        }
        joinedDataMap.get(key).push(item);
      });

      return dataArray.map(item => ({
        ...item,
        [as]: joinedDataMap.get(item[foreignKey]) || [],
      }));
    } catch (error) {
      logger.error(`Failed to join data from ${serviceName}.${endpointName}: ${error.message}`);
      return dataArray.map(item => ({ ...item, [as]: [] }));
    }
  }
}

module.exports = new DataJoiner();
