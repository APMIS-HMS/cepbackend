const assert = require('assert');
const app = require('../../src/app');

describe('\'crud-immunization-record\' service', () => {
  it('registered the service', () => {
    const service = app.service('crud-immunization-record');

    assert.ok(service, 'Registered the service');
  });
});
