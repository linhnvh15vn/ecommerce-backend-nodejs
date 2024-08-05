'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');
const { default: helmet } = require('helmet');

const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(compression);
// Routers

// Handle errors

module.exports = app;
