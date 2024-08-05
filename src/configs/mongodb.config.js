'use strict';

const development = {
  app: {
    port: process.env.APP_PORT_DEV || 8080,
  },
  db: {
    host: process.env.DB_HOST_DEV || '127.0.0.1',
    port: process.env.DB_PORT_DEV || 27017,
    name: process.env.DB_NAME_DEV || 'ecommerce-backend-nodejs',
  },
};

const production = {
  app: {
    port: process.env.APP_PORT_PROD || 8080,
  },
  db: {
    host: process.env.DB_HOST_PROD || '127.0.0.1',
    port: process.env.DB_PORT_PROD || 27017,
    name: process.env.DB_NAME_PROD || 'ecommerce-backend-nodejs',
  },
};

const config = { development, production };
const env = process.env.NODE_ENV || 'development';

console.log(config[env]);

module.exports = config[env];
