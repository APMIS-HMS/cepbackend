const assert = require('assert');
const app = require('../../src/app');

describe('\'employee-accessibilities-query\' service', () => {
  it('registered the service', () => {
    const service = app.service('employee-accessibilities-query');

    assert.ok(service, 'Registered the service');
  });
});
