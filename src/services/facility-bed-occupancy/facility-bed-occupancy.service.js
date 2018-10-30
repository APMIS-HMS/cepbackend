// Initializes the `facility-bed-occupancy` service on path `/facility-bed-occupancy`
const createService = require('./facility-bed-occupancy.class.js');
const hooks = require('./facility-bed-occupancy.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/facility-bed-occupancy', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('facility-bed-occupancy');

  service.hooks(hooks);
};
