const { authenticate } = require('@feathersjs/authentication').hooks;
const {
  softDelete2
} = require('feathers-hooks-common');

module.exports = {
  before: {
    all: [authenticate('jwt'),softDelete2()],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [softDelete2()],
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
