const assert = require('assert');
const app = require('../../src/app');

describe('\'patientRegReport\' service', () => {
  it('registered the service', () => {
    const service = app.service('patient-reg-report');

    assert.ok(service, 'Registered the service');
  });
});
