const assert = require('assert');
const app = require('../../src/app');

describe('\'inventory-summary-counts\' service', () => {
  it('registered the service', () => {
    const service = app.service('inventory-summary-counts');

    assert.ok(service, 'Registered the service');
  });
});
