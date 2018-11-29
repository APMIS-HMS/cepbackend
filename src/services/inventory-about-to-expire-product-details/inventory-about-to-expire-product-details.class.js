/* eslint-disable no-unused-vars */
var isAfter = require('date-fns/is_after');
var isBefore = require('date-fns/is_before');
const jsend = require('jsend');
var addDays = require('date-fns/add_days');
var Paginator = require('../../../src/helpers/paginate');
class Service {
  constructor(options) {
    this.options = options || {};
  }

  async find(params) {
    const inventoriesService = this.app.service('inventories');
    let expiredProduct = await inventoriesService.find({
      query: {
        storeId: params.query.storeId,
        availableQuantity: {
          $gt: 0
        },
        $limit: false
      }
    });
    let retVal = [];
    const currentDate = new Date();
    // for (let index = 0; index < expiredProduct.data.length; index++) {
    //     const element = expiredProduct.data[index];
    //     console.log('a');
    //     for (let indx = 0; indx < element.transactions.length; indx++) {
    //         const element2 = element.transactions[indx];
    //         let productExpiryDate = new Date(element2.expiryDate);
    //         console.log('b');
    //         console.log(productExpiryDate.getFullYear());
    //         console.log(currentDate.getFullYear());
    //         if (productExpiryDate.getFullYear() <= currentDate.getFullYear()) {
    //             console.log('c');
    //             if (productExpiryDate.getMonth() < currentDate.getMonth()) {
    //                 //expiredProductCounter += 1;
    //                 console.log(1);
    //                 retVal.push(element2);
    //             } else if (productExpiryDate.getMonth() == currentDate.getMonth()) {
    //                 console.log('d');
    //                 if (productExpiryDate.getFullYear() < currentDate.getFullYear()) {
    //                     //expiredProductCounter += 1;
    //                     console.log(2);
    //                     retVal.push(element2);
    //                 } else if (productExpiryDate.getFullYear() == currentDate.getFullYear()) {
    //                     //aboutExpiredProductCounter += 1;
    //                 }
    //             }
    //         }
    //     }

    // }

    retVal = expiredProduct.data.map(x => {
      return {
        transactions: x.transactions.filter(y => isBefore(y.expiryDate, addDays(Date.now(), params.query.numberOfDays))).map(u => {
          return {
            quantity: u.quantity,
            batchNumber: u.batchNumber,
            expiryDate: u.expiryDate
          };
        }),
        productName: x.productObject.name,
        reOrderLevel: x.reorder,
        price: x.price.price,
        availableQuantity: x.totalQuantity
      };
    });
    const skip = params.query.skip;
    const limit = params.query.limit;
    const page = skip / limit + 1;
    return jsend.success(Paginator(retVal.filter(x => x.transactions.length > 0), page, limit));
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
