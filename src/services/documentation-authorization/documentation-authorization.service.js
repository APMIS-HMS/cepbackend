// Initializes the `documentation-authorization` service on path
// `/documentation-authorization`
const createService = require('./documentation-authorization.class.js');
const hooks = require('./documentation-authorization.hooks');

module.exports = function(app) {
    const paginate = app.get('paginate');

    const options = { name: 'documentation-authorization', paginate, app: app };

    // Initialize our service with any options it requires
    app.use('/documentation-authorization', createService(options));

    // Get our initialized service so that we can register hooks and filters
    const service = app.service('documentation-authorization');

    service.hooks(hooks);
};