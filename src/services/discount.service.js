'use strict';

const { BadRequest, NotFound } = require('../core/error.response');
const ProductRepository = require('../models/repositories/product.repository');
const DiscountRepository = require('../models/repositories/discount.repository');

class DiscountService {
  static async createDiscount(body) {
    if (new Date(body.startDate) > new Date(body.endDate)) {
      throw new BadRequest('Invalid date.');
    }

    const foundDiscount = await DiscountRepository.findOne({
      code: body.code,
      shopId: body.shopId,
    });
    if (foundDiscount) {
      throw new BadRequest('Discount has been existed!');
    }

    const newDiscount = await DiscountRepository.create(body);
    return newDiscount;
  }

  static async updateDiscount(discountId, body) {}

  static async findAllProductsWithDiscount({ code, shopId, page = 1 }) {
    const foundDiscount = await DiscountRepository.findOne({
      code,
      shopId,
    });
    if (!foundDiscount || !foundDiscount.isActive) {
      throw new NotFound(
        'No discount found with this code or discount is inactive.',
      );
    }

    let products;
    const select = ['_id', 'name', 'thumb', 'price'];

    if (foundDiscount.applyTo === 'all') {
      products = await ProductRepository.findAll({
        filter: { shopId, isPublished: true },
        page,
        select,
      });
    }

    if (foundDiscount.applyTo === 'only') {
      products = await ProductRepository.findAll({
        filter: {
          _id: { $in: foundDiscount.productIds },
          isPublished: true,
        },
        page,
        select,
      });
    }

    return products;
  }

  static async findAllShopDiscounts(shopId) {
    const discounts = await DiscountRepository.find({
      shopId,
      isActive: true,
    });

    return discounts;
  }

  static async getDiscountAmount({ code, userId, shopId, products }) {
    const foundDiscount = await DiscountRepository.findOne({
      code,
      shopId,
    });

    if (!foundDiscount) {
      throw new NotFound(
        'No discount with this code or not available with this shop.',
      );
    }

    const {
      isActive,
      usedCount,
      maxUsage,
      minOrderValue,
      startDate,
      endDate,
      usedBy,
    } = foundDiscount;

    if (!isActive) {
      throw new BadRequest('Discount is not active.');
    }
    if (usedCount > maxUsage) {
      throw new BadRequest('Expired discount code.');
    }
    if (new Date() < new Date(startDate) || new Date() > new Date(endDate)) {
      throw new BadRequest('Discount has been not started or has been ended.');
    }

    let totalOrder = 0;
    if (minOrderValue > 0) {
      totalOrder = products.reduce(
        (acc, product) => acc + product.quantity * product.price,
        0,
      );

      if (totalOrder < minOrderValue) {
        throw new BadRequest('The order has not reached the minimum value.');
      }
    }

    if (maxUsage > 0) {
      const isUsed = usedBy.find((user) => user._id === userId);
      if (isUsed) {
        throw BadRequest('You have already used this voucher');
      }
    }

    const discountAmount =
      foundDiscount.type === 'fixed'
        ? foundDiscount.value
        : totalOrder * (foundDiscount.value / 100);

    return {
      totalOrder,
      discountAmount,
      finalPrice: totalOrder - discountAmount,
    };
  }

  static async deleteDiscount(_id) {
    return await DiscountRepository.findByIdAndDelete(_id);
  }

  static async cancelDiscount({ code, shopId, userId }) {
    const foundDiscount = await DiscountRepository.findOne({
      code,
      shopId,
    });
    if (!foundDiscount) {
      throw new NotFound('No discount code found.');
    }

    const result = await Discount.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        usedByUserIds: userId,
      },
      $inc: {
        maxUse: 1,
        useCount: -1,
      },
    });

    return result;
  }
}

module.exports = DiscountService;
