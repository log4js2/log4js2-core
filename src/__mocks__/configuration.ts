import { LogLevel } from '..';
import { configure } from '../log4js';
import { CustomAppender } from './custom.appender';

export const CUSTOM_LOGGER = 'custom';
export const TEST_LOGGER_1 = 'test1';
export const TEST_LOGGER_2 = 'test2';
export const MAP_LOGGER = 'mapLogger';
export const MARKER_LOGGER = 'markerLogger';
export const ERROR_LOGGER = 'errorLogger';

configure({
    appenders: [{
        appender: CustomAppender
    }],
    layout: '%c - %m',
    loggers: [{
        level: LogLevel.INFO
    }, {
        tag: TEST_LOGGER_1,
        level: LogLevel.ERROR
    }, {
        tag: TEST_LOGGER_2,
        level: LogLevel.INFO,
        layout: '%c [%p] %m'
    }, {
        tag: ERROR_LOGGER,
        level: LogLevel.ERROR,
        layout: '%ex'
    }, {
        tag: MAP_LOGGER,
        level: LogLevel.INFO,
        layout: '%K'
    }, {
        tag: MARKER_LOGGER,
        level: LogLevel.INFO,
        layout: '%marker'
    }, {
        tag: CUSTOM_LOGGER,
        level: LogLevel.TRACE
    }]
});
