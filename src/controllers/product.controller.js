'use strict';

const ProductService = require('../services/product.service');
const { Created, Ok } = require('../core/success.response');
const { catchAsync } = require('../utils');

class ProductController {
  findAllProducts = catchAsync(async (req, res, next) => {
    return new Ok({
      data: await ProductService.findAllProducts(req.query),
    }).send(res);
  });

  createProduct = catchAsync(async (req, res, next) => {
    return new Created({
      data: await ProductService.createProduct({
        shopId: req.user.userId,
        ...req.body,
      }),
    }).send(res);
  });

  findAllDrafts = catchAsync(async (req, res, next) => {
    return new Ok({
      data: await ProductService.findAllDraftProducts(
        req.user.userId,
        req.query,
      ),
    }).send(res);
  });

  findAllPublished = catchAsync(async (req, res, next) => {
    return new Ok({
      data: await ProductService.findAllPublishedProducts(
        req.user.userId,
        req.query,
      ),
    }).send(res);
  });

  publishProduct = catchAsync(async (req, res, next) => {
    return new Ok({
      data: await ProductService.publishProduct({
        _id: req.params._id,
        shopId: req.user.userId,
      }),
    }).send(res);
  });

  unPublishProduct = catchAsync(async (req, res, next) => {
    return new Ok({
      data: await ProductService.unPublishProduct({
        _id: req.params._id,
        shopId: req.user.userId,
      }),
    }).send(res);
  });

  searchProduct = catchAsync(async (req, res, next) => {
    return new Ok({
      data: await ProductService.searchProduct(req.query.q),
    }).send(res);
  });

  findProductById = catchAsync(async (req, res, next) => {
    return new Ok({
      data: await ProductService.findProductById(req.params._id),
    }).send(res);
  });

  updateProduct = catchAsync(async (req, res, next) => {
    return new Ok({
      data: await ProductService.updateProduct({
        ...req.body,
        productId: req.params.productId,
        shopId: req.user.userId,
      }),
    }).send(res);
  });
}

module.exports = new ProductController();
