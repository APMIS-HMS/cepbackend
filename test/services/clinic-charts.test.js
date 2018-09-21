const assert = require('assert');
const app = require('../../src/app');

describe('\'clinic-charts\' service', () => {
  it('registered the service', () => {
    const service = app.service('clinic-charts');

    assert.ok(service, 'Registered the service');
  });
});
