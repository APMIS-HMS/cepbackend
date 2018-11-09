// Initializes the `dashboard` service on path `/dashboard`
const createService = require('feathers-mongoose');
const createModel = require('../../models/dashboard.model');
const hooks = require('./dashboard.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/dashboard', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('dashboard');

  service.hooks(hooks);
};
