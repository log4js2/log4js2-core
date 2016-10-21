/*istanbul ignore next*/'use strict';

exports.__esModule = true;
exports.LogLevel = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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
var APPENDER = /*istanbul ignore next*/void 0;

/**
 * @typedef {{ allowAppenderInjection : boolean, appenders : Array.<APPENDER>,
 * 			application : Object, loggers : Array.<LogAppender>, layout : string }}
 */
var CONFIG_PARAMS = /*istanbul ignore next*/void 0;

/** @const */
var _MAIN_LOGGER = 'main';
/** @const */
var _DEFAULT_CONFIG = {
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
var APPENDER_METHODS = ['append', 'getName', 'isActive', 'setLogLevel', 'setLayout'];

/** @type {Object} */
var _appenders = {};
/** @type {?CONFIG_PARAMS} */
var _configuration = null;
/** @type {boolean} */
var _finalized = false;
/** @type {Object} */
var _loggers = {};

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

        for (var logKey in _loggers) {

            if (_loggers.hasOwnProperty(logKey)) {
                for (var key in _loggers[logKey]) {
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
var _configureAppenders = function _configureAppenders(appenders) {

    if (appenders instanceof Array) {

        var count = appenders.length;
        for (var i = 0; i < count; i++) {

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
var _configureLoggers = function _configureLoggers(loggers) {

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
var _getLoggers = function _getLoggers(logLevel, layout) {

    var logger = /*istanbul ignore next*/void 0;
    var appenderList = [];

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
var _validateAppender = function _validateAppender(appender) {

    // if we are running ES6, we can make sure it extends LogAppender
    // otherwise, it must be a function
    if (appender.prototype instanceof /*istanbul ignore next*/_appender.LogAppender) {
        return;
    } else if (!(appender instanceof Function)) {
        throw new Error('Invalid appender: not a function or class LogAppender');
    }

    // instantiate the appender function
    var appenderObj = appender();

    // ensure that the appender methods are present (and are functions)
    APPENDER_METHODS.forEach(function (element) {
        if (appenderObj[element] == undefined || !(appenderObj[element] instanceof Function)) {
            throw new Error( /*istanbul ignore next*/'Invalid appender: missing/invalid method: ' + element);
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
        } else if ( /*istanbul ignore next*/(typeof context === 'undefined' ? 'undefined' : _typeof(context)) == 'object') {

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

            for (var logKey in _loggers) {
                if (_loggers.hasOwnProperty(logKey)) {
                    for (var key in _loggers[logKey]) {
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
//# sourceMappingURL=data:application/json;base64,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O3lCQUExQztxQkFESjtpQkFESjthQURKO1NBTko7S0FGSjtDQUZHOztBQTBCUDs7Z0NBRVMiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogbG9nNGpzIDxodHRwczovL2dpdGh1Yi5jb20vYW5pZ2VuZXJvL2xvZzRqcz5cclxuICpcclxuICogQ29weXJpZ2h0IDIwMTYgUm9iaW4gU2NodWx0eiA8aHR0cDovL2FuaWdlbmVyby5jb20+XHJcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZVxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBIb2xkcyB0aGUgZGVmaW5pdGlvbiBmb3IgdGhlIGFwcGVuZGVyIGNsb3N1cmVcclxuICpcclxuICogQHR5cGVkZWYge3sgYXBwZW5kIDogZnVuY3Rpb24gKG51bWJlciwgTE9HX0VWRU5UKSwgaXNBY3RpdmUgOiBmdW5jdGlvbigpLFxyXG4gKiAgICAgICAgICBzZXRMb2dMZXZlbCA6IGZ1bmN0aW9uKG51bWJlciksIHNldExheW91dCA6IGZ1bmN0aW9uKHN0cmluZykgfX1cclxuICovXHJcbmxldCBBUFBFTkRFUjtcclxuXHJcbi8qKlxyXG4gKiBAdHlwZWRlZiB7eyBhbGxvd0FwcGVuZGVySW5qZWN0aW9uIDogYm9vbGVhbiwgYXBwZW5kZXJzIDogQXJyYXkuPEFQUEVOREVSPixcclxuICogXHRcdFx0YXBwbGljYXRpb24gOiBPYmplY3QsIGxvZ2dlcnMgOiBBcnJheS48TG9nQXBwZW5kZXI+LCBsYXlvdXQgOiBzdHJpbmcgfX1cclxuICovXHJcbmxldCBDT05GSUdfUEFSQU1TO1xyXG5cclxuaW1wb3J0ICogYXMgZm9ybWF0dGVyIGZyb20gJy4vZm9ybWF0dGVyJztcclxuaW1wb3J0ICogYXMgdXRpbGl0eSBmcm9tICcuL3V0aWxpdHknO1xyXG5pbXBvcnQge0xvZ0FwcGVuZGVyfSBmcm9tICcuL2FwcGVuZGVyL2FwcGVuZGVyJztcclxuaW1wb3J0IHtMb2dnZXJ9IGZyb20gJy4vbG9nZ2VyL2xvZ2dlcic7XHJcbmltcG9ydCB7TG9nTGV2ZWx9IGZyb20gJy4vY29uc3QvbG9nTGV2ZWwnO1xyXG5pbXBvcnQge0NvbnNvbGVBcHBlbmRlcn0gZnJvbSAnLi9hcHBlbmRlci9jb25zb2xlQXBwZW5kZXInO1xyXG5cclxuLyoqIEBjb25zdCAqL1xyXG5jb25zdCBfTUFJTl9MT0dHRVIgPSAnbWFpbic7XHJcbi8qKiBAY29uc3QgKi9cclxuY29uc3QgX0RFRkFVTFRfQ09ORklHID0ge1xyXG4gICAgJ2FsbG93QXBwZW5kZXJJbmplY3Rpb24nIDogdHJ1ZSxcclxuICAgICdhcHBlbmRlcnMnIDogW3tcclxuICAgICAgICAnYXBwZW5kZXInIDogQ29uc29sZUFwcGVuZGVyLFxyXG4gICAgICAgICdsZXZlbCcgOiBMb2dMZXZlbC5JTkZPXHJcblx0fV0sXHJcbiAgICAnbG9nZ2VycycgOiBbe1xyXG4gICAgICAgICdhcHBlbmRlcicgOiAnY29uc29sZScsXHJcbiAgICAgICAgJ2xldmVsJyA6IExvZ0xldmVsLklORk9cclxuICAgIH1dLFxyXG4gICAgJ2xheW91dCcgOiAnJWR7eXl5eS1NTS1kZCBISDptbTpzcy5TU1N9IFslbGV2ZWxdICVsb2dnZXIgLSAlbWVzc2FnZSdcclxufTtcclxuY29uc3QgQVBQRU5ERVJfTUVUSE9EUyA9IFsnYXBwZW5kJywgJ2dldE5hbWUnLCAnaXNBY3RpdmUnLCAnc2V0TG9nTGV2ZWwnLCAnc2V0TGF5b3V0J107XHJcblxyXG4vKiogQHR5cGUge09iamVjdH0gKi9cclxubGV0IF9hcHBlbmRlcnMgPSB7fTtcclxuLyoqIEB0eXBlIHs/Q09ORklHX1BBUkFNU30gKi9cclxubGV0IF9jb25maWd1cmF0aW9uID0gbnVsbDtcclxuLyoqIEB0eXBlIHtib29sZWFufSAqL1xyXG5sZXQgX2ZpbmFsaXplZCA9IGZhbHNlO1xyXG4vKiogQHR5cGUge09iamVjdH0gKi9cclxubGV0IF9sb2dnZXJzID0ge307XHJcblxyXG4vKipcclxuICogQ29uZmlndXJlcyB0aGUgbG9nZ2VyXHJcbiAqXHJcbiAqIEBmdW5jdGlvblxyXG4gKlxyXG4gKiBAcGFyYW1zIHtDT05GSUdfUEFSQU1TfSBjb25maWdcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBjb25maWd1cmUoY29uZmlnKSB7XHJcblxyXG5cdGlmIChfZmluYWxpemVkKSB7XHJcblx0XHRjb25zb2xlLmVycm9yKCdDb3VsZCBub3QgY29uZmlndXJlLiBMb2dVdGlsaXR5IGFscmVhZHkgaW4gdXNlJyk7XHJcblx0XHRyZXR1cm47XHJcblx0fVxyXG5cclxuXHRpZiAoIV9jb25maWd1cmF0aW9uKSB7XHJcbiAgICAgICAgX2NvbmZpZ3VyYXRpb24gPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIWNvbmZpZy5sYXlvdXQgJiYgIV9jb25maWd1cmF0aW9uLmxheW91dCkge1xyXG4gICAgICAgIF9jb25maWd1cmF0aW9uLmxheW91dCA9IF9ERUZBVUxUX0NPTkZJRy5sYXlvdXQ7XHJcbiAgICB9IGVsc2UgaWYgKGNvbmZpZy5sYXlvdXQpIHtcclxuICAgICAgICBfY29uZmlndXJhdGlvbi5sYXlvdXQgPSBjb25maWcubGF5b3V0O1xyXG4gICAgfVxyXG5cclxuXHQvLyBjb25maWd1cmUgdGhlIGFwcGVuZGVyc1xyXG5cdF9jb25maWd1cmVBcHBlbmRlcnMoY29uZmlnLmFwcGVuZGVycyk7XHJcbiAgICAvLyBjb25maWd1cmUgdGhlIGxvZ2dlcnNcclxuICAgIF9jb25maWd1cmVMb2dnZXJzKGNvbmZpZy5sb2dnZXJzKTtcclxuXHJcbiAgICBpZiAoY29uZmlnLmxheW91dCkge1xyXG5cclxuICAgICAgICBmb3JtYXR0ZXIucHJlQ29tcGlsZShjb25maWcubGF5b3V0KTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgbG9nS2V5IGluIF9sb2dnZXJzKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoX2xvZ2dlcnMuaGFzT3duUHJvcGVydHkobG9nS2V5KSkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQga2V5IGluIF9sb2dnZXJzW2xvZ0tleV0pIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoX2xvZ2dlcnNbbG9nS2V5XS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9sb2dnZXJzW2xvZ0tleV1ba2V5XS5zZXRMYXlvdXQoY29uZmlnLmxheW91dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgX2NvbmZpZ3VyYXRpb24gPSBjb25maWc7XHJcblxyXG59XHJcblxyXG4vKipcclxuICogQHByaXZhdGVcclxuICogQGZ1bmN0aW9uXHJcbiAqXHJcbiAqIEBwYXJhbSBhcHBlbmRlcnNcclxuICovXHJcbmxldCBfY29uZmlndXJlQXBwZW5kZXJzID0gZnVuY3Rpb24gKGFwcGVuZGVycykge1xyXG5cclxuICAgIGlmIChhcHBlbmRlcnMgaW5zdGFuY2VvZiBBcnJheSkge1xyXG5cclxuICAgICAgICBsZXQgY291bnQgPSBhcHBlbmRlcnMubGVuZ3RoO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBhcHBlbmRlcnNbaV0gPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgIGFkZEFwcGVuZGVyKGFwcGVuZGVyc1tpXSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIFRPRE86IGZpeFxyXG4gICAgICAgICAgICAvLyBlbHNlIGlmICh0eXBlb2YgYXBwZW5kZXJzW2ldID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAvLyAgICAgLy8gZG8gc29tZXRoaW5nP1xyXG4gICAgICAgICAgICAvLyB9IGVsc2UgaWYgKHR5cGVvZiBhcHBlbmRlcnNbaV0gPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcignSW52YWxpZCBhcHBlbmRlciBjb25maWd1cmF0aW9uJyk7XHJcbiAgICB9XHJcblxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBmdW5jdGlvblxyXG4gKlxyXG4gKiBAcGFyYW0ge0FycmF5LjxPYmplY3Q+fSBsb2dnZXJzXHJcbiAqL1xyXG5sZXQgX2NvbmZpZ3VyZUxvZ2dlcnMgPSBmdW5jdGlvbiAobG9nZ2Vycykge1xyXG5cclxuXHRpZiAoIShsb2dnZXJzIGluc3RhbmNlb2YgQXJyYXkpKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgbG9nZ2VycycpO1xyXG5cdH1cclxuXHJcbiAgICBsb2dnZXJzLmZvckVhY2goZnVuY3Rpb24gKGxvZ2dlcikge1xyXG5cclxuICAgICAgICBpZiAoIWxvZ2dlci5sYXlvdXQgfHwgdHlwZW9mIGxvZ2dlci5sYXlvdXQgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIGxvZ2dlci5sYXlvdXQgPSBfY29uZmlndXJhdGlvbi5sYXlvdXQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsb2dnZXIudGFnID0gbG9nZ2VyLnRhZyB8fCBfTUFJTl9MT0dHRVI7XHJcbiAgICAgICAgbG9nZ2VyLmxvZ0xldmVsID0gbG9nZ2VyLmxvZ0xldmVsIHx8IExvZ0xldmVsLkVSUk9SO1xyXG5cclxuICAgICAgICBfbG9nZ2Vyc1tsb2dnZXIudGFnXSA9IF9nZXRMb2dnZXJzKGxvZ2dlci5sb2dMZXZlbCwgbG9nZ2VyLmxheW91dCk7XHJcblxyXG4gICAgfSk7XHJcblxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEdldHMgdGhlIGxvZ2dlcnMgdGhhdCBtYXRjaCB0aGUgZ2l2ZW4gcGF0dGVybiBhbmQgbG9nIGxldmVsXHJcbiAqXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBmdW5jdGlvblxyXG4gKlxyXG4gKiBAcGFyYW0ge251bWJlcn0gbG9nTGV2ZWxcclxuICogQHBhcmFtIHtzdHJpbmd9IGxheW91dFxyXG4gKlxyXG4gKiBAcmV0dXJucyB7QXJyYXl9XHJcbiAqL1xyXG5sZXQgX2dldExvZ2dlcnMgPSBmdW5jdGlvbiAobG9nTGV2ZWwsIGxheW91dCkge1xyXG5cclxuICAgIGxldCBsb2dnZXI7XHJcbiAgICBsZXQgYXBwZW5kZXJMaXN0ID0gW107XHJcblxyXG4gICAgT2JqZWN0LmtleXMoX2FwcGVuZGVycykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XHJcblxyXG4gICAgICAgIGxvZ2dlciA9IChfYXBwZW5kZXJzW2tleV0ucHJvdG90eXBlIGluc3RhbmNlb2YgTG9nQXBwZW5kZXIpID8gbmV3IF9hcHBlbmRlcnNba2V5XSgpIDogX2FwcGVuZGVyc1trZXldKCk7XHJcblxyXG4gICAgICAgIGxvZ2dlci5zZXRMb2dMZXZlbChsb2dMZXZlbCk7XHJcbiAgICAgICAgbG9nZ2VyLnNldExheW91dChsYXlvdXQpO1xyXG5cclxuICAgICAgICBhcHBlbmRlckxpc3QucHVzaChsb2dnZXIpO1xyXG5cclxuICAgIH0pO1xyXG5cclxuXHRyZXR1cm4gYXBwZW5kZXJMaXN0O1xyXG5cclxufTtcclxuXHJcbi8qKlxyXG4gKiBBZGRzIGFuIGFwcGVuZGVyIHRvIHRoZSBhcHBlbmRlciBxdWV1ZS4gSWYgdGhlIHN0YWNrIGlzIGZpbmFsaXplZCwgYW5kXHJcbiAqIHRoZSBhbGxvd0FwcGVuZGVySW5qZWN0aW9uIGlzIHNldCB0byBmYWxzZSwgdGhlbiB0aGUgZXZlbnQgd2lsbCBub3QgYmVcclxuICogYXBwZW5kZWRcclxuICpcclxuICogQGZ1bmN0aW9uXHJcbiAqXHJcbiAqIEBwYXJhbXMge0xvZ0FwcGVuZGVyfSBhcHBlbmRlclxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGFkZEFwcGVuZGVyKGFwcGVuZGVyKSB7XHJcblxyXG5cdGlmIChfZmluYWxpemVkICYmICFfY29uZmlndXJhdGlvbi5hbGxvd0FwcGVuZGVySW5qZWN0aW9uKSB7XHJcblx0XHRjb25zb2xlLmVycm9yKCdDYW5ub3QgYWRkIGFwcGVuZGVyIHdoZW4gY29uZmlndXJhdGlvbiBmaW5hbGl6ZWQnKTtcclxuXHRcdHJldHVybjtcclxuXHR9XHJcblxyXG4gICAgX3ZhbGlkYXRlQXBwZW5kZXIoYXBwZW5kZXIpO1xyXG5cclxuICAgIC8vIG9ubHkgcHV0IHRoZSBhcHBlbmRlciBpbnRvIHRoZSBzZXQgaWYgaXQgZG9lc24ndCBleGlzdCBhbHJlYWR5XHJcbiAgICBpZiAoIV9hcHBlbmRlcnNbYXBwZW5kZXIubmFtZV0pIHtcclxuICAgICAgICBfYXBwZW5kZXJzW2FwcGVuZGVyLm5hbWVdID0gYXBwZW5kZXI7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG4vKipcclxuICogVmFsaWRhdGVzIHRoYXQgdGhlIGFwcGVuZGVyXHJcbiAqXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBmdW5jdGlvblxyXG4gKlxyXG4gKiBAcGFyYW1zIHtBUFBFTkRFUn0gYXBwZW5kZXJcclxuICogQHRocm93cyB7RXJyb3J9IGlmIHRoZSBhcHBlbmRlciBpcyBpbnZhbGlkXHJcbiAqL1xyXG5sZXQgX3ZhbGlkYXRlQXBwZW5kZXIgPSBmdW5jdGlvbiAoYXBwZW5kZXIpIHtcclxuXHJcbiAgICAvLyBpZiB3ZSBhcmUgcnVubmluZyBFUzYsIHdlIGNhbiBtYWtlIHN1cmUgaXQgZXh0ZW5kcyBMb2dBcHBlbmRlclxyXG4gICAgLy8gb3RoZXJ3aXNlLCBpdCBtdXN0IGJlIGEgZnVuY3Rpb25cclxuICAgIGlmIChhcHBlbmRlci5wcm90b3R5cGUgaW5zdGFuY2VvZiBMb2dBcHBlbmRlcikge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH0gZWxzZSBpZiAoIShhcHBlbmRlciBpbnN0YW5jZW9mIEZ1bmN0aW9uKSkge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGFwcGVuZGVyOiBub3QgYSBmdW5jdGlvbiBvciBjbGFzcyBMb2dBcHBlbmRlcicpO1xyXG5cdH1cclxuXHJcblx0Ly8gaW5zdGFudGlhdGUgdGhlIGFwcGVuZGVyIGZ1bmN0aW9uXHJcblx0bGV0IGFwcGVuZGVyT2JqID0gYXBwZW5kZXIoKTtcclxuXHJcbiAgICAvLyBlbnN1cmUgdGhhdCB0aGUgYXBwZW5kZXIgbWV0aG9kcyBhcmUgcHJlc2VudCAoYW5kIGFyZSBmdW5jdGlvbnMpXHJcbiAgICBBUFBFTkRFUl9NRVRIT0RTLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICBpZiAoYXBwZW5kZXJPYmpbZWxlbWVudF0gPT0gdW5kZWZpbmVkIHx8ICEoYXBwZW5kZXJPYmpbZWxlbWVudF0gaW5zdGFuY2VvZiBGdW5jdGlvbikpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGFwcGVuZGVyOiBtaXNzaW5nL2ludmFsaWQgbWV0aG9kOiAke2VsZW1lbnR9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEFwcGVuZHMgdGhlIGxvZyBldmVudFxyXG4gKlxyXG4gKiBAZnVuY3Rpb25cclxuICpcclxuICogQHBhcmFtIHtPYmplY3R9IGxvZ2dpbmdFdmVudFxyXG4gKi9cclxuZnVuY3Rpb24gX2FwcGVuZChsb2dnaW5nRXZlbnQpIHtcclxuXHJcblx0Ly8gZmluYWxpemUgdGhlIGNvbmZpZ3VyYXRpb24gdG8gbWFrZSBzdXJlIG5vIG90aGVyIGFwcGVuZGVyIGNhbiBiZSBpbmplY3RlZCAoaWYgc2V0KVxyXG5cdF9maW5hbGl6ZWQgPSB0cnVlO1xyXG5cclxuICAgIChfbG9nZ2Vyc1tsb2dnaW5nRXZlbnQubG9nZ2VyXSB8fCBfbG9nZ2Vyc1tfTUFJTl9MT0dHRVJdKS5mb3JFYWNoKGZ1bmN0aW9uIChsb2dnZXIpIHtcclxuICAgICAgICAvLyBUT0RPOiBsb2dnZXIgYWN0aXZlP1xyXG4gICAgICAgIC8vIGlmIChsb2dnZXIuaXNBY3RpdmUobG9nZ2luZ0V2ZW50LmxldmVsKSkge1xyXG4gICAgICAgICAgICBsb2dnZXIuYXBwZW5kKGxvZ2dpbmdFdmVudCk7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgfSk7XHJcblxyXG59XHJcblxyXG4vKipcclxuICogSGFuZGxlcyBjcmVhdGluZyB0aGUgbG9nZ2VyIGFuZCByZXR1cm5pbmcgaXRcclxuICogQHBhcmFtIHtmdW5jdGlvbnxzdHJpbmd9IGNvbnRleHRcclxuICogQHJldHVybiB7TG9nZ2VyfVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGdldExvZ2dlcihjb250ZXh0KSB7XHJcblxyXG5cdC8vIHdlIG5lZWQgdG8gaW5pdGlhbGl6ZSBpZiB3ZSBoYXZlbid0XHJcblx0aWYgKCFfY29uZmlndXJhdGlvbikge1xyXG5cdFx0Y29uZmlndXJlKF9ERUZBVUxUX0NPTkZJRyk7XHJcblx0fVxyXG5cclxuICAgIC8vIGRldGVybWluZSB0aGUgY29udGV4dFxyXG4gICAgaWYgKHR5cGVvZiBjb250ZXh0ICE9ICdzdHJpbmcnKSB7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgY29udGV4dCA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIGNvbnRleHQgPSB1dGlsaXR5LmdldEZ1bmN0aW9uTmFtZShjb250ZXh0KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBjb250ZXh0ID09ICdvYmplY3QnKSB7XHJcblxyXG4gICAgICAgICAgICBjb250ZXh0ID0gdXRpbGl0eS5nZXRGdW5jdGlvbk5hbWUoY29udGV4dC5jb25zdHJ1Y3Rvcik7XHJcblxyXG4gICAgICAgICAgICBpZiAoY29udGV4dCA9PSAnT2JqZWN0Jykge1xyXG4gICAgICAgICAgICAgICAgY29udGV4dCA9ICdhbm9ueW1vdXMnO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnRleHQgPSAnYW5vbnltb3VzJztcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuXHRyZXR1cm4gbmV3IExvZ2dlcihjb250ZXh0LCB7XHJcblx0XHQnYXBwZW5kJyA6IF9hcHBlbmRcclxuXHR9KTtcclxuXHJcbn1cclxuXHJcblxyXG5cclxuLyoqXHJcbiAqIFNldHMgdGhlIGxvZyBsZXZlbCBmb3IgYWxsIGxvZ2dlcnMsIG9yIHNwZWNpZmllZCBsb2dnZXJcclxuICogQHBhcmFtIHtudW1iZXJ9IGxvZ0xldmVsXHJcbiAqIEBwYXJhbSB7c3RyaW5nPX0gbG9nZ2VyXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gc2V0TG9nTGV2ZWwobG9nTGV2ZWwsIGxvZ2dlcikge1xyXG5cclxuICAgIGlmIChsb2dMZXZlbCBpbnN0YW5jZW9mIE51bWJlcikge1xyXG5cclxuICAgICAgICBpZiAobG9nZ2VyICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgaWYgKF9sb2dnZXJzW2xvZ2dlcl0pIHtcclxuICAgICAgICAgICAgICAgIF9sb2dnZXJzW2xvZ2dlcl0uc2V0TG9nTGV2ZWwobG9nTGV2ZWwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGxvZ0tleSBpbiBfbG9nZ2Vycykge1xyXG4gICAgICAgICAgICAgICAgaWYgKF9sb2dnZXJzLmhhc093blByb3BlcnR5KGxvZ0tleSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gX2xvZ2dlcnNbbG9nS2V5XSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoX2xvZ2dlcnNbbG9nS2V5XS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfbG9nZ2Vyc1tsb2dLZXldW2tleV0uc2V0TG9nTGV2ZWwobG9nTGV2ZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5hZGRBcHBlbmRlcihDb25zb2xlQXBwZW5kZXIpO1xyXG5cclxuZXhwb3J0IHsgTG9nTGV2ZWwgfTtcclxuIl19