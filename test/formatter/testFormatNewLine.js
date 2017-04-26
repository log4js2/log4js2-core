const formatter = require('../../build/es6/formatter').Formatter;
const assert = require('assert');

describe('new line', function () {

    it('%n', function () {
        assert.equal(formatter.format('foo %n bar', {}), "foo \n bar");
    });

});