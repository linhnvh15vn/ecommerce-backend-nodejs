'use strict';

const express = require('express');

const CartController = require('../controllers/cart.controller');
const AuthMiddleware = require('../middlewares/auth.middleware');

const cartRouter = express.Router();

cartRouter.get('/', CartController.findCartByUserId);
cartRouter.post('/', CartController.addToCart);
cartRouter.patch('/', CartController.updateQuantity);
cartRouter.delete('/', CartController.removeItem);

module.exports = cartRouter;
