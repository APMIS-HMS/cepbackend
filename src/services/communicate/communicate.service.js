// Initializes the `communicate` service on path `/communicate`
const createService = require('feathers-mongoose');
const createModel = require('../../models/communicate.model');
const hooks = require('./communicate.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/communicate', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('communicate');

  service.hooks(hooks);
};
