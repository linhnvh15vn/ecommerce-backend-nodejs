'use strict';

const apiKeyService = require('../services/api-key.service');

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization',
};

exports.checkApiKey = async (req, res, next) => {
  try {
    const apiKey = req.headers[HEADER.API_KEY].toString();
    if (!apiKey) {
      // throw error
    }

    const apiKeyObject = await apiKeyService.getById();
    if (objKey) {
      // throw error
    }

    req.apiKeyObject = apiKeyObject;

    next();
  } catch (error) {}
};

exports.checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.apiKeyObject.permissions) {
      // throw error
    }

    const validPermission = req.objKey.permissions.includes(permission);
    if (!validPermission) {
    }

    next();
  };
};
