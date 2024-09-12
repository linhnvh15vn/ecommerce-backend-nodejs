'use strict';

const { default: mongoose } = require('mongoose');
const { default: slugify } = require('slugify');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    thumb: {
      type: String,
      required: true,
    },
    slug: String,
    description: String,
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    shop_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    attributes: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    rating_average: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    variations: {
      type: Array,
      default: [],
    },
    is_draft: {
      type: Boolean,
      default: true,
      index: true,
      select: false,
    },
    is_published: {
      type: Boolean,
      default: false,
      index: true,
      select: false,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

productSchema.index({ name: 'text', description: 'text' });

productSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

productSchema.pre(/^find/, function (next) {
  this.select('-__v');
  next();
});

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
    shop_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
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
    shop_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

const Electronic = mongoose.model('Electronic', electronicSchema);

module.exports = {
  Product,
  Clothing,
  Electronic,
};
