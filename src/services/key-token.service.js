'use strict';

const KeyToken = require('../models/key-token.schema');
const { NotFound } = require('../core/error.response');

const createKeyToken = async ({
  userId,
  publicKey,
  privateKey,
  refreshToken,
}) => {
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
};

const findByUserId = async (userId) => {
  const keyToken = await KeyToken.findOne({ user: userId }).lean();
  if (!keyToken) {
    throw new NotFound();
  }

  return keyToken;
};

const removeById = async (_id) => {
  const keyToken = await KeyToken.findByIdAndDelete(_id);
  if (!keyToken) {
    throw new NotFound();
  }

  return keyToken;
};

const findByRefreshTokenUsed = async (refreshToken) => {
  const keyToken = await KeyToken.findOne({ refreshTokenUsed: refreshToken });
  if (!keyToken) {
    throw new NotFound();
  }

  return keyToken;
};

module.exports = {
  createKeyToken,
  findByUserId,
  removeById,
  findByRefreshTokenUsed,
};
