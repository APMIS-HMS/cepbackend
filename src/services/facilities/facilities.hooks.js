const {
  authenticate
} = require('@feathersjs/authentication').hooks;
const {
  fastJoin
} = require('feathers-hooks-common');
const facilityToken = require('../../hooks/facility-token');

const alerts = require('../../hooks/alerts');


const resolvers = {
  joins: {
    facilityInitializer: () => async (facility, context) => {
      try {
        if (facility._id !== undefined) {
          const facilityObj = await context.app
            .service('facility-initializer')
            .find({
              query: {
                facilityId: facility._id
              }
            });
        }
      } catch (error) {}


    }
  }
};



module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [authenticate('jwt')],
    create: [facilityToken()],
    update: [authenticate('jwt')],
    patch: [authenticate('jwt')],
    remove: [authenticate('jwt')]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [alerts(), fastJoin(resolvers)],
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
