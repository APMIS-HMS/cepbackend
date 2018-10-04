// Initializes the `azure-blob` service on path `/azure-blob`
const createService = require('./azure-blob.class.js');
const hooks = require('./azure-blob.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/azure-blob', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('azure-blob');

  service.hooks(hooks);
};
