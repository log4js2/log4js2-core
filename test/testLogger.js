const log4js = require('../dist/es6/log4js2.js');

const assert = require('assert');
const expect = require('expect.js');

describe('Logger', function () {

    // create a log stack we can throw logs into
    let logStack = {
        info: [],
        error: []
    };

    // override console
    // we will use this to monitor logger output
    console.info = function (log) {
        logStack.info.push(log);
    };
    console.error = function (log) {
        logStack.error.push(log);
    };

    beforeEach(function () {
        logStack.info = [];
        logStack.error = [];
    });

    it('default logger', function () {

        const logMessage = 'Test log';
        const logger = log4js.getLogger();

        logger.info(logMessage);

        assert.equal(logStack.info.length, 1);
        assert.equal(logStack.info[0], `main - ${logMessage}`);

    });

    it('levels', function () {

        const logMessage = 'Test log';
        const logger = log4js.getLogger(testLogger1);

        // log at info level
        // nothing should be logged
        logger.info(logMessage);

        assert.equal(logStack.info.length, 0);

        // log at error level
        // this should make it to the output
        logger.error(logMessage);

        assert.equal(logStack.error.length, 1);
        assert.equal(logStack.error[0], `${testLogger1} - ${logMessage}`);

    });

    it('layouts', function () {

        const logMessage = 'Test log';
        const logger = log4js.getLogger(testLogger2);

        // log at info level
        // nothing should be logged
        logger.info(logMessage);

        assert.equal(logStack.info.length, 1);
        assert.equal(logStack.info[0], `${testLogger2} [INFO] ${logMessage}`);

    });

});