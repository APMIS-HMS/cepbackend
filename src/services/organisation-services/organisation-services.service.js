// Initializes the `organisationServices` service on path `/organisation-services`
const createService = require('feathers-mongoose');
const createModel = require('../../models/organisation-services.model');
const hooks = require('./organisation-services.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'organisation-services',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/organisation-services', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('organisation-services');

  service.hooks(hooks);
};
