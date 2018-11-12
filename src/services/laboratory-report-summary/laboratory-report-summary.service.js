// Initializes the `laboratoryReportSummary` service on path `/laboratory-report-summary`
const createService = require('./laboratory-report-summary.class.js');
const hooks = require('./laboratory-report-summary.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/laboratory-report-summary', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('laboratory-report-summary');

  service.hooks(hooks);
};
