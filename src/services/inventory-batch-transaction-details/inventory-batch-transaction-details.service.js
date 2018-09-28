// Initializes the `inventory-batch-transaction-details` service on path `/inventory-batch-transaction-details`
const createService = require('./inventory-batch-transaction-details.class.js');
const hooks = require('./inventory-batch-transaction-details.hooks');

module.exports = function(app) {

    const paginate = app.get('paginate');

    const options = {
        paginate,
        app: app
    };

    // Initialize our service with any options it requires
    app.use('/inventory-batch-transaction-details', createService(options));

    // Get our initialized service so that we can register hooks
    const service = app.service('inventory-batch-transaction-details');

    service.hooks(hooks);
};