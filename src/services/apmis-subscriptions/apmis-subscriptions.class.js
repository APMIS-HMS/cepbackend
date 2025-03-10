/* eslint-disable no-unused-vars */
const request = require('request-promise');
const jsend = require('jsend');
class Service {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  async find(params) {
    let facilitySubscriptionUrl = process.env.APMIS_ADMIN + '/subscribed-facilities?facilityId=' + params.query.facilityId;
    const options = {
      method: 'GET',
      uri: facilitySubscriptionUrl
    };
    try {
      if(process.env.PLATFORM_SUBSCRIPTION_STATUS === 'ON'){
        let subscriptions = await request(options);
        let parsed = JSON.parse(subscriptions);
        parsed.subscriptions_status = process.env.PLATFORM_SUBSCRIPTION_STATUS;
        if (parsed.status === 'success') {
          return jsend.success(parsed);
        } else {
          return jsend.fail({});
        }
      }else{
        return jsend.success({});
      }
    } catch (e) {
      return jsend.fail({});
    }
  }

  get(id, params) {
    return Promise.resolve({
      id,
      text: `A new message with ID: ${id}!`
    });
  }

  create(data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current)));
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
