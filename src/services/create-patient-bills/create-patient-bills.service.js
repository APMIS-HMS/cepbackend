// Initializes the `create-patient-bills` service on path `/create-patient-bills`
const createService = require('./create-patient-bills.class.js');
const hooks = require('./create-patient-bills.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/create-patient-bills', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('create-patient-bills');

  service.hooks(hooks);
};
