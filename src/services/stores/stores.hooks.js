const {
  authenticate
} = require('@feathersjs/authentication').hooks;
const {
  fastJoin
} = require('feathers-hooks-common');

const resolvers = {
  joins: {
    productTypeArrayObject: () => async (store, context) => {
      try {
        if (store.productTypeId !== undefined) {
          for (let index = 0; index < store.productTypeId.length; index++) {
            const element = store.productTypeId[index];
            const productTypeObject = await context.app.service('product-types').get(element.productTypeId, {
              query: {
                facilityId: store.facilityId
              }
            });
            element.name = productTypeObject.name;
          }
        }
      } catch (error) {
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
    all: [],
    find: [fastJoin(resolvers)],
    get: [fastJoin(resolvers)],
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
