'use strict';

const productService = require('../services/product.service');
const { Created, Ok } = require('../core/success.response');

const createProduct = async (req, res, next) => {
  return new Created({
    data: await productService.ProductFactory.createProduct(
      req.body.product_type,
      {
        product_shop: req.user.userId,
        ...req.body,
      },
    ),
  }).send(res);
};

const findAllDrafts = async (req, res, next) => {
  return new Ok({
    data: await productService.findAllDraft({
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

module.exports = {
  createProduct,
  findAllDrafts,
  findAllPublished,
};
