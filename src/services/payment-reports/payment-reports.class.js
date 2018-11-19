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

  }

  async get(id, params) {
    const invoicesService = this.app.service('invoices');
    params.query.facilityId = id;
    const isSummary = params.query.isSummary;
    delete params.query.isSummary;
    params.query.$select = (!isSummary) ? ['invoiceNo', 'patientId', 'paymentCompleted', 'payments', 'totalPrice', 'balance'] : ['payments'];
    const saleSummary = await invoicesService.find({
      query: params.query
    });
    let totalSales = 0;
    saleSummary.data.map(item => {
      if (item.patientObject !== undefined) {
        item.person = (item.patientObject.personDetails !== undefined) ? (item.patientObject.personDetails.firstName + ' ' + item.patientObject.personDetails.lastName) : '';
      }
      delete item.patientObject;
      if (isSummary) {
        item.payments.map(txn => {
          totalSales += txn.amountPaid;
        });
      }
    });
    if (isSummary) {
      return jsend.success({totalSales:totalSales});
    }
    return saleSummary;
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
