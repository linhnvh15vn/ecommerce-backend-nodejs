'use strict';

const ApiKey = require('../models/api-key.schema');
const { NotFound } = require('../core/error.response');

const findApiKey = async (key) => {
  const apiKey = await ApiKey.findOne({ key, status: true }).lean();
  if (!apiKey) {
    throw new NotFound();
  }

  return apiKey;
};

const createApiKey = async () => {
  const newApiKey = await ApiKey.create({
    key: 'test-api-key',
    permissions: ['0000'],
  });

  return newApiKey;
};

module.exports = {
  findApiKey,
  createApiKey,
};
