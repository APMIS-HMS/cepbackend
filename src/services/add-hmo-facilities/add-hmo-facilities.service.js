// Initializes the `add-hmo-facilities` service on path `/add-hmo-facilities`
const createService = require('./add-hmo-facilities.class.js');
const hooks = require('./add-hmo-facilities.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/add-hmo-facilities', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('add-hmo-facilities');

  service.hooks(hooks);
};
