/*istanbul ignore next*/'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.formatter = exports.LogAppender = exports.LogLevel = undefined;
exports.configure = configure;
/*istanbul ignore next*/exports.addAppender = addAppender;
/*istanbul ignore next*/exports.getLogger = getLogger;
/*istanbul ignore next*/exports.setLogLevel = setLogLevel;

var /*istanbul ignore next*/_formatter = require('./formatter');

/*istanbul ignore next*/
var formatter = _interopRequireWildcard(_formatter);

var /*istanbul ignore next*/_utility = require('./utility');

/*istanbul ignore next*/
var utility = _interopRequireWildcard(_utility);

var /*istanbul ignore next*/_appender = require('./appender/appender');

var /*istanbul ignore next*/_logger = require('./logger/logger');

var /*istanbul ignore next*/_logLevel = require('./const/logLevel');

var /*istanbul ignore next*/_consoleAppender = require('./appender/consoleAppender');

/*istanbul ignore next*/
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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

/** @const */
const _MAIN_LOGGER = 'main';
/** @const */
const _DEFAULT_CONFIG = {
    'allowAppenderInjection': true,
    'appenders': [{
        'appender': /*istanbul ignore next*/_consoleAppender.ConsoleAppender,
        'level': /*istanbul ignore next*/_logLevel.LogLevel.INFO
    }],
    'loggers': [{
        'appender': 'console',
        'level': /*istanbul ignore next*/_logLevel.LogLevel.INFO
    }],
    'layout': '%d{yyyy-MM-dd HH:mm:ss.SSS} [%level] %logger - %message'
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
function configure(config) {

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
        logger.logLevel = logger.logLevel || /*istanbul ignore next*/_logLevel.LogLevel.ERROR;

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

        logger = _appenders[key].prototype instanceof /*istanbul ignore next*/_appender.LogAppender ? new _appenders[key]() : _appenders[key]();

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
function addAppender(appender) {

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
    if (appender.prototype instanceof /*istanbul ignore next*/_appender.LogAppender) {
        return;
    } else if (!(appender instanceof Function)) {
        throw new Error('Invalid appender: not a function or class LogAppender');
    }

    // instantiate the appender function
    let appenderObj = appender();

    // ensure that the appender methods are present (and are functions)
    APPENDER_METHODS.forEach(function (element) {
        if (appenderObj[element] == undefined || !(appenderObj[element] instanceof Function)) {
            throw new Error(`Invalid appender: missing/invalid method: ${ element }`);
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
function getLogger(context) {

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

    return new /*istanbul ignore next*/_logger.Logger(context, {
        'append': _append
    });
}

/**
 * Sets the log level for all loggers, or specified logger
 * @param {number} logLevel
 * @param {string=} logger
 */
function setLogLevel(logLevel, logger) {

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

addAppender( /*istanbul ignore next*/_consoleAppender.ConsoleAppender);

/*istanbul ignore next*/exports.LogLevel = _logLevel.LogLevel;
/*istanbul ignore next*/exports.LogAppender = _appender.LogAppender;
/*istanbul ignore next*/exports.formatter = formatter;
//# sourceMappingURL=data:application/json;base64,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SjtLQUZKO0NBRkc7O0FBMEJQOztnQ0FFUztnQ0FDQTtnQ0FDQSIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBsb2c0anMgPGh0dHBzOi8vZ2l0aHViLmNvbS9hbmlnZW5lcm8vbG9nNGpzPlxyXG4gKlxyXG4gKiBDb3B5cmlnaHQgMjAxNiBSb2JpbiBTY2h1bHR6IDxodHRwOi8vYW5pZ2VuZXJvLmNvbT5cclxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEhvbGRzIHRoZSBkZWZpbml0aW9uIGZvciB0aGUgYXBwZW5kZXIgY2xvc3VyZVxyXG4gKlxyXG4gKiBAdHlwZWRlZiB7eyBhcHBlbmQgOiBmdW5jdGlvbiAobnVtYmVyLCBMT0dfRVZFTlQpLCBpc0FjdGl2ZSA6IGZ1bmN0aW9uKCksXHJcbiAqICAgICAgICAgIHNldExvZ0xldmVsIDogZnVuY3Rpb24obnVtYmVyKSwgc2V0TGF5b3V0IDogZnVuY3Rpb24oc3RyaW5nKSB9fVxyXG4gKi9cclxubGV0IEFQUEVOREVSO1xyXG5cclxuLyoqXHJcbiAqIEB0eXBlZGVmIHt7IGFsbG93QXBwZW5kZXJJbmplY3Rpb24gOiBib29sZWFuLCBhcHBlbmRlcnMgOiBBcnJheS48QVBQRU5ERVI+LFxyXG4gKiBcdFx0XHRhcHBsaWNhdGlvbiA6IE9iamVjdCwgbG9nZ2VycyA6IEFycmF5LjxMb2dBcHBlbmRlcj4sIGxheW91dCA6IHN0cmluZyB9fVxyXG4gKi9cclxubGV0IENPTkZJR19QQVJBTVM7XHJcblxyXG5pbXBvcnQgKiBhcyBmb3JtYXR0ZXIgZnJvbSAnLi9mb3JtYXR0ZXInO1xyXG5pbXBvcnQgKiBhcyB1dGlsaXR5IGZyb20gJy4vdXRpbGl0eSc7XHJcbmltcG9ydCB7TG9nQXBwZW5kZXJ9IGZyb20gJy4vYXBwZW5kZXIvYXBwZW5kZXInO1xyXG5pbXBvcnQge0xvZ2dlcn0gZnJvbSAnLi9sb2dnZXIvbG9nZ2VyJztcclxuaW1wb3J0IHtMb2dMZXZlbH0gZnJvbSAnLi9jb25zdC9sb2dMZXZlbCc7XHJcbmltcG9ydCB7Q29uc29sZUFwcGVuZGVyfSBmcm9tICcuL2FwcGVuZGVyL2NvbnNvbGVBcHBlbmRlcic7XHJcblxyXG4vKiogQGNvbnN0ICovXHJcbmNvbnN0IF9NQUlOX0xPR0dFUiA9ICdtYWluJztcclxuLyoqIEBjb25zdCAqL1xyXG5jb25zdCBfREVGQVVMVF9DT05GSUcgPSB7XHJcbiAgICAnYWxsb3dBcHBlbmRlckluamVjdGlvbicgOiB0cnVlLFxyXG4gICAgJ2FwcGVuZGVycycgOiBbe1xyXG4gICAgICAgICdhcHBlbmRlcicgOiBDb25zb2xlQXBwZW5kZXIsXHJcbiAgICAgICAgJ2xldmVsJyA6IExvZ0xldmVsLklORk9cclxuXHR9XSxcclxuICAgICdsb2dnZXJzJyA6IFt7XHJcbiAgICAgICAgJ2FwcGVuZGVyJyA6ICdjb25zb2xlJyxcclxuICAgICAgICAnbGV2ZWwnIDogTG9nTGV2ZWwuSU5GT1xyXG4gICAgfV0sXHJcbiAgICAnbGF5b3V0JyA6ICclZHt5eXl5LU1NLWRkIEhIOm1tOnNzLlNTU30gWyVsZXZlbF0gJWxvZ2dlciAtICVtZXNzYWdlJ1xyXG59O1xyXG5jb25zdCBBUFBFTkRFUl9NRVRIT0RTID0gWydhcHBlbmQnLCAnZ2V0TmFtZScsICdpc0FjdGl2ZScsICdzZXRMb2dMZXZlbCcsICdzZXRMYXlvdXQnXTtcclxuXHJcbi8qKiBAdHlwZSB7T2JqZWN0fSAqL1xyXG5sZXQgX2FwcGVuZGVycyA9IHt9O1xyXG4vKiogQHR5cGUgez9DT05GSUdfUEFSQU1TfSAqL1xyXG5sZXQgX2NvbmZpZ3VyYXRpb24gPSBudWxsO1xyXG4vKiogQHR5cGUge2Jvb2xlYW59ICovXHJcbmxldCBfZmluYWxpemVkID0gZmFsc2U7XHJcbi8qKiBAdHlwZSB7T2JqZWN0fSAqL1xyXG5sZXQgX2xvZ2dlcnMgPSB7fTtcclxuXHJcbi8qKlxyXG4gKiBDb25maWd1cmVzIHRoZSBsb2dnZXJcclxuICpcclxuICogQGZ1bmN0aW9uXHJcbiAqXHJcbiAqIEBwYXJhbXMge0NPTkZJR19QQVJBTVN9IGNvbmZpZ1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGNvbmZpZ3VyZShjb25maWcpIHtcclxuXHJcblx0aWYgKF9maW5hbGl6ZWQpIHtcclxuXHRcdGNvbnNvbGUuZXJyb3IoJ0NvdWxkIG5vdCBjb25maWd1cmUuIExvZ1V0aWxpdHkgYWxyZWFkeSBpbiB1c2UnKTtcclxuXHRcdHJldHVybjtcclxuXHR9XHJcblxyXG5cdGlmICghX2NvbmZpZ3VyYXRpb24pIHtcclxuICAgICAgICBfY29uZmlndXJhdGlvbiA9IHt9O1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghY29uZmlnLmxheW91dCAmJiAhX2NvbmZpZ3VyYXRpb24ubGF5b3V0KSB7XHJcbiAgICAgICAgX2NvbmZpZ3VyYXRpb24ubGF5b3V0ID0gX0RFRkFVTFRfQ09ORklHLmxheW91dDtcclxuICAgIH0gZWxzZSBpZiAoY29uZmlnLmxheW91dCkge1xyXG4gICAgICAgIF9jb25maWd1cmF0aW9uLmxheW91dCA9IGNvbmZpZy5sYXlvdXQ7XHJcbiAgICB9XHJcblxyXG5cdC8vIGNvbmZpZ3VyZSB0aGUgYXBwZW5kZXJzXHJcblx0X2NvbmZpZ3VyZUFwcGVuZGVycyhjb25maWcuYXBwZW5kZXJzKTtcclxuICAgIC8vIGNvbmZpZ3VyZSB0aGUgbG9nZ2Vyc1xyXG4gICAgX2NvbmZpZ3VyZUxvZ2dlcnMoY29uZmlnLmxvZ2dlcnMpO1xyXG5cclxuICAgIGlmIChjb25maWcubGF5b3V0KSB7XHJcblxyXG4gICAgICAgIGZvcm1hdHRlci5wcmVDb21waWxlKGNvbmZpZy5sYXlvdXQpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBsb2dLZXkgaW4gX2xvZ2dlcnMpIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChfbG9nZ2Vycy5oYXNPd25Qcm9wZXJ0eShsb2dLZXkpKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gX2xvZ2dlcnNbbG9nS2V5XSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChfbG9nZ2Vyc1tsb2dLZXldLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX2xvZ2dlcnNbbG9nS2V5XVtrZXldLnNldExheW91dChjb25maWcubGF5b3V0KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBfY29uZmlndXJhdGlvbiA9IGNvbmZpZztcclxuXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAZnVuY3Rpb25cclxuICpcclxuICogQHBhcmFtIGFwcGVuZGVyc1xyXG4gKi9cclxubGV0IF9jb25maWd1cmVBcHBlbmRlcnMgPSBmdW5jdGlvbiAoYXBwZW5kZXJzKSB7XHJcblxyXG4gICAgaWYgKGFwcGVuZGVycyBpbnN0YW5jZW9mIEFycmF5KSB7XHJcblxyXG4gICAgICAgIGxldCBjb3VudCA9IGFwcGVuZGVycy5sZW5ndGg7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGFwcGVuZGVyc1tpXSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgYWRkQXBwZW5kZXIoYXBwZW5kZXJzW2ldKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gVE9ETzogZml4XHJcbiAgICAgICAgICAgIC8vIGVsc2UgaWYgKHR5cGVvZiBhcHBlbmRlcnNbaV0gPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIC8vICAgICAvLyBkbyBzb21ldGhpbmc/XHJcbiAgICAgICAgICAgIC8vIH0gZWxzZSBpZiAodHlwZW9mIGFwcGVuZGVyc1tpXSA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCdJbnZhbGlkIGFwcGVuZGVyIGNvbmZpZ3VyYXRpb24nKTtcclxuICAgIH1cclxuXHJcbn07XHJcblxyXG4vKipcclxuICogQHByaXZhdGVcclxuICogQGZ1bmN0aW9uXHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXkuPE9iamVjdD59IGxvZ2dlcnNcclxuICovXHJcbmxldCBfY29uZmlndXJlTG9nZ2VycyA9IGZ1bmN0aW9uIChsb2dnZXJzKSB7XHJcblxyXG5cdGlmICghKGxvZ2dlcnMgaW5zdGFuY2VvZiBBcnJheSkpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcignSW52YWxpZCBsb2dnZXJzJyk7XHJcblx0fVxyXG5cclxuICAgIGxvZ2dlcnMuZm9yRWFjaChmdW5jdGlvbiAobG9nZ2VyKSB7XHJcblxyXG4gICAgICAgIGlmICghbG9nZ2VyLmxheW91dCB8fCB0eXBlb2YgbG9nZ2VyLmxheW91dCAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgbG9nZ2VyLmxheW91dCA9IF9jb25maWd1cmF0aW9uLmxheW91dDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxvZ2dlci50YWcgPSBsb2dnZXIudGFnIHx8IF9NQUlOX0xPR0dFUjtcclxuICAgICAgICBsb2dnZXIubG9nTGV2ZWwgPSBsb2dnZXIubG9nTGV2ZWwgfHwgTG9nTGV2ZWwuRVJST1I7XHJcblxyXG4gICAgICAgIF9sb2dnZXJzW2xvZ2dlci50YWddID0gX2dldExvZ2dlcnMobG9nZ2VyLmxvZ0xldmVsLCBsb2dnZXIubGF5b3V0KTtcclxuXHJcbiAgICB9KTtcclxuXHJcbn07XHJcblxyXG4vKipcclxuICogR2V0cyB0aGUgbG9nZ2VycyB0aGF0IG1hdGNoIHRoZSBnaXZlbiBwYXR0ZXJuIGFuZCBsb2cgbGV2ZWxcclxuICpcclxuICogQHByaXZhdGVcclxuICogQGZ1bmN0aW9uXHJcbiAqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBsb2dMZXZlbFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gbGF5b3V0XHJcbiAqXHJcbiAqIEByZXR1cm5zIHtBcnJheX1cclxuICovXHJcbmxldCBfZ2V0TG9nZ2VycyA9IGZ1bmN0aW9uIChsb2dMZXZlbCwgbGF5b3V0KSB7XHJcblxyXG4gICAgbGV0IGxvZ2dlcjtcclxuICAgIGxldCBhcHBlbmRlckxpc3QgPSBbXTtcclxuXHJcbiAgICBPYmplY3Qua2V5cyhfYXBwZW5kZXJzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcclxuXHJcbiAgICAgICAgbG9nZ2VyID0gKF9hcHBlbmRlcnNba2V5XS5wcm90b3R5cGUgaW5zdGFuY2VvZiBMb2dBcHBlbmRlcikgPyBuZXcgX2FwcGVuZGVyc1trZXldKCkgOiBfYXBwZW5kZXJzW2tleV0oKTtcclxuXHJcbiAgICAgICAgbG9nZ2VyLnNldExvZ0xldmVsKGxvZ0xldmVsKTtcclxuICAgICAgICBsb2dnZXIuc2V0TGF5b3V0KGxheW91dCk7XHJcblxyXG4gICAgICAgIGFwcGVuZGVyTGlzdC5wdXNoKGxvZ2dlcik7XHJcblxyXG4gICAgfSk7XHJcblxyXG5cdHJldHVybiBhcHBlbmRlckxpc3Q7XHJcblxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEFkZHMgYW4gYXBwZW5kZXIgdG8gdGhlIGFwcGVuZGVyIHF1ZXVlLiBJZiB0aGUgc3RhY2sgaXMgZmluYWxpemVkLCBhbmRcclxuICogdGhlIGFsbG93QXBwZW5kZXJJbmplY3Rpb24gaXMgc2V0IHRvIGZhbHNlLCB0aGVuIHRoZSBldmVudCB3aWxsIG5vdCBiZVxyXG4gKiBhcHBlbmRlZFxyXG4gKlxyXG4gKiBAZnVuY3Rpb25cclxuICpcclxuICogQHBhcmFtcyB7TG9nQXBwZW5kZXJ9IGFwcGVuZGVyXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gYWRkQXBwZW5kZXIoYXBwZW5kZXIpIHtcclxuXHJcblx0aWYgKF9maW5hbGl6ZWQgJiYgIV9jb25maWd1cmF0aW9uLmFsbG93QXBwZW5kZXJJbmplY3Rpb24pIHtcclxuXHRcdGNvbnNvbGUuZXJyb3IoJ0Nhbm5vdCBhZGQgYXBwZW5kZXIgd2hlbiBjb25maWd1cmF0aW9uIGZpbmFsaXplZCcpO1xyXG5cdFx0cmV0dXJuO1xyXG5cdH1cclxuXHJcbiAgICBfdmFsaWRhdGVBcHBlbmRlcihhcHBlbmRlcik7XHJcblxyXG4gICAgLy8gb25seSBwdXQgdGhlIGFwcGVuZGVyIGludG8gdGhlIHNldCBpZiBpdCBkb2Vzbid0IGV4aXN0IGFscmVhZHlcclxuICAgIGlmICghX2FwcGVuZGVyc1thcHBlbmRlci5uYW1lXSkge1xyXG4gICAgICAgIF9hcHBlbmRlcnNbYXBwZW5kZXIubmFtZV0gPSBhcHBlbmRlcjtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBWYWxpZGF0ZXMgdGhhdCB0aGUgYXBwZW5kZXJcclxuICpcclxuICogQHByaXZhdGVcclxuICogQGZ1bmN0aW9uXHJcbiAqXHJcbiAqIEBwYXJhbXMge0FQUEVOREVSfSBhcHBlbmRlclxyXG4gKiBAdGhyb3dzIHtFcnJvcn0gaWYgdGhlIGFwcGVuZGVyIGlzIGludmFsaWRcclxuICovXHJcbmxldCBfdmFsaWRhdGVBcHBlbmRlciA9IGZ1bmN0aW9uIChhcHBlbmRlcikge1xyXG5cclxuICAgIC8vIGlmIHdlIGFyZSBydW5uaW5nIEVTNiwgd2UgY2FuIG1ha2Ugc3VyZSBpdCBleHRlbmRzIExvZ0FwcGVuZGVyXHJcbiAgICAvLyBvdGhlcndpc2UsIGl0IG11c3QgYmUgYSBmdW5jdGlvblxyXG4gICAgaWYgKGFwcGVuZGVyLnByb3RvdHlwZSBpbnN0YW5jZW9mIExvZ0FwcGVuZGVyKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfSBlbHNlIGlmICghKGFwcGVuZGVyIGluc3RhbmNlb2YgRnVuY3Rpb24pKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgYXBwZW5kZXI6IG5vdCBhIGZ1bmN0aW9uIG9yIGNsYXNzIExvZ0FwcGVuZGVyJyk7XHJcblx0fVxyXG5cclxuXHQvLyBpbnN0YW50aWF0ZSB0aGUgYXBwZW5kZXIgZnVuY3Rpb25cclxuXHRsZXQgYXBwZW5kZXJPYmogPSBhcHBlbmRlcigpO1xyXG5cclxuICAgIC8vIGVuc3VyZSB0aGF0IHRoZSBhcHBlbmRlciBtZXRob2RzIGFyZSBwcmVzZW50IChhbmQgYXJlIGZ1bmN0aW9ucylcclxuICAgIEFQUEVOREVSX01FVEhPRFMuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgIGlmIChhcHBlbmRlck9ialtlbGVtZW50XSA9PSB1bmRlZmluZWQgfHwgIShhcHBlbmRlck9ialtlbGVtZW50XSBpbnN0YW5jZW9mIEZ1bmN0aW9uKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgYXBwZW5kZXI6IG1pc3NpbmcvaW52YWxpZCBtZXRob2Q6ICR7ZWxlbWVudH1gKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbn07XHJcblxyXG4vKipcclxuICogQXBwZW5kcyB0aGUgbG9nIGV2ZW50XHJcbiAqXHJcbiAqIEBmdW5jdGlvblxyXG4gKlxyXG4gKiBAcGFyYW0ge09iamVjdH0gbG9nZ2luZ0V2ZW50XHJcbiAqL1xyXG5mdW5jdGlvbiBfYXBwZW5kKGxvZ2dpbmdFdmVudCkge1xyXG5cclxuXHQvLyBmaW5hbGl6ZSB0aGUgY29uZmlndXJhdGlvbiB0byBtYWtlIHN1cmUgbm8gb3RoZXIgYXBwZW5kZXIgY2FuIGJlIGluamVjdGVkIChpZiBzZXQpXHJcblx0X2ZpbmFsaXplZCA9IHRydWU7XHJcblxyXG4gICAgKF9sb2dnZXJzW2xvZ2dpbmdFdmVudC5sb2dnZXJdIHx8IF9sb2dnZXJzW19NQUlOX0xPR0dFUl0pLmZvckVhY2goZnVuY3Rpb24gKGxvZ2dlcikge1xyXG4gICAgICAgIC8vIFRPRE86IGxvZ2dlciBhY3RpdmU/XHJcbiAgICAgICAgLy8gaWYgKGxvZ2dlci5pc0FjdGl2ZShsb2dnaW5nRXZlbnQubGV2ZWwpKSB7XHJcbiAgICAgICAgICAgIGxvZ2dlci5hcHBlbmQobG9nZ2luZ0V2ZW50KTtcclxuICAgICAgICAvLyB9XHJcbiAgICB9KTtcclxuXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBIYW5kbGVzIGNyZWF0aW5nIHRoZSBsb2dnZXIgYW5kIHJldHVybmluZyBpdFxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufHN0cmluZ30gY29udGV4dFxyXG4gKiBAcmV0dXJuIHtMb2dnZXJ9XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZ2V0TG9nZ2VyKGNvbnRleHQpIHtcclxuXHJcblx0Ly8gd2UgbmVlZCB0byBpbml0aWFsaXplIGlmIHdlIGhhdmVuJ3RcclxuXHRpZiAoIV9jb25maWd1cmF0aW9uKSB7XHJcblx0XHRjb25maWd1cmUoX0RFRkFVTFRfQ09ORklHKTtcclxuXHR9XHJcblxyXG4gICAgLy8gZGV0ZXJtaW5lIHRoZSBjb250ZXh0XHJcbiAgICBpZiAodHlwZW9mIGNvbnRleHQgIT0gJ3N0cmluZycpIHtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBjb250ZXh0ID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgY29udGV4dCA9IHV0aWxpdHkuZ2V0RnVuY3Rpb25OYW1lKGNvbnRleHQpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGNvbnRleHQgPT0gJ29iamVjdCcpIHtcclxuXHJcbiAgICAgICAgICAgIGNvbnRleHQgPSB1dGlsaXR5LmdldEZ1bmN0aW9uTmFtZShjb250ZXh0LmNvbnN0cnVjdG9yKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChjb250ZXh0ID09ICdPYmplY3QnKSB7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0ID0gJ2Fub255bW91cyc7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29udGV4dCA9ICdhbm9ueW1vdXMnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG5cdHJldHVybiBuZXcgTG9nZ2VyKGNvbnRleHQsIHtcclxuXHRcdCdhcHBlbmQnIDogX2FwcGVuZFxyXG5cdH0pO1xyXG5cclxufVxyXG5cclxuXHJcblxyXG4vKipcclxuICogU2V0cyB0aGUgbG9nIGxldmVsIGZvciBhbGwgbG9nZ2Vycywgb3Igc3BlY2lmaWVkIGxvZ2dlclxyXG4gKiBAcGFyYW0ge251bWJlcn0gbG9nTGV2ZWxcclxuICogQHBhcmFtIHtzdHJpbmc9fSBsb2dnZXJcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRMb2dMZXZlbChsb2dMZXZlbCwgbG9nZ2VyKSB7XHJcblxyXG4gICAgaWYgKGxvZ0xldmVsIGluc3RhbmNlb2YgTnVtYmVyKSB7XHJcblxyXG4gICAgICAgIGlmIChsb2dnZXIgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBpZiAoX2xvZ2dlcnNbbG9nZ2VyXSkge1xyXG4gICAgICAgICAgICAgICAgX2xvZ2dlcnNbbG9nZ2VyXS5zZXRMb2dMZXZlbChsb2dMZXZlbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgbG9nS2V5IGluIF9sb2dnZXJzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoX2xvZ2dlcnMuaGFzT3duUHJvcGVydHkobG9nS2V5KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiBfbG9nZ2Vyc1tsb2dLZXldKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfbG9nZ2Vyc1tsb2dLZXldLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9sb2dnZXJzW2xvZ0tleV1ba2V5XS5zZXRMb2dMZXZlbChsb2dMZXZlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmFkZEFwcGVuZGVyKENvbnNvbGVBcHBlbmRlcik7XHJcblxyXG5leHBvcnQgeyBMb2dMZXZlbCB9O1xyXG5leHBvcnQgeyBMb2dBcHBlbmRlciB9O1xyXG5leHBvcnQgeyBmb3JtYXR0ZXIgfTtcclxuIl19