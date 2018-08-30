import { LogLevel } from '..';
import { configure } from '../log4js';
import { CustomAppender } from './custom.appender';

export const CUSTOM_LOGGER = 'custom';
export const TEST_LOGGER_1 = 'test1';
export const TEST_LOGGER_2 = 'test2';

configure({
    appenders: [{
        appender: CustomAppender
    }],
    patternLayout: '%c - %m',
    loggers: [{
        level: LogLevel.INFO
    }, {
        tag: TEST_LOGGER_1,
        level: LogLevel.ERROR
    }, {
        tag: TEST_LOGGER_2,
        level: LogLevel.INFO,
        patternLayout: '%c [%p] %m'
    }, {
        tag: CUSTOM_LOGGER,
        level: LogLevel.TRACE
    }]
});
