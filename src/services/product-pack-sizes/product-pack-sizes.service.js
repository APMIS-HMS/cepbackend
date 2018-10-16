// Initializes the `product-pack-sizes` service on path `/product-pack-sizes`
const createService = require('feathers-mongoose');
const createModel = require('../../models/product-pack-sizes.model');
const hooks = require('./product-pack-sizes.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  let paginate = app.get('paginate');
  paginate.default = 20;

  const options = {
    name: 'product-pack-sizes',
    Model,
    paginate,
  };

  // Initialize our service with any options it requires
  app.use('/product-pack-sizes', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('product-pack-sizes');

  service.hooks(hooks);
};
