// Initializes the `walkin-dispense-prescription` service on path `/walkin-dispense-prescription`
const createService = require('./walkin-dispense-prescription.class.js');
const hooks = require('./walkin-dispense-prescription.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/walkin-dispense-prescription', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('walkin-dispense-prescription');

  service.hooks(hooks);
};
