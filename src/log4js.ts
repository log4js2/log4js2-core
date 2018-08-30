import {addAppender, getAppender, getAppenders} from "./appender";
import LogAppender from "./appender/log.appender";
import IAppenderConfiguration from "./config/appender.config";
import IConfiguration from "./config/configuration";
import ILoggerConfiguration from "./config/logger.config";
import {LogLevel} from "./const/log.level";
import {LogEvent} from "./log.event";
import Logger from "./logger/logger";
import {getFunctionName, isArray} from "./util/utility";
import {getVirtualConsole} from "./util/virtual.console";

/**
 * The name of the main logger. We use this in case no logger is specified
 * @const
 */
const _MAIN_LOGGER = 'main';

/**
 * The default appenders that should be included if no appenders are specified
 * @const
 */
const _DEFAULT_APPENDERS = ((): IAppenderConfiguration[] => {
    return [{
        appender: 'Console',
        level: LogLevel.ERROR
    }];
})();

/**
 * The default configuration for log4js2. If no configuration is specified, then this
 * configuration will be injected
 * @const
 */
const _DEFAULT_CONFIG = ((): IConfiguration => ({
    appenders: _DEFAULT_APPENDERS,
    loggers: [{
        level: LogLevel.INFO
    }],
    patternLayout: '%d [%p] %c - %m'
}))();

/** @type {?IConfiguration} */
let _configuration: IConfiguration = null;
/** @type {Object} */
const _loggers: { [key: string]: LogAppender[] } = {};

/** @type {boolean} */
let _finalized = false;

/**
 * Configures the logger
 *
 * @function
 * @params {IConfiguration} config
 */
export function configure(config: IConfiguration) {

    if (_finalized) {
        console.error('Could not configure - already in use');
        return;
    }

    if (!_configuration) {
        _configuration = {};
    }

    // set the default layout
    if (!config.patternLayout && !_configuration.patternLayout) {
        _configuration.patternLayout = _DEFAULT_CONFIG.patternLayout;
    } else if (config.patternLayout) {
        _configuration.patternLayout = config.patternLayout;
    }

    // configure the appenders
    _configureAppenders(config.appenders);
    // configure the loggers
    _configureLoggers(config.loggers);

    getVirtualConsole(getLogger());

}

/**
 * Configures appenders
 *
 * @private
 * @function
 *
 * @param {Array.<LogAppender|function>} appenders
 */
const _configureAppenders = <T extends LogAppender>(appenders: Array<(Newable<T> | IAppenderConfiguration<T> | string)>) => {

    if (!isArray(appenders)) {
        appenders = _DEFAULT_APPENDERS;
    }

    appenders.forEach((value) => {
        if (typeof value === 'string') {
            if (getAppender(value as string)) {

            }
        } else if ((value as IAppenderConfiguration<T>).appender) {
            if (typeof (value as IAppenderConfiguration<T>).appender === 'string') {
                if (getAppender((value as IAppenderConfiguration<T>).appender as string)) {

                }
            } else {
                addAppender((value as IAppenderConfiguration<T>).appender as Newable<T>);
            }
        } else if ((value as Newable<T>).prototype.append) {
            addAppender(value as Newable<T>);
        } else {
            // TODO: throw an error
        }
    });

};

/**
 * Configures the loggers
 *
 * @private
 * @function
 *
 * @param {Array.<Object>} loggers
 */
const _configureLoggers = (loggers: ILoggerConfiguration[]) => {

    if (!isArray(loggers)) {
        throw new Error('Invalid loggers');
    }

    loggers.forEach((logger) => {

        if (!logger.patternLayout || typeof logger.patternLayout !== 'string') {
            logger.patternLayout = _configuration.patternLayout;
        }

        logger.patternLayout = logger.patternLayout || _MAIN_LOGGER;
        logger.level = logger.level || LogLevel.ERROR;

        _loggers[logger.tag] = _getAppendersForLogger(logger);

    });

};

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

    const appenderList: LogAppender[] = [];

    getAppenders().forEach((value) => {

        const logger: LogAppender = new value();

        logger.setLogLevel(logConfig.level);
        logger.setLayout(logConfig.patternLayout as string);

        appenderList.push(logger);

    });

    return appenderList;

};

/**
 * Appends the log event
 *
 * @private
 * @function
 *
 * @param {Object} logEvent
 */
function _append(logEvent: LogEvent) {

    // finalize the configuration to make sure no other appender can be injected (if set)
    _finalized = true;

    // cycle through each appender for the logger and append the logging event
    (_loggers[logEvent.logger] || _loggers[_MAIN_LOGGER]).forEach((logger) => {
        if (logger.isActive()) {
            logger.append(logEvent);
        }
    });

}

/**
 * Handles creating the logger and returning it
 *
 * @function
 *
 * @param {function|string=} context
 *
 * @return {Logger}
 */
export function getLogger<T>(context?: Newable<T> | Method<T> | string): Logger {

    // we need to initialize if we haven't already
    if (!_configuration) {
        configure(_DEFAULT_CONFIG);
    }

    // determine the context
    if (typeof context !== 'string') {

        if (typeof context === 'function') {
            context = getFunctionName(context as Method<T>);
        } else if (typeof context === 'object') {

            context = getFunctionName((context as any).constructor);

            if (context === 'Object') {
                context = 'anonymous';
            }

        } else {
            context = _MAIN_LOGGER;
        }

    }

    return new Logger(context, {
        append(event: LogEvent) {
            _append(event);
        }
    } as LogAppender);

}

/**
 * Sets the log level for all appenders of a logger, or specified logger
 *
 * @function
 *
 * @param {number} logLevel
 * @param {string=} logger
 */
export function setLogLevel(logLevel: LogLevel, logger?: string) {

    if (Number.isInteger(logLevel)) {

        if (logger) {
            if (_loggers[logger]) {
                _loggers[logger].forEach((appender) => appender.setLogLevel(logLevel));
            }
        } else {
            for (const key in _loggers) {
                if (_loggers.hasOwnProperty(key)) {
                    _loggers[key].forEach((appender) => appender.setLogLevel(logLevel));
                }
            }
        }

    }

}
