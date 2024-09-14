'use strict';

const jwt = require('jsonwebtoken');

const ApiKeyService = require('../services/api-key.service');
const KeyTokenService = require('../services/key-token.service');
const { Forbidden, NotFound, Unauthorized } = require('../core/error.response');
const { catchAsync } = require('../utils');

class AuthMiddleware {
  static checkApiKey = catchAsync(async (req, res, next) => {
    try {
      const xApiKey = req.headers['x-api-key'].toString();
      if (!xApiKey) {
        throw new Forbidden();
      }

      const apiKey = await ApiKeyService.findByKey(xApiKey);
      if (!apiKey) {
        throw new NotFound('This api key does not existed.');
      }

      req.apiKey = apiKey;

      next();
    } catch (error) {
      console.log(error);
    }
  });

  static checkPermission = (permission) => {
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

  static authenticate = catchAsync(async (req, res, next) => {
    const userId = req.headers['x-client-id'];
    if (!userId) {
      throw new Unauthorized('You are not logged in.');
    }

    const keyStore = await KeyTokenService.findByUserId(userId);
    if (!keyStore) {
      throw new NotFound('No user found with this _id');
    }

    const accessToken = req.headers['authorization'];
    if (!accessToken) {
      throw new Unauthorized();
    }

    // catch jwt error
    const decodedUser = jwt.verify(accessToken, keyStore.publicKey);

    if (decodedUser.userId !== userId) {
      throw new Unauthorized();
    }

    req.keyStore = keyStore;
    req.user = decodedUser;

    next();
  });
}

module.exports = AuthMiddleware;
