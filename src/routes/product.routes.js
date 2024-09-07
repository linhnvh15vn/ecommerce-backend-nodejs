'use strict';

const express = require('express');

const productController = require('../controllers/product.controller');
const { authenticate } = require('../middlewares/auth.middleware');

const productRouter = express.Router();

productRouter.get('/search', productController.httpSearchProduct);

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
