'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');
const { default: helmet } = require('helmet');

require('dotenv').config();

const app = express();

// Middlewares
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(compression());

// Databases
require('./databases/init.mongodb');

// Routes
app.use('/', require('./routes'));

// Handle errors
app.all('*', (req, res, next) => {
  next(new Error(`Can not find ${req.originalUrl} on this server!`, 404));
});

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  return res.status(statusCode).json({
    status: 'error',
    message: err.messages,
  });
});

module.exports = app;
