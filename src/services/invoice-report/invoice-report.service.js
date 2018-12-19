// Initializes the `invoiceReport` service on path `/invoice-report`
const createService = require('./invoice-report.class.js');
const hooks = require('./invoice-report.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate,
    app:app
  };

  // Initialize our service with any options it requires
  app.use('/invoice-report', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('invoice-report');

  service.hooks(hooks);
};
