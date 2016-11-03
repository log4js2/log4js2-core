const formatter = require('../../dist/es6/formatter');
const assert = require('assert');

describe('new line', function () {

    it('%n', function () {
        assert.equal(formatter.format('foo %n bar', {}), "foo \n bar");
    });

});