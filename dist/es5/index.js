/*istanbul ignore next*/'use strict';

exports.__esModule = true;
exports.LogAppender = exports.LogLevel = undefined;

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

/**
 * The name of the main logger. We use this in case no logger is specified
 * @const
 */
var _MAIN_LOGGER = 'main';

/**
 * The default configuration for log4js2. If no configuration is specified, then this
 * configuration will be injected
 * @const
 */
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
    'layout': '%d [%p] %c - %m'
};

/**
 * The methods that an appender must contain
 * @const
 */
var _APPENDER_METHODS = ['append', 'getName', 'isActive', 'setLogLevel', 'setLayout'];

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
 * @memberOf log4js
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

        for (var key in _loggers) {
            if (_loggers.hasOwnProperty(key)) {
                _loggers[key].forEach(function (appender) {
                    appender.setLayout(config.layout);
                });
            }
        }
    }

    _configuration = config;
}

/**
 * Configures appenders
 *
 * @private
 * @function
 *
 * @param {Array.<LogAppender|function>} appenders
 */
var _configureAppenders = function _configureAppenders(appenders) {

    if (appenders instanceof Array) {

        appenders.forEach(function (appender) {
            if (appender instanceof Function) {
                addAppender(appender);
            }
        });
    } else {
        console.error('Invalid appender configuration');
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

        _loggers[logger.tag] = _getAppendersForLogger(logger.logLevel, logger.layout);
    });
};

/**
 * Gets the appenders for the level and layout
 *
 * @private
 * @function
 *
 * @param {number} logLevel
 * @param {string} layout
 *
 * @returns {Array}
 */
var _getAppendersForLogger = function _getAppendersForLogger(logLevel, layout) {

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
 * @memberOf log4js
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
    _APPENDER_METHODS.forEach(function (element) {
        if (appenderObj[element] == undefined || !(appenderObj[element] instanceof Function)) {
            throw new Error( /*istanbul ignore next*/'Invalid appender: missing/invalid method: ' + element);
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
function _append(logEvent) {

    // finalize the configuration to make sure no other appender can be injected (if set)
    _finalized = true;

    // cycle through each appender for the logger and append the logging event
    (_loggers[logEvent.logger] || _loggers[_MAIN_LOGGER]).forEach(function (logger) {
        if (logger.isActive(logEvent.level)) {
            logger.append(logEvent);
        }
    });
}

/**
 * Handles creating the logger and returning it
 *
 * @function
 * @memberOf log4js
 *
 * @param {function|string} context
 *
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
 * Sets the log level for all appenders of a logger, or specified logger
 *
 * @function
 * @memberOf log4js
 *
 * @param {number} logLevel
 * @param {string=} logger
 */
function setLogLevel(logLevel, logger) {

    if (logLevel instanceof Number) {

        if (logger) {
            if (_loggers[logger]) {
                _loggers[logger].setLogLevel(logLevel);
            }
        } else {
            for (var key in _loggers) {
                if (_loggers.hasOwnProperty(key)) {
                    _loggers[key].forEach(function (appender) {
                        appender.setLogLevel(logLevel);
                    });
                }
            }
        }
    }
}

addAppender( /*istanbul ignore next*/_consoleAppender.ConsoleAppender);

/*istanbul ignore next*/exports.LogLevel = _logLevel.LogLevel;
/*istanbul ignore next*/exports.LogAppender = _appender.LogAppender;
//# sourceMappingURL=data:application/json;base64,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QixFQUE0Qjs7QUFFNUIsWUFBSSxPQUFPLE9BQVAsSUFBa0IsVUFBbEIsRUFBOEI7QUFDOUIsc0JBQVUsUUFBUSxlQUFSLENBQXdCLE9BQXhCLENBQVYsQ0FEOEI7U0FBbEMsTUFFTyxJQUFJLGlDQUFPLHlEQUFQLElBQWtCLFFBQWxCLEVBQTRCOztBQUVuQyxzQkFBVSxRQUFRLGVBQVIsQ0FBd0IsUUFBUSxXQUFSLENBQWxDLENBRm1DOztBQUluQyxnQkFBSSxXQUFXLFFBQVgsRUFBcUI7QUFDckIsMEJBQVUsV0FBVixDQURxQjthQUF6QjtTQUpHLE1BUUE7QUFDSCxzQkFBVSxXQUFWLENBREc7U0FSQTtLQUpYOztBQWtCSCxXQUFPLDJDQUFXLE9BQVgsRUFBb0I7QUFDMUIsa0JBQVcsT0FBWDtLQURNLENBQVAsQ0ExQmtDO0NBQTVCOzs7Ozs7Ozs7OztBQTJDQSxTQUFTLFdBQVQsQ0FBcUIsUUFBckIsRUFBK0IsTUFBL0IsRUFBdUM7O0FBRTFDLFFBQUksb0JBQW9CLE1BQXBCLEVBQTRCOztBQUU1QixZQUFJLE1BQUosRUFBWTtBQUNSLGdCQUFJLFNBQVMsTUFBVCxDQUFKLEVBQXNCO0FBQ2xCLHlCQUFTLE1BQVQsRUFBaUIsV0FBakIsQ0FBNkIsUUFBN0IsRUFEa0I7YUFBdEI7U0FESixNQUlPO0FBQ0gsaUJBQUssSUFBSSxHQUFKLElBQVcsUUFBaEIsRUFBMEI7QUFDdEIsb0JBQUksU0FBUyxjQUFULENBQXdCLEdBQXhCLENBQUosRUFBa0M7QUFDOUIsNkJBQVMsR0FBVCxFQUFjLE9BQWQsQ0FBc0IsVUFBVSxRQUFWLEVBQW9CO0FBQ3RDLGlDQUFTLFdBQVQsQ0FBcUIsUUFBckIsRUFEc0M7cUJBQXBCLENBQXRCLENBRDhCO2lCQUFsQzthQURKO1NBTEo7S0FGSjtDQUZHOztBQXNCUDs7Z0NBRVM7Z0NBQ0EiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogbG9nNGpzIDxodHRwczovL2dpdGh1Yi5jb20vYW5pZ2VuZXJvL2xvZzRqcz5cclxuICpcclxuICogQ29weXJpZ2h0IDIwMTYgUm9iaW4gU2NodWx0eiA8aHR0cDovL2FuaWdlbmVyby5jb20+XHJcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZVxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBIb2xkcyB0aGUgZGVmaW5pdGlvbiBmb3IgdGhlIGFwcGVuZGVyIGNsb3N1cmVcclxuICpcclxuICogQHR5cGVkZWYge3sgYXBwZW5kIDogZnVuY3Rpb24gKG51bWJlciwgTE9HX0VWRU5UKSwgaXNBY3RpdmUgOiBmdW5jdGlvbigpLFxyXG4gKiAgICAgICAgICBzZXRMb2dMZXZlbCA6IGZ1bmN0aW9uKG51bWJlciksIHNldExheW91dCA6IGZ1bmN0aW9uKHN0cmluZykgfX1cclxuICovXHJcbmxldCBBUFBFTkRFUjtcclxuXHJcbi8qKlxyXG4gKiBAdHlwZWRlZiB7eyBhbGxvd0FwcGVuZGVySW5qZWN0aW9uIDogYm9vbGVhbiwgYXBwZW5kZXJzIDogQXJyYXkuPEFQUEVOREVSPixcclxuICogXHRcdFx0YXBwbGljYXRpb24gOiBPYmplY3QsIGxvZ2dlcnMgOiBBcnJheS48TG9nQXBwZW5kZXI+LCBsYXlvdXQgOiBzdHJpbmcgfX1cclxuICovXHJcbmxldCBDT05GSUdfUEFSQU1TO1xyXG5cclxuaW1wb3J0ICogYXMgZm9ybWF0dGVyIGZyb20gJy4vZm9ybWF0dGVyJztcclxuaW1wb3J0ICogYXMgdXRpbGl0eSBmcm9tICcuL3V0aWxpdHknO1xyXG5pbXBvcnQge0xvZ0FwcGVuZGVyfSBmcm9tICcuL2FwcGVuZGVyL2FwcGVuZGVyJztcclxuaW1wb3J0IHtMb2dnZXJ9IGZyb20gJy4vbG9nZ2VyL2xvZ2dlcic7XHJcbmltcG9ydCB7TG9nTGV2ZWx9IGZyb20gJy4vY29uc3QvbG9nTGV2ZWwnO1xyXG5pbXBvcnQge0NvbnNvbGVBcHBlbmRlcn0gZnJvbSAnLi9hcHBlbmRlci9jb25zb2xlQXBwZW5kZXInO1xyXG5cclxuLyoqXHJcbiAqIFRoZSBuYW1lIG9mIHRoZSBtYWluIGxvZ2dlci4gV2UgdXNlIHRoaXMgaW4gY2FzZSBubyBsb2dnZXIgaXMgc3BlY2lmaWVkXHJcbiAqIEBjb25zdFxyXG4gKi9cclxuY29uc3QgX01BSU5fTE9HR0VSID0gJ21haW4nO1xyXG5cclxuLyoqXHJcbiAqIFRoZSBkZWZhdWx0IGNvbmZpZ3VyYXRpb24gZm9yIGxvZzRqczIuIElmIG5vIGNvbmZpZ3VyYXRpb24gaXMgc3BlY2lmaWVkLCB0aGVuIHRoaXNcclxuICogY29uZmlndXJhdGlvbiB3aWxsIGJlIGluamVjdGVkXHJcbiAqIEBjb25zdFxyXG4gKi9cclxuY29uc3QgX0RFRkFVTFRfQ09ORklHID0ge1xyXG4gICAgJ2FsbG93QXBwZW5kZXJJbmplY3Rpb24nIDogdHJ1ZSxcclxuICAgICdhcHBlbmRlcnMnIDogW3tcclxuICAgICAgICAnYXBwZW5kZXInIDogQ29uc29sZUFwcGVuZGVyLFxyXG4gICAgICAgICdsZXZlbCcgOiBMb2dMZXZlbC5JTkZPXHJcblx0fV0sXHJcbiAgICAnbG9nZ2VycycgOiBbe1xyXG4gICAgICAgICdhcHBlbmRlcicgOiAnY29uc29sZScsXHJcbiAgICAgICAgJ2xldmVsJyA6IExvZ0xldmVsLklORk9cclxuICAgIH1dLFxyXG4gICAgJ2xheW91dCcgOiAnJWQgWyVwXSAlYyAtICVtJ1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFRoZSBtZXRob2RzIHRoYXQgYW4gYXBwZW5kZXIgbXVzdCBjb250YWluXHJcbiAqIEBjb25zdFxyXG4gKi9cclxuY29uc3QgX0FQUEVOREVSX01FVEhPRFMgPSBbJ2FwcGVuZCcsICdnZXROYW1lJywgJ2lzQWN0aXZlJywgJ3NldExvZ0xldmVsJywgJ3NldExheW91dCddO1xyXG5cclxuLyoqIEB0eXBlIHtPYmplY3R9ICovXHJcbmxldCBfYXBwZW5kZXJzID0ge307XHJcbi8qKiBAdHlwZSB7P0NPTkZJR19QQVJBTVN9ICovXHJcbmxldCBfY29uZmlndXJhdGlvbiA9IG51bGw7XHJcbi8qKiBAdHlwZSB7Ym9vbGVhbn0gKi9cclxubGV0IF9maW5hbGl6ZWQgPSBmYWxzZTtcclxuLyoqIEB0eXBlIHtPYmplY3R9ICovXHJcbmxldCBfbG9nZ2VycyA9IHt9O1xyXG5cclxuLyoqXHJcbiAqIENvbmZpZ3VyZXMgdGhlIGxvZ2dlclxyXG4gKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGxvZzRqc1xyXG4gKlxyXG4gKiBAcGFyYW1zIHtDT05GSUdfUEFSQU1TfSBjb25maWdcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBjb25maWd1cmUoY29uZmlnKSB7XHJcblxyXG5cdGlmIChfZmluYWxpemVkKSB7XHJcblx0XHRjb25zb2xlLmVycm9yKCdDb3VsZCBub3QgY29uZmlndXJlLiBMb2dVdGlsaXR5IGFscmVhZHkgaW4gdXNlJyk7XHJcblx0XHRyZXR1cm47XHJcblx0fVxyXG5cclxuXHRpZiAoIV9jb25maWd1cmF0aW9uKSB7XHJcbiAgICAgICAgX2NvbmZpZ3VyYXRpb24gPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIWNvbmZpZy5sYXlvdXQgJiYgIV9jb25maWd1cmF0aW9uLmxheW91dCkge1xyXG4gICAgICAgIF9jb25maWd1cmF0aW9uLmxheW91dCA9IF9ERUZBVUxUX0NPTkZJRy5sYXlvdXQ7XHJcbiAgICB9IGVsc2UgaWYgKGNvbmZpZy5sYXlvdXQpIHtcclxuICAgICAgICBfY29uZmlndXJhdGlvbi5sYXlvdXQgPSBjb25maWcubGF5b3V0O1xyXG4gICAgfVxyXG5cclxuXHQvLyBjb25maWd1cmUgdGhlIGFwcGVuZGVyc1xyXG5cdF9jb25maWd1cmVBcHBlbmRlcnMoY29uZmlnLmFwcGVuZGVycyk7XHJcbiAgICAvLyBjb25maWd1cmUgdGhlIGxvZ2dlcnNcclxuICAgIF9jb25maWd1cmVMb2dnZXJzKGNvbmZpZy5sb2dnZXJzKTtcclxuXHJcbiAgICBpZiAoY29uZmlnLmxheW91dCkge1xyXG5cclxuICAgICAgICBmb3JtYXR0ZXIucHJlQ29tcGlsZShjb25maWcubGF5b3V0KTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQga2V5IGluIF9sb2dnZXJzKSB7XHJcbiAgICAgICAgICAgIGlmIChfbG9nZ2Vycy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICBfbG9nZ2Vyc1trZXldLmZvckVhY2goZnVuY3Rpb24gKGFwcGVuZGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXBwZW5kZXIuc2V0TGF5b3V0KGNvbmZpZy5sYXlvdXQpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIF9jb25maWd1cmF0aW9uID0gY29uZmlnO1xyXG5cclxufVxyXG5cclxuLyoqXHJcbiAqIENvbmZpZ3VyZXMgYXBwZW5kZXJzXHJcbiAqXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBmdW5jdGlvblxyXG4gKlxyXG4gKiBAcGFyYW0ge0FycmF5LjxMb2dBcHBlbmRlcnxmdW5jdGlvbj59IGFwcGVuZGVyc1xyXG4gKi9cclxubGV0IF9jb25maWd1cmVBcHBlbmRlcnMgPSBmdW5jdGlvbiAoYXBwZW5kZXJzKSB7XHJcblxyXG4gICAgaWYgKGFwcGVuZGVycyBpbnN0YW5jZW9mIEFycmF5KSB7XHJcblxyXG4gICAgICAgIGFwcGVuZGVycy5mb3JFYWNoKGFwcGVuZGVyID0+IHtcclxuICAgICAgICAgICAgaWYgKGFwcGVuZGVyIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgIGFkZEFwcGVuZGVyKGFwcGVuZGVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcignSW52YWxpZCBhcHBlbmRlciBjb25maWd1cmF0aW9uJyk7XHJcbiAgICB9XHJcblxyXG59O1xyXG5cclxuLyoqXHJcbiAqIENvbmZpZ3VyZXMgdGhlIGxvZ2dlcnNcclxuICpcclxuICogQHByaXZhdGVcclxuICogQGZ1bmN0aW9uXHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXkuPE9iamVjdD59IGxvZ2dlcnNcclxuICovXHJcbmxldCBfY29uZmlndXJlTG9nZ2VycyA9IGZ1bmN0aW9uIChsb2dnZXJzKSB7XHJcblxyXG5cdGlmICghKGxvZ2dlcnMgaW5zdGFuY2VvZiBBcnJheSkpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcignSW52YWxpZCBsb2dnZXJzJyk7XHJcblx0fVxyXG5cclxuICAgIGxvZ2dlcnMuZm9yRWFjaChmdW5jdGlvbiAobG9nZ2VyKSB7XHJcblxyXG4gICAgICAgIGlmICghbG9nZ2VyLmxheW91dCB8fCB0eXBlb2YgbG9nZ2VyLmxheW91dCAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgbG9nZ2VyLmxheW91dCA9IF9jb25maWd1cmF0aW9uLmxheW91dDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxvZ2dlci50YWcgPSBsb2dnZXIudGFnIHx8IF9NQUlOX0xPR0dFUjtcclxuICAgICAgICBsb2dnZXIubG9nTGV2ZWwgPSBsb2dnZXIubG9nTGV2ZWwgfHwgTG9nTGV2ZWwuRVJST1I7XHJcblxyXG4gICAgICAgIF9sb2dnZXJzW2xvZ2dlci50YWddID0gX2dldEFwcGVuZGVyc0ZvckxvZ2dlcihsb2dnZXIubG9nTGV2ZWwsIGxvZ2dlci5sYXlvdXQpO1xyXG5cclxuICAgIH0pO1xyXG5cclxufTtcclxuXHJcbi8qKlxyXG4gKiBHZXRzIHRoZSBhcHBlbmRlcnMgZm9yIHRoZSBsZXZlbCBhbmQgbGF5b3V0XHJcbiAqXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBmdW5jdGlvblxyXG4gKlxyXG4gKiBAcGFyYW0ge251bWJlcn0gbG9nTGV2ZWxcclxuICogQHBhcmFtIHtzdHJpbmd9IGxheW91dFxyXG4gKlxyXG4gKiBAcmV0dXJucyB7QXJyYXl9XHJcbiAqL1xyXG5sZXQgX2dldEFwcGVuZGVyc0ZvckxvZ2dlciA9IGZ1bmN0aW9uIChsb2dMZXZlbCwgbGF5b3V0KSB7XHJcblxyXG4gICAgbGV0IGxvZ2dlcjtcclxuICAgIGxldCBhcHBlbmRlckxpc3QgPSBbXTtcclxuXHJcbiAgICBPYmplY3Qua2V5cyhfYXBwZW5kZXJzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcclxuXHJcbiAgICAgICAgbG9nZ2VyID0gKF9hcHBlbmRlcnNba2V5XS5wcm90b3R5cGUgaW5zdGFuY2VvZiBMb2dBcHBlbmRlcikgPyBuZXcgX2FwcGVuZGVyc1trZXldKCkgOiBfYXBwZW5kZXJzW2tleV0oKTtcclxuXHJcbiAgICAgICAgbG9nZ2VyLnNldExvZ0xldmVsKGxvZ0xldmVsKTtcclxuICAgICAgICBsb2dnZXIuc2V0TGF5b3V0KGxheW91dCk7XHJcblxyXG4gICAgICAgIGFwcGVuZGVyTGlzdC5wdXNoKGxvZ2dlcik7XHJcblxyXG4gICAgfSk7XHJcblxyXG5cdHJldHVybiBhcHBlbmRlckxpc3Q7XHJcblxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEFkZHMgYW4gYXBwZW5kZXIgdG8gdGhlIGFwcGVuZGVyIHF1ZXVlLiBJZiB0aGUgc3RhY2sgaXMgZmluYWxpemVkLCBhbmRcclxuICogdGhlIGFsbG93QXBwZW5kZXJJbmplY3Rpb24gaXMgc2V0IHRvIGZhbHNlLCB0aGVuIHRoZSBldmVudCB3aWxsIG5vdCBiZVxyXG4gKiBhcHBlbmRlZFxyXG4gKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGxvZzRqc1xyXG4gKlxyXG4gKiBAcGFyYW1zIHtMb2dBcHBlbmRlcn0gYXBwZW5kZXJcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBhZGRBcHBlbmRlcihhcHBlbmRlcikge1xyXG5cclxuXHRpZiAoX2ZpbmFsaXplZCAmJiAhX2NvbmZpZ3VyYXRpb24uYWxsb3dBcHBlbmRlckluamVjdGlvbikge1xyXG5cdFx0Y29uc29sZS5lcnJvcignQ2Fubm90IGFkZCBhcHBlbmRlciB3aGVuIGNvbmZpZ3VyYXRpb24gZmluYWxpemVkJyk7XHJcblx0XHRyZXR1cm47XHJcblx0fVxyXG5cclxuICAgIF92YWxpZGF0ZUFwcGVuZGVyKGFwcGVuZGVyKTtcclxuXHJcbiAgICAvLyBvbmx5IHB1dCB0aGUgYXBwZW5kZXIgaW50byB0aGUgc2V0IGlmIGl0IGRvZXNuJ3QgZXhpc3QgYWxyZWFkeVxyXG4gICAgaWYgKCFfYXBwZW5kZXJzW2FwcGVuZGVyLm5hbWVdKSB7XHJcbiAgICAgICAgX2FwcGVuZGVyc1thcHBlbmRlci5uYW1lXSA9IGFwcGVuZGVyO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuLyoqXHJcbiAqIFZhbGlkYXRlcyB0aGF0IHRoZSBhcHBlbmRlclxyXG4gKlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAZnVuY3Rpb25cclxuICpcclxuICogQHBhcmFtcyB7QVBQRU5ERVJ9IGFwcGVuZGVyXHJcbiAqIEB0aHJvd3Mge0Vycm9yfSBpZiB0aGUgYXBwZW5kZXIgaXMgaW52YWxpZFxyXG4gKi9cclxubGV0IF92YWxpZGF0ZUFwcGVuZGVyID0gZnVuY3Rpb24gKGFwcGVuZGVyKSB7XHJcblxyXG4gICAgLy8gaWYgd2UgYXJlIHJ1bm5pbmcgRVM2LCB3ZSBjYW4gbWFrZSBzdXJlIGl0IGV4dGVuZHMgTG9nQXBwZW5kZXJcclxuICAgIC8vIG90aGVyd2lzZSwgaXQgbXVzdCBiZSBhIGZ1bmN0aW9uXHJcbiAgICBpZiAoYXBwZW5kZXIucHJvdG90eXBlIGluc3RhbmNlb2YgTG9nQXBwZW5kZXIpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9IGVsc2UgaWYgKCEoYXBwZW5kZXIgaW5zdGFuY2VvZiBGdW5jdGlvbikpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcignSW52YWxpZCBhcHBlbmRlcjogbm90IGEgZnVuY3Rpb24gb3IgY2xhc3MgTG9nQXBwZW5kZXInKTtcclxuXHR9XHJcblxyXG5cdC8vIGluc3RhbnRpYXRlIHRoZSBhcHBlbmRlciBmdW5jdGlvblxyXG5cdGxldCBhcHBlbmRlck9iaiA9IGFwcGVuZGVyKCk7XHJcblxyXG4gICAgLy8gZW5zdXJlIHRoYXQgdGhlIGFwcGVuZGVyIG1ldGhvZHMgYXJlIHByZXNlbnQgKGFuZCBhcmUgZnVuY3Rpb25zKVxyXG4gICAgX0FQUEVOREVSX01FVEhPRFMuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgIGlmIChhcHBlbmRlck9ialtlbGVtZW50XSA9PSB1bmRlZmluZWQgfHwgIShhcHBlbmRlck9ialtlbGVtZW50XSBpbnN0YW5jZW9mIEZ1bmN0aW9uKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgYXBwZW5kZXI6IG1pc3NpbmcvaW52YWxpZCBtZXRob2Q6ICR7ZWxlbWVudH1gKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbn07XHJcblxyXG4vKipcclxuICogQXBwZW5kcyB0aGUgbG9nIGV2ZW50XHJcbiAqXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBmdW5jdGlvblxyXG4gKlxyXG4gKiBAcGFyYW0ge09iamVjdH0gbG9nRXZlbnRcclxuICovXHJcbmZ1bmN0aW9uIF9hcHBlbmQobG9nRXZlbnQpIHtcclxuXHJcblx0Ly8gZmluYWxpemUgdGhlIGNvbmZpZ3VyYXRpb24gdG8gbWFrZSBzdXJlIG5vIG90aGVyIGFwcGVuZGVyIGNhbiBiZSBpbmplY3RlZCAoaWYgc2V0KVxyXG5cdF9maW5hbGl6ZWQgPSB0cnVlO1xyXG5cclxuICAgIC8vIGN5Y2xlIHRocm91Z2ggZWFjaCBhcHBlbmRlciBmb3IgdGhlIGxvZ2dlciBhbmQgYXBwZW5kIHRoZSBsb2dnaW5nIGV2ZW50XHJcbiAgICAoX2xvZ2dlcnNbbG9nRXZlbnQubG9nZ2VyXSB8fCBfbG9nZ2Vyc1tfTUFJTl9MT0dHRVJdKS5mb3JFYWNoKGZ1bmN0aW9uIChsb2dnZXIpIHtcclxuICAgICAgICBpZiAobG9nZ2VyLmlzQWN0aXZlKGxvZ0V2ZW50LmxldmVsKSkge1xyXG4gICAgICAgICAgICBsb2dnZXIuYXBwZW5kKGxvZ0V2ZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBIYW5kbGVzIGNyZWF0aW5nIHRoZSBsb2dnZXIgYW5kIHJldHVybmluZyBpdFxyXG4gKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGxvZzRqc1xyXG4gKlxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufHN0cmluZ30gY29udGV4dFxyXG4gKlxyXG4gKiBAcmV0dXJuIHtMb2dnZXJ9XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZ2V0TG9nZ2VyKGNvbnRleHQpIHtcclxuXHJcblx0Ly8gd2UgbmVlZCB0byBpbml0aWFsaXplIGlmIHdlIGhhdmVuJ3RcclxuXHRpZiAoIV9jb25maWd1cmF0aW9uKSB7XHJcblx0XHRjb25maWd1cmUoX0RFRkFVTFRfQ09ORklHKTtcclxuXHR9XHJcblxyXG4gICAgLy8gZGV0ZXJtaW5lIHRoZSBjb250ZXh0XHJcbiAgICBpZiAodHlwZW9mIGNvbnRleHQgIT0gJ3N0cmluZycpIHtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBjb250ZXh0ID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgY29udGV4dCA9IHV0aWxpdHkuZ2V0RnVuY3Rpb25OYW1lKGNvbnRleHQpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGNvbnRleHQgPT0gJ29iamVjdCcpIHtcclxuXHJcbiAgICAgICAgICAgIGNvbnRleHQgPSB1dGlsaXR5LmdldEZ1bmN0aW9uTmFtZShjb250ZXh0LmNvbnN0cnVjdG9yKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChjb250ZXh0ID09ICdPYmplY3QnKSB7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0ID0gJ2Fub255bW91cyc7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29udGV4dCA9ICdhbm9ueW1vdXMnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG5cdHJldHVybiBuZXcgTG9nZ2VyKGNvbnRleHQsIHtcclxuXHRcdCdhcHBlbmQnIDogX2FwcGVuZFxyXG5cdH0pO1xyXG5cclxufVxyXG5cclxuXHJcblxyXG4vKipcclxuICogU2V0cyB0aGUgbG9nIGxldmVsIGZvciBhbGwgYXBwZW5kZXJzIG9mIGEgbG9nZ2VyLCBvciBzcGVjaWZpZWQgbG9nZ2VyXHJcbiAqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyT2YgbG9nNGpzXHJcbiAqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBsb2dMZXZlbFxyXG4gKiBAcGFyYW0ge3N0cmluZz19IGxvZ2dlclxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHNldExvZ0xldmVsKGxvZ0xldmVsLCBsb2dnZXIpIHtcclxuXHJcbiAgICBpZiAobG9nTGV2ZWwgaW5zdGFuY2VvZiBOdW1iZXIpIHtcclxuXHJcbiAgICAgICAgaWYgKGxvZ2dlcikge1xyXG4gICAgICAgICAgICBpZiAoX2xvZ2dlcnNbbG9nZ2VyXSkge1xyXG4gICAgICAgICAgICAgICAgX2xvZ2dlcnNbbG9nZ2VyXS5zZXRMb2dMZXZlbChsb2dMZXZlbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gX2xvZ2dlcnMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChfbG9nZ2Vycy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX2xvZ2dlcnNba2V5XS5mb3JFYWNoKGZ1bmN0aW9uIChhcHBlbmRlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcHBlbmRlci5zZXRMb2dMZXZlbChsb2dMZXZlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxufVxyXG5cclxuYWRkQXBwZW5kZXIoQ29uc29sZUFwcGVuZGVyKTtcclxuXHJcbmV4cG9ydCB7IExvZ0xldmVsIH07XHJcbmV4cG9ydCB7IExvZ0FwcGVuZGVyIH07XHJcbiJdfQ==