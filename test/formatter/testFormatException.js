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

        const formatted = formatter.format(tag, { error : testException });

        assert.ok(formatted.split('\n').length > 1);
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