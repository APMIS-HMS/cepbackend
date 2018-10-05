const assert = require('assert');
const app = require('../../src/app');

describe('\'inventory-count-details\' service', () => {
  it('registered the service', () => {
    const service = app.service('inventory-count-details');

    assert.ok(service, 'Registered the service');
  });
});
