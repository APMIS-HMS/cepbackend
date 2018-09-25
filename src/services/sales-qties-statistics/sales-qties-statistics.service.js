// Initializes the `sales-qties-statistics` service on path `/sales-qties-statistics`
const createService = require('./sales-qties-statistics.class.js');
const hooks = require('./sales-qties-statistics.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/sales-qties-statistics', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('sales-qties-statistics');

  service.hooks(hooks);
};
