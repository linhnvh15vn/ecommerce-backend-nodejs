'use strict';

const { default: mongoose } = require('mongoose');

// Define base product model
const productSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_thumb: {
      type: String,
      required: true,
    },
    product_description: {
      type: String,
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_quantity: {
      type: String,
      required: true,
    },
    product_type: {
      type: String,
      required: true,
    },
    product_shop: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    product_attributes: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Product = mongoose.model('Product', productSchema);

// Define clothing model
const clothingSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    size: {
      type: String,
    },
    material: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const Clothing = mongoose.model('Clothing', clothingSchema);

// Define Electronic model
const electronicSchema = new mongoose.Schema(
  {
    manufacturer: {
      type: String,
      required: true,
    },
    model: {
      type: String,
    },
    color: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const Electronic = mongoose.model('Electronic', electronicSchema);

module.exports = {
  Product,
  Clothing,
  Electronic,
};
