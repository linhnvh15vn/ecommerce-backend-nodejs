'use strict';

const { default: mongoose } = require('mongoose');

const keyTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
    },
    publicKey: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const KeyToken = mongoose.model('KeyToken', keyTokenSchema);

module.exports = KeyToken;
