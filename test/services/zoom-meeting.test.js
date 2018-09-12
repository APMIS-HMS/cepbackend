const assert = require('assert');
const app = require('../../src/app');

describe('\'zoom-meeting\' service', () => {
  it('registered the service', () => {
    const service = app.service('zoom-meeting');

    assert.ok(service, 'Registered the service');
  });
});
