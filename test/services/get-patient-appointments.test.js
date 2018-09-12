const assert = require('assert');
const app = require('../../src/app');

describe('\'get-patient-appointments\' service', () => {
  it('registered the service', () => {
    const service = app.service('get-patient-appointments');

    assert.ok(service, 'Registered the service');
  });
});
