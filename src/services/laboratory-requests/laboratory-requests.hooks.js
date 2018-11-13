const {
  authenticate
} = require('@feathersjs/authentication').hooks;
const {
  fastJoin
} = require('feathers-hooks-common');
const resolvers = {
  joins: {

    patientDetails: () => async (request, context) => {
      try {
        const patient = await context.app.service('patients').get(request.patientId, {});
        request.personDetails = patient.personDetails;
      } catch (error) {
        console.log('error1: ', error);
      }

    },
    employeeDetails: () => async (request, context) => {
      try {
        console.log(request.createdBy);
        const employee = await context.app.service('employees').get(request.createdBy, {});
        request.employeeDetails = employee.personDetails;
      } catch (error) {}

    }
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
