const assert = require('assert');
const app = require('../../src/app');

describe('\'symptoms\' service', () => {
  it('registered the service', () => {
    const service = app.service('symptoms');

    assert.ok(service, 'Registered the service');
  });
});
