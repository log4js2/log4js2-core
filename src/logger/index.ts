import { LogAppender } from '..';
import { getAppenderInstances } from '../appender';
import ILoggerConfiguration from '../config/logger.config';
import { Logger } from './logger';

/**
 * The name of the main logger. We use this in case no logger is specified
 * @const
 */
export const MAIN_LOGGER = 'main';

/**
 *
 */
const _loggers: Map<string, Logger> = new Map<string, Logger>();

export const addLogger = (tag: string, logger: Logger) => {
    _loggers.set(tag, logger);
};

/**
 * Handles creating the logger and returning it
 *
 * @function
 *
 * @param {function|string=} context
 * @param {ILoggerConfiguration} config
 * @return {Logger}
 */
export const getLogger = <T>(context: string, config: ILoggerConfiguration): Logger => {

    if (_loggers.has(context)) {
        return _loggers.get(context);
    } else {

        const appenders: Array<LogAppender<any>> = [];
        getAppenderInstances().forEach((appender) => {

            appender.setLogLevel(config.level);
            appender.setLayout(config.patternLayout);

            appenders.push(appender);

        });

        return new Logger(context, appenders);

    }

};
