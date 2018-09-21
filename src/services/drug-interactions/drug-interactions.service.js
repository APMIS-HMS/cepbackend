// Initializes the `drug-interactions` service on path `/drug-interactions`
const createService = require('./drug-interactions.class.js');
const hooks = require('./drug-interactions.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate,
    app:app
  };

  // Initialize our service with any options it requires
  app.use('/drug-interactions', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('drug-interactions');

  service.hooks(hooks);
};
