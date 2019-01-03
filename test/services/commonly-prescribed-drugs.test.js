const assert = require('assert');
const app = require('../../src/app');

describe('\'commonly-prescribed-drugs\' service', () => {
  it('registered the service', () => {
    const service = app.service('commonly-prescribed-drugs');

    assert.ok(service, 'Registered the service');
  });
});
