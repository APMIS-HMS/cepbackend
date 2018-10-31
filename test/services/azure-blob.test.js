const assert = require('assert');
const app = require('../../src/app');

describe('\'azure-blob\' service', () => {
  it('registered the service', () => {
    const service = app.service('azure-blob');

    assert.ok(service, 'Registered the service');
  });
});
