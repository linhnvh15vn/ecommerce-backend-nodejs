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
} = require('../core/error.response');

const signUp = async ({ name, email, password }) => {
  const isUserExisted = await User.findOne({ email }).lean();
  if (isUserExisted) {
    throw new Conflict();
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
};

const logIn = async ({ email, password, refreshToken = null }) => {
  const user = await userService.findByEmail(email);

  // TODO: Move this function to model
  const match = bcrypt.compare(password, user.password);
  if (!match) {
    throw new Unauthorized();
  }
  const tokens = await generateKeyTokens({ userId: user._id });

  return {
    user,
    tokens,
  };
};

const logOut = async (keyStore) => {
  const removedKey = await keyTokenService.removeKeyById(keyStore._id);
  return removedKey;
};

module.exports = {
  signUp,
  logIn,
  logOut,
};
