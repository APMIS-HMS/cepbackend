const assert = require('assert');
const app = require('../../src/app');

describe('\'nhis-resports\' service', () => {
  it('registered the service', () => {
    const service = app.service('nhis-resports');

    assert.ok(service, 'Registered the service');
  });
});
