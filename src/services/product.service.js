'use strict';

const { Product } = require('../models/product.schema');
const ProductFactory = require('../factories/product.factory');
const ProductRepository = require('../models/repositories/product.repository');
const { selectFields, excludeFields } = require('../utils');

class ProductService {
  static async findAllProducts({ query, skip = 0, limit = 50 }) {
    const filter = { ...query, is_publish: true };
    const select = ['product_name', 'product_price', 'product_thumb'];

    return await ProductRepository.findAllProducts({
      query: filter,
      skip,
      limit,
      select,
    });
  }

  static async findProductById(productId) {
    const nonSelect = [];
    return await ProductRepository.findProductById({ productId, nonSelect });
  }

  static async findAllDraftProducts({ product_shop, skip = 0, limit = 50 }) {
    const query = { product_shop, is_draft: true };
    const products = await ProductRepository.findAllProducts({
      query,
      skip,
      limit,
    });

    return products;
  }

  static async findAllPublishedProducts({
    product_shop,
    skip = 0,
    limit = 50,
  }) {
    const query = { product_shop, is_published: true };
    const products = await ProductRepository.findAllProducts({
      query,
      skip,
      limit,
    });

    return products;
  }

  static async createProduct(body) {
    const newProduct = await ProductFactory.createProduct(type, body);
    return newProduct;
  }

  static async updateProduct(body) {
    const productType = (await Product.findById(body.product_id)).product_type;
    return await ProductFactory.updateProduct(productType, body);
  }

  static async searchProduct(q) {
    return await ProductRepository.searchProduct(q);
  }

  static async publishProduct({ productId, productShopId }) {
    const body = { is_draft: false, is_published: true };

    return await ProductRepository.findOneAndUpdate({
      productId,
      productShopId,
      body,
    });
  }

  static async unPublishProduct({ productId, productShopId }) {
    const body = { is_draft: true, is_published: false };

    return await ProductRepository.findOneAndUpdate({
      productId,
      productShopId,
      body,
    });
  }
}

module.exports = ProductService;
