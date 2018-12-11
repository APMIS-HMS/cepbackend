const assert = require('assert');
const app = require('../../src/app');

describe('\'patientDiagnosis\' service', () => {
  it('registered the service', () => {
    const service = app.service('patient-diagnosis');

    assert.ok(service, 'Registered the service');
  });
});
