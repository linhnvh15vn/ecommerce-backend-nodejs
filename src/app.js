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
app.use(compression);

// Databases
require('./databases/init.mongodb');

// Routes
app.use('/', require('./routes'));
// Handle errors

module.exports = app;
