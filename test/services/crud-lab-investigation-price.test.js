const assert = require('assert');
const app = require('../../src/app');

describe('\'crud-lab-investigation-price\' service', () => {
  it('registered the service', () => {
    const service = app.service('crud-lab-investigation-price');

    assert.ok(service, 'Registered the service');
  });
});
