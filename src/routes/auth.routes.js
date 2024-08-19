'use strict';

const express = require('express');
const AuthController = require('../controllers/auth.controller');

const authRouter = express.Router();

authRouter.post('/sign-up', AuthController.signUp);

module.exports = authRouter;
