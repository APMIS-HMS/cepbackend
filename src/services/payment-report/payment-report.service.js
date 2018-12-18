// Initializes the `paymentReport` service on path `/payment-report`
const createService = require('./payment-report.class.js');
const hooks = require('./payment-report.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/payment-report', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('payment-report');

  service.hooks(hooks);
};
