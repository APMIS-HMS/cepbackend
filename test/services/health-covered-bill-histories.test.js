const assert = require('assert');
const app = require('../../src/app');

describe('\'health-covered-bill-histories\' service', () => {
  it('registered the service', () => {
    const service = app.service('health-covered-bill-histories');

    assert.ok(service, 'Registered the service');
  });
});
