const assert = require('assert');
const app = require('../../src/app');

describe('\'batch-transactions\' service', () => {
  it('registered the service', () => {
    const service = app.service('batch-transactions');

    assert.ok(service, 'Registered the service');
  });
});
