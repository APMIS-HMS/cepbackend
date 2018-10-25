// Initializes the `extract-facility-data` service on path `/extract-facility-data`
const createService = require('./extract-facility-data.class.js');
const hooks = require('./extract-facility-data.hooks');

module.exports = function (app) {

  const paginate = app.get('paginate');

  const options = {
    paginate,
    app: app
  };

  // Initialize our service with any options it requires
  app.use('/extract-facility-data', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('extract-facility-data');

  service.hooks(hooks);
};
