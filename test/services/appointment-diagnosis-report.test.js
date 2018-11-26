const assert = require('assert');
const app = require('../../src/app');

describe('\'appointmentDiagnosisReport\' service', () => {
  it('registered the service', () => {
    const service = app.service('appointment-diagnosis-report');

    assert.ok(service, 'Registered the service');
  });
});
