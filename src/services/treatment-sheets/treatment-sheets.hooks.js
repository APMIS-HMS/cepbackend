const {
  authenticate
} = require('@feathersjs/authentication').hooks;
const {
  fastJoin,softDelete
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

const fastJoinCreatedBy = {
  joins: {
    addCreatedByObject: () => async (data, context) => {
      const employee = await context.app.service('employees').get(data.createdBy, {});
      data.createdByName = employee.personDetails.firstName + ' ' + employee.personDetails.lastName;
    }
  }
}

module.exports = {
  before: {
    all: [authenticate('jwt'),softDelete()],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [fastJoin(fastJoinServerDate)],
    remove: []
  },

  after: {
    all: [],
    find: [fastJoin(fastJoinCreatedBy)],
    get: [fastJoin(fastJoinCreatedBy)],
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
