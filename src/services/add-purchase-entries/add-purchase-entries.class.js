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
    const purchaseEntry = {};
    purchaseEntry.invoiceAmount = data.amount.toString();
    purchaseEntry.deliveryDate = data.deliveryDate;
    purchaseEntry.facilityId = data.facilityId;
    purchaseEntry.invoiceNumber = data.invoiceNo;
    purchaseEntry.orderId = data.orderId;
    purchaseEntry.remark = data.desc;
    purchaseEntry.storeId = data.store;
    purchaseEntry.supplierId = data.supplier;
    purchaseEntry.createdBy = data.createdBy;

    purchaseEntry.products = [];

    /* end*/

    let inventories = [];
    let existingInventories = [];
    for (let index = 0; index < data.productForms.length; index++) {
      let productObj = data.productForms[index];
      if (productObj.productObject.config !== undefined) {
        delete productObj.productObject.config;
      }
      // let productObject = {
      //   id: productObj.id,
      //   name: productObj.product,
      //   code: productObj.code
      // }
      let product = {};
      product.batchNo = productObj.batchNo;
      product.costPrice = productObj.costPrice;
      product.expiryDate = productObj.expiryDate;
      product.productId = productObj.id;
      product.productObject = productObj.productObject;
      product.quantity = productObj.qty;
      product.qtyDetails = productObj.qtyDetails;
      product.availableQuantity = productObj.qty;
      purchaseEntry.products.push(product);

      const existingInventory = await inventoriesService.find({
        query: {
          facilityId: data.facilityId,
          storeId: data.store,
          productId: productObj.id
        }
      });
      const inventory = existingInventory.data[0];
      inventory.totalQuantity = inventory.totalQuantity + productObj.qty;
      inventory.availableQuantity = inventory.availableQuantity + productObj.qty;
      const inventoryTransaction = {};
      inventoryTransaction.batchNumber = productObj.batchNo;
      inventoryTransaction.costPrice = productObj.costPrice;
      inventoryTransaction.expiryDate = productObj.expiryDate;
      inventoryTransaction.quantity = productObj.qty;
      inventoryTransaction.availableQuantity = productObj.qty;
      inventory.transactions.push(inventoryTransaction);

      existingInventories.push(inventory);
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
