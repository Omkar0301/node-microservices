/* eslint-disable no-process-exit */
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const logger = require('./shared/utils/logger');

const servicesDir = path.join(__dirname, 'services');

const services = fs.readdirSync(servicesDir).filter(name => {
  const servicePath = path.join(servicesDir, name);
  return fs.existsSync(path.join(servicePath, 'package.json'));
});

if (services.length === 0) {
  logger.warn('No services found to install');
  process.exit(0);
}

logger.info(`Found ${services.length} services to install: ${services.join(', ')}`);

services.forEach((service, index) => {
  const servicePath = path.join(servicesDir, service);
  const command = process.platform === 'win32' ? 'npm.cmd' : 'npm';

  logger.info(`[${index + 1}/${services.length}] Installing dependencies for ${service}...`);

  const install = spawn(command, ['install'], {
    cwd: servicePath,
    stdio: 'inherit',
    shell: true,
  });

  install.on('error', error => {
    logger.error(`Error installing ${service}: ${error.message}`);
  });

  install.on('close', code => {
    if (code === 0) {
      logger.info(`✅ Successfully installed dependencies for ${service}`);
    } else {
      logger.error(`❌ Failed to install dependencies for ${service}`);
    }
  });
});
