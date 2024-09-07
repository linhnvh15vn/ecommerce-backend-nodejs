'use strict';

const { Product, Clothing, Electronic } = require('../models/product.schema');
const { selectFields, excludeFields } = require('../utils');
const { BadRequest } = require('../core/error.response');

class ProductFactory {
  static async createProduct(type, data) {
    switch (type) {
      case 'Electronic':
        return new _Electronic(data).createProduct();

      case 'Clothing':
        return new _Clothing(data).createProduct();

      default:
        throw new BadRequest('Invalid product type');
    }
  }
}

class BaseProduct {
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
    return await Product.create({ ...this, _id: product_id });
  }
}

class _Clothing extends BaseProduct {
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
}

class _Electronic extends BaseProduct {
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
}

const findAllDraftProducts = async ({ product_shop, skip = 0, limit = 50 }) => {
  const query = { product_shop, is_draft: true };

  return await Product.find(query)
    .populate('product_shop', '_id name email')
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

const findAllPublishedProducts = async ({
  product_shop,
  skip = 0,
  limit = 50,
}) => {
  const query = { product_shop, is_published: true };

  return await Product.find(query)
    .populate('product_shop', '_id name email')
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

const publishProduct = async ({ product_shop, product_id }) => {
  const product = await Product.findOneAndUpdate(
    {
      _id: product_id,
      product_shop,
    },
    {
      is_draft: false,
      is_published: true,
    },
    {
      new: true,
    },
  );

  if (!product) return null;
  return product;
};

const unPublishProduct = async ({ product_shop, product_id }) => {
  const product = await Product.findOneAndUpdate(
    {
      _id: product_id,
      product_shop,
    },
    {
      is_draft: true,
      is_published: false,
    },
    {
      new: true,
    },
  );

  if (!product) return null;
  return product;
};

const searchProduct = async ({ q }) => {
  const regexSearch = new RegExp(q);
  const products = await Product.find({
    is_published: true,
    $text: { $search: regexSearch },
  }).lean();

  return products;
};

const findAllProducts = async ({
  limit = 50,
  page = 1,
  filter = { is_publish: true },
  fields,
}) => {
  const skip = (page - 1) * limit;
  const products = await Product.find(filter)
    .sort('createdAt')
    .skip(skip)
    .limit(limit)
    .select(selectFields(fields))
    .lean();

  return products;
};

const findProductById = async ({ productId, fields }) => {
  const product = await Product.findById(productId)
    .select(excludeFields(fields))
    .lean();

  return product;
};

module.exports = {
  ProductFactory,
  findAllDraftProducts,
  findAllPublishedProducts,
  publishProduct,
  unPublishProduct,
  searchProduct,
  findAllProducts,
  findProductById,
};
