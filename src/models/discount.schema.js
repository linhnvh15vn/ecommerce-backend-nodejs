'use strict';

const { default: mongoose } = require('mongoose');

const discountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['fixed', 'percentage'],
      default: 'fixed',
    },
    value: {
      type: Number,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    maxUse: {
      type: Number,
      required: true,
    },
    useCount: {
      type: Number,
      required: true,
    },
    usedByUserIds: {
      type: Array,
      default: [],
    },
    limit: {
      type: Number,
      required: true,
    },
    minOrderValue: {
      type: Number,
      required: true,
    },
    shopId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    applyTo: {
      type: String,
      enum: ['all', 'only'],
      required: true,
    },
    productIds: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const Discount = mongoose.model('Discount', discountSchema);

module.exports = Discount;
