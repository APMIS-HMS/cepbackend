// Initializes the `appointmentDiagnosisReport` service on path `/appointment-diagnosis-report`
const createService = require('./appointment-diagnosis-report.class.js');
const hooks = require('./appointment-diagnosis-report.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate,
    app:app
  };

  // Initialize our service with any options it requires
  app.use('/appointment-diagnosis-report', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('appointment-diagnosis-report');

  service.hooks(hooks);
};
