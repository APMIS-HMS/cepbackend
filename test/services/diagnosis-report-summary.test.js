const assert = require('assert');
const app = require('../../src/app');

describe('\'diagnosisReportSummary\' service', () => {
  it('registered the service', () => {
    const service = app.service('diagnosis-report-summary');

    assert.ok(service, 'Registered the service');
  });
});
