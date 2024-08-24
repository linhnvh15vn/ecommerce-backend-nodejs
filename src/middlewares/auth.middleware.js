'use strict';

const apiKeyService = require('../services/api-key.service');
const { Forbidden, NotFound } = require('../core/error.response');

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization',
};

exports.checkApiKey = async (req, res, next) => {
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

exports.checkPermission = (permission) => {
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
