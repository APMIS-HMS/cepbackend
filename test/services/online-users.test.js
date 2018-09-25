const assert = require('assert');
const app = require('../../src/app');

describe('\'onlineUsers\' service', () => {
  it('registered the service', () => {
    const service = app.service('online-users');

    assert.ok(service, 'Registered the service');
  });
});
