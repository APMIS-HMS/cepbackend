/* eslint-disable no-unused-vars */
const request = require('request');
const requestPromise = require('request-promise');
const jsend = require('jsend');

class Service {
  constructor(options) {
    this.options = options || {};
  }

  async find(params) {
    const method = params.query.method;
    const searchText = params.query.searchtext;
    const productId = params.query.productId;
    let url = '';

    if (method === 'drug-details') {
      url = process.env.EMDEX_BASEURL + '/products/' + productId;
    } else if (method === 'immunization') {
      // url = process.env.APMIS_FORMULARY + '/search-ingredients?search=' + searchText;
      url = process.env.NODE_ENV ? process.env.NODE_ENV : 'http://localhost:3030' + '/search-ingredients?search=' + searchText;

    } else {
      // url = process.env.APMIS_FORMULARY + '/prescriptions?search=' + searchText;
      url = process.env.NODE_ENV ? process.env.NODE_ENV : 'http://localhost:3030' + '/prescriptions?search=' + searchText;

      // url = process.env.EMDEX_BASEURL + '/list/?query=' + params.query.searchtext +
      //     '&po=' + params.query.po + '&brandonly=' + params.query.brandonly + '&genericonly=' + params.query.genericonly;
    }

    const options = {
      method: 'GET',
      uri: url,
      // headers: { authorisation: process.env.EMDEX_AUTHORISATION_KEY }
    };

    try {
      const makeRequest = await requestPromise(options);
      const parsed = JSON.parse(makeRequest);

      if (method === 'drug-details') {
        return jsend.success(parsed);
      } else if (method === 'immunization') {
        if (parsed.status === 'success') {
          return jsend.success(parsed.data);
        } else {
          return jsend.success([]);
        }
      } else {
        if (parsed.status === 'success') {
          return jsend.success(parsed.data.data);
        } else {
          return jsend.success([]);
        }
      }
    } catch (e) {
      let err = {
        error: e,
        url: url
      }
      return jsend.fail(e);
    }
  }

  setup(app) {
    this.app = app;
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
