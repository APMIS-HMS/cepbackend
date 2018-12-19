const assert = require('assert');
const app = require('../../src/app');

describe('\'find-facilities\' service', () => {
  it('registered the service', () => {
    const service = app.service('find-facilities');

    assert.ok(service, 'Registered the service');
  });
});
