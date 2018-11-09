// Initializes the `clinicAttendanceSummary` service on path `/clinic-attendance-summary`
const createService = require('./clinic-attendance-summary.class.js');
const hooks = require('./clinic-attendance-summary.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate,
    app:app
  };

  // Initialize our service with any options it requires
  app.use('/clinic-attendance-summary', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('clinic-attendance-summary');

  service.hooks(hooks);
};
