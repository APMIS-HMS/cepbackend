const assert = require('assert');
const app = require('../../src/app');

describe('\'prescriptionReport\' service', () => {
  it('registered the service', () => {
    const service = app.service('prescription-report');

    assert.ok(service, 'Registered the service');
  });
});
