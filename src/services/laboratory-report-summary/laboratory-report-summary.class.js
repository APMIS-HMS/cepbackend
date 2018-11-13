/* eslint-disable no-unused-vars */
const jsend = require('jsend');
class Service {
  constructor(options) {
    this.options = options || {};
  }

  find(params) {
    return Promise.resolve([]);
  }

  get(id, params) {
    return Promise.resolve({
      id,
      text: `A new message with ID: ${id}!`
    });
  }


  async create(data, params) {
    const InvestigationService = this.app.service('investigations');
    const LaboratoryRequestService = this.app.service('laboratory-requests');

    let facilityId = data.facilityId;
    try {
      console.log('========Got here=========\n', facilityId);
      const getLabRequest = await LaboratoryRequestService.find({
        query: {
          facilityId: facilityId
        }
      });
      console.log('========Got here1=========');
      if (getLabRequest !== undefined) {
        console.log('==============data=============\n', getLabRequest);
      }
    } catch (error) {
      console.log('===error===\n', error);
      return jsend.error({
        message: 'There was an errror while ',
        code: 422,
        data: {
          error
        }
      });
    }

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
