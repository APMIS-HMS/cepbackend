const assert = require('assert');
const app = require('../../src/app');

describe('\'apmis-consumables\' service', () => {
  it('registered the service', () => {
    const service = app.service('src/services');

    assert.ok(service, 'Registered the service');
  });
});
