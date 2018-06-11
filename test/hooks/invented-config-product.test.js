const assert = require('assert');
const feathers = require('@feathersjs/feathers');
const inventedConfigProduct = require('../../src/hooks/invented-config-product');

describe('\'invented_config_product\' hook', () => {
  let app;

  beforeEach(() => {
    app = feathers();

    app.use('/dummy', {
      get(id) {
        return Promise.resolve({ id });
      }
    });

    app.service('dummy').hooks({
      before: inventedConfigProduct()
    });
  });

  it('runs the hook', () => {
    return app.service('dummy').get('test').then(result => {
      assert.deepEqual(result, { id: 'test' });
    });
  });
});
