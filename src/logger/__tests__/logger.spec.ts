import { ERROR_LOGGER, MAP_LOGGER, MARKER_LOGGER, TEST_LOGGER_1, TEST_LOGGER_2 } from '../../__mocks__/configuration';
import { logStack } from '../../__mocks__/custom.appender';
import { getLogger } from '../../log4js';
import { Marker } from '../../marker';

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

        expect(logStack.info).toHaveLength(1);
        expect(logStack.info[0]).toEqual(`${TEST_LOGGER_2} [INFO] ${logMessage}`);

    });

    test('new logger', () => {

        const logMessage = 'Test log';
        const logger = getLogger('new logger');

        logger.fatal(logMessage);

        expect(logStack.fatal).toHaveLength(1);
        expect(logStack.fatal[0]).toEqual(`new logger - ${logMessage}`);

    });

    test('variables', () => {

        const logMessage = 'This is {}!';
        const logger = getLogger(TEST_LOGGER_2);

        logger.info(logMessage, 'Sparta');

        expect(logStack.info).toHaveLength(1);
        expect(logStack.info[0]).toEqual(`${TEST_LOGGER_2} [INFO] This is Sparta!`);

    });

    test('errors', () => {

        const logMessage = 'An error occurred';
        const logger = getLogger(ERROR_LOGGER);

        logger.error(logMessage, new Error('an error occurred'));

        expect(logStack.error).toHaveLength(1);

    });

    test('maps', () => {

        const logMessage = '';
        const logger = getLogger(MAP_LOGGER);

        logger.info(logMessage, {foo: 'bar'});

        expect(logStack.info).toHaveLength(1);
        expect(logStack.info[0]).toEqual('{{foo,bar}}');

    });

    test('marker', () => {

        const parent = Marker.getMarker('parent');
        const child = Marker.getMarker('child').setParents(parent);

        const logMessage = '';
        const logger = getLogger(MARKER_LOGGER);

        logger.info(parent, logMessage);
        logger.info(child, logMessage);
        logger.info(logMessage);

        expect(logStack.info).toHaveLength(3);
        expect(logStack.info[0]).toEqual('parent');
        expect(logStack.info[1]).toEqual('child[ parent ]');
        expect(logStack.info[2]).toEqual('');

    });

    test('logger names', () => {

        class TestClass {
            public static readonly logger = getLogger();
        }

        const logger1 = getLogger(function foo() {
            // do nothing
        });

        logger1.info('bar');
        TestClass.logger.info('bar');

        expect(logStack.info).toHaveLength(2);
        expect(logStack.info[0]).toEqual('foo - bar');
        expect(logStack.info[1]).toEqual('main - bar');

    });

});
