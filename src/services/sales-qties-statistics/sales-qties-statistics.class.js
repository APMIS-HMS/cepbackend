/* eslint-disable no-unused-vars */
const jsend = require('jsend');
const differenceInCalendarDays = require('date-fns/difference_in_calendar_days');
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
    let transactionTypes = await inventoryTxnService.find({
      query: {
        $limit: false
      }
    });
    // let products = {};
    if (isNaN(id) !== true) {
      const products = await inventoriesService.find({
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
        if (x.inventorytransactionType === "dispense" && differenceInCalendarDays(new Date(), new Date(x.updatedAt)) <= id) {
          sum += x.price;
          return x;
        }
      });
      return jsend.success({
        txns_no: dispenseItems.length,
        total_txns_sum: (isNaN(sum) === true) ? 0 : sum
      });
    } else {
      return jsend.error({
        code: 400,
        message: 'Invalid *days parameter',
        data: false
      });
    }
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
