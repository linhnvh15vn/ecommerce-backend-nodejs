'use strict';

const ApiKey = require('../api-key.schema');

class ApiKeyRepository {
  static async findOne({ filter }) {
    return await ApiKey.findOne(filter).lean();
  }

  static async create(body) {
    return await ApiKey.create(body);
  }
}

module.exports = ApiKeyRepository;
