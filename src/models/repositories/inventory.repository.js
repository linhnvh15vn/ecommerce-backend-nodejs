'use strict';

const Inventory = require('../inventory.schema');

class InventoryRepository {
  //
  static async createInventory(body) {
    return await Inventory.create(body);
  }
}

module.exports = InventoryRepository;
