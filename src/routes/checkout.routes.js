'use strict';

const express = require('express');
const CheckoutController = require('../controllers/checkout.controller');

const checkoutRouter = express.Router();

checkoutRouter.post('/review', CheckoutController.checkoutReview);

module.exports = checkoutRouter;
