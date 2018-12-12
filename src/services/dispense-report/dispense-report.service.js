// Initializes the `dispenseReport` service on path `/dispense-report`
const createService = require('./dispense-report.class.js');
const hooks = require('./dispense-report.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate,
    app:app
  };

  // Initialize our service with any options it requires
  app.use('/dispense-report', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('dispense-report');

  service.hooks(hooks);
};
