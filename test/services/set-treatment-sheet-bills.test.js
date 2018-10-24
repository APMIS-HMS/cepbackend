const assert = require('assert');
const app = require('../../src/app');

describe('\'set-treatment-sheet-bills\' service', () => {
  it('registered the service', () => {
    const service = app.service('set-treatment-sheet-bills');

    assert.ok(service, 'Registered the service');
  });
});
