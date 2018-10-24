// Initializes the `set-treatment-sheet-bills` service on path `/set-treatment-sheet-bills`
const createService = require('./set-treatment-sheet-bills.class.js');
const hooks = require('./set-treatment-sheet-bills.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/set-treatment-sheet-bills', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('set-treatment-sheet-bills');

  service.hooks(hooks);
};
