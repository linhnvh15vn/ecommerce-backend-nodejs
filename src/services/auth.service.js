'use strict';

const bcrypt = require('bcryptjs');

const Shop = require('../models/shop.schema');
const KeyService = require('../services/keytoken.service');
const { createTokenPair, generateRSAKeys } = require('../utils');

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

    if (!newShop) {
      // throw error
    }

    const { publicKey, privateKey } = generateRSAKeys();

    // Save publicKey to database
    await KeyService.createKeyToken({
      userId: newShop._id,
      publicKey,
    });

    const tokens = await createTokenPair(
      { userId: newShop._id },
      publicKey,
      privateKey,
    );

    console.log(tokens);

    return tokens;
  }
}

module.exports = AuthService;
