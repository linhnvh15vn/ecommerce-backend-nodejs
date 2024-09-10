'use strict';

const { BadRequest, NotFound } = require('../core/error.response');
const Discount = require('../models/discount.schema');

class DiscountService {
  //
  static async createDiscount(body) {
    if (
      new Date() < new Date(body.startDate) ||
      new Date() > new Date(body.endDate)
    ) {
      throw new BadRequest('Discount code has expired!');
    }

    if (new Date(body.startDate) > new Date(body.enDate)) {
      throw new BadRequest();
    }

    const foundDiscount = await Discount.findOne({
      code: body.code,
      shopId: body.shopId,
    }).lean();
    if (foundDiscount) {
      throw new BadRequest();
    }

    const newDiscount = await Discount.create(body);

    return newDiscount;
  }

  static async updateDiscount(discountId, body) {}

  // Get all discount available with products
  static async findDiscounts({ code, shopId, userId, limit, page }) {
    // const foundDiscounts =
  }
}

module.exports = DiscountService;
