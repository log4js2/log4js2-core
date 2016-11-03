const formatter = require('../../dist/es6/formatter');
const assert = require('assert');

describe('exception', function () {

    let testException;
    try {
        throw new Error();
    } catch (e) {
        testException = e;
    }

    let testExceptionOutput = function (tag) {

        let formatted = formatter.format(tag, { error : testException });

        assert.equal(formatted.split('\n').length, 11);
        assert.equal(formatted.split('\n')[0], 'Error');

    };

    it('%ex', function () {
        testExceptionOutput('%ex');
    });

    it('%exception', function () {
        testExceptionOutput('%exception');
    });

    it('%throwable', function () {
        testExceptionOutput('%throwable');
    });

});