const { authenticate } = require('@feathersjs/authentication').hooks;
const peopleApmisId = require('../../hooks/people-apmis-id');
const alerts = require('../../hooks/alerts');
const { softDelete2 } = require('feathers-hooks-common');

module.exports = {
  before: {
    all: [authenticate('jwt'),softDelete2()],
    find: [authenticate('jwt')],
    get: [authenticate('jwt')],
    create: [peopleApmisId()],
    update: [authenticate('jwt')],
    patch: [authenticate('jwt')],
    remove: [authenticate('jwt')]
  },

  after: {
    all: [softDelete2()],
    find: [],
    get: [],
    create: [alerts()],
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
