const formatter = require('../../build/es6/formatter').Formatter;
const assert = require('assert');

describe('relative', function () {

    let testRelative = function (tag) {
        assert.equal(formatter.format(tag, { relative : 100 }), '100');
    };

    it('%r', function () {

        const tag = '%r';
        testRelative(tag);

    });

    it('%relative', function () {

        const tag = '%relative';
        testRelative(tag);

    });

});