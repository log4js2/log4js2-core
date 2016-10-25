const formatter = require('../../dist/es6/formatter');
const assert = require('assert');

describe('relative', function () {

    let testRelative = function (tag) {
        assert.equal('100', formatter.format(tag, { relative : 100 }));
    };

    it('%r', function () {

        const tag = '%r';
        formatter.preCompile(tag);

        testRelative(tag);

    });

    it('%relative', function () {

        const tag = '%relative';
        formatter.preCompile(tag);

        testRelative(tag);

    });

});