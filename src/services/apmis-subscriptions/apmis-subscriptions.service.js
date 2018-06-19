// Initializes the `apmis-subscriptions` service on path `/apmis-subscriptions`
const createService = require('./apmis-subscriptions.class.js');
const hooks = require('./apmis-subscriptions.hooks');

module.exports = function (app) {

  const paginate = app.get('paginate');

  const options = {
    name: 'apmis-subscriptions',
    paginate,
    app: app
  };

  // Initialize our service with any options it requires
  app.use('/apmis-subscriptions', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('apmis-subscriptions');

  service.hooks(hooks);
};
