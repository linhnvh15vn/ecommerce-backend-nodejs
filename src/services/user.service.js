'use strict';

const User = require('../models/user.schema');
const { NotFound } = require('../core/error.response');

const findByEmail = async (email) => {
  const user = await User.findOne({ email }).lean();

  return user;
};

module.exports = {
  findByEmail,
};
