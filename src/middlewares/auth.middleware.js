'use strict';

const jwt = require('jsonwebtoken');

const apiKeyService = require('../services/api-key.service');
const { Forbidden, NotFound, Unauthorized } = require('../core/error.response');
const { catchAsync } = require('../utils');
const keyTokenService = require('../services/key-token.service');

const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization',
};

const checkApiKey = async (req, res, next) => {
  try {
    const apiKeyFromHeader = req.headers[HEADER.API_KEY].toString();
    if (!apiKeyFromHeader) {
      throw new Forbidden();
    }

    const apiKey = await apiKeyService.findApiKey(apiKeyFromHeader);
    if (!apiKey) {
      throw new NotFound();
    }
    req.apiKey = apiKey;

    next();
  } catch (error) {
    console.log(error);
  }
};

const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.apiKey.permissions) {
      throw new Forbidden();
    }

    const validPermission = req.apiKey.permissions.includes(permission);
    if (!validPermission) {
      throw new Forbidden();
    }

    next();
  };
};

const authenticate = catchAsync(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) {
    throw new Unauthorized();
  }

  const keyStore = await keyTokenService.findByUserId(userId);
  if (!keyStore) {
    throw new NotFound();
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) {
    throw new Unauthorized();
  }

  try {
    const decodedUser = jwt.verify(accessToken, keyStore.publicKey);

    if (decodedUser.userId !== userId) {
      throw new Unauthorized();
    }

    req.keyStore = keyStore;
    req.user = decodedUser;

    next();
  } catch (error) {
    throw error;
  }
});

module.exports = {
  checkApiKey,
  checkPermission,
  authenticate,
};
