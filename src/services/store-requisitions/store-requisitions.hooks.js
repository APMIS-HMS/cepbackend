const { authenticate } = require('@feathersjs/authentication').hooks;
const requisitionId = require('../../hooks/requisition-id');

const {
  fastJoin
} = require('feathers-hooks-common');

const resolvers = {
  joins: {
    store: () => async (data, context) => {
      try {
        const getResidentStore = await context.app.service('stores').get(data.storeId);
        data.storeObject = getResidentStore;
      } catch (e) {
        // console.log(e);
      }
      try {
        const getDestinationStore = await context.app.service('stores').get(data.destinationStoreId);
        data.destinationStoreObject = getDestinationStore;
      } catch (e) {
        // console.log(e);
      }
    },
    employee: () => async (data, context) => {
      try {
        const getEmployee = await context.app.service('employees').get(data.employeeId);
        data.employeeObject = getEmployee;
      } catch (e) {
        // console.log(e);
      }
    }
  }
};

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [requisitionId()],
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
