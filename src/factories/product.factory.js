'use strict';

const { Product, Clothing, Electronic } = require('../models/product.schema');
const { BadRequest } = require('../core/error.response');
const { cleanObject, cleanNestedObject } = require('../utils');
const InventoryRepository = require('../models/repositories/inventory.repository');

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
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  async createProduct(product_id) {
    const newProduct = await Product.create({ ...this, _id: product_id });
    if (!newProduct) {
      // throw error
    }

    await InventoryRepository.createInventory({
      productId: newProduct._id,
      shopId: this.product_shop,
      stock: this.product_quantity,
    });

    return newProduct;
  }

  async updateProduct(product_id) {
    return await Product.findByIdAndUpdate(product_id, this, {
      new: true,
    });
  }
}

class _Clothing extends _Product {
  async createProduct() {
    const newClothing = await Clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) {
      throw new BadRequest();
    }

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) {
      throw new BadRequest();
    }

    return newProduct;
  }

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

    console.log(cleanNestedObject(objParams));

    const updatedProduct = await super.updateProduct(
      productId,
      cleanNestedObject(objParams),
    );
    return updatedProduct;
  }
}

class _Electronic extends _Product {
  async createProduct() {
    const newElectronic = await Electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic) {
      throw new BadRequest();
    }

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) {
      throw new BadRequest();
    }

    return newProduct;
  }

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
