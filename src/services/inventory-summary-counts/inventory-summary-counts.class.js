/* eslint-disable no-unused-vars */
const jsend = require('jsend');
const differenceInDays = require('date-fns/difference_in_days');
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
    let products = await inventoriesService.find({
      query: {
        storeId: id,
        availableQuantity: {
          $gt: 0
        },
        $limit: false
      }
    });
    let productTransactions = [];
    products.data.map(x => x.transactions.map(z => {
      productTransactions.push(z);
    }));

    productTransactions.map(x => {      
      let diffInDays = differenceInDays(new Date(x.expiryDate), new Date());
      if (diffInDays <= 15 && diffInDays >= 0) {
        aboutExpiredProductCounter += 1;
      } else if (diffInDays < 0) {
        expiredProductCounter += 1;
      }
    });

    products.data.map(x => {
      if (x.reOrderSizeId !== undefined) {
        const filter = x.productObject.productConfigObject.find(y => y._id !== undefined && y._id.toString() === x.reOrderSizeId.toString());
        if (filter !== undefined) {
          let size = (filter.size) * x.reOrderLevel;
          if (size > x.availableQuantity) {
            outOfOrderProductCounter += 1;
          } else if ((size + (size / 4)) <= x.availableQuantity && size === x.availableQuantity) {
            aboutOutOfOrderProductCounter += 1;
          }
        }
      }
    });

    let result = {
      inventories: {
        total: products.data.length,
        batches: productTransactions.length,
        url: '/'
      },
      expired: {
        total: expiredProductCounter,
        url: '/'
      },
      about_to_expire: {
        total: aboutExpiredProductCounter,
        url: '/'
      },
      near_reorder_level: {
        total: aboutOutOfOrderProductCounter,
        url: '/'
      },
      past_reorder_level: {
        total: outOfOrderProductCounter,
        url: '/'
      }
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
