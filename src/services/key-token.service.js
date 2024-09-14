'use strict';

const { NotFound } = require('../core/error.response');
const KeyTokenRepository = require('../models/repositories/key-token.repository');

class KeyTokenService {
  static async createKeyToken(body) {
    const filter = { userId: body.userId };
    const token = await KeyTokenRepository.findOneAndUpdate(filter, body);

    return token ? token.publicKey : null;
  }

  static async findByUserId(userId) {
    const keyToken = await KeyTokenRepository.findOne({ filter: { userId } });
    if (!keyToken) {
      throw new NotFound('No key token found with this userId.');
    }

    return keyToken;
  }
}

module.exports = KeyTokenService;
