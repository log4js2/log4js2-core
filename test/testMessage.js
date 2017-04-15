const log4js = require('../dist/es6/log4js2.js');

const assert = require('assert');
const expect = require('expect.js');

describe('Message', function () {

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

    it('single', function () {

        const logMessage = '{}';
        const logger = log4js.getLogger();

        const param1 = 'Foo';

        logger.info(logMessage, param1);

        assert.equal(logStack.info.length, 1);
        assert.equal(logStack.info[0], `main - ${param1}`);

    });

    it('multiple', function () {

        const logMessage = '{} {} {}';
        const logger = log4js.getLogger();

        const param1 = 'lorem';
        const param2 = 'ipsum';
        const param3 = 'dolor';

        logger.info(logMessage, param1, param2, param3);

        assert.equal(logStack.info.length, 1);
        assert.equal(logStack.info[0], `main - ${param1} ${param2} ${param3}`);

    });

});