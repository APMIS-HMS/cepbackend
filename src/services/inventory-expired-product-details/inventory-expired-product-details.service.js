// Initializes the `inventory-expired-product-details` service on path `/inventory-expired-product-details`
const createService = require('./inventory-expired-product-details.class.js');
const hooks = require('./inventory-expired-product-details.hooks');

module.exports = function(app) {

    const paginate = app.get('paginate');

    const options = {
        paginate,
        app: app
    };

    // Initialize our service with any options it requires
    app.use('/inventory-expired-product-details', createService(options));

    // Get our initialized service so that we can register hooks
    const service = app.service('inventory-expired-product-details');

    service.hooks(hooks);
};