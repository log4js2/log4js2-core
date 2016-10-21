/**
 * log4js <https://github.com/anigenero/log4js>
 *
 * Copyright 2016 Robin Schultz <http://anigenero.com>
 * Released under the MIT License
 */

/**
 * Holds the definition for the appender closure
 *
 * @typedef {{ append : function (number, LOG_EVENT), isActive : function(),
 *          setLogLevel : function(number), setLayout : function(string) }}
 */
let APPENDER;

/**
 * @typedef {{ allowAppenderInjection : boolean, appenders : Array.<APPENDER>,
 * 			application : Object, loggers : Array.<LogAppender>, layout : string }}
 */
let CONFIG_PARAMS;

import * as formatter from './formatter';
import * as utility from './utility';
import {LogAppender} from './appender/appender';
import {Logger} from './logger/logger';
import {LogLevel} from './const/logLevel';
import {ConsoleAppender} from './appender/consoleAppender';

/** @const */
const _MAIN_LOGGER = 'main';
/** @const */
const _DEFAULT_CONFIG = {
    'allowAppenderInjection' : true,
    'appenders' : [{
        'appender' : ConsoleAppender,
        'level' : LogLevel.INFO
	}],
    'loggers' : [{
        'appender' : 'console',
        'level' : LogLevel.INFO
    }],
    'layout' : '%d{yyyy-MM-dd HH:mm:ss.SSS} [%level] %logger - %message'
};
const APPENDER_METHODS = ['append', 'getName', 'isActive', 'setLogLevel', 'setLayout'];

/** @type {Object} */
let _appenders = {};
/** @type {?CONFIG_PARAMS} */
let _configuration = null;
/** @type {boolean} */
let _finalized = false;
/** @type {Object} */
let _loggers = {};

/**
 * Configures the logger
 *
 * @function
 *
 * @params {CONFIG_PARAMS} config
 */
export function configure(config) {

	if (_finalized) {
		console.error('Could not configure. LogUtility already in use');
		return;
	}

	if (!_configuration) {
        _configuration = {};
    }

    if (!config.layout && !_configuration.layout) {
        _configuration.layout = _DEFAULT_CONFIG.layout;
    } else if (config.layout) {
        _configuration.layout = config.layout;
    }

	// configure the appenders
	_configureAppenders(config.appenders);
    // configure the loggers
    _configureLoggers(config.loggers);

    if (config.layout) {

        formatter.preCompile(config.layout);

        for (let logKey in _loggers) {

            if (_loggers.hasOwnProperty(logKey)) {
                for (let key in _loggers[logKey]) {
                    if (_loggers[logKey].hasOwnProperty(key)) {
                        _loggers[logKey][key].setLayout(config.layout);
                    }
                }
            }

        }

    }

    _configuration = config;

}

/**
 * @private
 * @function
 *
 * @param appenders
 */
let _configureAppenders = function (appenders) {

    if (appenders instanceof Array) {

        let count = appenders.length;
        for (let i = 0; i < count; i++) {

            if (typeof appenders[i] === 'function') {
                addAppender(appenders[i]);
            }

            // TODO: fix
            // else if (typeof appenders[i] === 'string') {
            //     // do something?
            // } else if (typeof appenders[i] === 'object') {
            //
            // }

        }

    } else {
        console.error('Invalid appender configuration');
    }

};

/**
 * @private
 * @function
 *
 * @param {Array.<Object>} loggers
 */
let _configureLoggers = function (loggers) {

	if (!(loggers instanceof Array)) {
		throw new Error('Invalid loggers');
	}

    loggers.forEach(function (logger) {

        if (!logger.layout || typeof logger.layout !== 'string') {
            logger.layout = _configuration.layout;
        }

        logger.tag = logger.tag || _MAIN_LOGGER;
        logger.logLevel = logger.logLevel || LogLevel.ERROR;

        _loggers[logger.tag] = _getLoggers(logger.logLevel, logger.layout);

    });

};

/**
 * Gets the loggers that match the given pattern and log level
 *
 * @private
 * @function
 *
 * @param {number} logLevel
 * @param {string} layout
 *
 * @returns {Array}
 */
let _getLoggers = function (logLevel, layout) {

    let logger;
    let appenderList = [];

    Object.keys(_appenders).forEach(function (key) {

        logger = (_appenders[key].prototype instanceof LogAppender) ? new _appenders[key]() : _appenders[key]();

        logger.setLogLevel(logLevel);
        logger.setLayout(layout);

        appenderList.push(logger);

    });

	return appenderList;

};

/**
 * Adds an appender to the appender queue. If the stack is finalized, and
 * the allowAppenderInjection is set to false, then the event will not be
 * appended
 *
 * @function
 *
 * @params {LogAppender} appender
 */
export function addAppender(appender) {

	if (_finalized && !_configuration.allowAppenderInjection) {
		console.error('Cannot add appender when configuration finalized');
		return;
	}

    _validateAppender(appender);

    // only put the appender into the set if it doesn't exist already
    if (!_appenders[appender.name]) {
        _appenders[appender.name] = appender;
    }

}

/**
 * Validates that the appender
 *
 * @private
 * @function
 *
 * @params {APPENDER} appender
 * @throws {Error} if the appender is invalid
 */
let _validateAppender = function (appender) {

    // if we are running ES6, we can make sure it extends LogAppender
    // otherwise, it must be a function
    if (appender.prototype instanceof LogAppender) {
        return;
    } else if (!(appender instanceof Function)) {
		throw new Error('Invalid appender: not a function or class LogAppender');
	}

	// instantiate the appender function
	let appenderObj = appender();

    // ensure that the appender methods are present (and are functions)
    APPENDER_METHODS.forEach(function (element) {
        if (appenderObj[element] == undefined || !(appenderObj[element] instanceof Function)) {
            throw new Error(`Invalid appender: missing/invalid method: ${element}`);
        }
    });

};

/**
 * Appends the log event
 *
 * @function
 *
 * @param {Object} loggingEvent
 */
function _append(loggingEvent) {

	// finalize the configuration to make sure no other appender can be injected (if set)
	_finalized = true;

    (_loggers[loggingEvent.logger] || _loggers[_MAIN_LOGGER]).forEach(function (logger) {
        // TODO: logger active?
        // if (logger.isActive(loggingEvent.level)) {
            logger.append(loggingEvent);
        // }
    });

}

/**
 * Handles creating the logger and returning it
 * @param {function|string} context
 * @return {Logger}
 */
export function getLogger(context) {

	// we need to initialize if we haven't
	if (!_configuration) {
		configure(_DEFAULT_CONFIG);
	}

    // determine the context
    if (typeof context != 'string') {

        if (typeof context == 'function') {
            context = utility.getFunctionName(context);
        } else if (typeof context == 'object') {

            context = utility.getFunctionName(context.constructor);

            if (context == 'Object') {
                context = 'anonymous';
            }

        } else {
            context = 'anonymous';
        }

    }

	return new Logger(context, {
		'append' : _append
	});

}



/**
 * Sets the log level for all loggers, or specified logger
 * @param {number} logLevel
 * @param {string=} logger
 */
export function setLogLevel(logLevel, logger) {

    if (logLevel instanceof Number) {

        if (logger !== undefined) {
            if (_loggers[logger]) {
                _loggers[logger].setLogLevel(logLevel);
            }
        } else {

            for (let logKey in _loggers) {
                if (_loggers.hasOwnProperty(logKey)) {
                    for (let key in _loggers[logKey]) {
                        if (_loggers[logKey].hasOwnProperty(key)) {
                            _loggers[logKey][key].setLogLevel(logLevel);
                        }
                    }
                }
            }

        }

    }

}

addAppender(ConsoleAppender);

export { LogLevel };
export { LogAppender };
export { formatter };