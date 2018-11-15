// Initializes the `appointmentReportSummary` service on path `/appointment-report-summary`
const createService = require('./appointment-report-summary.class.js');
const hooks = require('./appointment-report-summary.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/appointment-report-summary', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('appointment-report-summary');

  service.hooks(hooks);
};
