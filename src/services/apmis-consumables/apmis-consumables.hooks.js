const { authenticate } = require('@feathersjs/authentication').hooks;
const { fastJoin } = require('feathers-hooks-common');

const resolvers = {
  joins: {
    consumerCategoryDetails: () => async (consumable, context) => {
      try {
        const category = await context.app
        .service('consumable-categories')
        .get(consumable.CONSUMABLECATEGORYID, {});
        consumable.consumerCategoryDetails = category;
      } catch (error) {
        console.log(error);
      }
    }
  }
};

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [fastJoin(resolvers)],
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
