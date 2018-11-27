const assert = require('assert');
const app = require('../../src/app');

describe('\'payment-reports\' service', () => {
  it('registered the service', () => {
    const service = app.service('payment-reports');

    assert.ok(service, 'Registered the service');
  });
});
