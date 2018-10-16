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

  get(id, params) {
    return Promise.resolve({
      id,
      text: `A new message with ID: ${id}!`
    });
  }

  async create(data, params) {
    const facilitiesService = this.app.service('facilities');
    const hmosService = this.app.service('hmos');

    const hmoPolicyFormatUpdate = await facilitiesService.patch(data._id, {
      policyIDRegexFormat: data.policyIDRegexFormat
    });
    if (data.checkHmo) {
      data.loginHMOListObject.hmos.map(x => {
        if (x.hmo === data._id) {
          x.policyIDRegexFormat = hmoPolicyFormatUpdate.policyIDRegexFormat;
          
        }
      });
      const mHmos = JSON.parse(JSON.stringify(data.loginHMOListObject.hmos));
      await hmosService.patch(data.loginHMOListObject._id, {
        hmos: mHmos
      });
      return jsend.fail({
        message: 'The selected HMO is already in the list of HMOs'
      });
    } else {
      if (data._id === undefined) {
        return jsend.fail({
          message: 'Please select an HMO to continue!'
        });
      } else {
        const newHmo = {
          hmo: data._id,
          policyIDRegexFormat: hmoPolicyFormatUpdate.policyIDRegexFormat,
          enrolleeList: []
        }
        data.loginHMOListObject.hmos.push(newHmo);
        if (data._id !== undefined) {
          if (data.loginHMOListObject._id === undefined) {
            const hmo = await hmosService.create(data.loginHMOListObject);
            data.loginHMOListObject = hmo;
            return jsend.success({
              message: 'Selected HMO added to your HMO list successfully',
              value: data
            });
          } else {
            const hmo = await hmosService.update(data.loginHMOListObject._id, data.loginHMOListObject);
            data.loginHMOListObject = hmo;
            return jsend.success({
              message: 'Selected HMO added to your HMO list successfully',
              value: data
            });
          }
        }
      }
    }
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
