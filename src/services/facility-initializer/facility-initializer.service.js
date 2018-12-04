// Initializes the `facility-initializer` service on path `/facility-initializer`
const createService = require('./facility-initializer.class.js');
const hooks = require('./facility-initializer.hooks');

module.exports = function (app) {

  const paginate = app.get('paginate');

  const options = {
    paginate,
    app: app
  };

  // Initialize our service with any options it requires
  app.use('/facility-initializer', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('facility-initializer');

  service.hooks(hooks);
};
