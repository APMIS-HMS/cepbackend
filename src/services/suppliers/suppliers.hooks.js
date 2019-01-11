const {
  authenticate
} = require('@feathersjs/authentication').hooks;
const {
  fastJoin
} = require('feathers-hooks-common');
const resolvers = {
  joins: {
    facilityDetails: () => async (supplier, context) => {
      if (supplier.supplierId !== undefined) {
        const facility = await context.app.service('facilities').get(supplier.supplierId, {});
        supplier.supplier = {
          name: facility.name,
          '_id': facility._id,
          primaryContactPhoneNo: facility.primaryContactPhoneNo,
          email: facility.email,
          cacNo: facility.cacNo,
          street: facility.street,
          address: facility.address,
          contactPerson: facility.contactPerson
        };
      }
    },
    // employeeDetails: () => async (supplier, context) => {
    //   if (supplier.createdBy !== undefined) {
    //     const employee = await context.app.service('employees').get(supplier.createdBy, {});
    //     supplier.employeeDetails = employee.personDetails;
    //   }
    // }
  }
};


module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [fastJoin(resolvers)],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
