/* eslint-disable no-unused-vars */
class Service {
  constructor(options) {
    this.options = options || {};
  }

  async find(params) {
    const serviceCategoryService = this.app.service('organisation-services');
    const newCategory = {};
    newCategory.facilityId = params.query.facilityId;
    const categories = [];
    categories = [{
        services: [],
        canRemove: false,
        name: "Laboratory"
      },
      {
        services: [],
        canRemove: false,
        name: "Medical Records"
      },
      {
        services: [],
        canRemove: false,
        name: "Pharmacy"
      },
      {
        services: [],
        canRemove: false,
        name: "Imaging"
      },
      {
        services: [],
        canRemove: false,
        name: "Ward"
      },
      {
        services: [],
        canRemove: false,
        name: "Appointment"
      },
      {
        services: [],
        canRemove: false,
        name: "Procedures"
      }
    ]
    newCategory.categories = categories;
    const categoryResult = await serviceCategoryService.create(newCategory)
    return categoryResult;
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
