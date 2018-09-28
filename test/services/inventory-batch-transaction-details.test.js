const assert = require('assert');
const app = require('../../src/app');

describe('\'inventory-batch-transaction-details\' service', () => {
  it('registered the service', () => {
    const service = app.service('inventory-batch-transaction-details');

    assert.ok(service, 'Registered the service');
  });
});
