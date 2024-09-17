'use strict';

const Discount = require('../discount.schema');

class DiscountRepository {
  static async find(filter) {
    const discounts = await Discount.find(filter).lean();
    return discounts;
  }

  static async findOne(filter) {
    const discount = await Discount.findOne(filter).lean();
    return discount;
  }

  static async create(body) {
    return await Discount.create(body);
  }

  static async findByIdAndDelete(_id) {
    return await Discount.findByIdAndDelete(_id).lean();
  }
}

module.exports = DiscountRepository;
