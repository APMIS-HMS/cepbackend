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
    const inventoryTxnService = this.app.service('inventory-transaction-types');
    let expiredProductCounter = 0;
    let aboutExpiredProductCounter = 0;
    let outOfOrderProductCounter = 0;
    let aboutOutOfOrderProductCounter = 0;
    let transactionTypes = await inventoryTxnService.find({
      query: {
        $limit: false
      }
    });
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

    let sales = {};
    
    if (isNaN(id) !== true) {
      let batchTxns = [];
      products.data.map(x => x.transactions.map(y => {
        if (y.batchTransactions.length > 0) {
          batchTxns.push.apply(batchTxns, y.batchTransactions);
        }
      }));
      
      batchTxns.map(x => transactionTypes.data.map(y => {
        if (y._id.toString() === x.inventorytransactionTypeId.toString()) {
          x.inventorytransactionType = y.name;
          return x;
        }
      }));
      
      let sum = 0;
      const dispenseItems = batchTxns.filter(x => {
        if (x.inventorytransactionType === "dispense" && differenceInDays(new Date(), new Date(x.updatedAt)) <= id) {
          sum += x.price;
          return x;
        }
      });
      
      sales = {
        txns_no: dispenseItems.length,
        total_txns_sum: (isNaN(sum) === true) ? 0 : sum
      };
    } else {
      return jsend.error({
        code: 400,
        message: 'Invalid *days parameter',
        data: false
      });
    }






    let result = [];
    result.push({
      key: 'Inventory',
      values: [{
          key: 'Products',
          value: products.data.length,
        },
        {
          key: 'Batches',
          value: productTransactions.length,
        }
      ],
      method: 'find',
      query: {
        params: {
          storeId: params.query.storeId
        }
      },
      hex: "#008000",
      rgb: "rgb(0,128,0)",
      url: 'inventory-count-details'
    }, {
      key: 'Expired Items',
      values: [{
        key: 'Batches',
        value: expiredProductCounter,
      }],
      method: 'find',
      query: {
        params: {
          storeId: params.query.storeId
        }
      },
      hex: "#FF0000",
      rgb: "rgb(255,0,0)",
      url: 'inventory-expired-product-details'
    }, {
      key: 'About to Expired',
      values: [{
        key: 'Batches',
        value: aboutExpiredProductCounter,
      }],
      method: 'find',
      query: {
        params: {
          numberOfDays: id,
          storeId: params.query.storeId
        }
      },
      hex: "#D95B5B",
      rgb: "rgb(217,91,91)",
      url: 'inventory-about-to-expire-product-details'
    }, {
      key: 'Require Reorder',
      values: [{
        key: 'Batches',
        value: aboutOutOfOrderProductCounter,
      }],
      method: 'get',
      getId: 1,
      query: {
        params: {
          storeId: params.query.storeId
        }
      },
      hex: "#A1638F",
      rgb: "rgb(161,99,143)",
      url: 'out-of-stock-count-details'
    }, {
      key: 'Out of Stock',
      values: [{
        key: 'Batches',
        value: outOfOrderProductCounter,
      }],
      method: 'get',
      getId: 0,
      query: {
        params: {
          storeId: params.query.storeId
        }
      },
      hex: "#581845",
      rgb: "rgb(88,24,69)",
      url: 'out-of-stock-count-details'
    }, {
      key: 'Transaction',
      values: [{
        key: 'Transaction',
        value: sales.txns_no,
      }],
      method: 'find',
      query: {
        params: {
          storeId: params.query.storeId
        }
      },
      hex: "#ABDCA2",
      rgb: "rgb(171,220,162)",
      url: 'inventory-batch-transaction-details'
    }, {
      key: 'Revenue',
      values: [{
        key: 'Amount',
        value: sales.total_txns_sum,
      }],
      method: 'find',
      query: {
        params: {
          storeId: params.query.storeId
        }
      },
      hex: "#6A9A61",
      rgb: "rgb(106,154,97)",
      url: 'inventory-batch-transaction-details'
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
