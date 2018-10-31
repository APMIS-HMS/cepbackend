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
    const appointmentsService = this.app.service('appointments');
    let appointments = await appointmentsService.find({
      query: {
        facilityId: id,
        $limit: false
      }
    });
    const checkOuts = appointments.data.filter(x => x.isCheckedOut === true);
    const nonCheckOuts = appointments.data.filter(x => x.isCheckedOut === false);

    let filteredCheckOut = [];
    for (let index = 0; index < checkOuts.length; index++) {
      const element = checkOuts[index];
      let check = filteredCheckOut.filter(x => x.name === element.clinicId);
      if (check.length === 0) {
        filteredCheckOut.push({
          name: element.clinicId,
          count: 1
        })
      } else {
        check[0].count += 1;
      }
    }


    let nonFilteredCheckOut = [];
    for (let index = 0; index < nonCheckOuts.length; index++) {
      const element = nonCheckOuts[index];
      let check = nonFilteredCheckOut.filter(x => x.name === element.clinicId);
      if (check.length === 0) {
        nonFilteredCheckOut.push({
          name: element.clinicId,
          count: 1,
          date: (element.attendance !== undefined) ? element.attendance.dateCheckIn : element.createdAt
        })
      } else {
        check[0].count += 1;
      }
    }

    let result = {
      checkOuts: filteredCheckOut,
      nonCheckOuts: nonFilteredCheckOut
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
