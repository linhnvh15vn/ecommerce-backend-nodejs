'use strict';

const { Product } = require('../models/product.schema');
const ProductFactory = require('../factories/product.factory');
const ProductRepository = require('../models/repositories/product.repository');
const { cleanQueryParams } = require('../utils');

class ProductService {
  static async findAllProducts({ page, ...query }) {
    const filter = { ...query, isPublished: true };
    const select = ['name', 'price', 'thumb'];

    return await ProductRepository.findAll({
      filter,
      page,
      select,
    });
  }

  static async findAllDraftProducts(shopId, { page, ...query }) {
    const filter = { shopId, isDraft: true, ...query };
    const products = await ProductRepository.findAll({
      filter,
      page,
    });

    return products;
  }

  static async findAllPublishedProducts(shopId, { page, ...query }) {
    const filter = { shopId, isPublished: true, ...query };
    const products = await ProductRepository.findAll({
      filter,
      page,
    });

    return products;
  }

  static async findProductById(productId) {
    const nonSelect = [];
    return await ProductRepository.findById({ productId, nonSelect });
  }

  static async createProduct(body) {
    const newProduct = await ProductFactory.createProduct(body.type, body);
    return newProduct;
  }

  static async updateProduct(body) {
    const productType = (await Product.findById(body._id)).type;
    return await ProductFactory.updateProduct(productType, body);
  }

  static async searchProduct(q) {
    return await ProductRepository.searchProduct(q);
  }

  static async publishProduct({ _id, shopId }) {
    const filter = { _id, shopId };
    const body = { isDraft: false, isPublished: true };

    return await ProductRepository.findOneAndUpdate(filter, body);
  }

  static async unPublishProduct({ _id, shopId }) {
    const filter = { _id, shopId };
    const body = { isDraft: true, isPublished: false };

    return await ProductRepository.findOneAndUpdate(filter, body);
  }
}

module.exports = ProductService;
