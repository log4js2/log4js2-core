const formatter = require('../../dist/es6/formatter');
const assert = require('assert');

describe('logger', function () {

    let testLoggerOutput = function (loggerTag) {
        assert.equal('testLogger', formatter.format(loggerTag, { logger : 'testLogger' }));
    };

    it('%c', function () {

        const tag = '%c';

        formatter.preCompile(tag);
        testLoggerOutput(tag);


    });

    it('%logger', function () {

        const tag = '%logger';

        formatter.preCompile(tag);
        testLoggerOutput(tag);

    });

});