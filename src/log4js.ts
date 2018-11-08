import { getAppender, getAppenderInstances, getAppenderName, registerAppender, setAppenderConfig } from './appender';
import { ConsoleAppender } from './appender/console.appender';
import { LogAppender } from './appender/log.appender';
import IAppenderConfiguration from './config/appender.config';
import IConfiguration from './config/configuration';
import ILoggerConfiguration from './config/logger.config';
import { LogLevel } from './const/log.level';
import { Method, Newable } from './def';
import { addLogger, getLogger as getLoggerFromContext, MAIN_LOGGER } from './logger';
import { Logger } from './logger/logger';
import { getFunctionName, isArray } from './util/utility';
import { getVirtualConsole, useVirtualConsole } from './util/virtual.console';

/**
 * The default appenders that should be included if no appenders are specified
 * @const
 */
const _DEFAULT_APPENDERS = (<T extends LogAppender<any>>(): Array<IAppenderConfiguration<T>> => {
    return [{
        appender: ConsoleAppender,
        level: LogLevel.ERROR
    }];
})();

const _DEFAULT_PATTERN_LAYOUT = '%d [%p] %c - %m';

/**
 * The default configuration for log4js2. If no configuration is specified, then this
 * configuration will be injected
 * @const
 */
const _DEFAULT_CONFIG = ((): IConfiguration => ({
    appenders: _DEFAULT_APPENDERS,
    loggers: [{
        level: LogLevel.ERROR
    }],
    patternLayout: '%d [%p] %c - %m'
}))();

/** @type {?IConfiguration} */
let _configuration: IConfiguration = null;

/**
 * Gets the appenders for the level and layout
 *
 * @private
 * @function
 *
 * @param {ILoggerConfiguration} logConfig
 *
 * @returns {Array}
 */
const _getAppendersForLogger = (logConfig: ILoggerConfiguration) => {

    const appenderList: Array<LogAppender<any>> = [];

    getAppenderInstances().forEach((appender) => {

        appender.setLogLevel(logConfig.level);
        appender.setLayout(logConfig.patternLayout);

        appenderList.push(appender);

    });

    return appenderList;

};

/**
 * Configures the loggers
 *
 * @private
 * @function
 *
 * @param {IConfiguration} config
 */
const _configureLoggers = (config: IConfiguration) => {

    let hasMain = false;
    if (isArray(config.loggers)) {
        config.loggers.forEach((logger) => {

            logger.tag = logger.tag || MAIN_LOGGER;

            hasMain = hasMain || logger.tag === MAIN_LOGGER;

            if (!logger.patternLayout || typeof logger.patternLayout !== 'string') {
                logger.patternLayout = config.patternLayout;
            }

            logger.patternLayout = logger.patternLayout || _DEFAULT_PATTERN_LAYOUT;
            logger.level = logger.level || config.level || LogLevel.ERROR;

            addLogger(logger.tag, new Logger(logger.tag, _getAppendersForLogger(logger)));

        });
    } else {
        config.loggers = [];
    }

    if (!hasMain) {

        const mainLoggerConfig: ILoggerConfiguration = {
            tag: MAIN_LOGGER,
            level: config.level || LogLevel.ERROR,
            patternLayout: config.patternLayout || _DEFAULT_PATTERN_LAYOUT,
        };

        config.loggers.push(mainLoggerConfig);

        addLogger(MAIN_LOGGER, new Logger(MAIN_LOGGER,
            _getAppendersForLogger(mainLoggerConfig)));

    }

};

/**
 * Configures appenders
 *
 * @private
 * @function
 *
 * @param {Array.<LogAppender|function>} appenders
 */
const _configureAppenders = (appenders: Array<(Newable<LogAppender<any>> | IAppenderConfiguration | string)>) => {

    if (!isArray(appenders)) {
        appenders = _DEFAULT_APPENDERS;
    }

    appenders.forEach((appenderConfig) => {

        let appender: Newable<LogAppender<any>>;

        if (typeof appenderConfig === 'string') {
            appender = getAppender(appenderConfig);
        } else {
            if ((appenderConfig as IAppenderConfiguration).appender) {
                if (typeof (appenderConfig as IAppenderConfiguration).appender === 'string') {
                    appender = getAppender((appenderConfig as IAppenderConfiguration).appender as string);
                } else {
                    appender = registerAppender((appenderConfig as IAppenderConfiguration).appender as Newable<LogAppender<any>>);
                }
            } else if ((appenderConfig as Newable<LogAppender<any>>).prototype.append) {
                appender = registerAppender(appenderConfig as Newable<LogAppender<any>>);
            } else {
                throw new Error('Invalid appender: \'' + appenderConfig + '\'');
            }

        }

        if ((appenderConfig as IAppenderConfiguration).config) {
            setAppenderConfig(getAppenderName(appender), (appenderConfig as IAppenderConfiguration).config);
        }

    });

};

/**
 * Configures the logger
 *
 * @function
 * @params {IConfiguration} config
 */
export function configure(config: IConfiguration) {

    // set the default layout
    if (!config.patternLayout) {
        config.patternLayout = _DEFAULT_PATTERN_LAYOUT;
    }

    // configure the appenders
    _configureAppenders(config.appenders);
    // configure the loggers
    _configureLoggers(config);

    if (config.virtualConsole !== false) {
        getVirtualConsole(getLoggerFromContext(MAIN_LOGGER, config));
    } else {
        useVirtualConsole(false);
    }

    _configuration = config;

}

export const getLogger = <T>(context?: Newable<T> | Method<T> | string): Logger => {

    if (!_configuration) {
        configure(_DEFAULT_CONFIG);
    }

    const logContext = _determineContext(context);
    const loggerConfig = _getLoggerConfiguration(logContext) || _getLoggerConfiguration(MAIN_LOGGER);

    return getLoggerFromContext(logContext, loggerConfig);

};

function _getLoggerConfiguration(context: string): ILoggerConfiguration {
    return _configuration.loggers.filter((value) => value.tag === context)[0];
}

function _determineContext<T>(context?: Newable<T> | Method<T> | string): string {

    // determine the context
    if (typeof context === 'string') {
        return context;
    }

    if (typeof context === 'function') {
        return getFunctionName(context as Method<T>);
    } else if (typeof context === 'object') {

        context = getFunctionName((context as any).constructor);

        if (context === 'Object') {
            return 'anonymous';
        } else {
            return context;
        }

    } else {
        return MAIN_LOGGER;
    }

}
