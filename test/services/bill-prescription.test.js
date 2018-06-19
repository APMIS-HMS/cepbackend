const assert = require('assert');
const app = require('../../src/app');

describe('\'bill-prescription\' service', () => {
  it('registered the service', () => {
    const service = app.service('bill-prescription');

    assert.ok(service, 'Registered the service');
  });
});
