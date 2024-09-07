'use strict';

const { Product } = require('../models/product.schema');
const ProductFactory = require('../factories/product.factory');
const { selectFields, excludeFields } = require('../utils');

const createProduct = async (type, data) => {
  return await ProductFactory.createProduct(type, data);
};

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
  createProduct,
  findAllDraftProducts,
  findAllPublishedProducts,
  publishProduct,
  unPublishProduct,
  searchProduct,
  findAllProducts,
  findProductById,
};
