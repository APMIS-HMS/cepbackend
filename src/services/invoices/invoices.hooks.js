const {
  authenticate
} = require('@feathersjs/authentication').hooks;

const {
  fastJoin,softDelete2
} = require('feathers-hooks-common');


const resolvers = {
  joins: {
    patientObject: () => async (item, context) => {
      try {
        if (item.patientId !== undefined) {
          const patient = await context.app.service('patients').get(item.patientId, {});
          item.patientObject = patient;
        }
      } catch (error) {
        item.patientObject = {};
      }
    }
  }
};

module.exports = {
  before: {
    all: [authenticate('jwt'),softDelete2()],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [softDelete2(),fastJoin(resolvers)],
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
