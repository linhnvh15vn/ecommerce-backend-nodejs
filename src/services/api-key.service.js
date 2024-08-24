'use strict';

const ApiKey = require('../models/api-key.schema');

exports.findApiKey = async (key) => {
  const apiKey = await ApiKey.findOne({
    key,
    status: true,
  }).lean();

  return apiKey;
};
