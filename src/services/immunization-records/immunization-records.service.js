// Initializes the `immunization-records` service on path `/immunization-records`
const createService = require('feathers-mongoose');
const createModel = require('../../models/immunization-records.model');
const hooks = require('./immunization-records.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/immunization-records', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('immunization-records');

  service.hooks(hooks);
};
