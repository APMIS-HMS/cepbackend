const { authenticate } = require('@feathersjs/authentication').hooks;
const {
  softDelete
} = require('feathers-hooks-common');

module.exports = {
  before: {
    all: [authenticate('jwt'),softDelete()],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
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
