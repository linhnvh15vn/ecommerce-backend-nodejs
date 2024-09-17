'use strict';

const express = require('express');
const DiscountController = require('../controllers/discount.controller');
const AuthMiddleware = require('../middlewares/auth.middleware');

const discountRouter = express.Router();

discountRouter.get('/', DiscountController.findAllShopDiscounts);
discountRouter.get(
  '/available-products',
  DiscountController.findAllProductsWithDiscount,
);
discountRouter.post('/get-amount', DiscountController.getDiscountAmount);

discountRouter.use(AuthMiddleware.authenticate);

discountRouter.post('/', DiscountController.createDiscount);
discountRouter.delete('/:_id', DiscountController.deleteDiscount);

module.exports = discountRouter;
