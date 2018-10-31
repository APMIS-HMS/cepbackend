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
    const personsService = this.app.service('people');

    const usersService = this.app.service('users');
    const patientsService = this.app.service('patients');
    const facilitiesService = this.app.service('facilities');
    let personsCount = await personsService.find({query:{$limit:0}});
    let usersCount = await usersService.find({query:{$limit:0}});
    let patientsCount = await patientsService.find({query:{$limit:0}});
    let facilitiesCount = await facilitiesService.find({query:{$limit:0}});
    let facilityHosp = await facilitiesService.find({
      query: {
        "facilityTypeId": "Hospital",
        $limit:0
      }
    });
    let facilityHMO = await facilitiesService.find({
      query: {
        "facilityTypeId": "HMO",
        $limit:0
      }
    });
    let facilityImage = await facilitiesService.find({
      query: {
        "facilityTypeId": "Imaging Centre",
        $limit:0
      }
    });
    let result = {
      persons: personsCount.total,
      users: usersCount.total,
      patients: patientsCount.total,
      facilities: {
        hospital: facilityHosp.total,
        hmo: facilityHMO.total,
        imaging: facilityImage.total,
        all: facilitiesCount.total
      }
    }
    return jsend.success(result);
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
