const assert = require('assert');
const app = require('../../src/app');

describe('\'add-hmo-facilities\' service', () => {
  it('registered the service', () => {
    const service = app.service('add-hmo-facilities');

    assert.ok(service, 'Registered the service');
  });
});
