const assert = require('assert');
const app = require('../../src/app');

describe('\'daily-opd\' service', () => {
  it('registered the service', () => {
    const service = app.service('daily-opd');

    assert.ok(service, 'Registered the service');
  });
});
