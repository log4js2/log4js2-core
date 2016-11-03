/*istanbul ignore next*/'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LogAppender = exports.LogLevel = undefined;
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

/**
 * The name of the main logger. We use this in case no logger is specified
 * @const
 */
const _MAIN_LOGGER = 'main';

/**
 * The default appenders that should be included if no appenders are specified
 * @const
 */
const _DEFAULT_APPENDERS = [{
    'appender': /*istanbul ignore next*/_consoleAppender.ConsoleAppender,
    'level': /*istanbul ignore next*/_logLevel.LogLevel.INFO
}];

/**
 * The default configuration for log4js2. If no configuration is specified, then this
 * configuration will be injected
 * @const
 */
const _DEFAULT_CONFIG = {
    'allowAppenderInjection': true,
    'appenders': _DEFAULT_APPENDERS,
    'loggers': [{
        'level': /*istanbul ignore next*/_logLevel.LogLevel.INFO
    }],
    'layout': '%d [%p] %c - %m'
};

/**
 * The methods that an appender must contain
 * @const
 */
const _APPENDER_METHODS = ['append', 'getName', 'isActive', 'setLogLevel', 'setLayout'];

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
 * @memberOf log4js
 *
 * @params {CONFIG_PARAMS} config
 */
function configure(config) {

    if (_finalized) {
        console.error('Could not configure - already in use');
        return;
    }

    if (!_configuration) {
        _configuration = {};
    }

    // set the default layout
    if (!config.layout && !_configuration.layout) {
        _configuration.layout = _DEFAULT_CONFIG.layout;
    } else if (config.layout) {
        _configuration.layout = config.layout;
    }

    // configure the appenders
    _configureAppenders(config.appenders);
    // configure the loggers
    _configureLoggers(config.loggers);
}

/**
 * Configures appenders
 *
 * @private
 * @function
 *
 * @param {Array.<LogAppender|function>} appenders
 */
let _configureAppenders = function (appenders) {

    if (!(appenders instanceof Array)) {
        appenders = _DEFAULT_APPENDERS;
    }

    appenders.forEach(appender => {
        if (appender instanceof Function) {
            addAppender(appender);
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
let _getAppendersForLogger = function (logLevel, layout) {

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
    _APPENDER_METHODS.forEach(function (element) {
        if (appenderObj[element] == undefined || !(appenderObj[element] instanceof Function)) {
            throw new Error(`Invalid appender: missing/invalid method: ${ element }`);
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
 * @param {function|string=} context
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
        } else if (typeof context == 'object') {

            context = utility.getFunctionName(context.constructor);

            if (context == 'Object') {
                context = 'anonymous';
            }
        } else {
            context = _MAIN_LOGGER;
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
            for (let key in _loggers) {
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
//# sourceMappingURL=data:application/json;base64,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QURNLENBQVAsQ0ExQmtDO0NBQTVCOzs7Ozs7Ozs7OztBQTJDQSxTQUFTLFdBQVQsQ0FBcUIsUUFBckIsRUFBK0IsTUFBL0IsRUFBdUM7O0FBRTFDLFFBQUksb0JBQW9CLE1BQXBCLEVBQTRCOztBQUU1QixZQUFJLE1BQUosRUFBWTtBQUNSLGdCQUFJLFNBQVMsTUFBVCxDQUFKLEVBQXNCO0FBQ2xCLHlCQUFTLE1BQVQsRUFBaUIsV0FBakIsQ0FBNkIsUUFBN0IsRUFEa0I7YUFBdEI7U0FESixNQUlPO0FBQ0gsaUJBQUssSUFBSSxHQUFKLElBQVcsUUFBaEIsRUFBMEI7QUFDdEIsb0JBQUksU0FBUyxjQUFULENBQXdCLEdBQXhCLENBQUosRUFBa0M7QUFDOUIsNkJBQVMsR0FBVCxFQUFjLE9BQWQsQ0FBc0IsVUFBVSxRQUFWLEVBQW9CO0FBQ3RDLGlDQUFTLFdBQVQsQ0FBcUIsUUFBckIsRUFEc0M7cUJBQXBCLENBQXRCLENBRDhCO2lCQUFsQzthQURKO1NBTEo7S0FGSjtDQUZHOztBQXNCUDs7Z0NBRVM7Z0NBQ0EiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogbG9nNGpzIDxodHRwczovL2dpdGh1Yi5jb20vYW5pZ2VuZXJvL2xvZzRqcz5cclxuICpcclxuICogQ29weXJpZ2h0IDIwMTYgUm9iaW4gU2NodWx0eiA8aHR0cDovL2FuaWdlbmVyby5jb20+XHJcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZVxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBIb2xkcyB0aGUgZGVmaW5pdGlvbiBmb3IgdGhlIGFwcGVuZGVyIGNsb3N1cmVcclxuICpcclxuICogQHR5cGVkZWYge3sgYXBwZW5kIDogZnVuY3Rpb24gKG51bWJlciwgTE9HX0VWRU5UKSwgaXNBY3RpdmUgOiBmdW5jdGlvbigpLFxyXG4gKiAgICAgICAgICBzZXRMb2dMZXZlbCA6IGZ1bmN0aW9uKG51bWJlciksIHNldExheW91dCA6IGZ1bmN0aW9uKHN0cmluZykgfX1cclxuICovXHJcbmxldCBBUFBFTkRFUjtcclxuXHJcbi8qKlxyXG4gKiBAdHlwZWRlZiB7eyBhbGxvd0FwcGVuZGVySW5qZWN0aW9uIDogYm9vbGVhbiwgYXBwZW5kZXJzIDogQXJyYXkuPEFQUEVOREVSPixcclxuICogXHRcdFx0YXBwbGljYXRpb24gOiBPYmplY3QsIGxvZ2dlcnMgOiBBcnJheS48TG9nQXBwZW5kZXI+LCBsYXlvdXQgOiBzdHJpbmcgfX1cclxuICovXHJcbmxldCBDT05GSUdfUEFSQU1TO1xyXG5cclxuaW1wb3J0ICogYXMgZm9ybWF0dGVyIGZyb20gJy4vZm9ybWF0dGVyJztcclxuaW1wb3J0ICogYXMgdXRpbGl0eSBmcm9tICcuL3V0aWxpdHknO1xyXG5pbXBvcnQge0xvZ0FwcGVuZGVyfSBmcm9tICcuL2FwcGVuZGVyL2FwcGVuZGVyJztcclxuaW1wb3J0IHtMb2dnZXJ9IGZyb20gJy4vbG9nZ2VyL2xvZ2dlcic7XHJcbmltcG9ydCB7TG9nTGV2ZWx9IGZyb20gJy4vY29uc3QvbG9nTGV2ZWwnO1xyXG5pbXBvcnQge0NvbnNvbGVBcHBlbmRlcn0gZnJvbSAnLi9hcHBlbmRlci9jb25zb2xlQXBwZW5kZXInO1xyXG5cclxuLyoqXHJcbiAqIFRoZSBuYW1lIG9mIHRoZSBtYWluIGxvZ2dlci4gV2UgdXNlIHRoaXMgaW4gY2FzZSBubyBsb2dnZXIgaXMgc3BlY2lmaWVkXHJcbiAqIEBjb25zdFxyXG4gKi9cclxuY29uc3QgX01BSU5fTE9HR0VSID0gJ21haW4nO1xyXG5cclxuLyoqXHJcbiAqIFRoZSBkZWZhdWx0IGFwcGVuZGVycyB0aGF0IHNob3VsZCBiZSBpbmNsdWRlZCBpZiBubyBhcHBlbmRlcnMgYXJlIHNwZWNpZmllZFxyXG4gKiBAY29uc3RcclxuICovXHJcbmNvbnN0IF9ERUZBVUxUX0FQUEVOREVSUyA9IFt7XHJcbiAgICAnYXBwZW5kZXInIDogQ29uc29sZUFwcGVuZGVyLFxyXG4gICAgJ2xldmVsJyA6IExvZ0xldmVsLklORk9cclxufV07XHJcblxyXG4vKipcclxuICogVGhlIGRlZmF1bHQgY29uZmlndXJhdGlvbiBmb3IgbG9nNGpzMi4gSWYgbm8gY29uZmlndXJhdGlvbiBpcyBzcGVjaWZpZWQsIHRoZW4gdGhpc1xyXG4gKiBjb25maWd1cmF0aW9uIHdpbGwgYmUgaW5qZWN0ZWRcclxuICogQGNvbnN0XHJcbiAqL1xyXG5jb25zdCBfREVGQVVMVF9DT05GSUcgPSB7XHJcbiAgICAnYWxsb3dBcHBlbmRlckluamVjdGlvbicgOiB0cnVlLFxyXG4gICAgJ2FwcGVuZGVycycgOiBfREVGQVVMVF9BUFBFTkRFUlMsXHJcbiAgICAnbG9nZ2VycycgOiBbe1xyXG4gICAgICAgICdsZXZlbCcgOiBMb2dMZXZlbC5JTkZPXHJcbiAgICB9XSxcclxuICAgICdsYXlvdXQnIDogJyVkIFslcF0gJWMgLSAlbSdcclxufTtcclxuXHJcbi8qKlxyXG4gKiBUaGUgbWV0aG9kcyB0aGF0IGFuIGFwcGVuZGVyIG11c3QgY29udGFpblxyXG4gKiBAY29uc3RcclxuICovXHJcbmNvbnN0IF9BUFBFTkRFUl9NRVRIT0RTID0gWydhcHBlbmQnLCAnZ2V0TmFtZScsICdpc0FjdGl2ZScsICdzZXRMb2dMZXZlbCcsICdzZXRMYXlvdXQnXTtcclxuXHJcbi8qKiBAdHlwZSB7T2JqZWN0fSAqL1xyXG5sZXQgX2FwcGVuZGVycyA9IHt9O1xyXG4vKiogQHR5cGUgez9DT05GSUdfUEFSQU1TfSAqL1xyXG5sZXQgX2NvbmZpZ3VyYXRpb24gPSBudWxsO1xyXG4vKiogQHR5cGUge2Jvb2xlYW59ICovXHJcbmxldCBfZmluYWxpemVkID0gZmFsc2U7XHJcbi8qKiBAdHlwZSB7T2JqZWN0fSAqL1xyXG5sZXQgX2xvZ2dlcnMgPSB7fTtcclxuXHJcbi8qKlxyXG4gKiBDb25maWd1cmVzIHRoZSBsb2dnZXJcclxuICpcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJPZiBsb2c0anNcclxuICpcclxuICogQHBhcmFtcyB7Q09ORklHX1BBUkFNU30gY29uZmlnXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gY29uZmlndXJlKGNvbmZpZykge1xyXG5cclxuXHRpZiAoX2ZpbmFsaXplZCkge1xyXG5cdFx0Y29uc29sZS5lcnJvcignQ291bGQgbm90IGNvbmZpZ3VyZSAtIGFscmVhZHkgaW4gdXNlJyk7XHJcblx0XHRyZXR1cm47XHJcblx0fVxyXG5cclxuXHRpZiAoIV9jb25maWd1cmF0aW9uKSB7XHJcbiAgICAgICAgX2NvbmZpZ3VyYXRpb24gPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBzZXQgdGhlIGRlZmF1bHQgbGF5b3V0XHJcbiAgICBpZiAoIWNvbmZpZy5sYXlvdXQgJiYgIV9jb25maWd1cmF0aW9uLmxheW91dCkge1xyXG4gICAgICAgIF9jb25maWd1cmF0aW9uLmxheW91dCA9IF9ERUZBVUxUX0NPTkZJRy5sYXlvdXQ7XHJcbiAgICB9IGVsc2UgaWYgKGNvbmZpZy5sYXlvdXQpIHtcclxuICAgICAgICBfY29uZmlndXJhdGlvbi5sYXlvdXQgPSBjb25maWcubGF5b3V0O1xyXG4gICAgfVxyXG5cclxuXHQvLyBjb25maWd1cmUgdGhlIGFwcGVuZGVyc1xyXG5cdF9jb25maWd1cmVBcHBlbmRlcnMoY29uZmlnLmFwcGVuZGVycyk7XHJcbiAgICAvLyBjb25maWd1cmUgdGhlIGxvZ2dlcnNcclxuICAgIF9jb25maWd1cmVMb2dnZXJzKGNvbmZpZy5sb2dnZXJzKTtcclxuXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDb25maWd1cmVzIGFwcGVuZGVyc1xyXG4gKlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAZnVuY3Rpb25cclxuICpcclxuICogQHBhcmFtIHtBcnJheS48TG9nQXBwZW5kZXJ8ZnVuY3Rpb24+fSBhcHBlbmRlcnNcclxuICovXHJcbmxldCBfY29uZmlndXJlQXBwZW5kZXJzID0gZnVuY3Rpb24gKGFwcGVuZGVycykge1xyXG5cclxuICAgIGlmICghKGFwcGVuZGVycyBpbnN0YW5jZW9mIEFycmF5KSkge1xyXG4gICAgICAgIGFwcGVuZGVycyA9IF9ERUZBVUxUX0FQUEVOREVSUztcclxuICAgIH1cclxuXHJcbiAgICBhcHBlbmRlcnMuZm9yRWFjaChhcHBlbmRlciA9PiB7XHJcbiAgICAgICAgaWYgKGFwcGVuZGVyIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcclxuICAgICAgICAgICAgYWRkQXBwZW5kZXIoYXBwZW5kZXIpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxufTtcclxuXHJcbi8qKlxyXG4gKiBDb25maWd1cmVzIHRoZSBsb2dnZXJzXHJcbiAqXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBmdW5jdGlvblxyXG4gKlxyXG4gKiBAcGFyYW0ge0FycmF5LjxPYmplY3Q+fSBsb2dnZXJzXHJcbiAqL1xyXG5sZXQgX2NvbmZpZ3VyZUxvZ2dlcnMgPSBmdW5jdGlvbiAobG9nZ2Vycykge1xyXG5cclxuXHRpZiAoIShsb2dnZXJzIGluc3RhbmNlb2YgQXJyYXkpKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgbG9nZ2VycycpO1xyXG5cdH1cclxuXHJcbiAgICBsb2dnZXJzLmZvckVhY2goZnVuY3Rpb24gKGxvZ2dlcikge1xyXG5cclxuICAgICAgICBpZiAoIWxvZ2dlci5sYXlvdXQgfHwgdHlwZW9mIGxvZ2dlci5sYXlvdXQgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIGxvZ2dlci5sYXlvdXQgPSBfY29uZmlndXJhdGlvbi5sYXlvdXQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsb2dnZXIudGFnID0gbG9nZ2VyLnRhZyB8fCBfTUFJTl9MT0dHRVI7XHJcbiAgICAgICAgbG9nZ2VyLmxvZ0xldmVsID0gbG9nZ2VyLmxvZ0xldmVsIHx8IExvZ0xldmVsLkVSUk9SO1xyXG5cclxuICAgICAgICBfbG9nZ2Vyc1tsb2dnZXIudGFnXSA9IF9nZXRBcHBlbmRlcnNGb3JMb2dnZXIobG9nZ2VyLmxvZ0xldmVsLCBsb2dnZXIubGF5b3V0KTtcclxuXHJcbiAgICB9KTtcclxuXHJcbn07XHJcblxyXG4vKipcclxuICogR2V0cyB0aGUgYXBwZW5kZXJzIGZvciB0aGUgbGV2ZWwgYW5kIGxheW91dFxyXG4gKlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAZnVuY3Rpb25cclxuICpcclxuICogQHBhcmFtIHtudW1iZXJ9IGxvZ0xldmVsXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBsYXlvdXRcclxuICpcclxuICogQHJldHVybnMge0FycmF5fVxyXG4gKi9cclxubGV0IF9nZXRBcHBlbmRlcnNGb3JMb2dnZXIgPSBmdW5jdGlvbiAobG9nTGV2ZWwsIGxheW91dCkge1xyXG5cclxuICAgIGxldCBsb2dnZXI7XHJcbiAgICBsZXQgYXBwZW5kZXJMaXN0ID0gW107XHJcblxyXG4gICAgT2JqZWN0LmtleXMoX2FwcGVuZGVycykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XHJcblxyXG4gICAgICAgIGxvZ2dlciA9IChfYXBwZW5kZXJzW2tleV0ucHJvdG90eXBlIGluc3RhbmNlb2YgTG9nQXBwZW5kZXIpID8gbmV3IF9hcHBlbmRlcnNba2V5XSgpIDogX2FwcGVuZGVyc1trZXldKCk7XHJcblxyXG4gICAgICAgIGxvZ2dlci5zZXRMb2dMZXZlbChsb2dMZXZlbCk7XHJcbiAgICAgICAgbG9nZ2VyLnNldExheW91dChsYXlvdXQpO1xyXG5cclxuICAgICAgICBhcHBlbmRlckxpc3QucHVzaChsb2dnZXIpO1xyXG5cclxuICAgIH0pO1xyXG5cclxuXHRyZXR1cm4gYXBwZW5kZXJMaXN0O1xyXG5cclxufTtcclxuXHJcbi8qKlxyXG4gKiBBZGRzIGFuIGFwcGVuZGVyIHRvIHRoZSBhcHBlbmRlciBxdWV1ZS4gSWYgdGhlIHN0YWNrIGlzIGZpbmFsaXplZCwgYW5kXHJcbiAqIHRoZSBhbGxvd0FwcGVuZGVySW5qZWN0aW9uIGlzIHNldCB0byBmYWxzZSwgdGhlbiB0aGUgZXZlbnQgd2lsbCBub3QgYmVcclxuICogYXBwZW5kZWRcclxuICpcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJPZiBsb2c0anNcclxuICpcclxuICogQHBhcmFtcyB7TG9nQXBwZW5kZXJ9IGFwcGVuZGVyXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gYWRkQXBwZW5kZXIoYXBwZW5kZXIpIHtcclxuXHJcblx0aWYgKF9maW5hbGl6ZWQgJiYgIV9jb25maWd1cmF0aW9uLmFsbG93QXBwZW5kZXJJbmplY3Rpb24pIHtcclxuXHRcdGNvbnNvbGUuZXJyb3IoJ0Nhbm5vdCBhZGQgYXBwZW5kZXIgd2hlbiBjb25maWd1cmF0aW9uIGZpbmFsaXplZCcpO1xyXG5cdFx0cmV0dXJuO1xyXG5cdH1cclxuXHJcbiAgICBfdmFsaWRhdGVBcHBlbmRlcihhcHBlbmRlcik7XHJcblxyXG4gICAgLy8gb25seSBwdXQgdGhlIGFwcGVuZGVyIGludG8gdGhlIHNldCBpZiBpdCBkb2Vzbid0IGV4aXN0IGFscmVhZHlcclxuICAgIGlmICghX2FwcGVuZGVyc1thcHBlbmRlci5uYW1lXSkge1xyXG4gICAgICAgIF9hcHBlbmRlcnNbYXBwZW5kZXIubmFtZV0gPSBhcHBlbmRlcjtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBWYWxpZGF0ZXMgdGhhdCB0aGUgYXBwZW5kZXJcclxuICpcclxuICogQHByaXZhdGVcclxuICogQGZ1bmN0aW9uXHJcbiAqXHJcbiAqIEBwYXJhbXMge0FQUEVOREVSfSBhcHBlbmRlclxyXG4gKiBAdGhyb3dzIHtFcnJvcn0gaWYgdGhlIGFwcGVuZGVyIGlzIGludmFsaWRcclxuICovXHJcbmxldCBfdmFsaWRhdGVBcHBlbmRlciA9IGZ1bmN0aW9uIChhcHBlbmRlcikge1xyXG5cclxuICAgIC8vIGlmIHdlIGFyZSBydW5uaW5nIEVTNiwgd2UgY2FuIG1ha2Ugc3VyZSBpdCBleHRlbmRzIExvZ0FwcGVuZGVyXHJcbiAgICAvLyBvdGhlcndpc2UsIGl0IG11c3QgYmUgYSBmdW5jdGlvblxyXG4gICAgaWYgKGFwcGVuZGVyLnByb3RvdHlwZSBpbnN0YW5jZW9mIExvZ0FwcGVuZGVyKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfSBlbHNlIGlmICghKGFwcGVuZGVyIGluc3RhbmNlb2YgRnVuY3Rpb24pKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgYXBwZW5kZXI6IG5vdCBhIGZ1bmN0aW9uIG9yIGNsYXNzIExvZ0FwcGVuZGVyJyk7XHJcblx0fVxyXG5cclxuXHQvLyBpbnN0YW50aWF0ZSB0aGUgYXBwZW5kZXIgZnVuY3Rpb25cclxuXHRsZXQgYXBwZW5kZXJPYmogPSBhcHBlbmRlcigpO1xyXG5cclxuICAgIC8vIGVuc3VyZSB0aGF0IHRoZSBhcHBlbmRlciBtZXRob2RzIGFyZSBwcmVzZW50IChhbmQgYXJlIGZ1bmN0aW9ucylcclxuICAgIF9BUFBFTkRFUl9NRVRIT0RTLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICBpZiAoYXBwZW5kZXJPYmpbZWxlbWVudF0gPT0gdW5kZWZpbmVkIHx8ICEoYXBwZW5kZXJPYmpbZWxlbWVudF0gaW5zdGFuY2VvZiBGdW5jdGlvbikpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGFwcGVuZGVyOiBtaXNzaW5nL2ludmFsaWQgbWV0aG9kOiAke2VsZW1lbnR9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEFwcGVuZHMgdGhlIGxvZyBldmVudFxyXG4gKlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAZnVuY3Rpb25cclxuICpcclxuICogQHBhcmFtIHtPYmplY3R9IGxvZ0V2ZW50XHJcbiAqL1xyXG5mdW5jdGlvbiBfYXBwZW5kKGxvZ0V2ZW50KSB7XHJcblxyXG5cdC8vIGZpbmFsaXplIHRoZSBjb25maWd1cmF0aW9uIHRvIG1ha2Ugc3VyZSBubyBvdGhlciBhcHBlbmRlciBjYW4gYmUgaW5qZWN0ZWQgKGlmIHNldClcclxuXHRfZmluYWxpemVkID0gdHJ1ZTtcclxuXHJcbiAgICAvLyBjeWNsZSB0aHJvdWdoIGVhY2ggYXBwZW5kZXIgZm9yIHRoZSBsb2dnZXIgYW5kIGFwcGVuZCB0aGUgbG9nZ2luZyBldmVudFxyXG4gICAgKF9sb2dnZXJzW2xvZ0V2ZW50LmxvZ2dlcl0gfHwgX2xvZ2dlcnNbX01BSU5fTE9HR0VSXSkuZm9yRWFjaChmdW5jdGlvbiAobG9nZ2VyKSB7XHJcbiAgICAgICAgaWYgKGxvZ2dlci5pc0FjdGl2ZShsb2dFdmVudC5sZXZlbCkpIHtcclxuICAgICAgICAgICAgbG9nZ2VyLmFwcGVuZChsb2dFdmVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG59XHJcblxyXG4vKipcclxuICogSGFuZGxlcyBjcmVhdGluZyB0aGUgbG9nZ2VyIGFuZCByZXR1cm5pbmcgaXRcclxuICpcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJPZiBsb2c0anNcclxuICpcclxuICogQHBhcmFtIHtmdW5jdGlvbnxzdHJpbmc9fSBjb250ZXh0XHJcbiAqXHJcbiAqIEByZXR1cm4ge0xvZ2dlcn1cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRMb2dnZXIoY29udGV4dCkge1xyXG5cclxuXHQvLyB3ZSBuZWVkIHRvIGluaXRpYWxpemUgaWYgd2UgaGF2ZW4ndFxyXG5cdGlmICghX2NvbmZpZ3VyYXRpb24pIHtcclxuXHRcdGNvbmZpZ3VyZShfREVGQVVMVF9DT05GSUcpO1xyXG5cdH1cclxuXHJcbiAgICAvLyBkZXRlcm1pbmUgdGhlIGNvbnRleHRcclxuICAgIGlmICh0eXBlb2YgY29udGV4dCAhPSAnc3RyaW5nJykge1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mIGNvbnRleHQgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICBjb250ZXh0ID0gdXRpbGl0eS5nZXRGdW5jdGlvbk5hbWUoY29udGV4dCk7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgY29udGV4dCA9PSAnb2JqZWN0Jykge1xyXG5cclxuICAgICAgICAgICAgY29udGV4dCA9IHV0aWxpdHkuZ2V0RnVuY3Rpb25OYW1lKGNvbnRleHQuY29uc3RydWN0b3IpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGNvbnRleHQgPT0gJ09iamVjdCcpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQgPSAnYW5vbnltb3VzJztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb250ZXh0ID0gX01BSU5fTE9HR0VSO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG5cdHJldHVybiBuZXcgTG9nZ2VyKGNvbnRleHQsIHtcclxuXHRcdCdhcHBlbmQnIDogX2FwcGVuZFxyXG5cdH0pO1xyXG5cclxufVxyXG5cclxuXHJcblxyXG4vKipcclxuICogU2V0cyB0aGUgbG9nIGxldmVsIGZvciBhbGwgYXBwZW5kZXJzIG9mIGEgbG9nZ2VyLCBvciBzcGVjaWZpZWQgbG9nZ2VyXHJcbiAqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyT2YgbG9nNGpzXHJcbiAqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBsb2dMZXZlbFxyXG4gKiBAcGFyYW0ge3N0cmluZz19IGxvZ2dlclxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHNldExvZ0xldmVsKGxvZ0xldmVsLCBsb2dnZXIpIHtcclxuXHJcbiAgICBpZiAobG9nTGV2ZWwgaW5zdGFuY2VvZiBOdW1iZXIpIHtcclxuXHJcbiAgICAgICAgaWYgKGxvZ2dlcikge1xyXG4gICAgICAgICAgICBpZiAoX2xvZ2dlcnNbbG9nZ2VyXSkge1xyXG4gICAgICAgICAgICAgICAgX2xvZ2dlcnNbbG9nZ2VyXS5zZXRMb2dMZXZlbChsb2dMZXZlbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gX2xvZ2dlcnMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChfbG9nZ2Vycy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX2xvZ2dlcnNba2V5XS5mb3JFYWNoKGZ1bmN0aW9uIChhcHBlbmRlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcHBlbmRlci5zZXRMb2dMZXZlbChsb2dMZXZlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxufVxyXG5cclxuYWRkQXBwZW5kZXIoQ29uc29sZUFwcGVuZGVyKTtcclxuXHJcbmV4cG9ydCB7IExvZ0xldmVsIH07XHJcbmV4cG9ydCB7IExvZ0FwcGVuZGVyIH07XHJcbiJdfQ==