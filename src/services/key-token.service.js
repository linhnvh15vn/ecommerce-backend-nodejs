'use strict';

const KeyToken = require('../models/key-token.schema');

class KeyTokenService {
  static async createKeyToken({ userId, publicKey, privateKey, refreshToken }) {
    const token = await KeyToken.findOneAndUpdate(
      { user: userId },
      {
        publicKey,
        privateKey,
        refreshTokenUsed: [],
        refreshToken,
      },
      { upsert: true, new: true },
    );

    return token ? token.publicKey : null;
  }
}

module.exports = KeyTokenService;
