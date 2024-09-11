'use strict';

const DiscountService = require('../services/discount.service');
const { catchAsync } = require('../utils');
const { Ok, Created } = require('../core/success.response');

class DiscountController {
  testError = catchAsync(async (req, res, next) => {
    return new Created({
      data: DiscountService.testError(),
    }).send(res);
  });

  createDiscount = catchAsync(async (req, res, next) => {
    return new Created({
      data: await DiscountService.createDiscount({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  });

  findAllShopDiscounts = catchAsync(async (req, res, next) => {
    return new Ok({
      data: await DiscountService.findAllShopDiscounts(req.user.userId),
    }).send(res);
  });

  getDiscountAmount = catchAsync(async (req, res, next) => {
    return new Ok({
      data: await DiscountService.getDiscountAmount(req.body),
    }).send(res);
  });

  findAllProductsWithDiscount = catchAsync(async (req, res, next) => {
    return new Ok({
      data: await DiscountService.findAllProductsWithDiscount({
        ...req.query,
        // shopId: req.user.userId,
      }),
    }).send(res);
  });
}

module.exports = new DiscountController();
