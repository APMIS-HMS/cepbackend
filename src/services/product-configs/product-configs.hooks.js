const {
  authenticate
} = require('@feathersjs/authentication').hooks;
const {
  fastJoin
} = require('feathers-hooks-common');



const resolvers = {
  joins: {
    isVented: () => async (data, context) => {
      try {
        const getProduct = await context.app.service('inventories').find({
          query: {
            productId: data.productId,
            facilityId:data.facilityId,
            storeId:context.mStoreId
          }
        });
        if (getProduct.data.length > 0) {
          data.isVented = true;
        } else {
          data.isVented = false;
        }
      } catch (e) {
        // console.log(e);
      }
    }
  }
};




const inventedConfigProduct = require('../../hooks/invented-config-product');




module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [inventedConfigProduct()],
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
