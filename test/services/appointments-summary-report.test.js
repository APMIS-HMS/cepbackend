const assert = require('assert');
const app = require('../../src/app');

describe('\'appointmentsSummaryReport\' service', () => {
  it('registered the service', () => {
    const service = app.service('appointments-summary-report');

    assert.ok(service, 'Registered the service');
  });
});
