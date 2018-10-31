// Initializes the `admin-dashboard-chart` service on path `/admin-dashboard-chart`
const createService = require('./admin-dashboard-chart.class.js');
const hooks = require('./admin-dashboard-chart.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate,
  };

  // Initialize our service with any options it requires
  app.use('/admin-dashboard-chart', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('admin-dashboard-chart');

  service.hooks(hooks);
};
