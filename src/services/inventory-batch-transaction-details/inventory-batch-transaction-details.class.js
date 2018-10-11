/* eslint-disable no-unused-vars */
var isAfter = require('date-fns/is_after');
var isBefore = require('date-fns/is_before');
const jsend = require('jsend');
var subDays = require('date-fns/sub_days');
class Service {
  constructor(options) {
    this.options = options || {};
  }

  async find(params) {
    if (params.query.storeId !== undefined && params.query.numberOfDays !== undefined) {
      const inventoriesService = this.app.service('inventories');
      const inventoryTransactionTypeService = this.app.service('inventory-transaction-types');
      let inventoryTransactionTypeRecord = await inventoryTransactionTypeService.find({
        query: {
          'name': 'dispense'
        }
      });
      if (inventoryTransactionTypeRecord.data.length > 0) {
        let transactionTypeId = inventoryTransactionTypeRecord.data.reduce(x => x)._id;

        let expiredProduct = await inventoriesService.find({
          query: {
            storeId: params.query.storeId,
            availableQuantity: {
              $gt: 0
            },
            $limit: false
          }
        });

        let arrMe = [];

        expiredProduct.data.map(x =>
          x.transactions.filter(m => m.batchTransactions.length > 0).map(y => {
            let batchTransactionFiltered = y.batchTransactions
              .filter(k => k.inventorytransactionTypeId.toString() == transactionTypeId.toString() && isAfter(k.createdAt, subDays(Date.now(), params.query.numberOfDays)));
            if (batchTransactionFiltered.length > 0) {
              arrMe.push({
                transaction: {
                  batchNumber: batchTransactionFiltered.reduce(uu => uu).batchNumber,
                  quantity: batchTransactionFiltered.reduce(uu => uu).quantity,
                  createdAt: batchTransactionFiltered.reduce(uu => uu).createdAt,
                  price: batchTransactionFiltered.reduce(uu => uu).price
                },
                productName: x.productObject.name
              });
            }
          })
        );
        return jsend.success(arrMe);
      } else {
        return jsend.error('Transaction Type missing on the server');
      }

      // return jsend.success(expiredProduct.data.map(x => {
      //     return {
      //         transactions: x.transactions.filter(y => isAfter(y.expiryDate, Date.now())).map(u => {
      //             return {
      //                 quantity: u.quantity,
      //                 batchNumber: u.batchNumber,
      //                 expiryDate: u.expiryDate
      //             };
      //         }),
      //         productName: x.productObject.name
      //     };
      // }));
    } else {
      return jsend.error({
        code: 500,
        message: this.app
      });
    }

  }

  get(id, params) {
    return Promise.resolve({
      id,
      text: `A new message with ID: ${id}!`
    });
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

  setup(app) {
    this.app = app;
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
