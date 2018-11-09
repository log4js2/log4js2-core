import { LogLevel } from '../const/log.level';
import { configure, getLogger } from '../';
import { getVirtualConsole } from '../util/virtual.console';

describe('Message', () => {

    configure({
        level: LogLevel.INFO,
        patternLayout: '%c - %m'
    });

    // create a log stack we can throw logs into
    const _logStack: { [key: string]: string[] } = {
        info: [],
        error: []
    };

    // override console
    // we will use this to monitor logger output
    getVirtualConsole().info = (log: string) => {
        _logStack.info.push(log);
    };
    getVirtualConsole().error = (log: string) => {
        _logStack.error.push(log);
    };

    beforeEach(() => {
        _logStack.info = [];
        _logStack.error = [];
    });

    test('single', () => {

        const logMessage = '{}';
        const logger = getLogger();

        const param1 = 'Foo';

        logger.info(logMessage, param1);

        expect(_logStack.info).toHaveLength(1);
        expect(_logStack.info[0]).toEqual(`main - ${param1}`);

    });

    test('multiple', () => {

        const logMessage = '{} {} {}';
        const logger = getLogger();

        const param1 = 'lorem';
        const param2 = 'ipsum';
        const param3 = 'dolor';

        logger.info(logMessage, param1, param2, param3);

        expect(_logStack.info).toHaveLength(1);
        expect(_logStack.info[0]).toEqual(`main - ${param1} ${param2} ${param3}`);

    });

});
