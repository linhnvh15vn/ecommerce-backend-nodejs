'use strict';

const Discount = require('../discount.schema');

class DiscountRepository {
  static async findAllDiscounts({ filter }) {
    const discounts = await Discount.find(filter).lean();
    return discounts;
  }

  static async findOneDiscount({ filter }) {
    const discount = await Discount.findOne(filter).lean();
    return discount;
  }
}

module.exports = DiscountRepository;
