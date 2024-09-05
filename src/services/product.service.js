'use strict';

const { Product, Clothing, Electronic } = require('../models/product.schema');
const { BadRequest } = require('../core/error.response');

class ProductFactory {
  static async createProduct(type, data) {
    switch (type) {
      case 'Electronic':
        return new Electronic(data).createProduct();

      case 'Clothing':
        return new Clothing(data).createProduct();

      default:
        throw new BadRequest('Invalid product type');
    }
  }
}

class BaseProduct {
  /**
   *
   */
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

  async createProduct() {
    return await Product.create(this);
  }
}

class Clothing extends BaseProduct {
  async createProduct() {
    const newClothing = await Clothing.create(this.product_attributes);
    if (!newClothing) {
      throw new BadRequest();
    }

    const newProduct = await super.createProduct();
    if (!newProduct) {
      throw new BadRequest();
    }
  }
}

class Electronic extends BaseProduct {
  async createProduct() {
    const newElectronic = await Electronic.create(this.product_attributes);
    if (!newElectronic) {
      throw new BadRequest();
    }

    const newProduct = await super.createProduct();
    if (!newProduct) {
      throw new BadRequest();
    }
  }
}

module.exports = ProductFactory;
