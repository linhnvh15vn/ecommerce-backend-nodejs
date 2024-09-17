'use strict';

const DiscountService = require('../services/discount.service');
const { Ok, Created } = require('../core/success.response');
const { catchAsync } = require('../utils');

class DiscountController {
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
      data: await DiscountService.findAllShopDiscounts(req.query.shopId),
    }).send(res);
  });

  getDiscountAmount = catchAsync(async (req, res, next) => {
    return new Ok({
      data: await DiscountService.getDiscountAmount(req.body),
    }).send(res);
  });

  findAllProductsWithDiscount = catchAsync(async (req, res, next) => {
    return new Ok({
      data: await DiscountService.findAllProductsWithDiscount(req.query),
    }).send(res);
  });

  deleteDiscount = catchAsync(async (req, res, next) => {
    return new Ok({
      data: await DiscountService.deleteDiscount(req.params._id),
    }).send(res);
  });
}

module.exports = new DiscountController();
