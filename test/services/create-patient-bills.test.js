const assert = require('assert');
const app = require('../../src/app');

describe('\'create-patient-bills\' service', () => {
  it('registered the service', () => {
    const service = app.service('create-patient-bills');

    assert.ok(service, 'Registered the service');
  });
});
