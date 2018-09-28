const assert = require('assert');
const app = require('../../src/app');

describe('\'inventory-expired-product-details\' service', () => {
  it('registered the service', () => {
    const service = app.service('inventory-expired-product-details');

    assert.ok(service, 'Registered the service');
  });
});
