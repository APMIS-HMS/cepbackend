const assert = require('assert');
const app = require('../../src/app');

describe('\'dispenseReport\' service', () => {
  it('registered the service', () => {
    const service = app.service('dispense-report');

    assert.ok(service, 'Registered the service');
  });
});
