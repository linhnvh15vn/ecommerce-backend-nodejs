'use strict';

const { Product, Clothing, Electronic } = require('../models/product.schema');
const { BadRequest } = require('../core/error.response');
const { cleanObject, cleanNestedObject } = require('../utils');

class ProductFactory {
  static async createProduct(type, body) {
    switch (type) {
      case 'Electronic':
        return new _Electronic(body).createProduct();

      case 'Clothing':
        return new _Clothing(body).createProduct();

      default:
        throw new BadRequest('Invalid product type');
    }
  }

  static async updateProduct(type, body) {
    switch (type) {
      case 'Electronic':
        return new _Electronic(body).updateProduct(body.product_id);

      case 'Clothing':
        return new _Clothing(body).updateProduct(body.product_id);

      default:
        throw new BadRequest('Invalid product type');
    }
  }
}

class _Product {
  constructor(body) {
    this.body = body;
  }

  async createProduct(_id) {
    return await Product.create({ _id, ...this.body });
  }

  async updateProduct(_id) {
    return await Product.findByIdAndUpdate(_id, this, {
      new: true,
    });
  }
}

class _Clothing extends _Product {
  async createProduct() {
    const { shop_id, attributes } = this.body;
    const body = { shop_id, ...attributes };

    const newClothing = await Clothing.create(body);
    if (!newClothing) throw new BadRequest();

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequest();

    return newProduct;
  }

  // TODO: FIX LATER !!!!!!
  async updateProduct(productId) {
    const objParams = cleanObject(this);

    if (objParams.product_attributes) {
      await Clothing.findByIdAndUpdate(
        productId,
        cleanNestedObject(objParams.product_attributes),
        {
          new: true,
        },
      );
    }

    const updatedProduct = await super.updateProduct(
      productId,
      cleanNestedObject(objParams),
    );
    return updatedProduct;
  }
}

class _Electronic extends _Product {
  async createProduct() {
    const { shop_id, attributes } = this.body;
    const body = { shop_id, ...attributes };

    const newElectronic = await Electronic.create(body);
    if (!newElectronic) {
      throw new BadRequest();
    }

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) {
      throw new BadRequest();
    }

    return newProduct;
  }

  // TODO: FIX LATER !!!!!!1
  async updateProduct(productId) {
    const objParams = this;
    if (objParams.product_attributes) {
      await Electronic.findByIdAndUpdate(productId, objParams, {
        new: true,
      });
    }

    const updatedProduct = await super.updateProduct(productId, objParams);
    return updatedProduct;
  }
}

module.exports = ProductFactory;
