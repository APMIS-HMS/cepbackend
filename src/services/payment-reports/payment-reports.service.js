// Initializes the `payment-reports` service on path `/payment-reports`
const createService = require('./payment-reports.class.js');
const hooks = require('./payment-reports.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/payment-reports', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('payment-reports');

  service.hooks(hooks);
};
