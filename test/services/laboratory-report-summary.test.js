const assert = require('assert');
const app = require('../../src/app');

describe('\'laboratoryReportSummary\' service', () => {
  it('registered the service', () => {
    const service = app.service('laboratory-report-summary');

    assert.ok(service, 'Registered the service');
  });
});
