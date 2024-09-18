'use strict';

const { default: mongoose } = require('mongoose');

const apiKeySchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    permissions: {
      type: [String],
      required: true,
      enum: ['0000', '1111', '2222'],
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const ApiKey = mongoose.model('ApiKey', apiKeySchema);

module.exports = ApiKey;
