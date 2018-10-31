// Initializes the `health-covered-bill-histories` service on path `/health-covered-bill-histories`
const createService = require('./health-covered-bill-histories.class.js');
const hooks = require('./health-covered-bill-histories.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/health-covered-bill-histories', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('health-covered-bill-histories');

  service.hooks(hooks);
};
