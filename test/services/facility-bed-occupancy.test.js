const assert = require('assert');
const app = require('../../src/app');

describe('\'facility-bed-occupancy\' service', () => {
  it('registered the service', () => {
    const service = app.service('facility-bed-occupancy');

    assert.ok(service, 'Registered the service');
  });
});
