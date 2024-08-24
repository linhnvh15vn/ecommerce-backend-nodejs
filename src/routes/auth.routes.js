'use strict';

const express = require('express');

const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');

const authRouter = express.Router();

authRouter.post('/signup', authController.signUp);
authRouter.post('/login', authController.logIn);

authRouter.use(authenticate);
authRouter.post('/logout', authController.logOut);

module.exports = authRouter;
