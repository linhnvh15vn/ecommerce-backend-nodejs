'use strict';

const User = require('../models/user.schema');
const NotFound = require('../core/error.response');

exports.findUserByEmail = async (email) => {
  const user = await User.findOne({ email }).lean();
  if (!user) {
    throw new NotFound();
  }

  return user;
};
