'use strict';

const express = require('express');

const productController = require('../controllers/product.controller');
const { authenticate } = require('../middlewares/auth.middleware');

const productRouter = express.Router();

productRouter.get('/search', productController.httpSearchProduct);
productRouter.get('/', productController.httpFindAllProducts);
// productRouter.get('/:productId', productController.httpFindProductById);

productRouter.use(authenticate);

productRouter.post('/', productController.createProduct);
productRouter.get('/drafts', productController.findAllDrafts);
productRouter.get('/published', productController.findAllPublished);

productRouter.post('/publish/:productId', productController.httpPublishProduct);
productRouter.post(
  '/unpublish/:productId',
  productController.httpUnPublishProduct,
);

module.exports = productRouter;
