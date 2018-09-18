const assert = require('assert');
const app = require('../../src/app');

describe('\'communicate\' service', () => {
  it('registered the service', () => {
    const service = app.service('communicate');

    assert.ok(service, 'Registered the service');
  });
});
