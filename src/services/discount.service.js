'use strict';

const { BadRequest, NotFound } = require('../core/error.response');
const ProductRepository = require('../models/repositories/product.repository');
const Discount = require('../models/discount.schema');
const DiscountRepository = require('../models/repositories/discount.repository');

class DiscountService {
  static testError() {
    throw new BadRequest('test error');
  }

  //
  static async createDiscount(body) {
    if (
      new Date() < new Date(body.startDate) ||
      new Date() > new Date(body.endDate)
    ) {
      throw new BadRequest('Discount code has expired!');
    }

    if (new Date(body.startDate) > new Date(body.endDate)) {
      throw new BadRequest('invalid date');
    }

    const foundDiscount = await Discount.findOne({
      code: body.code,
      shopId: body.shopId,
    }).lean();

    if (foundDiscount) {
      throw new BadRequest('Discount has been existed!');
    }

    const newDiscount = await Discount.create(body);

    return newDiscount;
  }

  static async updateDiscount(discountId, body) {}

  /**
   *
   * @param {*} param0
   * @returns
   */
  static async findAllProductsWithDiscount({
    code,
    shopId,
    userId,
    limit,
    page,
  }) {
    const foundDiscount = await Discount.findOne({
      code: body.code,
      shopId: body.shopId,
    }).lean();
    if (!foundDiscount || !foundDiscount.isActive) {
      throw new NotFound();
    }

    let products;
    if (foundDiscount.applyTo === 'all') {
      products = await ProductRepository.findAllProducts({
        filter: { product_shop: shopId, is_published: true },
      });
    }

    if (foundDiscount.applyTo === 'only') {
      products = await ProductRepository.findAllProducts({
        filter: {
          _id: { $in: foundDiscount.productIds },
          is_published: true,
        },
      });
    }

    return products;
  }

  /**
   *
   * @param {*} shopId
   * @returns
   */
  static async findAllShopDiscounts(shopId) {
    const discounts = await DiscountRepository.findAllDiscounts({
      filter: { shopId, isActive: true },
    });

    return discounts;
  }

  static async getDiscountAmount({ code, userId, shopId, products }) {
    const foundDiscount = await DiscountRepository.findOneDiscount({
      filter: {
        code,
        shopId,
      },
    });

    if (!foundDiscount) {
      throw new NotFound();
    }

    const {
      isActive,
      useCount,
      maxUse,
      minOrderValue,
      startDate,
      endDate,
      usedByUserIds,
    } = foundDiscount;

    if (!isActive) {
      throw new BadRequest();
    }
    if (!useCount) {
      throw new BadRequest();
    }
    if (new Date() < new Date(startDate) || new Date() > new Date(endDate)) {
      throw new BadRequest();
    }

    let totalOrder = 0;
    if (minOrderValue > 0) {
      totalOrder = products.reduce(
        (acc, product) => acc + product.quantity * product.price,
        0,
      );

      if (totalOrder < minOrderValue) {
        throw new BadRequest();
      }
    }

    if (maxUse > 0) {
      const isUserUse = usedByUserIds.find((user) => user._id === userId);
      if (isUserUse) {
      }
    }

    const amount =
      foundDiscount.type === 'fixed'
        ? foundDiscount.value
        : totalOrder * (foundDiscount.value / 100);

    return {
      totalOrder,
      amount,
      totalPrice: totalOrder - amount,
    };
  }

  static async deleteDiscount({ code, shopId }) {
    await Discount.findByIdAndDelete({
      code,
      shopId,
    });

    return;
  }

  static async cancelDiscount({ code, shopId, userId }) {
    const foundDiscount = await DiscountRepository.findOneDiscount({
      filter: {
        code,
        shopId,
      },
    });
    if (!foundDiscount) {
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
