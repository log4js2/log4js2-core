import { LogLevel, RollingFileAppender } from '../..';
import { configure, getLogger } from '../../log4js';
import { IRollingFileAppenderConfig } from '../rolling.file.appender';

describe('RollingFileAppender', () => {

    beforeAll(() => {

        configure({
            level: LogLevel.DEBUG,
            patternLayout: '[%p] %c - %m',
            appenders: [{
                appender: RollingFileAppender,
                config: {
                    maxSize: .1,
                    fileName: './logs/rollingfile.log',
                    filePattern: './logs/rollingfile.%i.log'
                } as IRollingFileAppenderConfig
            }],
            virtualConsole: false
        });

    });

    test('test rolling file', async () => {

        jest.setTimeout(60000);

        function sleep(ms: number) {
            return new Promise((resolve) => {
                setTimeout(resolve, ms);
            });
        }

        const logger = getLogger();

        for (let i = 0; i < 5000; i++) {
            await sleep(1).then(() =>
                logger.error('Log line {}', i));
        }

    });

});
