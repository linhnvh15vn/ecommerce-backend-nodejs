'use strict';

const bcrypt = require('bcryptjs');

const { generateKeyTokens } = require('../utils');
const UserRepository = require('../models/repositories/user.repository');
const {
  Unauthorized,
  Conflict,
  BadRequest,
  NotFound,
} = require('../core/error.response');

class AuthService {
  static async signUp({ name, email, password }) {
    const foundUser = await UserRepository.findUser({ filter: { email } });
    if (foundUser) {
      throw new Conflict('This email has been registered.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserRepository.create({
      name,
      email,
      password: hashedPassword,
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

  static async logIn({ email, password, refreshToken = null }) {
    const foundUser = await UserRepository.findUser({ filter: { email } });
    if (!foundUser) {
      throw new NotFound('No user found with this email.');
    }

    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) {
      throw new Unauthorized('Password is incorrect.');
    }
    const tokens = await generateKeyTokens({ userId: foundUser._id });

    return {
      user: foundUser,
      tokens,
    };
  }
}

module.exports = AuthService;
