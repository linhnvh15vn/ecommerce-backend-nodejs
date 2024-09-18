'use strict';

const User = require('../user.schema');

class UserRepository {
  static async findUser({ filter }) {
    return await User.findOne(filter).lean();
  }

  static async create(body) {
    return await User.create(body);
  }
}

module.exports = UserRepository;
