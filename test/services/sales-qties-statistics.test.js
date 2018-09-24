const assert = require('assert');
const app = require('../../src/app');

describe('\'sales-qties-statistics\' service', () => {
  it('registered the service', () => {
    const service = app.service('sales-qties-statistics');

    assert.ok(service, 'Registered the service');
  });
});
