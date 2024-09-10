'use strict';

const express = require('express');

const ProductController = require('../controllers/product.controller');
const { authenticate } = require('../middlewares/auth.middleware');

const productRouter = express.Router();

productRouter.get('/search', ProductController.searchProduct);
productRouter.get('/', ProductController.findAllProducts);
// productRouter.get('/:productId', ProductController.httpFindProductById);

productRouter.use(authenticate);

productRouter.post('/', ProductController.createProduct);
productRouter.patch('/:productId', ProductController.updateProduct);
productRouter.get('/drafts', ProductController.findAllDrafts);
productRouter.get('/published', ProductController.findAllPublished);

productRouter.post('/publish/:productId', ProductController.publishProduct);
productRouter.post('/unpublish/:productId', ProductController.unPublishProduct);

module.exports = productRouter;
