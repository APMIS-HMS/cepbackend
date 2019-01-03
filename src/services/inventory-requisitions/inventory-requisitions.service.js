// Initializes the `inventory-requisitions` service on path `/inventory-requisitions`
const createService = require('./inventory-requisitions.class.js');
const hooks = require('./inventory-requisitions.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/inventory-requisitions', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('inventory-requisitions');

  service.hooks(hooks);
};
