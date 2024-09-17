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
    maxUsage: {
      type: Number,
      required: true,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    maxUsagePerUser: {
      type: Number,
      required: true,
    },
    usedBy: {
      type: Array,
      default: [],
    },
    minOrderValue: {
      type: Number,
      required: true,
    },
    shopId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
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
