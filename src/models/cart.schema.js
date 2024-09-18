'use strict';

const { default: mongoose } = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    itemCount: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['active', 'pending', 'processing', 'completed', 'cancelled'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  },
);

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
