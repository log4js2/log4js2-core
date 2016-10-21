const log4js = require('../dist/es6/log4js2.js');

const assert = require('assert');
const expect = require('expect.js');

describe('Logger', function () {

    const logger = log4js.getLogger('testLogger');

    logger.error('This is a test');

});