'use strict';

const express = require('express');
const DiscountController = require('../controllers/discount.controller');
const AuthMiddleware = require('../middlewares/auth.middleware');

const discountRouter = express.Router();

discountRouter.get('/test-error', DiscountController.testError);

discountRouter.post('/amount', DiscountController.getDiscountAmount);
discountRouter.get(
  '/list-products',
  DiscountController.findAllProductsWithDiscount,
);

discountRouter.use(AuthMiddleware.authenticate);

discountRouter.post('/', DiscountController.createDiscount);
discountRouter.get('/', DiscountController.findAllShopDiscounts);

module.exports = discountRouter;
