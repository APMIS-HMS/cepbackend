// Initializes the `employee-accessibilities-query` service on path `/employee-accessibilities-query`
const createService = require('./employee-accessibilities-query.class.js');
const hooks = require('./employee-accessibilities-query.hooks');

module.exports = function (app) {

  const paginate = app.get('paginate');

  const options = {
    paginate,
    app: app
  };

  // Initialize our service with any options it requires
  app.use('/employee-accessibilities-query', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('employee-accessibilities-query');

  service.hooks(hooks);
};
