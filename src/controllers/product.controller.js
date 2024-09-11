'use strict';

const ProductService = require('../services/product.service');
const { Created, Ok } = require('../core/success.response');
const { catchAsync } = require('../utils');

class ProductController {
  createProduct = catchAsync(async (req, res, next) => {
    return new Created({
      data: await ProductService.createProduct(req.body.product_type, {
        product_shop: req.user.userId,
        ...req.body,
      }),
    }).send(res);
  });

  /* GET - Find all draft product - OK */
  findAllDrafts = catchAsync(async (req, res, next) => {
    return new Ok({
      data: await ProductService.findAllDraftProducts({
        product_shop: req.user.userId,
      }),
    }).send(res);
  });

  /* GET - Find all published product - OK */
  findAllPublished = catchAsync(async (req, res, next) => {
    console.log('a');

    return new Ok({
      data: await ProductService.findAllPublishedProducts({
        product_shop: req.user.userId,
      }),
    }).send(res);
  });

  publishProduct = catchAsync(async (req, res, next) => {
    return new Ok({
      data: await ProductService.publishProduct({
        product_shop: req.user.userId,
        product_id: req.params.productId,
      }),
    }).send(res);
  });

  unPublishProduct = catchAsync(async (req, res, next) => {
    return new Ok({
      data: await ProductService.unPublishProduct({
        product_shop: req.user.userId,
        product_id: req.params.productId,
      }),
    }).send(res);
  });

  /* GET - Search product - OK */
  searchProduct = catchAsync(async (req, res, next) => {
    return new Ok({
      data: await ProductService.searchProduct(req.query.q),
    }).send(res);
  });

  /* GET - Find all products - OK */
  findAllProducts = catchAsync(async (req, res, next) => {
    return new Ok({
      data: await ProductService.findAllProducts({
        query: req.query,
      }),
    }).send(res);
  });

  /* GET - Find product by productId - OK */
  findProductById = catchAsync(async (req, res, next) => {
    return new Ok({
      data: await ProductService.findProductById(req.params.productId),
    }).send(res);
  });

  /* PATCH - Update product */
  updateProduct = catchAsync(async (req, res, next) => {
    return new Ok({
      data: await ProductService.updateProduct({
        ...req.body,
        product_id: req.params.productId,
        product_shop: req.user.userId,
      }),
    }).send(res);
  });
}

module.exports = new ProductController();
