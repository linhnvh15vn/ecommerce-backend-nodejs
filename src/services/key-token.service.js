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

  static findByUserId = async (userId) => {
    return await KeyToken.findOne({ user: userId }).lean();
  };

  static removeKeyById = async (id) => {
    return await KeyToken.findByIdAndDelete(id);
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await KeyToken.findOne({ refreshTokenUsed: refreshToken });
  };
}

module.exports = KeyTokenService;
