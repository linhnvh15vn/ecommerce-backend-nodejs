'use strict';

const KeyToken = require('../models/keytoken.schema');

class KeyTokenService {
  static async createKeyToken({ userId, publicKey }) {
    const token = await KeyToken.create({
      user: userId,
      publicKey,
    });

    return token ? token.publicKey : null;
  }
}

module.exports = KeyTokenService;
