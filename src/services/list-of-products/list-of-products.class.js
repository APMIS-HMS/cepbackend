/* eslint-disable no-unused-vars */
class Service {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  async find(params) {
    const productConfigService = this.app.service('product-configs');
    const fpService = this.app.service('formulary-products');
    let productConfig = {};
    productConfig.data = [];

    let productIds = await fpService.find({
      query: {
        facilityId: params.query.facilityId
      }
    });
    // console.log(productIds);
    for (let index = 0; index < productIds.data.length; index++) {
      const productConfigItems = await productConfigService.find({
        query: {
          facilityId: params.query.facilityId,
          productId: productIds.data[index].id
        }
      });
      if (productConfigItems.data[0] !== undefined) {
        productConfig.data.push(productConfigItems.data[0]);
      }
    }

    return productConfig;
  }

  get(id, params) {
    return Promise.resolve({
      id,
      text: `A new message with ID: ${id}!`
    });
  }

  create(data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current)));
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
