const assert = require('assert');
const app = require('../../src/app');

describe('\'facility-plans\' service', () => {
  it('registered the service', () => {
    const service = app.service('facility-plans');

    assert.ok(service, 'Registered the service');
  });
});
