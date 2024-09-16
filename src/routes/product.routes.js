'use strict';

const express = require('express');

const ProductController = require('../controllers/product.controller');
const { authenticate } = require('../middlewares/auth.middleware');

const productRouter = express.Router();

productRouter.get('/', ProductController.findAllProducts);
productRouter.get('/search', ProductController.searchProduct);
// productRouter.get('/:_id', ProductController.findProductById);

productRouter.use(authenticate);

productRouter.get('/drafts', ProductController.findAllDrafts);
productRouter.get('/published', ProductController.findAllPublished);

productRouter.post('/', ProductController.createProduct);

productRouter.patch('/:_id', ProductController.updateProduct);
productRouter.patch('/publish/:_id', ProductController.publishProduct);
productRouter.patch('/unpublish/:_id', ProductController.unPublishProduct);

module.exports = productRouter;
