// Initializes the `patientRegReport` service on path `/patient-reg-report`
const createService = require('./patient-reg-report.class.js');
const hooks = require('./patient-reg-report.hooks');

module.exports = function (app) {
  
    const paginate = app.get('paginate');

    const options = {
        paginate,
        app:app
    };

    // Initialize our service with any options it requires
    app.use('/patient-reg-report', createService(options));

    // Get our initialized service so that we can register hooks
    const service = app.service('patient-reg-report');

    service.hooks(hooks);
};
