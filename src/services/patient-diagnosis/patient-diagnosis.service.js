// Initializes the `patientDiagnosis` service on path `/patient-diagnosis`
const createService = require('feathers-mongoose');
const createModel = require('../../models/patient-diagnosis.model');
const hooks = require('./patient-diagnosis.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/patient-diagnosis', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('patient-diagnosis');

  service.hooks(hooks);
};
