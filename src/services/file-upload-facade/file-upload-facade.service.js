// Initializes the `fileUploadFacade` service on path `/file-upload-facade`
const createService = require('./file-upload-facade.class.js');
const hooks = require('./file-upload-facade.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate,
    app:app
  };

  // Initialize our service with any options it requires
  app.use('/file-upload-facade', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('file-upload-facade');

  service.hooks(hooks);
};
