// Initializes the `find-facilities` service on path `/find-facilities`
const createService = require('./find-facilities.class.js');
const hooks = require('./find-facilities.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/find-facilities', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('find-facilities');

  service.hooks(hooks);
};
