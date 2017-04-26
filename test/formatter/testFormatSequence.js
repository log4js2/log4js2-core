const formatter = require('../../build/es6/formatter').Formatter;
const assert = require('assert');

describe('sequence', function () {

    let testSequence = function (tag) {
        assert.equal(formatter.format(tag, { sequence : 1 }), '1');
    };

    it('%sn', function () {

        const tag = '%sn';
        formatter.preCompile(tag);

        testSequence(tag);

    });

    it('%sequenceNumber', function () {

        const tag = '%sequenceNumber';
        formatter.preCompile(tag);

        testSequence(tag);

    });

});