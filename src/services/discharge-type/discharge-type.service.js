// Initializes the `dischargeType` service on path `/discharge-types`
const createService = require('feathers-mongoose');
const createModel = require('../../models/discharge-type.model');
const hooks = require('./discharge-type.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'discharge-type',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/discharge-types', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('discharge-types');

  service.hooks(hooks);
};
