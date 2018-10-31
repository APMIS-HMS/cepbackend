const assert = require('assert');
const app = require('../../src/app');

describe('\'admin-dashboard-chart\' service', () => {
  it('registered the service', () => {
    const service = app.service('admin-dashboard-chart');

    assert.ok(service, 'Registered the service');
  });
});
