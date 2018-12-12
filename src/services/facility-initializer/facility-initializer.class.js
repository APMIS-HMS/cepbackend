/* eslint-disable no-unused-vars */
class Service {
  constructor(options) {
    this.options = options || {};
  }

  async find(params) {
    const serviceCategoryService = this.app.service('organisation-services');
    const facilityService = this.app.service('facilities');

    let selectedFacility = await facilityService.get(params.query.facilityId, {});

    // begins category initializer
    let newCategory = {};
    newCategory.facilityId = params.query.facilityId;
    let categories = [];
    categories = [{
        services: [],
        canRemove: false,
        name: "Laboratory"
      },
      {
        services: [{
          name: 'New Registration',
          panels: []
        }],
        canRemove: false,
        name: "Medical Record"
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
        services: [{
          name: 'General Consultation',
          panels: []
        }],
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
    const categoryResult = await serviceCategoryService.create(newCategory);
    // end category initializer

    // begins department initializer
    selectedFacility.departments = [{
        name: 'Ward',
        isActive: true,
        units: [{
          name: 'General Ward',
          shortName: '',
          isActive: true,
          clinics: []
        }, {
          name: 'Private Ward',
          shortName: '',
          isActive: true,
          clinics: []
        }]
      },
      {
        name: 'Laboratory',
        isActive: true,
        units: [{
          name: 'Central Laboratory',
          shortName: '',
          isActive: true,
          clinics: []
        }]
      },
      {
        name: 'Pharmacy',
        isActive: true,
        units: [{
          name: 'Main Pharmacy',
          shortName: '',
          isActive: true,
          clinics: []
        }]
      },
      {
        name: 'Health Record',
        isActive: true,
        units: [{
          name: 'Front Desk',
          shortName: '',
          isActive: true,
          clinics: []
        }]
      }

      // end department initializer
    ];

    // beings minor location initializer
    selectedFacility.minorLocations = [{
      'name': 'Laboratory',
      'locationId': '59896b6bb3abed2f546bda58',
      'description': '',
      'isActive': true
    }, {
      'name': 'Pharmacy',
      'locationId': '59c92a994be1bb0ac48ea59c',
      'description': '',
      'isActive': true
    }, {
      'name': 'Clinics',
      'locationId': '58524d4df320eb3370a5a1dc',
      'description': '',
      'isActive': true
    }, {
      'name': 'Ward',
      'locationId': '58524d27f320eb3370a5a1da',
      'description': '',
      'isActive': true
    }, {
      'name': 'Health Record',
      'locationId': '59b148ec091a382610b80640',
      'description': '',
      'isActive': true
    }]
    // end minor location initialiser

    const updatedFacility = await facilityService.update(selectedFacility._id, selectedFacility);

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

  setup(app) {
    this.app = app;
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
