'use strict';

const ApiKeyRepository = require('../models/repositories/api-key.repository');
const { NotFound, BadRequest } = require('../core/error.response');

class ApiKeyService {
  static async findByKey(key) {
    const apiKey = await ApiKeyRepository.findOne({
      filter: { key, status: true },
    });
    if (!apiKey) {
      throw new NotFound();
    }

    return apiKey;
  }

  static async createApiKey(body) {
    const newApiKey = await ApiKeyRepository.create(body);
    if (!newApiKey) {
      throw new BadRequest();
    }

    return newApiKey;
  }
}

module.exports = ApiKeyService;
