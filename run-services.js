const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const logger = require('./shared/utils/logger');

const mode = process.argv[2] || 'dev'; // 'dev' or 'start'
const servicesDir = path.join(__dirname, 'services');

const services = fs
  .readdirSync(servicesDir)
  .filter(name => fs.existsSync(path.join(servicesDir, name, 'package.json')));

services.forEach(service => {
  const servicePath = path.join(servicesDir, service);
  const command = process.platform === 'win32' ? 'npm.cmd' : 'npm';

  logger.info(`Running '${mode}' for ${service}...`);

  spawn(command, ['run', mode], {
    cwd: servicePath,
    stdio: 'inherit',
    shell: true,
  });
});
