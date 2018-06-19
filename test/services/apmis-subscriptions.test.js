const assert = require('assert');
const app = require('../../src/app');

describe('\'apmis-subscriptions\' service', () => {
  it('registered the service', () => {
    const service = app.service('apmis-subscriptions');

    assert.ok(service, 'Registered the service');
  });
});
