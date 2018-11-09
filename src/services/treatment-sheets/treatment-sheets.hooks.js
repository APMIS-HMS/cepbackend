const {
  authenticate
} = require('@feathersjs/authentication').hooks;
const {
  fastJoin
} = require('feathers-hooks-common');

const fastJoinServerDate = {
  joins: {
    addServerDate: () => async (data, context) => {
      if (data.treatmentSheet !== undefined) {
        if (data.treatmentSheet.investigations !== undefined) {
          data.treatmentSheet.investigations.map(x => {
            if (x.tracks !== undefined) {
              x.tracks.map(y => {
                if (y.createdAt === undefined) {
                  y.createdAt = new Date();
                }
              });
            }
          });
        }
        if (data.treatmentSheet.medications !== undefined) {
          data.treatmentSheet.medications.map(x => {
            if (x.tracks !== undefined) {
              x.tracks.map(y => {
                if (y.createdAt === undefined) {
                  y.createdAt = new Date();
                }
              });
            }
          });
        }
        if (data.treatmentSheet.procedures !== undefined) {
          data.treatmentSheet.procedures.map(x => {
            if (x.tracks !== undefined) {
              x.tracks.map(y => {
                if (y.createdAt === undefined) {
                  y.createdAt = new Date();
                }
              });
            }
          });
        }
        if (data.treatmentSheet.nursingCares !== undefined) {
          data.treatmentSheet.nursingCares.map(x => {
            if (x.tracks !== undefined) {
              x.tracks.map(y => {
                if (y.createdAt === undefined) {
                  y.createdAt = new Date();
                }
              });
            }
          });
        }
        if (data.treatmentSheet.physicianOrders !== undefined) {
          data.treatmentSheet.physicianOrders.map(x => {
            if (x.tracks !== undefined) {
              x.tracks.map(y => {
                if (y.createdAt === undefined) {
                  y.createdAt = new Date();
                }
              });
            }
          });
        }
      }
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
