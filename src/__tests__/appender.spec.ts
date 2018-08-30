import { LogLevel } from '..';
import { CUSTOM_LOGGER } from '../__mocks__/configuration';
import { logStack } from '../__mocks__/custom.appender';
import { configure, getLogger } from '../log4js';

configure({
    level: LogLevel.DEBUG,
    patternLayout: '%m'
});

describe('Logger', () => {

    beforeEach(() => {
        logStack.error = [];
        logStack.warn = [];
        logStack.info = [];
        logStack.debug = [];
        logStack.trace = [];
    });

    test('test', () => {

        const logMessage = 'Test log';
        const logger = getLogger(CUSTOM_LOGGER);

        logger.error(logMessage);

        expect(logStack.error).toHaveLength(1);
        expect(logStack.error[0]).toEqual(`${CUSTOM_LOGGER} - ${logMessage}`);

        logger.warn(logMessage);

        expect(logStack.warn).toHaveLength(1);
        expect(logStack.warn[0]).toEqual(`${CUSTOM_LOGGER} - ${logMessage}`);

        logger.info(logMessage);

        expect(logStack.info).toHaveLength(1);
        expect(logStack.info[0]).toEqual(`${CUSTOM_LOGGER} - ${logMessage}`);

        logger.debug(logMessage);

        expect(logStack.debug).toHaveLength(1);
        expect(logStack.debug[0]).toEqual(`${CUSTOM_LOGGER} - ${logMessage}`);

        logger.trace(logMessage);

        expect(logStack.trace).toHaveLength(1);
        expect(logStack.trace[0]).toEqual(`${CUSTOM_LOGGER} - ${logMessage}`);

    });

});
