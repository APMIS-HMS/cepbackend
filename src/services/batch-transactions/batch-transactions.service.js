// Initializes the `batch-transactions` service on path `/batch-transactions`
const createService = require('feathers-mongoose');
const createModel = require('../../models/batch-transactions.model');
const hooks = require('./batch-transactions.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/batch-transactions', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('batch-transactions');

  service.hooks(hooks);
};
