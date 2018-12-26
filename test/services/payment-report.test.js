const assert = require('assert');
const app = require('../../src/app');

describe('\'paymentReport\' service', () => {
  it('registered the service', () => {
    const service = app.service('payment-report');

    assert.ok(service, 'Registered the service');
  });
});
