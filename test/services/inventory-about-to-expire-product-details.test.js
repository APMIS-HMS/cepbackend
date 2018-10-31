const assert = require('assert');
const app = require('../../src/app');

describe('\'inventory-about-to-expire-product-details\' service', () => {
  it('registered the service', () => {
    const service = app.service('inventory-about-to-expire-product-details');

    assert.ok(service, 'Registered the service');
  });
});
