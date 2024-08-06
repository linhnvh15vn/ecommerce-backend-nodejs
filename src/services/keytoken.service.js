'use strict';

const KeyToken = require('../models/keytoken.schema');

class KeyTokenService {
  static async createKeyToken({ userId, publicKey }) {
    const publicKeyString = publicKey.toString();
    const tokens = await KeyToken.create({
      user: userId,
      publicKey: publicKeyString,
    });

    return tokens ? publicKeyString : null;
  }
}

module.exports = KeyTokenService;
