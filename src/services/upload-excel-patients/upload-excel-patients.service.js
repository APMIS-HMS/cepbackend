// Initializes the `upload-excel-patients` service on path `/upload-excel-patients`
const createService = require('./upload-excel-patients.class.js');
const hooks = require('./upload-excel-patients.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/upload-excel-patients', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('upload-excel-patients');

  service.hooks(hooks);
};
