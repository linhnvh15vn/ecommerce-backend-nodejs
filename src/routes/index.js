'use strict';

const express = require('express');
const authRouter = require('./auth.routes');
const authMiddleware = require('../middlewares/auth.middleware');
const productRouter = require('./product.routes');
const discountRouter = require('./discount.routes');

const { createApiKey } = require('../services/api-key.service');

const router = express.Router();

// TEST ROUTER
/*
 *
 *
 *
 *
 */
router.use('/api/test/api-key', async (req, res, next) => {
  return res.status(201).json({
    data: await createApiKey({
      key: 'test-api-key',
      permissions: ['0000'],
    }),
  });
});

router.use(authMiddleware.checkApiKey);
router.use(authMiddleware.checkPermission('0000'));

router.use('/api/v1/auth', authRouter);
router.use('/api/v1/products', productRouter);
router.use('/api/v1/discounts', discountRouter);

module.exports = router;
