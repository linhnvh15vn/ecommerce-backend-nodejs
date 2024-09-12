'use strict';

const { default: mongoose } = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    user_id: {
      type: Number,
      required: true,
    },
    products: {
      type: Array,
      required: true,
    },
    item_count: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['active', 'pending', 'processing', 'completed', 'cancelled'],
      default: 'active',
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
