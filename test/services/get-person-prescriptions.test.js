const assert = require('assert');
const app = require('../../src/app');

describe('\'get-person-prescriptions\' service', () => {
  it('registered the service', () => {
    const service = app.service('get-person-prescriptions');

    assert.ok(service, 'Registered the service');
  });
});
