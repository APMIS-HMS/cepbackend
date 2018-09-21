// Initializes the `clinic-charts` service on path `/clinic-charts`
const createService = require('./clinic-charts.class.js');
const hooks = require('./clinic-charts.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/clinic-charts', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('clinic-charts');

  service.hooks(hooks);
};
