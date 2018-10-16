// Initializes the `nhis-resports` service on path `/nhis-resports`
const createService = require('feathers-mongoose');
const createModel = require('../../models/nhis-resports.model');
const hooks = require('./nhis-resports.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'nhis-resports',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/nhis-resports', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('nhis-resports');

  service.hooks(hooks);
};
