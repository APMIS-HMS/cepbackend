// Initializes the `inventory-summary-counts` service on path `/inventory-summary-counts`
const createService = require('./inventory-summary-counts.class.js');
const hooks = require('./inventory-summary-counts.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/inventory-summary-counts', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('inventory-summary-counts');

  service.hooks(hooks);
};
