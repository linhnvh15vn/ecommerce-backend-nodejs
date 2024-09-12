'use strict';

const CartService = require('../services/cart.service');
const { Ok } = require('../core/success.response');
const { catchAsync } = require('../utils');

class CartController {
  findUserCart = catchAsync(async (req, res, next) => {
    return new Ok({
      data: await CartService.findUserCart(req.query.userId),
    }).send(res);
  });

  addToCart = catchAsync(async (req, res, next) => {
    return new Ok({
      data: await CartService.addToCart(req.body),
    }).send(res);
  });

  updateCartQuantity = catchAsync(async (req, res, next) => {
    return new Ok({
      data: await CartService.updateCartQuantity(req.body),
    }).send(res);
  });

  removeProductFormCart = catchAsync(async (req, res, next) => {
    return new Ok({
      data: await CartService.removeProductFromCart(req.body),
    }).send(res);
  });
}

module.exports = new CartController();
