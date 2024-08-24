'use strict';

const express = require('express');
const AuthController = require('../controllers/auth.controller');
const { authentication } = require('../middlewares/auth.middleware');

const authRouter = express.Router();

authRouter.post('/sign-up', AuthController.signUp);
authRouter.post('/log-in', AuthController.logIn);

authRouter.use(authentication);
authRouter.post('/log-out', AuthController.logOut);

module.exports = authRouter;
