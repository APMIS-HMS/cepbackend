/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {};
  }

  setup(app){
    this.app = app;
  }

  async find (params) {
    let billingService = this.app.service('billings');

    let facilityId = params.query.facilityId;
    let getBillings, covers;

        let date = new Date();
        let startDate = params.query.startDate?params.query.startDate:new Date(date.setHours(0,0,0,0));
        let endDate = params.query.endDate?params.query.endDate:Date.now();

    try {
      getBillings = await billingService.find({query:{
        facilityId:facilityId,
        $and: [{
          createdAt: {
              $gte: startDate
          }
      },
      {
          createdAt: {
              $lte: endDate
          }
      }
      ],
      $limit: (params.query.$limit) ? params.query.$limit : 10,
      $skip: (params.query.$skip) ? params.query.$skip : 0
      }
    });
    } catch (error) {
      return error;
    }
    return Promise.resolve([]);
  }

  get (id, params) {
    return Promise.resolve({
      id, text: `A new message with ID: ${id}!`
    });
  }

  create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }

    return Promise.resolve(data);
  }

  update (id, data, params) {
    return Promise.resolve(data);
  }

  patch (id, data, params) {
    return Promise.resolve(data);
  }

  remove (id, params) {
    return Promise.resolve({ id });
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
