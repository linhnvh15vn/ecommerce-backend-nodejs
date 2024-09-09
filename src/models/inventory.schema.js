'use strict';

const { default: mongoose } = require('mongoose');

const inventorySchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Product',
    },

    shopId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Shop',
    },

    location: {
      type: String,
      default: 'unknown',
    },

    stock: {
      type: Number,
      required: true,
    },

    reservations: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;
