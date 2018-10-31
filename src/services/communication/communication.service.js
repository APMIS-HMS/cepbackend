// Initializes the `communication` service on path `/communication`
const createService = require('./communication.class.js');
const hooks = require('./communication.hooks');

module.exports = function (app) {
  
    const paginate = app.get('paginate');

    const options = {
        paginate,
        app:app
    };

    // Initialize our service with any options it requires
    app.use('/communication', createService(options));

    // Get our initialized service so that we can register hooks
    const service = app.service('communication');

    service.hooks(hooks);
};
