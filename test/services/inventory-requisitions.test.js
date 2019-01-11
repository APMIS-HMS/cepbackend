const assert = require('assert');
const app = require('../../src/app');

describe('\'inventory-requisitions\' service', () => {
  it('registered the service', () => {
    const service = app.service('inventory-requisitions');

    assert.ok(service, 'Registered the service');
  });
});
