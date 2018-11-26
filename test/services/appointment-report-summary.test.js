const assert = require('assert');
const app = require('../../src/app');

describe('\'appointmentReportSummary\' service', () => {
  it('registered the service', () => {
    const service = app.service('appointment-report-summary');

    assert.ok(service, 'Registered the service');
  });
});
