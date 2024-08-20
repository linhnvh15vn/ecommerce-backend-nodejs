'use strict';

const apiKeyService = require('../services/api-key.service');
const { Forbidden, NotFound } = require('../core/error.response');

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization',
};

exports.checkApiKey = async (req, res, next) => {
  try {
    const apiKey = req.headers[HEADER.API_KEY].toString();
    if (!apiKey) {
      throw new Forbidden();
    }

    const apiKeyObject = await apiKeyService.getById();
    if (!apiKeyObject) {
      throw new NotFound();
    }

    req.apiKeyObject = apiKeyObject;

    next();
  } catch (error) {}
};

exports.checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.apiKeyObject.permissions) {
      throw new Forbidden();
    }

    const validPermission = req.objKey.permissions.includes(permission);
    if (!validPermission) {
      throw new Forbidden();
    }

    next();
  };
};
