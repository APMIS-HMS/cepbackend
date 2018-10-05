const assert = require('assert');
const app = require('../../src/app');

describe('\'out-of-stock-count-details\' service', () => {
  it('registered the service', () => {
    const service = app.service('out-of-stock-count-details');

    assert.ok(service, 'Registered the service');
  });
});
