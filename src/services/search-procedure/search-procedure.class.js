/* eslint-disable no-unused-vars */
'use strict';
const jsend = require('jsend');
class Service {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  async find(params) {
    const organisationService = this.app.service('organisation-services');
    const facilityPriceService = this.app.service('facility-prices');
    const accessToken = params.accessToken;
    const facilityId = params.query.facilityId;
    const searchString = params.query.text;

    if (accessToken !== undefined) {
      const hasFacility = params.user.facilitiesRole.filter(x => x.facilityId.toString() === facilityId);
      if (hasFacility.length > 0) {
        const organisation = await organisationService.find({
          query: {
            facilityId: facilityId,
            'categories.name': 'Procedures'
          }
        });
        if (organisation.data.length > 0) {
          let data = organisation.data[0];
          if (data.categories !== undefined) {
            let categories = data.categories.filter(x => x.name === 'Procedures');
            if (categories.length > 0) {
              if (categories[0].services !== undefined) {
                let services = categories[0].services;
                let returnData = services.filter(x => x.name.toLowerCase().includes(searchString.toLowerCase()));
                for (let index = 0; index < returnData.length; index++) {
                  const element = returnData[index];
                  console.log(facilityId,
                    data._id,
                    categories[0]._id,
                    element._id);
                  const facilityPrice = await facilityPriceService.find({
                    query: {
                      facilityId: facilityId,
                      facilityServiceId: data._id,
                      categoryId: categories[0]._id,
                      serviceId: element._id
                    }
                  });
                  returnData[index].price = facilityPrice.data[0];
                }

                // serviceId: { type: Schema.Types.ObjectId, require: true },
                // facilityId:{ type: Schema.Types.ObjectId, require: true },
                // modifiers :  [modifierScheme],
                // price:{ type: Number, require: true }   facility-prices
                return jsend.success(returnData);
              } else {
                return jsend.success([]);
              }
            } else {
              return jsend.success([]);
            }
          } else {
            return jsend.success([]);
          }
        } else {
          return jsend.success([]);
        }
      } else {
        return jsend.error('You can not perform this transaction.');
      }
    } else {
      return jsend.error('You are not logged in to perform this transaction.');
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
