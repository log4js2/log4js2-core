require('./mock/log4js2TestConfiguration');
const log4js = require('../dist/es6/log4js2.js');

const assert = require('assert');
const expect = require('expect.js');

describe('Logger', function () {

    beforeEach(function () {
        logStack.error = [];
        logStack.warn = [];
        logStack.info = [];
        logStack.debug = [];
        logStack.trace = [];
    });

    it('test', function () {

        const logMessage = 'Test log';
        const logger = log4js.getLogger(testAppenderLogger);

        logger.error(logMessage);

        assert.equal(logStack.error.length, 1);
        assert.equal(logStack.error[0], `${testAppenderLogger} - ${logMessage}`);

        logger.warn(logMessage);

        assert.equal(logStack.warn.length, 1);
        assert.equal(logStack.warn[0], `${testAppenderLogger} - ${logMessage}`);

        logger.info(logMessage);

        assert.equal(logStack.info.length, 1);
        assert.equal(logStack.info[0], `${testAppenderLogger} - ${logMessage}`);

        logger.debug(logMessage);

        assert.equal(logStack.debug.length, 1);
        assert.equal(logStack.debug[0], `${testAppenderLogger} - ${logMessage}`);

        logger.trace(logMessage);

        assert.equal(logStack.trace.length, 1);
        assert.equal(logStack.trace[0], `${testAppenderLogger} - ${logMessage}`);

    });

});