'use strict';

const { default: mongoose } = require('mongoose');
const Cart = require('../cart.schema');
const ProductRepository = require('./product.repository');

class CartRepository {
  static async find(filter) {
    return await Cart.find(filter).lean();
  }

  static async findOne(filter) {
    return await Cart.findOne(filter).lean();
  }

  static async findById(_id) {
    return await Cart.findById(_id).lean();
  }

  static async create({ userId, product }) {
    const foundProduct = await ProductRepository.findById({
      productId: product._id,
    });

    return await Cart.findOneAndUpdate(
      {
        userId,
      },
      {
        $addToSet: {
          items: {
            productId: foundProduct._id,
            name: foundProduct.name,
            price: foundProduct.price,
            quantity: product.quantity,
          },
        },
      },
      {
        new: true,
        upsert: true,
      },
    ).lean();
  }

  static async updateQuantity({ userId, product }) {
    return await Cart.findOneAndUpdate(
      {
        userId,
        status: 'active',
        'items.productId': product._id,
      },
      {
        $inc: {
          'items.$.quantity': product.quantity,
        },
      },
      {
        new: true,
        upsert: true,
      },
    ).lean();
  }

  static async removeItem({ userId, productId }) {
    return await Cart.findOneAndUpdate(
      {
        userId,
      },
      {
        $pull: {
          items: {
            productId,
          },
        },
      },
    ).lean();
  }
}

module.exports = CartRepository;
