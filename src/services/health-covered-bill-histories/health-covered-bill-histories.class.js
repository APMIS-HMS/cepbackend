/* eslint-disable no-unused-vars */
const format = require('date-fns/format');
const jsend = require('jsend');
class Service {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }


  async find(params) {
    const billingService = this.app.service('billings');
    const endDate = format(params.query.endDate);

    const startDate = format(params.query.startDate);
    const bills = await billingService.find({
      query: {
        isCoveredPage: true,
        facilityId: params.query.facilityId,
        $or: [{
          'billItems.covered.hmoId': params.query.hmoId
        }, {
          'billItems.covered.familyId': params.query.hmoId
        }, {
          'billItems.covered.companyId': params.query.hmoId
        }],
        $and: [{
            updatedAt: {
              $gte: startDate
            }
          },
          {
            updatedAt: {
              $lte: endDate
            }
          }
        ],
        $select: ['coverFile', 'billItems.covered', 'billItems.patientId', 'billItems.facilityServiceId', 'billItems.serviceId','billItems.totalPrice']
      }
    });

    bills.data.map(element => {
      const index = element.billItems.map(x => x.covered.isVerify !== undefined);
      if (index.length === 0) {
        element.isPending = true;
      } else {
        element.isPending = false;
      }
    });
    const pendingBills = bills.data.filter(x => x.isPending === true);
    const historyBills = bills.data.filter(x => x.isPending === false);
    return jsend.success({
      pendingBills: pendingBills,
      historyBills: historyBills
    });
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
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
