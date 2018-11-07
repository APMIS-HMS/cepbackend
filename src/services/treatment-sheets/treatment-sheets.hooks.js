const {
  authenticate
} = require('@feathersjs/authentication').hooks;
const {
  fastJoin
} = require('feathers-hooks-common');

const fastJoinServerDate = {
  joins: {
    addServerDate: () => async (data, context) => {
      console.log('Hook 1');
      console.log(data.treatmentSheet);
      data.treatmentSheet.investigations.map(x => {
        if (x.tracks !== undefined) {
          x.tracks.map(y => {
            if (y.createdAt === undefined) {
              y.createdAt = new Date();
            }
          });
        }
      });
      console.log('Hook 1');
      data.treatmentSheet.medications.map(x => {
        if (x.tracks !== undefined) {
          x.tracks.map(y => {
            if (y.createdAt === undefined) {
              y.createdAt = new Date();
            }
          });
        }
      });
      console.log('Hook 1');
      data.treatmentSheet.procedures.map(x => {
        if (x.tracks !== undefined) {
          x.tracks.map(y => {
            if (y.createdAt === undefined) {
              y.createdAt = new Date();
            }
          });
        }
      });
      console.log('Hook 1');
      data.treatmentSheet.nursingCares.map(x => {
        if (x.tracks !== undefined) {
          x.tracks.map(y => {
            if (y.createdAt === undefined) {
              y.createdAt = new Date();
            }
          });
        }
      });
      console.log(data);
    }
  }
}

module.exports = {
  before: {
    all: [], //authenticate('jwt')],
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
