// Initializes the `zoom-meeting` service on path `/zoom-meeting`
const createService = require('./zoom-meeting.class.js');
const hooks = require('./zoom-meeting.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'zoom-meeting',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/zoom-meeting', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('zoom-meeting');

  service.hooks(hooks);
};
