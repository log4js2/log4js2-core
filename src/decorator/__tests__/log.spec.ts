import { configure } from '../../';
import { TestLoggerClass } from './setup.function';

describe('@Log', () => {

    beforeAll(() => {
        configure({
            layout: '%d [%p] %marker %c - %message',
            virtualConsole: false
        });
    });

    test('LogError', () => {

        const loggerClass = new TestLoggerClass();
        loggerClass.errorFunction('foobar');

    });

});
