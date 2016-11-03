const log4js = require('../../dist/es6/log4js2');
require('./customAppender');

global.testLogger1 = 'test1';
global.testLogger2 = 'test2';
global.testAppenderLogger = 'customAppender';

log4js.configure({
    appenders: ['console', 'custom'],
    layout: '%c - %m',
    loggers: [{
        logLevel: log4js.LogLevel.INFO
    }, {
        tag: testLogger1,
        logLevel: log4js.LogLevel.ERROR
    }, {
        tag: testLogger2,
        logLevel: log4js.LogLevel.INFO,
        layout: '%c [%p] %m'
    }, {
        tag: testAppenderLogger,
        logLevel: log4js.LogLevel.TRACE
    }]
});