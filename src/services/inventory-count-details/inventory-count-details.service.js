// Initializes the `inventory-count-details` service on path `/inventory-count-details`
const createService = require('./inventory-count-details.class.js');
const hooks = require('./inventory-count-details.hooks');

module.exports = function(app) {

    const paginate = app.get('paginate');

    const options = {
        paginate,
        app: app
    };

    // Initialize our service with any options it requires
    app.use('/inventory-count-details', createService(options));

    // Get our initialized service so that we can register hooks
    const service = app.service('inventory-count-details');

    service.hooks(hooks);
};