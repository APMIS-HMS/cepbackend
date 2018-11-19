// Initializes the `appointmentsSummaryReport` service on path `/appointments-summary-report`
const createService = require('./appointments-summary-report.class.js');
const hooks = require('./appointments-summary-report.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate,
    app:app
  };

  // Initialize our service with any options it requires
  app.use('/appointments-summary-report', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('appointments-summary-report');

  service.hooks(hooks);
};
