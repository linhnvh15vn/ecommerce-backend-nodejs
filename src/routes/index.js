'use strict';

const express = require('express');
const authRouter = require('./auth.routes');
const authMiddleware = require('../middlewares/auth.middleware');
const productRouter = require('./product.routes');

const router = express.Router();

router.use(authMiddleware.checkApiKey);
router.use(authMiddleware.checkPermission('0000'));

router.use('/api/v1/auth', authRouter);
router.use('/api/v1/product', productRouter);

module.exports = router;
