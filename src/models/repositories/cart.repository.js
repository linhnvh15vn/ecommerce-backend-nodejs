'use strict';

const Cart = require('../cart.schema');

class CartRepository {
  static async findAllCarts({ filter }) {
    return await Cart.find(filter);
  }

  static async findOneCart({ filter }) {
    return await Cart.findOne(filter).lean();
  }

  static async createCart({ userId, product }) {
    console.log(product);

    return await Cart.findOneAndUpdate(
      {
        user_id: userId,
      },
      {
        $addToSet: {
          products: product, // Add directly in products array
        },
      },
      {
        new: true,
        upsert: true,
      },
    );
  }

  static async updateCartQuantity({ userId, product }) {
    const { _id, quantity } = product;

    return await Cart.findOneAndUpdate(
      {
        user_id: userId,
        status: 'active',
        'products._id': _id,
      },
      {
        $inc: {
          'products.$.quantity': quantity,
        },
      },
      {
        new: true,
        upsert: true,
      },
    );
  }

  static async removeProductFromCart({ userId, productId }) {
    return await Cart.findOneAndUpdate(
      {
        user_id: userId,
      },
      {
        $pull: {
          products: {
            productId,
          },
        },
      },
    );
  }
}

module.exports = CartRepository;
