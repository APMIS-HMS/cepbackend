// Initializes the `consumable-categories` service on path `/consumable-categories`
const createService = require('feathers-mongoose');
const createModel = require('../../models/consumable-categories.model');
const hooks = require('./consumable-categories.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/consumable-categories', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('consumable-categories');

  service.hooks(hooks);
};
