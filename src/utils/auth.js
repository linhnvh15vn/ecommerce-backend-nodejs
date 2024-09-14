'use strict';

const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const { BadRequest } = require('../core/error.response');
const KeyTokenService = require('../services/key-token.service');

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await jwt.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '2 days',
    });

    const refreshToken = await jwt.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '7 days',
    });

    return { accessToken, refreshToken };
  } catch (error) {}
};

const generateRSAKeys = () => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });

  return { publicKey, privateKey };
};

const generateKeyTokens = async (payload) => {
  const { publicKey, privateKey } = generateRSAKeys();

  const tokens = await createTokenPair(payload, publicKey, privateKey);

  const keyStore = await KeyTokenService.createKeyToken({
    publicKey,
    privateKey,
    refreshToken: tokens.refreshToken,
    ...payload,
  });

  console.log('53' + keyStore); // null

  if (!keyStore) {
    throw new BadRequest();
  }

  return tokens; // include AT & RT
};

module.exports = {
  createTokenPair,
  generateRSAKeys,
  generateKeyTokens,
};
