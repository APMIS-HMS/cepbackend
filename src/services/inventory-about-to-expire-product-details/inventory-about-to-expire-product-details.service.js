// Initializes the `inventory-about-to-expire-product-details` service on path `/inventory-about-to-expire-product-details`
const createService = require('./inventory-about-to-expire-product-details.class.js');
const hooks = require('./inventory-about-to-expire-product-details.hooks');

module.exports = function(app) {

    const paginate = app.get('paginate');

    const options = {
        paginate,
        app: app
    };

    // Initialize our service with any options it requires
    app.use('/inventory-about-to-expire-product-details', createService(options));

    // Get our initialized service so that we can register hooks
    const service = app.service('inventory-about-to-expire-product-details');

    service.hooks(hooks);
};