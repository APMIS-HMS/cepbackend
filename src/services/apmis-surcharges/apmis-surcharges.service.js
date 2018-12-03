// Initializes the `apmis-surcharges` service on path `/apmis-surcharges`
const createService = require('feathers-mongoose');
const createModel = require('../../models/apmis-surcharges.model');
const hooks = require('./apmis-surcharges.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/apmis-surcharges', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('apmis-surcharges');

  service.hooks(hooks);
};
