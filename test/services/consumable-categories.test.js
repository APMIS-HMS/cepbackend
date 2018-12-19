const assert = require('assert');
const app = require('../../src/app');

describe('\'consumable-categories\' service', () => {
  it('registered the service', () => {
    const service = app.service('consumable-categories');

    assert.ok(service, 'Registered the service');
  });
});
