// Initializes the `unknown-patients` service on path `/unknown-patients`
const createService = require('./unknown-patients.class.js');
const hooks = require('./unknown-patients.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/unknown-patients', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('unknown-patients');

  service.hooks(hooks);
};
