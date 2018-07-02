const assert = require('assert');
const app = require('../../src/app');

describe('\'walkin-dispense-prescription\' service', () => {
  it('registered the service', () => {
    const service = app.service('walkin-dispense-prescription');

    assert.ok(service, 'Registered the service');
  });
});
