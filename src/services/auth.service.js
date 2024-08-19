'use strict';

const bcrypt = require('bcryptjs');

const User = require('../models/user.schema');
const KeyTokenService = require('./key-token.service');
const { createTokenPair, generateRSAKeys } = require('../utils');

class AuthService {
  static async signUp({ name, email, password }) {
    const isUserExisted = await User.findOne({ email }).lean();
    if (isUserExisted) {
      // throw Error
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: passwordHash,
      roles: 'shop',
    });

    if (!newUser) {
      // throw error
    }

    const { publicKey, privateKey } = generateRSAKeys();

    //* Save publicKey to database
    // TODO: check error here
    await KeyTokenService.createKeyToken({
      userId: newUser._id,
      publicKey,
    });

    const tokens = await createTokenPair(
      { userId: newUser._id },
      publicKey,
      privateKey,
    );

    return tokens;
  }
}

module.exports = AuthService;
