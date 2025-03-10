// Initializes the `clientTypes` service on path `/client-types`
const createService = require('feathers-mongoose');
const createModel = require('../../models/client-types.model');
const hooks = require('./client-types.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'client-types',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/client-types', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('client-types');

  service.hooks(hooks);
};
