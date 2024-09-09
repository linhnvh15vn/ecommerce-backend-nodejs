'use strict';

const productService = require('../services/product.service');
const { Created, Ok } = require('../core/success.response');
const { catchAsync } = require('../utils');

const createProduct = catchAsync(async (req, res, next) => {
  return new Created({
    data: await productService.createProduct(req.body.product_type, {
      product_shop: req.user.userId,
      ...req.body,
    }),
  }).send(res);
});

const findAllDrafts = async (req, res, next) => {
  return new Ok({
    data: await productService.findAllDraftProducts({
      product_shop: req.user.userId,
    }),
  }).send(res);
};

const findAllPublished = async (req, res, next) => {
  return new Ok({
    data: await productService.findAllPublishedProducts({
      product_shop: req.user.userId,
    }),
  }).send(res);
};

const httpPublishProduct = async (req, res, next) => {
  return new Ok({
    data: await productService.publishProduct({
      product_shop: req.user.userId,
      product_id: req.params.productId,
    }),
  }).send(res);
};

const httpUnPublishProduct = async (req, res, next) => {
  return new Ok({
    data: await productService.unPublishProduct({
      product_shop: req.user.userId,
      product_id: req.params.productId,
    }),
  }).send(res);
};

const httpSearchProduct = async (req, res, next) => {
  return new Ok({
    data: await productService.searchProduct({ q: req.query.q }),
  }).send(res);
};

const httpFindAllProducts = async (req, res, next) => {
  return new Ok({
    data: await productService.findAllProducts({
      filter: req.query,
      fields: ['product_name', 'product_price', 'product_thumb'],
    }),
  }).send(res);
};

const httpFindProductById = async (req, res, next) => {
  return new Ok({
    data: await productService.findProductById({
      productId: req.params.productId,
    }),
  }).send(res);
};

const httpUpdateProduct = catchAsync(async (req, res, next) => {
  return new Ok({
    data: await productService.updateProduct({
      ...req.body,
      product_id: req.params.productId,
      product_shop: req.user.userId,
    }),
  }).send(res);
});

module.exports = {
  createProduct,
  findAllDrafts,
  findAllPublished,
  httpPublishProduct,
  httpUnPublishProduct,
  httpSearchProduct,
  httpFindAllProducts,
  httpFindProductById,
  httpUpdateProduct,
};
