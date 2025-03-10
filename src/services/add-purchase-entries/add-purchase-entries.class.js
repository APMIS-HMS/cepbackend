/* eslint-disable no-unused-vars */
const jsend = require('jsend');
class Service {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  find(params) {
    return Promise.resolve([]);
  }

  get(id, params) {
    return Promise.resolve({
      id,
      text: `A new message with ID: ${id}!`
    });
  }

  async create(data, params) {

    const inventoriesService = this.app.service('inventories');
    const purchaseEntriesService = this.app.service('purchase-entries');
    const makePurchaseEntriesService = this.app.service('make-purchase-entries');
    const purchaseEntry = data;

    let inventories = [];
    let existingInventories = [];
    for (let index = 0; index < data.products.length; index++) {
      let productObj = data.products[index];

      const existingInventory = await inventoriesService.find({
        query: {
          facilityId: data.facilityId,
          storeId: data.storeId,
          productId: productObj.productId
        }
      });
      const inventory = existingInventory.data.length > 0 ? existingInventory.data[0] : undefined;
      if (inventory !== undefined) {
        inventory.totalQuantity = inventory.totalQuantity + productObj.quantity;
        inventory.availableQuantity = inventory.availableQuantity + productObj.quantity;
        const inventoryTransaction = {};
        inventoryTransaction.batchNumber = productObj.batchNo;
        inventoryTransaction.costPrice = productObj.costPrice;
        inventoryTransaction.expiryDate = productObj.expiryDate;
        inventoryTransaction.quantity = productObj.quantity;
        inventoryTransaction.availableQuantity = productObj.quantity;
        inventory.transactions.push(inventoryTransaction);

        existingInventories.push(inventory);
      }

    };

    const data_ = {
      purchaseEntry: purchaseEntry,
      orderId: data.orderId,
      inventories: inventories,
      existingInventories: existingInventories
    }
    const _makePurchaseEntriesService = await makePurchaseEntriesService.create(data_);
    return jsend.success(_makePurchaseEntriesService);
  }

  update(id, data, params) {
    return Promise.resolve(data);
  }

  patch(id, data, params) {
    return Promise.resolve(data);
  }

  remove(id, params) {
    return Promise.resolve({
      id
    });
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
