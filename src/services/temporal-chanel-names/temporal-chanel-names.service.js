// Initializes the `temporalChanelNames` service on path `/temporal-chanel-names`
const createService = require('feathers-mongoose');
const createModel = require('../../models/temporal-chanel-names.model');
const hooks = require('./temporal-chanel-names.hooks');

module.exports = function (app) {
    const Model = createModel(app);
    const paginate = app.get('paginate');

    const options = {
        Model,
        paginate
    };

    // Initialize our service with any options it requires
    app.use('/temporal-chanel-names', createService(options));

    // Get our initialized service so that we can register hooks
    const service = app.service('temporal-chanel-names');

    service.hooks(hooks);
};
