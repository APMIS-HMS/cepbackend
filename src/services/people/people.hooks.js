const { authenticate } = require('@feathersjs/authentication').hooks;
const peopleApmisId = require('../../hooks/people-apmis-id');
const alerts = require('../../hooks/alerts');
const { softDelete } = require('feathers-hooks-common');

module.exports = {
  before: {
    all: [authenticate('jwt'),softDelete()],
    find: [authenticate('jwt')],
    get: [authenticate('jwt')],
    create: [peopleApmisId()],
    update: [authenticate('jwt')],
    patch: [authenticate('jwt')],
    remove: [authenticate('jwt')]
  },

  after: {
    all: [],
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
