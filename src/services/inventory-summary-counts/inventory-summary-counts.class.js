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
    const salesService = this.app.service('sales-qties-statistics');
    let expiredProductCounter = 0;
    let aboutExpiredProductCounter = 0;
    let outOfOrderProductCounter = 0;
    let aboutOutOfOrderProductCounter = 0;
    let products = await inventoriesService.find({
      query: {
        $or: [{
          storeId: params.query.storeId
        }, {
          facilityId: params.query.facilityId
        }],
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
          let size = (filter.size) * x.reorder;
          if (size > x.availableQuantity) {
            outOfOrderProductCounter += 1;
          } else if ((size + (size / 4)) >= x.availableQuantity && size <= x.availableQuantity) {
            aboutOutOfOrderProductCounter += 1;
          }
        }
      }
    });

    const sales = await salesService.get(id, {
      query: {
        facilityId: params.query.facilityId,
        storeId: params.query.storeId
      }
    });

    let result = [];
    result.push({
      key: 'Inventory',
      total: products.data.length,
      batches: productTransactions.length,
      colour: "#008000",
      url: 'inventory-count-details'
    }, {
      key: 'Expired Items',
      batches: expiredProductCounter,
      colour: "#FF0000",
      url: 'inventory-expired-product-details'
    }, {
      key: 'About to Expired',
      batches: aboutExpiredProductCounter,
      colour: "#D95B5B",
      url: 'inventory-about-to-expire-product-details?numberOfDays=' + id
    }, {
      key: 'Require Reorder',
      total: aboutOutOfOrderProductCounter,
      colour: "#A1638F",
      url: 'out-of-stock-count-details/1'
    }, {
      key: 'Out of Stock',
      total: outOfOrderProductCounter,
      colour: "#581845",
      url: 'out-of-stock-count-details/0'
    }, {
      key: 'Transaction',
      total: sales.data.txns_no,
      colour: "#ABDCA2",
      url: '/'
    }, {
      key: 'Revenue',
      total: sales.data.total_txns_sum,
      colour: "#6A9A61",
      url: '/'
    });


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
