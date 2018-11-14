// Initializes the `diagnosisReportSummary` service on path `/diagnosis-report-summary`
const createService = require('./diagnosis-report-summary.class.js');
const hooks = require('./diagnosis-report-summary.hooks');

module.exports = function (app) {
  
    const paginate = app.get('paginate');

    const options = {
        paginate,
        app:app
    };

    // Initialize our service with any options it requires
    app.use('/diagnosis-report-summary', createService(options));

    // Get our initialized service so that we can register hooks
    const service = app.service('diagnosis-report-summary');

    service.hooks(hooks);
};
