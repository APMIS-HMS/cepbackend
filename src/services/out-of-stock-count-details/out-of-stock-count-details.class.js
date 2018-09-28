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
    let reorders = [];
    products.data.map(x => {
      if (x.reOrderSizeId !== undefined) {
        const filter = x.productObject.productConfigObject.find(y => y._id !== undefined && y._id.toString() === x.reOrderSizeId.toString());
        if (filter !== undefined) {
          let size = (filter.size) * x.reorder;
          if (id.toString() === '0') {
            if (size > x.availableQuantity) {
              x.productObject.availableQuantity = x.availableQuantity
              x.productObject.reorderValue = x.reorder;
              const value = JSON.parse(JSON.stringify(x.productObject));
              delete value.productConfigObject;
              value.productConfig = filter;
              reorders.push(value);
            }
          } else {
            if ((size + (size / 4)) >= x.availableQuantity && size <= x.availableQuantity) {
              x.productObject.availableQuantity = x.availableQuantity
              x.productObject.reorderValue = x.reorder;
              const value = JSON.parse(JSON.stringify(x.productObject));
              delete value.productConfigObject;
              value.productConfig = filter;
              reorders.push(value);
            }
          }
        }
      }
    });
    return jsend.success(reorders);
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
