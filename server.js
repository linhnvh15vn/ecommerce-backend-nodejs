'use strict';

const app = require('./src/app');

const PORT = 8080;

const server = app.listen(PORT, () => {
  console.log(`Sever is running on PORT: ${PORT}`);
});

process.on('SIGINT', () => {
  server.close(() => {
    console.log('Exit Server');
  });
});
