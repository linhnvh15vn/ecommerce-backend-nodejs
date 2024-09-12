'use strict';

const { excludeFields, selectFields } = require('../../utils');
const { ITEMS_PER_PAGE } = require('../../constants');
const { Product } = require('../product.schema');

class ProductRepository {
  static async findAllProducts({
    filter,
    page = 1,
    itemsPerPage = ITEMS_PER_PAGE,
    select,
  }) {
    const skip = (page - 1) * itemsPerPage;

    const items = await Product.find(filter)
      .populate('shop_id', '_id name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(itemsPerPage)
      .select(select && selectFields(select))
      .lean();

    const currentItemCount = items.length;
    const totalItems = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return {
      currentItemCount,
      itemsPerPage,
      totalItems,
      totalPages,
      items,
    };
  }

  static async findProductById({ productId, nonSelect }) {
    return await Product.findById(productId)
      .select(excludeFields(nonSelect))
      .lean();
  }

  static async findOneAndUpdate({ productId, productShopId, body }) {
    const query = { _id: productId, shop_id: productShopId };
    const product = await Product.findOneAndUpdate(query, body, {
      new: true,
    });

    if (product) return null;

    return product;
  }

  static async searchProduct(q) {
    const regQ = new RegExp(q);
    const products = await Product.find({
      is_published: true,
      $text: { $search: regQ },
    }).lean();

    return products;
  }
}

module.exports = ProductRepository;
