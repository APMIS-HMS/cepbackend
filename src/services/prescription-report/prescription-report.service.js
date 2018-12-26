// Initializes the `prescriptionReport` service on path `/prescription-report`
const createService = require('./prescription-report.class.js');
const hooks = require('./prescription-report.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate,
    app:app
  };

  // Initialize our service with any options it requires
  app.use('/prescription-report', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('prescription-report');

  service.hooks(hooks);
};
