// Initializes the `facility-product-list` service on path `/facility-product-list`
const createService = require('./facility-product-list.class.js');
const hooks = require('./facility-product-list.hooks');

module.exports = function (app) {

  const paginate = app.get('paginate');

  const options = {
    paginate,
    app: app
  };

  // Initialize our service with any options it requires
  app.use('/facility-product-list', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('facility-product-list');

  service.hooks(hooks);
};
