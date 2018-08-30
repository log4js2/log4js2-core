import {getLogger} from "../log4js";

describe('Message', () => {

    // create a log stack we can throw logs into
    const logStack: { [key: string]: string[] } = {
        info: [],
        error: []
    };

    // override console
    // we will use this to monitor logger output
    console.info = (log: string) => {
        logStack.info.push(log);
    };
    console.error = (log: string) => {
        logStack.error.push(log);
    };

    beforeEach(() => {
        logStack.info = [];
        logStack.error = [];
    });

    test('single', () => {

        const logMessage = '{}';
        const logger = getLogger();

        const param1 = 'Foo';

        logger.info(logMessage, param1);

        expect(logStack.info.length).toHaveLength(1);
        expect(logStack.info[0]).toEqual(`main - ${param1}`);

    });

    test('multiple', () => {

        const logMessage = '{} {} {}';
        const logger = getLogger();

        const param1 = 'lorem';
        const param2 = 'ipsum';
        const param3 = 'dolor';

        logger.info(logMessage, param1, param2, param3);

        expect(logStack.info.length).toHaveLength(1);
        expect(logStack.info[0]).toEqual(`main - ${param1} ${param2} ${param3}`);

    });

});
