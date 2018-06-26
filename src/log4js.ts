import LogAppender from "./appender/appender";
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

/** @type {Object} */
const _appenders: Map<string, Newable<LogAppender>> = new Map<string, Newable<LogAppender>>();
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
const _configureAppenders = (appenders: Array<(Newable<typeof LogAppender> | IAppenderConfiguration | string)>) => {

    if (!isArray(appenders)) {
        appenders = _DEFAULT_APPENDERS;
    }

    const count = appenders.length;
    for (let i = 0; i < count; i++) {
        addAppender((appenders[i] as IAppenderConfiguration).appender || (appenders[i] as any));
    }

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

    console.dir(_appenders);

    _appenders.forEach((value) => {

        const logger: LogAppender = new value();

        logger.setLogLevel(logConfig.level);
        logger.setLayout(logConfig.patternLayout as string);

        appenderList.push(logger);

    });

    return appenderList;

};

/**
 * Adds an appender to the appender queue
 *
 * @function
 *
 * @params {LogAppender} appender
 */
export const addAppender = <T extends LogAppender>(appender: Newable<T>, name?: string) => {

    _validateAppender(appender);

    const appenderName = name || (appender as any).appenderName || appender;

    // only put the appender into the set if it doesn't exist already
    if (!_appenders.has(appenderName)) {
        _appenders.set(appenderName, appender);
    }

};

/**
 * Validates that the appender
 *
 * @private
 * @function
 *
 * @params {APPENDER} appender
 * @throws {Error} if the appender is invalid
 */
const _validateAppender = <T extends LogAppender>(appender: Newable<T>) => {

    // if we are running ES6, we can make sure it extends LogAppender
    // otherwise, it must be a function
    if (!(appender instanceof LogAppender)) {
        return;
    }

    // instantiate the appender function
    const appenderObj: LogAppender = new (appender as any)();

    // ensure that the appender methods are present (and are functions)
    ['append', 'isActive', 'setLogLevel', 'setLayout'].forEach((element) => {
        if (!(appenderObj as any)[element] || !((appenderObj as any)[element] instanceof Function)) {
            throw new Error(`Invalid appender: missing/invalid method: ${element}`);
        }
    });

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
