// Initializes the `get-person-lab-requests` service on path `/get-person-lab-requests`
const createService = require('./get-person-lab-requests.class.js');
const hooks = require('./get-person-lab-requests.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/get-person-lab-requests', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('get-person-lab-requests');

  service.hooks(hooks);
};
