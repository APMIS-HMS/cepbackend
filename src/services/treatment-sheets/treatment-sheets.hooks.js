const {
  authenticate
} = require('@feathersjs/authentication').hooks;
const {
  fastJoin
} = require('feathers-hooks-common');

const fastJoinServerDate = {
  joins: {
    addServerDate: () => async (data, context) => {
      console.log(context.params.query);
      // console.log(data['treatmentSheet.investigations']);
      console.log(data['treatmentSheet.investigations']);
      if (context.params.query !== {}) {
        if (context.params.query.isInvestigation && context.params.query.index !== undefined) {
          data['treatmentSheet.investigations'][context.params.query.index].trackItem.createdAt = new Date();
          data['treatmentSheet.investigations'][context.params.query.index].tracks.push(data['treatmentSheet.investigations'][context.params.query.index].trackItem);
          delete data['treatmentSheet.investigations'][context.params.query.index].trackItem;
          context.params.query = {};
        }
      }

    }
  }
}

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [fastJoin(fastJoinServerDate)],
    remove: []
  },

  after: {
    all: [],
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
