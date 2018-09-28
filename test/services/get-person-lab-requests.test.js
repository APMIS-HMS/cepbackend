const assert = require('assert');
const app = require('../../src/app');

describe('\'get-person-lab-requests\' service', () => {
  it('registered the service', () => {
    const service = app.service('get-person-lab-requests');

    assert.ok(service, 'Registered the service');
  });
});
