'use strict';

const { default: mongoose } = require('mongoose');
const { NotFound } = require('../core/error.response');
const CartRepository = require('../models/repositories/cart.repository');
const ProductRepository = require('../models/repositories/product.repository');

class CartService {
  static async findCardByUserId(userId) {
    return await CartRepository.findOne({ userId });
  }

  static async addToCart({ userId, product }) {
    const cart = await CartRepository.findOne({ userId });
    if (!cart) {
      return await CartRepository.create({ userId, product });
    }

    if (!cart.items.length) {
      cart.items = [product];
      return await cart.save();
    }

    return await CartRepository.updateQuantity({ userId, product });
  }

  /*
    body: {
      shopOrderIds: [
        {
          _id,
          items: [
            {
              productId,
              quantity,
              oldQuantity
            }
          ]
        }
      ]
    }
  */
  static async updateQuantity({ userId, shopOrderIds }) {
    const { productId, quantity, oldQuantity } = shopOrderIds[0].items[0];

    const foundProduct = await ProductRepository.findById({ productId });
    if (!foundProduct) {
      throw new NotFound('No product found.');
    }

    if (foundProduct.shopId.toString() !== shopOrderIds[0]._id) {
      throw new NotFound('No product found in this shop.');
    }

    if (quantity === 0) {
      return await CartRepository.removeItem({ userId, productId });
    }

    return await CartRepository.updateQuantity({
      userId,
      product: {
        _id: foundProduct._id,
        quantity: quantity - oldQuantity,
      },
    });
  }

  static async removeItem({ userId, productId }) {
    return await CartRepository.removeItem({ userId, productId });
  }
}

module.exports = CartService;
