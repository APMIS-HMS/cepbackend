const assert = require('assert');
const app = require('../../src/app');

describe('\'facility-initializer\' service', () => {
  it('registered the service', () => {
    const service = app.service('facility-initializer');

    assert.ok(service, 'Registered the service');
  });
});
