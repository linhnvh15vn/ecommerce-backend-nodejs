'use strict';

const { excludeFields, selectFields } = require('../../utils');
const { ITEMS_PER_PAGE } = require('../../constants');
const { Product } = require('../product.schema');

class ProductRepository {
  static async findAll({ filter, page = 1, select }) {
    const skip = (page - 1) * ITEMS_PER_PAGE;

    const items = await Product.find(filter)
      .populate('shopId', '_id name email')
      .sort({ createdAt: 'asc' })
      .skip(skip)
      .limit(ITEMS_PER_PAGE)
      .select(select && selectFields(select))
      .lean();

    const currentItemCount = items.length;
    const totalItems = await Product.countDocuments(filter).lean();
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    return {
      currentItemCount,
      itemsPerPage: ITEMS_PER_PAGE,
      totalItems,
      totalPages,
      items,
    };
  }

  static async findById({ productId, nonSelect }) {
    return await Product.findById(productId)
      .select(excludeFields(nonSelect))
      .lean();
  }

  static async findOneAndUpdate(filter, body) {
    const product = await Product.findOneAndUpdate(filter, body, {
      new: true,
    }).lean();

    return product;
  }

  static async searchProduct(q) {
    const regQ = new RegExp(q);
    const products = await Product.find({
      isPublished: true,
      $text: { $search: regQ },
    }).lean();

    return products;
  }
}

module.exports = ProductRepository;
