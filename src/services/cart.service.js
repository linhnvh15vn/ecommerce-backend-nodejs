'use strict';

const CartRepository = require('../models/repositories/cart.repository');
const ProductRepository = require('../models/repositories/product.repository');

class CartService {
  static async findUserCart(userId) {
    return CartRepository.findOneCart({ filter: { user_id: userId } });
  }

  static async addToCart({ userId, product }) {
    const cart = await CartRepository.findOneCart({
      filter: { user_id: userId },
    });
    if (!cart) {
      return await CartRepository.createCart({ userId, product });
    }

    if (!cart.products.length) {
      cart.products = [product];
      return await cart.save();
    }

    return await CartRepository.updateCartQuantity({ userId, product });
  }

  static async updateCartQuantity({}) {
    const foundProduct = await ProductRepository.findProductById({ productId });
  }

  static async removeProductFromCart({ userId, productId }) {
    return ProductRepository.removeProductFromCart({ userId, productId });
  }
}

module.exports = CartService;
