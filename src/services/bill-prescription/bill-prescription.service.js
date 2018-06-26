// Initializes the `bill-prescription` service on path `/bill-prescription`
const createService = require('./bill-prescription.class.js');
const hooks = require('./bill-prescription.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'bill-prescription',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/bill-prescription', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('bill-prescription');

  service.hooks(hooks);
};
