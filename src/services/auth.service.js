'use strict';

const bcrypt = require('bcryptjs');

const User = require('../models/user.schema');
const userService = require('../services/user.service');
const KeyTokenService = require('./key-token.service');
const { createTokenPair, generateRSAKeys, verifyJwt } = require('../utils');
const {
  NotFound,
  Unauthorized,
  Conflict,
  BadRequest,
} = require('../core/error.response');

const generateTokens = async (payload) => {
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

class AuthService {
  static async signUp({ name, email, password }) {
    const isUserExisted = await User.findOne({ email }).lean();
    if (isUserExisted) {
      throw new Conflict();
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: passwordHash,
      roles: 'shop',
    });

    if (!newUser) {
      throw new BadRequest();
    }

    const tokens = await generateTokens({ userId: newUser._id });

    return {
      user: newUser,
      tokens,
    };
  }

  static logIn = async ({ email, password, refreshToken = null }) => {
    const user = await userService.findUserByEmail(email);

    // TODO: Move this function to model
    const match = bcrypt.compare(password, user.password);
    if (!match) {
      throw new Unauthorized();
    }

    const tokens = await generateTokens({ userId: user._id });

    console.log(tokens);

    return {
      user,
      tokens,
    };
  };

  static logOut = async (keyStore) => {
    const removedKey = await KeyTokenService.removeKeyById(keyStore._id);
    console.log(removedKey);
    return removedKey;
  };

  static checkRefreshToken = async (refreshToken) => {
    const foundedToken = await KeyTokenService.findByRefreshTokenUsed(
      refreshToken,
    );
    if (foundedToken) {
      const decodedUser = await verifyJwt(
        refreshToken,
        foundedToken.privateKey,
      );
    }
  };
}

module.exports = AuthService;
