'use strict';

const productService = require('../services/product.service');
const { Created } = require('../core/success.response');

const createProduct = async (req, res, next) => {
  return new Created({
    data: await productService.createProduct(req.body.product_type, {
      product_shop: req.user.userId,
      ...req.body,
    }),
  }).send();
};

module.exports = {
  createProduct,
};
