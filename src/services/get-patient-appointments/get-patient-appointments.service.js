// Initializes the `get-patient-appointments` service on path `/get-patient-appointments`
const createService = require('./get-patient-appointments.class.js');
const hooks = require('./get-patient-appointments.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/get-patient-appointments', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('get-patient-appointments');

  service.hooks(hooks);
};
