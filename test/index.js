const assert = require('assert');
const cli2compose = require('../src/index.js');

describe('cli2compose', function() {
  it('should throw if input is not an array or a string', function() {
    assert.throws(() => {
      cli2compose(1);
    });
    assert.throws(() => {
      cli2compose({});
    });
    assert.throws(() => {
      cli2compose(function() {});
    });
  });
});
