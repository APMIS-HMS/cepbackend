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

  async get(id, params) {
    const inventoriesService = this.app.service('inventories');
    let expiredProductCounter = 0;
    let aboutExpiredProductCounter = 0;
    let outOfOrderProductCounter = 0;
    let aboutOutOfOrderProductCounter = 0;
    let expiredProduct = await inventoriesService.find({
      query: {
        storeId: id,
        $limit: false
      }
    });
    console.log(expiredProduct);
    const currentDate = new Date();
    for (let index = 0; index < expiredProduct.data.length; index++) {
      const element = expiredProduct.data[index];
      for (let indx = 0; indx < element.transactions.length; indx++) {
        const element2 = element.transactions[indx];
        let productExpiryDate = new Date(element2.expiryDate);
        if (productExpiryDate.getFullYear() <= currentDate.getFullYear()) {
          if (productExpiryDate.getMonth() < currentDate.getMonth()) {
            expiredProductCounter += 1;
          } else if (productExpiryDate.getMonth() == currentDate.getMonth()) {
            if (productExpiryDate.getFullYear() < currentDate.getFullYear()) {
              expiredProductCounter += 1;
            } else if (productExpiryDate.getFullYear() == currentDate.getFullYear()) {
              aboutExpiredProductCounter += 1;
            }
          }
        }
      }
      if (element.reOrderSizeId !== undefined) {
        let filter = element.productObject.productConfigObject.find(x => x._id !== undefined && x._id.toString() === element.reOrderSizeId.toString());
        if (filter !== undefined) {
          let size = (filter.size) * element.reOrderLevel;
          if (size > element.availableQuantity) {
            outOfOrderProductCounter += 1;
          } else if (size === element.availableQuantity) {
            aboutOutOfOrderProductCounter += 1;
          }

        }
      }
    }

    let result = {
      expired: expiredProductCounter,
      about_to_expire: aboutExpiredProductCounter,
      near_reorder_level: aboutOutOfOrderProductCounter,
      past_reorder_level: outOfOrderProductCounter
    }

    return jsend.success(result);
  }

  create(data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }

    return Promise.resolve(data);
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
