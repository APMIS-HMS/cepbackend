// Initializes the `nhis-reports` service on path `/nhis-reports`
const createService = require('./nhis-reports.class.js');
const hooks = require('./nhis-reports.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/nhis-reports', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('nhis-reports');

  service.hooks(hooks);
};
