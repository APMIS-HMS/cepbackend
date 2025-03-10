// Initializes the `vitalRythms` service on path `/vital-rythms`
const createService = require('feathers-mongoose');
const createModel = require('../../models/vital-rythms.model');
const hooks = require('./vital-rythms.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'vital-rythms',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/vital-rythms', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('vital-rythms');

  service.hooks(hooks);
};
