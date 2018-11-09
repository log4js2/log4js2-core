import { LogLevel, RollingFileAppender } from '../..';
import { configure, getLogger } from '../../log4js';
import { IRollingFileAppenderConfig } from '../rolling.file.appender';

describe('RollingFileAppender', () => {

    test('test rolling file', async () => {

        configure({
            level: LogLevel.DEBUG,
            patternLayout: '[%p] %c - %m',
            appenders: ['Console', {
                name: 'RollingFile',
                appender: RollingFileAppender,
                config: {
                    maxSize: .1,
                    fileName: './logs/rollingfile.log',
                    filePattern: './logs/rollingfile.%i.log'
                } as IRollingFileAppenderConfig
            }],
            loggers: [{
                tag: 'main',
                appenders: ['RollingFile']
            }],
            virtualConsole: false
        });

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
