/* eslint-disable no-unused-vars */
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
    const patientService = this.app.service('patients');
    const prescriptionsService = this.app.service('prescriptions');

    let patientIds = await patientService.find({
      query: {
        personId: params.query.personId,
        $select: ['_id']
      }
    });
    let strPatients = [];
    strPatients.push.apply(strPatients, patientIds.data);
    delete params.query.personId;
    params.query.patientId = strPatients;
    let prescriptions = await prescriptionsService.find({
      query: params.query
    });
    return prescriptions;
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
