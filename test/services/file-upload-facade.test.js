const assert = require('assert');
const app = require('../../src/app');

describe('\'fileUploadFacade\' service', () => {
  it('registered the service', () => {
    const service = app.service('file-upload-facade');

    assert.ok(service, 'Registered the service');
  });
});
