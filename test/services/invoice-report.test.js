const assert = require('assert');
const app = require('../../src/app');

describe('\'invoiceReport\' service', () => {
  it('registered the service', () => {
    const service = app.service('invoice-report');

    assert.ok(service, 'Registered the service');
  });
});
