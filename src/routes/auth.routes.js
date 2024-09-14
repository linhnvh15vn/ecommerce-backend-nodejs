'use strict';

const express = require('express');

const authController = require('../controllers/auth.controller');
const AuthMiddleware = require('../middlewares/auth.middleware');

const authRouter = express.Router();

authRouter.post('/signup', authController.signUp);
authRouter.post('/login', authController.logIn);

authRouter.use(AuthMiddleware.authenticate);

module.exports = authRouter;
