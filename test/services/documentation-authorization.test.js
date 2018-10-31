const assert = require('assert');
const app = require('../../src/app');

describe('\'documentation-authorization\' service', () => {
  it('registered the service', () => {
    const service = app.service('documentation-authorization');

    assert.ok(service, 'Registered the service');
  });
});
