const assert = require('assert');
const app = require('../../src/app');

describe('\'drug-interactions\' service', () => {
  it('registered the service', () => {
    const service = app.service('drug-interactions');

    assert.ok(service, 'Registered the service');
  });
});
