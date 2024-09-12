'use strict';

const bcrypt = require('bcryptjs');

const User = require('../models/user.schema');
const userService = require('../services/user.service');
const keyTokenService = require('./key-token.service');
const { generateKeyTokens } = require('../utils');
const {
  Unauthorized,
  Conflict,
  BadRequest,
  NotFound,
} = require('../core/error.response');

class AuthService {
  async signUp({ name, email, password }) {
    const foundUser = await User.findOne({ email }).lean();
    if (foundUser) {
      throw new Conflict('This email has been registered.');
    }

    // TODO move hash password to document middlewares
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
    const tokens = await generateKeyTokens({ userId: newUser._id });

    return {
      user: newUser,
      tokens,
    };
  }

  async logIn({ email, password, refreshToken = null }) {
    const user = await userService.findByEmail(email);
    if (!user) {
      throw new NotFound('No user found with this email.');
    }

    // TODO: Move this function to model
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new Unauthorized('Password is incorrect.');
    }
    const tokens = await generateKeyTokens({ userId: user._id });

    return {
      user,
      tokens,
    };
  }

  async logOut(keyStore) {
    const removedKey = await keyTokenService.removeKeyById(keyStore._id);
    return removedKey;
  }
}

module.exports = AuthService;
