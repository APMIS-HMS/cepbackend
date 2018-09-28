// Initializes the `out-of-stock-count-details` service on path `/out-of-stock-count-details`
const createService = require('./out-of-stock-count-details.class.js');
const hooks = require('./out-of-stock-count-details.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/out-of-stock-count-details', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('out-of-stock-count-details');

  service.hooks(hooks);
};
