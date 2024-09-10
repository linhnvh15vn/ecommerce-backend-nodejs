'use strict';

const { excludeFields, selectFields } = require('../../utils');
const { Product } = require('../product.schema');

class ProductRepository {
  static async findAllProducts({ query, limit, skip, select }) {
    return await Product.find(query)
      .populate('product_shop', '_id name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select(select && selectFields(select))
      .lean();
  }

  static async findProductById({ productId, nonSelect }) {
    return await Product.findById(productId)
      .select(excludeFields(nonSelect))
      .lean();
  }

  static async findOneAndUpdate({ productId, productShopId, body }) {
    const query = { _id: productId, product_shop: productShopId };
    const product = await Product.findOneAndUpdate(query, body, {
      new: true,
    });

    if (product) return null;

    return product;
  }

  static async searchProduct(q) {
    const regexSearch = new RegExp(q);
    const products = await Product.find({
      is_published: true,
      $text: { $search: regexSearch },
    }).lean();

    return products;
  }
}

module.exports = ProductRepository;
