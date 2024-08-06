'use strict';

const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const Shop = require('../models/shop.schema');
const KeyService = require('../services/keytoken.service');
const { createTokenPair } = require('../utils');

class AuthService {
  static async signUp({ name, email, password }) {
    const isShopExisted = await Shop.findOne({ email }).lean();
    if (isShopExisted) {
      // throw Error
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newShop = await Shop.create({
      name,
      email,
      password: passwordHash,
      roles: 'shop',
    });

    if (newShop) {
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

      console.log({ privateKey, publicKey });

      const publicKeyString = await KeyService.createKeyToken({
        userId: newShop._id,
        publicKey,
      });

      if (!publicKeyString) {
      }

      const tokens = await createTokenPair(
        { userId: newShop._id },
        publicKey,
        privateKey,
      );
    }

    return {};
  }
}

module.exports = AuthService;
