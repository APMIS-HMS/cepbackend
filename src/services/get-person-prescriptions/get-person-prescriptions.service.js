// Initializes the `get-person-prescriptions` service on path `/get-person-prescriptions`
const createService = require('./get-person-prescriptions.class.js');
const hooks = require('./get-person-prescriptions.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/get-person-prescriptions', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('get-person-prescriptions');

  service.hooks(hooks);
};
