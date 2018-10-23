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

  }

  async create(data, params) {
    const labInvestigation = this.app.service('facility-prices');
    const billCreatorsService = this.app.service('bill-creators');

    // const facilityPrice = await facilityPriceService.find({
    //   query: {
    //     facilityId: id,
    //     categoryId: data.categoryId,
    //     facilityServiceId: data.facilityServiceId,
    //     serviceId: data.serviceId
    //   }
    // });
    // const price = (facilityPrice.data[0].lenght !== 0) ? facilityPrice.data[0].price : 0;
    let bills = [];
    data.treatmentSheet.map(element => {
      element.investigations.map(investigation => {
        if
        bills.push({
          unitPrice: data.price,
          facilityId: id,
          facilityServiceId: data.facilityServiceId,
          serviceId: data.serviceId,
          patientId: data.patientId,
          quantity: data.quantity,
          active: true,
          totalPrice: data.price * data.quantity,
          covered: data.covered
        });
      });
    });
    bills.push({
      unitPrice: data.price,
      facilityId: id,
      facilityServiceId: data.facilityServiceId,
      serviceId: data.serviceId,
      patientId: data.patientId,
      quantity: data.quantity,
      active: true,
      totalPrice: data.price * data.quantity,
      covered: data.covered
    });
    const billCreator = await billCreatorsService.createBill(bills, {
      query: {
        facilityId: id,
        patientId: data.patientId
      }
    });
    return jsend.success(billCreator);
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
