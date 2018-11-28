const assert = require('assert');
const app = require('../../src/app');

describe('\'facility-product-list\' service', () => {
  it('registered the service', () => {
    const service = app.service('facility-product-list');

    assert.ok(service, 'Registered the service');
  });
});
