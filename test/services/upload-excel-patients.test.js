const assert = require('assert');
const app = require('../../src/app');

describe('\'upload-excel-patients\' service', () => {
  it('registered the service', () => {
    const service = app.service('upload-excel-patients');

    assert.ok(service, 'Registered the service');
  });
});
