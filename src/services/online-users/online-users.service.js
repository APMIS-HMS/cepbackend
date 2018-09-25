// Initializes the `onlineUsers` service on path `/online-users`
const createService = require('./online-users.class.js');
const hooks = require('./online-users.hooks');

module.exports = function (app) {
  
    const paginate = app.get('paginate');

    const options = {
        paginate,
        app:app
    };

    // Initialize our service with any options it requires
    app.use('/online-users', createService(options));

    // Get our initialized service so that we can register hooks
    const service = app.service('online-users');

    service.hooks(hooks);
};
