'use strict';

const app = require('./src/app');

const PORT = process.env.APP_PORT_DEV;

const server = app.listen(PORT, () => {
  console.log(`Sever is running on PORT: ${PORT}`);
});

process.on('SIGINT', () => {
  server.close(() => {
    console.log('Exit Server');
  });
});
