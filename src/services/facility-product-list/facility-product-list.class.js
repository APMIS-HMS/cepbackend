/* eslint-disable no-unused-vars */
class Service {
  constructor(options) {
    this.options = options || {};
  }

  async find(params) {
    const inventoryService = this.app.service('inventories');
    const facilityPriceService = this.app.service('facility-prices');
    const reOrderLevelService = this.app.service('product-reorders');
    const storeInventories = await inventoryService.find({
      query: {
        facilityId: params.query.facilityId,
        storeId: params.query.storeId,
        $limit: params.query.limit !== undefined ? params.query.limit : 10,
        $skip: params.query.skip != undefined ? params.query.skip : 0
      }
    });
    const facilityServiceIds = storeInventories.data.map(inventory => inventory.facilityServiceId);
    const serviceIds = storeInventories.data.map(inventory => inventory.serviceId);
    const productIds = storeInventories.data.map(inventory => inventory.productId);

    //get prices for all inventory products
    const prices = await facilityPriceService.find({
      query: {
        facilityId: params.query.facilityId,
        $and: [{
            'facilityServiceId': {
              $in: facilityServiceIds
            },
          },
          {
            serviceId: {
              $in: serviceIds
            }
          }
        ]
      }
    });

    // get product re-order-level
    const productLevels = await reOrderLevelService.find({
      query: {
        facilityId: params.query.facilityId,
        storeId: params.query.storeId,
        'productId': {
          $in: productIds
        }
      }
    });

    const mapStoreInventories = storeInventories.data.map(inventory => {
      return {
        productName: inventory.productObject.name,
        availableQuantity: inventory.availableQuantity,
        transactions: inventory.transactions.filter(transaction => transaction.availableQuantity > 0),
        price: this.getProductPrice(prices.data, inventory.serviceId.toString(), inventory.facilityServiceId.toString()),
        reOrderLevel: this.getProductReOrderLevel(productLevels.data, inventory.storeId.toString(), inventory.productId.toString())
      }
    });


    return Promise.resolve({
      total: storeInventories.total,
      limit: storeInventories.limit,
      skip: storeInventories.skip,
      data: mapStoreInventories
    });
  }

  getProductPrice(prices, serviceId, facilityServiceId) {
    const price = prices.filter(price => price.facilityServiceId.toString() == facilityServiceId && price.serviceId.toString() == serviceId);
    return price.length > 0 ? price[0].price : 0
  }

  getProductReOrderLevel(reOrderLevels, storeId, productId) {
    const order = reOrderLevels.filter(order => order.storeId.toString() == storeId && order.productId.toString() == productId);
    return order.length > 0 ? order[0].reOrderLevel : 0
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
