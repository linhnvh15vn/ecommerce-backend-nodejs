'use strict';

const CartService = require('../services/cart.service');
const { Ok } = require('../core/success.response');
const { catchAsync } = require('../utils');

class CartController {
  findCartByUserId = catchAsync(async (req, res, next) => {
    return new Ok({
      data: await CartService.findCardByUserId(req.query.userId),
    }).send(res);
  });

  addToCart = catchAsync(async (req, res, next) => {
    return new Ok({
      data: await CartService.addToCart(req.body),
    }).send(res);
  });

  updateQuantity = catchAsync(async (req, res, next) => {
    return new Ok({
      data: await CartService.updateQuantity(req.body),
    }).send(res);
  });

  removeItem = catchAsync(async (req, res, next) => {
    return new Ok({
      data: await CartService.removeItem(req.body),
    }).send(res);
  });
}

module.exports = new CartController();
