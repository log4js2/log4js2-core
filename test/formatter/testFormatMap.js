const formatter = require('../../build/es6/formatter').Formatter;
const assert = require('assert');

describe('map', function () {

    const testMap = { 'a' : 1, 'foo' : 'bar' };

    let testMapOutput = function (tag) {
        assert.equal(formatter.format(tag, { properties : testMap }), '{{a,1},{foo,bar}}');
    };

    it('%K', function () {
        testMapOutput('%K');
    });

    it('%map', function () {
        testMapOutput('%map');
    });

    it('%MAP', function () {
        testMapOutput('%MAP');
    });

});