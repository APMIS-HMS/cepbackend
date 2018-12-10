const assert = require('assert');
const app = require('../../src/app');

describe('\'purchase-list\' service', () => {
  it('registered the service', () => {
    const service = app.service('purchase-list');

    assert.ok(service, 'Registered the service');
  });
});
