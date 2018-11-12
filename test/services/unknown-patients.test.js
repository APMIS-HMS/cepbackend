const assert = require('assert');
const app = require('../../src/app');

describe('\'unknown-patients\' service', () => {
  it('registered the service', () => {
    const service = app.service('unknown-patients');

    assert.ok(service, 'Registered the service');
  });
});
