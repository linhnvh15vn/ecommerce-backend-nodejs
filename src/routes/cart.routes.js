'use strict';

const express = require('express');
const CartController = require('../controllers/cart.controller');
const AuthMiddleware = require('../middlewares/auth.middleware');

const cartRouter = express.Router();

cartRouter.get('/', CartController.findUserCart);
cartRouter.post('/', CartController.addToCart);
cartRouter.patch('/');
cartRouter.delete('/', CartController.removeProductFormCart);

cartRouter.use(AuthMiddleware.authenticate);

module.exports = cartRouter;
