// Initializes the `apmis-consumables` service on path `/src/services`
const createService = require('feathers-mongoose');
const createModel = require('../../models/apmis-consumables.model');
const hooks = require('./apmis-consumables.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('apmis-consumables', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('apmis-consumables');

  service.hooks(hooks);
};
