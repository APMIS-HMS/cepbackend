// Initializes the `create-patient` service on path `/create-patient`
const createService = require('./create-patient.class.js');
const hooks = require('./create-patient.hooks');

module.exports = function (app) {

  const paginate = app.get('paginate');

  const options = {
    paginate,
    app: app
  };

  // Initialize our service with any options it requires
  app.use('/create-patient', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('create-patient');

  service.hooks(hooks);
};
