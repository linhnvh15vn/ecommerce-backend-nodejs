'use strict';

const KeyToken = require('../key-token.schema');

class KeyTokenRepository {
  static async findOne({ filter }) {
    return await KeyToken.findOne({ filter }).lean();
  }

  static async findOneAndUpdate(filter, body) {
    return await KeyToken.findOneAndUpdate(filter, body, {
      new: true,
      upsert: true,
    }).lean();
  }

  static async findByIdAndDelete(_id) {
    return await KeyToken.findByIdAndDelete(_id).lean();
  }
}

module.exports = KeyTokenRepository;
