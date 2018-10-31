// Initializes the `daily-opd` service on path `/daily-opd`
const createService = require('feathers-mongoose');
const createModel = require('../../models/daily-opd.model');
const hooks = require('./daily-opd.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/daily-opd', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('daily-opd');

  service.hooks(hooks);
};
