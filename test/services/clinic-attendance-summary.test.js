const assert = require('assert');
const app = require('../../src/app');

describe('\'clinicAttendanceSummary\' service', () => {
  it('registered the service', () => {
    const service = app.service('clinic-attendance-summary');

    assert.ok(service, 'Registered the service');
  });
});
