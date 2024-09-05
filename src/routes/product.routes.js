'use strict';

const express = require('express');

const productController = require('../controllers/product.controller');
const { authenticate } = require('../middlewares/auth.middleware');

const productRouter = express.Router();

productRouter.use(authenticate);

productRouter.post('/', productController.createProduct);
productRouter.get('/drafts', productController.findAllDrafts);
productRouter.get('/published', productController.findAllPublished);

module.exports = productRouter;
