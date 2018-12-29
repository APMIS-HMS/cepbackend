// Initializes the `commonly-prescribed-drugs` service on path `/commonly-prescribed-drugs`
const createService = require('feathers-mongoose');
const createModel = require('../../models/commonly-prescribed-drugs.model');
const hooks = require('./commonly-prescribed-drugs.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/commonly-prescribed-drugs', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('commonly-prescribed-drugs');

  service.hooks(hooks);
};
