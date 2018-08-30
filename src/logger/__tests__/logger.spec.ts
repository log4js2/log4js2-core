import {TEST_LOGGER_1, TEST_LOGGER_2} from "../../__mocks__/configuration";
import {logStack} from "../../__mocks__/custom.appender";
import {getLogger} from "../../log4js";

describe('Logger', () => {

    beforeEach(() => {
        logStack.info = [];
        logStack.error = [];
    });

    test('default logger', () => {

        const logMessage = 'Test log';
        const logger = getLogger();

        logger.info(logMessage);

        expect(logStack.info).toHaveLength(1);
        expect(logStack.info[0]).toEqual(`main - ${logMessage}`);

    });

    test('levels', () => {

        const logMessage = 'Test log';
        const logger = getLogger(TEST_LOGGER_1);

        // log at info level
        // nothing should be logged
        logger.info(logMessage);

        expect(logStack.info).toHaveLength(0);

        // log at error level
        // this should make it to the output
        logger.error(logMessage);

        expect(logStack.error).toHaveLength(1);
        expect(logStack.error[0]).toEqual(`${TEST_LOGGER_1} - ${logMessage}`);

    });

    test('layouts', () => {

        const logMessage = 'Test log';
        const logger = getLogger(TEST_LOGGER_2);

        // log at info level
        // nothing should be logged
        logger.info(logMessage);

        expect(logStack.info.length).toHaveLength(1);
        expect(logStack.info[0]).toEqual(`${TEST_LOGGER_2} [INFO] ${logMessage}`);

    });

});
