'use strict';

const { NotFound, BadRequest } = require('../core/error.response');
const CartRepository = require('../models/repositories/cart.repository');
const DiscountService = require('./discount.service');
const ProductService = require('./product.service');

class CheckoutService {
  /*
    body: {
      cartId,
      userId,
      shopOrderIds: [
        {
          shopId,
          discounts: [],
          items: [
            {
              productId,
              price,
              qty,
            }
          ]
        }
      ]
    }
  */
  static async checkoutReview({ cartId, userId, shopOrderIds }) {
    const foundCart = await CartRepository.findById(cartId);
    if (!foundCart) {
      throw NotFound('No cart found with this cartId.');
    }

    const orderSummary = {
      subtotal: 0,
      shippingFee: 0,
      discountAmount: 0,
      finalTotal: 0,
    };

    const shopOrderIdsNew = [];

    for (let i = 0; i < shopOrderIds.length; i++) {
      const { shopId, discounts, items } = shopOrderIds[i];
      const checkProductByServer = await ProductService.checkProductByServer(
        items,
      );
      if (!checkProductByServer[0]) {
        throw new BadRequest('Something went wrong.');
      }

      const itemsTotalPrice = checkProductByServer.reduce(
        (acc, item) => acc + item.quantity * item.price,
        0,
      );
      orderSummary.subtotal += itemsTotalPrice;

      const updatedOrderItems = {
        shopId,
        discounts,
        totalBeforeDiscount: itemsTotalPrice,
        totalAfterDiscount: itemsTotalPrice,
        items,
      };

      if (discounts.length > 0) {
        const { discountAmount, finalPrice } =
          await DiscountService.getDiscountAmount({
            code: discounts[0],
            userId,
            shopId,
            products: checkProductByServer,
          });

        orderSummary.discountAmount += discountAmount;
        if (discountAmount > 0) {
          updatedOrderItems.totalAfterDiscount = finalPrice;
        }
      }

      orderSummary.finalTotal += updatedOrderItems.totalAfterDiscount;
      shopOrderIdsNew.push(updatedOrderItems);
    }

    return {
      shopOrderIds,
      shopOrderIdsNew,
      orderSummary,
    };
  }
}

module.exports = CheckoutService;
