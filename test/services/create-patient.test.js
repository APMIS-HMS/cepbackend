const assert = require('assert');
const app = require('../../src/app');

describe('\'create-patient\' service', () => {
  it('registered the service', () => {
    const service = app.service('create-patient');

    assert.ok(service, 'Registered the service');
  });
});
