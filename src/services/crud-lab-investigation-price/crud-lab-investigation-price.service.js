// Initializes the `crud-lab-investigation-price` service on path `/crud-lab-investigation-price`
const createService = require('./crud-lab-investigation-price.class.js');
const hooks = require('./crud-lab-investigation-price.hooks');

module.exports = function(app) {

    const paginate = app.get('paginate');

    const options = {
        paginate,
        app: app
    };

    // Initialize our service with any options it requires
    app.use('/crud-lab-investigation-price', createService(options));

    // Get our initialized service so that we can register hooks
    const service = app.service('crud-lab-investigation-price');

    service.hooks(hooks);
};