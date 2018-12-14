// Initializes the `purchase-list` service on path `/purchase-list`
const createService = require('feathers-mongoose');
const createModel = require('../../models/purchase-list.model');
const hooks = require('./purchase-list.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/purchase-list', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('purchase-list');

  service.hooks(hooks);
};
