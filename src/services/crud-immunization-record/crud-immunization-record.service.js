// Initializes the `crud-immunization-record` service on path `/crud-immunization-record`
const createService = require('./crud-immunization-record.class.js');
const hooks = require('./crud-immunization-record.hooks');

module.exports = function(app) {

    const paginate = app.get('paginate');

    const options = {
        paginate,
        app: app
    };

    // Initialize our service with any options it requires
    app.use('/crud-immunization-record', createService(options));

    // Get our initialized service so that we can register hooks
    const service = app.service('crud-immunization-record');

    service.hooks(hooks);
};