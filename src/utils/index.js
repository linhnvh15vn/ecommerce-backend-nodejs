'use strict';

const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const KeyTokenService = require('../services/key-token.service');
const { BadRequest } = require('../core/error.response');

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

  /*
   publicKey: '-----BEGIN PUBLIC KEY-----\n' +
    'MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEArTE5KjD/6gEBkzmy0pSO\n' +
    'EdxhC3OGcfy0hFjsnK95cCzTnlZWJkJDgOCzDRxxZxQxU7lh7gJk0YoAAac4LYA/\n' +
    '0+2lUavq6moJsGCE/CFjQxQgesFCOJbGYVPXJzMbvzKDG0IrRf/zmgfNmMsSZ+CK\n' +
    'uiZqb/njk7Sjy5pCbKqHu6EFoT73uGwT1CQInUujUy0HwEaNCxDqC2e6w3EKP424\n' +
    '2mCTyQxooxophlCWwlxLpGHeBtCV6/8GG4vp2nSGPmP/PWeN4PbI37d9Wm+cpNUK\n' +
    'tBGy9XKeoiC9cmLsVta7c27vsA6IaIyrNA+gRKEceJo/GWSaOBspyeTPDBL72Ah3\n' +
    'SGfcbt8umfrmW8GPVSGM/5StrR6oSq3MN44IQif+OgiWsVjYL0NHxnxdPliPSMRC\n' +
    'ocuQEL+ztWSnptZOGuneOW8Qup0uJiXrTUmdt1s7zTzDuuge5cYVz29tR+ZEDUyK\n' +
    'tg6HF/YuHYBMfnt35FfKkaa5k03Qwg4GzhQgwSMEa3RwP+HxSkX+UBA0svsvAKdW\n' +
    '07XmFFxfRANqvsJ9sRB7YvEMk7wDod8fVitCovgEd5OlUSZ+8/ZqjtMh0H+CGSTB\n' +
    '3/10eZDdfN7I/ZYW/ZNN16gMXL6vBDIvcIGS/PKLfdc+wrgAUqHAa0xQVGbhkAYF\n' +
    '+2Q/DBXrHYZfRM9eShqjfv0CAwEAAQ==\n' +
    '-----END PUBLIC KEY-----\n',
  */

  return { publicKey, privateKey };
};

const generateKeyTokens = async (payload) => {
  const { publicKey, privateKey } = generateRSAKeys();

  const tokens = await createTokenPair(payload, publicKey, privateKey);
  const keyStore = await KeyTokenService.createKeyToken({
    userId: payload.userId,
    publicKey,
    privateKey,
    refreshToken: tokens.refreshToken,
  });

  if (!keyStore) {
    throw new BadRequest();
  }

  return tokens; // include AT & RT
};

const verifyJwt = async (token, keySecret) => {
  return jwt.verify(token, keySecret);
};

module.exports = {
  createTokenPair,
  generateRSAKeys,
  generateKeyTokens,
  verifyJwt,
};
