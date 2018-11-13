// Initializes the `notification` service on path `/notification`
const createService = require('feathers-mongoose');
const createModel = require('../../models/notification.model');
const hooks = require('./notification.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/notification', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('notification');

  service.hooks(hooks);
};
