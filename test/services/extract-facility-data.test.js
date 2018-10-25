const assert = require('assert');
const app = require('../../src/app');

describe('\'extract-facility-data\' service', () => {
  it('registered the service', () => {
    const service = app.service('extract-facility-data');

    assert.ok(service, 'Registered the service');
  });
});
