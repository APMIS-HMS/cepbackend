/* eslint-disable no-unused-vars */
const jsend = require('jsend');
class Service {

  setup(app) {
    this.app = app;
  }

  constructor(options) {
    this.options = options || {};
  }

  async find(params) {
    const facilityService = this.app.service('facilities');
    params.query.name = {
      $regex: params.query.name,
      '$options': 'i'
    };
    const facilityResults = await facilityService.find({
      query: params.query
    });
    return facilityResults;
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
