const {
  authenticate
} = require('@feathersjs/authentication').hooks;

const {
  fastJoin
} = require('feathers-hooks-common');

const resolvers = {
  joins: {
    subscriptionStatus: () => async (data, context) => {
      if (process.env.PLATFORM_SUBSCRIPTION_STATUS === 'ON') {
        data.subscriptions_status = true;
      } else if (process.env.PLATFORM_SUBSCRIPTION_STATUS === 'OFF') {
        data.subscriptions_status = false;
      }
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
