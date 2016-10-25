const formatter = require('../../dist/es6/formatter');
const assert = require('assert');

describe('sequence', function () {

    let testSequence = function (tag) {
        assert.equal('1', formatter.format(tag, { sequence : 1 }));
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