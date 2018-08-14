const assert = require('assert');
const app = require('../../src/app');

describe('\'nhis-reports\' service', () => {
  it('registered the service', () => {
    const service = app.service('nhis-reports');

    assert.ok(service, 'Registered the service');
  });
});
