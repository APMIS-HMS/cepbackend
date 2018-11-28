const assert = require('assert');
const app = require('../../src/app');

describe('\'apmis-surcharges\' service', () => {
  it('registered the service', () => {
    const service = app.service('apmis-surcharges');

    assert.ok(service, 'Registered the service');
  });
});
