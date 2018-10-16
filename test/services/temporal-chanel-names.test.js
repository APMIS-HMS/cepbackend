const assert = require('assert');
const app = require('../../src/app');

describe('\'temporalChanelNames\' service', () => {
  it('registered the service', () => {
    const service = app.service('temporal-chanel-names');

    assert.ok(service, 'Registered the service');
  });
});
