const {
  authenticate
} = require('@feathersjs/authentication').hooks;

const treatmentSheetItemPatch = require('../../hooks/treatment-sheet-item-patch');

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [treatmentSheetItemPatch()],
    get: [],
    create: [],
    update: [],
    patch: [treatmentSheetItemPatch()],
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
