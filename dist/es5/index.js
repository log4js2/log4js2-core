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
 * The default appenders that should be included if no appenders are specified
 * @const
 */
var _DEFAULT_APPENDERS = [{
    'appender': /*istanbul ignore next*/_consoleAppender.ConsoleAppender,
    'level': /*istanbul ignore next*/_logLevel.LogLevel.INFO
}];

/**
 * The default configuration for log4js2. If no configuration is specified, then this
 * configuration will be injected
 * @const
 */
var _DEFAULT_CONFIG = {
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
var _configureAppenders = function _configureAppenders(appenders) {

    if (!(appenders instanceof Array)) {
        appenders = _DEFAULT_APPENDERS;
    }

    appenders.forEach(function (appender) {
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
        } else if ( /*istanbul ignore next*/(typeof context === 'undefined' ? 'undefined' : _typeof(context)) == 'object') {

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
//# sourceMappingURL=data:application/json;base64,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QVcsT0FBWCxFQUFvQjtBQUMxQixrQkFBVyxPQUFYO0tBRE0sQ0FBUCxDQTFCa0M7Q0FBNUI7Ozs7Ozs7Ozs7O0FBMkNBLFNBQVMsV0FBVCxDQUFxQixRQUFyQixFQUErQixNQUEvQixFQUF1Qzs7QUFFMUMsUUFBSSxvQkFBb0IsTUFBcEIsRUFBNEI7O0FBRTVCLFlBQUksTUFBSixFQUFZO0FBQ1IsZ0JBQUksU0FBUyxNQUFULENBQUosRUFBc0I7QUFDbEIseUJBQVMsTUFBVCxFQUFpQixXQUFqQixDQUE2QixRQUE3QixFQURrQjthQUF0QjtTQURKLE1BSU87QUFDSCxpQkFBSyxJQUFJLEdBQUosSUFBVyxRQUFoQixFQUEwQjtBQUN0QixvQkFBSSxTQUFTLGNBQVQsQ0FBd0IsR0FBeEIsQ0FBSixFQUFrQztBQUM5Qiw2QkFBUyxHQUFULEVBQWMsT0FBZCxDQUFzQixVQUFVLFFBQVYsRUFBb0I7QUFDdEMsaUNBQVMsV0FBVCxDQUFxQixRQUFyQixFQURzQztxQkFBcEIsQ0FBdEIsQ0FEOEI7aUJBQWxDO2FBREo7U0FMSjtLQUZKO0NBRkc7O0FBc0JQOztnQ0FFUztnQ0FDQSIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBsb2c0anMgPGh0dHBzOi8vZ2l0aHViLmNvbS9hbmlnZW5lcm8vbG9nNGpzPlxyXG4gKlxyXG4gKiBDb3B5cmlnaHQgMjAxNiBSb2JpbiBTY2h1bHR6IDxodHRwOi8vYW5pZ2VuZXJvLmNvbT5cclxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEhvbGRzIHRoZSBkZWZpbml0aW9uIGZvciB0aGUgYXBwZW5kZXIgY2xvc3VyZVxyXG4gKlxyXG4gKiBAdHlwZWRlZiB7eyBhcHBlbmQgOiBmdW5jdGlvbiAobnVtYmVyLCBMT0dfRVZFTlQpLCBpc0FjdGl2ZSA6IGZ1bmN0aW9uKCksXHJcbiAqICAgICAgICAgIHNldExvZ0xldmVsIDogZnVuY3Rpb24obnVtYmVyKSwgc2V0TGF5b3V0IDogZnVuY3Rpb24oc3RyaW5nKSB9fVxyXG4gKi9cclxubGV0IEFQUEVOREVSO1xyXG5cclxuLyoqXHJcbiAqIEB0eXBlZGVmIHt7IGFsbG93QXBwZW5kZXJJbmplY3Rpb24gOiBib29sZWFuLCBhcHBlbmRlcnMgOiBBcnJheS48QVBQRU5ERVI+LFxyXG4gKiBcdFx0XHRhcHBsaWNhdGlvbiA6IE9iamVjdCwgbG9nZ2VycyA6IEFycmF5LjxMb2dBcHBlbmRlcj4sIGxheW91dCA6IHN0cmluZyB9fVxyXG4gKi9cclxubGV0IENPTkZJR19QQVJBTVM7XHJcblxyXG5pbXBvcnQgKiBhcyBmb3JtYXR0ZXIgZnJvbSAnLi9mb3JtYXR0ZXInO1xyXG5pbXBvcnQgKiBhcyB1dGlsaXR5IGZyb20gJy4vdXRpbGl0eSc7XHJcbmltcG9ydCB7TG9nQXBwZW5kZXJ9IGZyb20gJy4vYXBwZW5kZXIvYXBwZW5kZXInO1xyXG5pbXBvcnQge0xvZ2dlcn0gZnJvbSAnLi9sb2dnZXIvbG9nZ2VyJztcclxuaW1wb3J0IHtMb2dMZXZlbH0gZnJvbSAnLi9jb25zdC9sb2dMZXZlbCc7XHJcbmltcG9ydCB7Q29uc29sZUFwcGVuZGVyfSBmcm9tICcuL2FwcGVuZGVyL2NvbnNvbGVBcHBlbmRlcic7XHJcblxyXG4vKipcclxuICogVGhlIG5hbWUgb2YgdGhlIG1haW4gbG9nZ2VyLiBXZSB1c2UgdGhpcyBpbiBjYXNlIG5vIGxvZ2dlciBpcyBzcGVjaWZpZWRcclxuICogQGNvbnN0XHJcbiAqL1xyXG5jb25zdCBfTUFJTl9MT0dHRVIgPSAnbWFpbic7XHJcblxyXG4vKipcclxuICogVGhlIGRlZmF1bHQgYXBwZW5kZXJzIHRoYXQgc2hvdWxkIGJlIGluY2x1ZGVkIGlmIG5vIGFwcGVuZGVycyBhcmUgc3BlY2lmaWVkXHJcbiAqIEBjb25zdFxyXG4gKi9cclxuY29uc3QgX0RFRkFVTFRfQVBQRU5ERVJTID0gW3tcclxuICAgICdhcHBlbmRlcicgOiBDb25zb2xlQXBwZW5kZXIsXHJcbiAgICAnbGV2ZWwnIDogTG9nTGV2ZWwuSU5GT1xyXG59XTtcclxuXHJcbi8qKlxyXG4gKiBUaGUgZGVmYXVsdCBjb25maWd1cmF0aW9uIGZvciBsb2c0anMyLiBJZiBubyBjb25maWd1cmF0aW9uIGlzIHNwZWNpZmllZCwgdGhlbiB0aGlzXHJcbiAqIGNvbmZpZ3VyYXRpb24gd2lsbCBiZSBpbmplY3RlZFxyXG4gKiBAY29uc3RcclxuICovXHJcbmNvbnN0IF9ERUZBVUxUX0NPTkZJRyA9IHtcclxuICAgICdhbGxvd0FwcGVuZGVySW5qZWN0aW9uJyA6IHRydWUsXHJcbiAgICAnYXBwZW5kZXJzJyA6IF9ERUZBVUxUX0FQUEVOREVSUyxcclxuICAgICdsb2dnZXJzJyA6IFt7XHJcbiAgICAgICAgJ2xldmVsJyA6IExvZ0xldmVsLklORk9cclxuICAgIH1dLFxyXG4gICAgJ2xheW91dCcgOiAnJWQgWyVwXSAlYyAtICVtJ1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFRoZSBtZXRob2RzIHRoYXQgYW4gYXBwZW5kZXIgbXVzdCBjb250YWluXHJcbiAqIEBjb25zdFxyXG4gKi9cclxuY29uc3QgX0FQUEVOREVSX01FVEhPRFMgPSBbJ2FwcGVuZCcsICdnZXROYW1lJywgJ2lzQWN0aXZlJywgJ3NldExvZ0xldmVsJywgJ3NldExheW91dCddO1xyXG5cclxuLyoqIEB0eXBlIHtPYmplY3R9ICovXHJcbmxldCBfYXBwZW5kZXJzID0ge307XHJcbi8qKiBAdHlwZSB7P0NPTkZJR19QQVJBTVN9ICovXHJcbmxldCBfY29uZmlndXJhdGlvbiA9IG51bGw7XHJcbi8qKiBAdHlwZSB7Ym9vbGVhbn0gKi9cclxubGV0IF9maW5hbGl6ZWQgPSBmYWxzZTtcclxuLyoqIEB0eXBlIHtPYmplY3R9ICovXHJcbmxldCBfbG9nZ2VycyA9IHt9O1xyXG5cclxuLyoqXHJcbiAqIENvbmZpZ3VyZXMgdGhlIGxvZ2dlclxyXG4gKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGxvZzRqc1xyXG4gKlxyXG4gKiBAcGFyYW1zIHtDT05GSUdfUEFSQU1TfSBjb25maWdcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBjb25maWd1cmUoY29uZmlnKSB7XHJcblxyXG5cdGlmIChfZmluYWxpemVkKSB7XHJcblx0XHRjb25zb2xlLmVycm9yKCdDb3VsZCBub3QgY29uZmlndXJlIC0gYWxyZWFkeSBpbiB1c2UnKTtcclxuXHRcdHJldHVybjtcclxuXHR9XHJcblxyXG5cdGlmICghX2NvbmZpZ3VyYXRpb24pIHtcclxuICAgICAgICBfY29uZmlndXJhdGlvbiA9IHt9O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHNldCB0aGUgZGVmYXVsdCBsYXlvdXRcclxuICAgIGlmICghY29uZmlnLmxheW91dCAmJiAhX2NvbmZpZ3VyYXRpb24ubGF5b3V0KSB7XHJcbiAgICAgICAgX2NvbmZpZ3VyYXRpb24ubGF5b3V0ID0gX0RFRkFVTFRfQ09ORklHLmxheW91dDtcclxuICAgIH0gZWxzZSBpZiAoY29uZmlnLmxheW91dCkge1xyXG4gICAgICAgIF9jb25maWd1cmF0aW9uLmxheW91dCA9IGNvbmZpZy5sYXlvdXQ7XHJcbiAgICB9XHJcblxyXG5cdC8vIGNvbmZpZ3VyZSB0aGUgYXBwZW5kZXJzXHJcblx0X2NvbmZpZ3VyZUFwcGVuZGVycyhjb25maWcuYXBwZW5kZXJzKTtcclxuICAgIC8vIGNvbmZpZ3VyZSB0aGUgbG9nZ2Vyc1xyXG4gICAgX2NvbmZpZ3VyZUxvZ2dlcnMoY29uZmlnLmxvZ2dlcnMpO1xyXG5cclxufVxyXG5cclxuLyoqXHJcbiAqIENvbmZpZ3VyZXMgYXBwZW5kZXJzXHJcbiAqXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBmdW5jdGlvblxyXG4gKlxyXG4gKiBAcGFyYW0ge0FycmF5LjxMb2dBcHBlbmRlcnxmdW5jdGlvbj59IGFwcGVuZGVyc1xyXG4gKi9cclxubGV0IF9jb25maWd1cmVBcHBlbmRlcnMgPSBmdW5jdGlvbiAoYXBwZW5kZXJzKSB7XHJcblxyXG4gICAgaWYgKCEoYXBwZW5kZXJzIGluc3RhbmNlb2YgQXJyYXkpKSB7XHJcbiAgICAgICAgYXBwZW5kZXJzID0gX0RFRkFVTFRfQVBQRU5ERVJTO1xyXG4gICAgfVxyXG5cclxuICAgIGFwcGVuZGVycy5mb3JFYWNoKGFwcGVuZGVyID0+IHtcclxuICAgICAgICBpZiAoYXBwZW5kZXIgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xyXG4gICAgICAgICAgICBhZGRBcHBlbmRlcihhcHBlbmRlcik7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG59O1xyXG5cclxuLyoqXHJcbiAqIENvbmZpZ3VyZXMgdGhlIGxvZ2dlcnNcclxuICpcclxuICogQHByaXZhdGVcclxuICogQGZ1bmN0aW9uXHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXkuPE9iamVjdD59IGxvZ2dlcnNcclxuICovXHJcbmxldCBfY29uZmlndXJlTG9nZ2VycyA9IGZ1bmN0aW9uIChsb2dnZXJzKSB7XHJcblxyXG5cdGlmICghKGxvZ2dlcnMgaW5zdGFuY2VvZiBBcnJheSkpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcignSW52YWxpZCBsb2dnZXJzJyk7XHJcblx0fVxyXG5cclxuICAgIGxvZ2dlcnMuZm9yRWFjaChmdW5jdGlvbiAobG9nZ2VyKSB7XHJcblxyXG4gICAgICAgIGlmICghbG9nZ2VyLmxheW91dCB8fCB0eXBlb2YgbG9nZ2VyLmxheW91dCAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgbG9nZ2VyLmxheW91dCA9IF9jb25maWd1cmF0aW9uLmxheW91dDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxvZ2dlci50YWcgPSBsb2dnZXIudGFnIHx8IF9NQUlOX0xPR0dFUjtcclxuICAgICAgICBsb2dnZXIubG9nTGV2ZWwgPSBsb2dnZXIubG9nTGV2ZWwgfHwgTG9nTGV2ZWwuRVJST1I7XHJcblxyXG4gICAgICAgIF9sb2dnZXJzW2xvZ2dlci50YWddID0gX2dldEFwcGVuZGVyc0ZvckxvZ2dlcihsb2dnZXIubG9nTGV2ZWwsIGxvZ2dlci5sYXlvdXQpO1xyXG5cclxuICAgIH0pO1xyXG5cclxufTtcclxuXHJcbi8qKlxyXG4gKiBHZXRzIHRoZSBhcHBlbmRlcnMgZm9yIHRoZSBsZXZlbCBhbmQgbGF5b3V0XHJcbiAqXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBmdW5jdGlvblxyXG4gKlxyXG4gKiBAcGFyYW0ge251bWJlcn0gbG9nTGV2ZWxcclxuICogQHBhcmFtIHtzdHJpbmd9IGxheW91dFxyXG4gKlxyXG4gKiBAcmV0dXJucyB7QXJyYXl9XHJcbiAqL1xyXG5sZXQgX2dldEFwcGVuZGVyc0ZvckxvZ2dlciA9IGZ1bmN0aW9uIChsb2dMZXZlbCwgbGF5b3V0KSB7XHJcblxyXG4gICAgbGV0IGxvZ2dlcjtcclxuICAgIGxldCBhcHBlbmRlckxpc3QgPSBbXTtcclxuXHJcbiAgICBPYmplY3Qua2V5cyhfYXBwZW5kZXJzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcclxuXHJcbiAgICAgICAgbG9nZ2VyID0gKF9hcHBlbmRlcnNba2V5XS5wcm90b3R5cGUgaW5zdGFuY2VvZiBMb2dBcHBlbmRlcikgPyBuZXcgX2FwcGVuZGVyc1trZXldKCkgOiBfYXBwZW5kZXJzW2tleV0oKTtcclxuXHJcbiAgICAgICAgbG9nZ2VyLnNldExvZ0xldmVsKGxvZ0xldmVsKTtcclxuICAgICAgICBsb2dnZXIuc2V0TGF5b3V0KGxheW91dCk7XHJcblxyXG4gICAgICAgIGFwcGVuZGVyTGlzdC5wdXNoKGxvZ2dlcik7XHJcblxyXG4gICAgfSk7XHJcblxyXG5cdHJldHVybiBhcHBlbmRlckxpc3Q7XHJcblxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEFkZHMgYW4gYXBwZW5kZXIgdG8gdGhlIGFwcGVuZGVyIHF1ZXVlLiBJZiB0aGUgc3RhY2sgaXMgZmluYWxpemVkLCBhbmRcclxuICogdGhlIGFsbG93QXBwZW5kZXJJbmplY3Rpb24gaXMgc2V0IHRvIGZhbHNlLCB0aGVuIHRoZSBldmVudCB3aWxsIG5vdCBiZVxyXG4gKiBhcHBlbmRlZFxyXG4gKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGxvZzRqc1xyXG4gKlxyXG4gKiBAcGFyYW1zIHtMb2dBcHBlbmRlcn0gYXBwZW5kZXJcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBhZGRBcHBlbmRlcihhcHBlbmRlcikge1xyXG5cclxuXHRpZiAoX2ZpbmFsaXplZCAmJiAhX2NvbmZpZ3VyYXRpb24uYWxsb3dBcHBlbmRlckluamVjdGlvbikge1xyXG5cdFx0Y29uc29sZS5lcnJvcignQ2Fubm90IGFkZCBhcHBlbmRlciB3aGVuIGNvbmZpZ3VyYXRpb24gZmluYWxpemVkJyk7XHJcblx0XHRyZXR1cm47XHJcblx0fVxyXG5cclxuICAgIF92YWxpZGF0ZUFwcGVuZGVyKGFwcGVuZGVyKTtcclxuXHJcbiAgICAvLyBvbmx5IHB1dCB0aGUgYXBwZW5kZXIgaW50byB0aGUgc2V0IGlmIGl0IGRvZXNuJ3QgZXhpc3QgYWxyZWFkeVxyXG4gICAgaWYgKCFfYXBwZW5kZXJzW2FwcGVuZGVyLm5hbWVdKSB7XHJcbiAgICAgICAgX2FwcGVuZGVyc1thcHBlbmRlci5uYW1lXSA9IGFwcGVuZGVyO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuLyoqXHJcbiAqIFZhbGlkYXRlcyB0aGF0IHRoZSBhcHBlbmRlclxyXG4gKlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAZnVuY3Rpb25cclxuICpcclxuICogQHBhcmFtcyB7QVBQRU5ERVJ9IGFwcGVuZGVyXHJcbiAqIEB0aHJvd3Mge0Vycm9yfSBpZiB0aGUgYXBwZW5kZXIgaXMgaW52YWxpZFxyXG4gKi9cclxubGV0IF92YWxpZGF0ZUFwcGVuZGVyID0gZnVuY3Rpb24gKGFwcGVuZGVyKSB7XHJcblxyXG4gICAgLy8gaWYgd2UgYXJlIHJ1bm5pbmcgRVM2LCB3ZSBjYW4gbWFrZSBzdXJlIGl0IGV4dGVuZHMgTG9nQXBwZW5kZXJcclxuICAgIC8vIG90aGVyd2lzZSwgaXQgbXVzdCBiZSBhIGZ1bmN0aW9uXHJcbiAgICBpZiAoYXBwZW5kZXIucHJvdG90eXBlIGluc3RhbmNlb2YgTG9nQXBwZW5kZXIpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9IGVsc2UgaWYgKCEoYXBwZW5kZXIgaW5zdGFuY2VvZiBGdW5jdGlvbikpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcignSW52YWxpZCBhcHBlbmRlcjogbm90IGEgZnVuY3Rpb24gb3IgY2xhc3MgTG9nQXBwZW5kZXInKTtcclxuXHR9XHJcblxyXG5cdC8vIGluc3RhbnRpYXRlIHRoZSBhcHBlbmRlciBmdW5jdGlvblxyXG5cdGxldCBhcHBlbmRlck9iaiA9IGFwcGVuZGVyKCk7XHJcblxyXG4gICAgLy8gZW5zdXJlIHRoYXQgdGhlIGFwcGVuZGVyIG1ldGhvZHMgYXJlIHByZXNlbnQgKGFuZCBhcmUgZnVuY3Rpb25zKVxyXG4gICAgX0FQUEVOREVSX01FVEhPRFMuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgIGlmIChhcHBlbmRlck9ialtlbGVtZW50XSA9PSB1bmRlZmluZWQgfHwgIShhcHBlbmRlck9ialtlbGVtZW50XSBpbnN0YW5jZW9mIEZ1bmN0aW9uKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgYXBwZW5kZXI6IG1pc3NpbmcvaW52YWxpZCBtZXRob2Q6ICR7ZWxlbWVudH1gKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbn07XHJcblxyXG4vKipcclxuICogQXBwZW5kcyB0aGUgbG9nIGV2ZW50XHJcbiAqXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBmdW5jdGlvblxyXG4gKlxyXG4gKiBAcGFyYW0ge09iamVjdH0gbG9nRXZlbnRcclxuICovXHJcbmZ1bmN0aW9uIF9hcHBlbmQobG9nRXZlbnQpIHtcclxuXHJcblx0Ly8gZmluYWxpemUgdGhlIGNvbmZpZ3VyYXRpb24gdG8gbWFrZSBzdXJlIG5vIG90aGVyIGFwcGVuZGVyIGNhbiBiZSBpbmplY3RlZCAoaWYgc2V0KVxyXG5cdF9maW5hbGl6ZWQgPSB0cnVlO1xyXG5cclxuICAgIC8vIGN5Y2xlIHRocm91Z2ggZWFjaCBhcHBlbmRlciBmb3IgdGhlIGxvZ2dlciBhbmQgYXBwZW5kIHRoZSBsb2dnaW5nIGV2ZW50XHJcbiAgICAoX2xvZ2dlcnNbbG9nRXZlbnQubG9nZ2VyXSB8fCBfbG9nZ2Vyc1tfTUFJTl9MT0dHRVJdKS5mb3JFYWNoKGZ1bmN0aW9uIChsb2dnZXIpIHtcclxuICAgICAgICBpZiAobG9nZ2VyLmlzQWN0aXZlKGxvZ0V2ZW50LmxldmVsKSkge1xyXG4gICAgICAgICAgICBsb2dnZXIuYXBwZW5kKGxvZ0V2ZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBIYW5kbGVzIGNyZWF0aW5nIHRoZSBsb2dnZXIgYW5kIHJldHVybmluZyBpdFxyXG4gKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGxvZzRqc1xyXG4gKlxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufHN0cmluZz19IGNvbnRleHRcclxuICpcclxuICogQHJldHVybiB7TG9nZ2VyfVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGdldExvZ2dlcihjb250ZXh0KSB7XHJcblxyXG5cdC8vIHdlIG5lZWQgdG8gaW5pdGlhbGl6ZSBpZiB3ZSBoYXZlbid0XHJcblx0aWYgKCFfY29uZmlndXJhdGlvbikge1xyXG5cdFx0Y29uZmlndXJlKF9ERUZBVUxUX0NPTkZJRyk7XHJcblx0fVxyXG5cclxuICAgIC8vIGRldGVybWluZSB0aGUgY29udGV4dFxyXG4gICAgaWYgKHR5cGVvZiBjb250ZXh0ICE9ICdzdHJpbmcnKSB7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgY29udGV4dCA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIGNvbnRleHQgPSB1dGlsaXR5LmdldEZ1bmN0aW9uTmFtZShjb250ZXh0KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBjb250ZXh0ID09ICdvYmplY3QnKSB7XHJcblxyXG4gICAgICAgICAgICBjb250ZXh0ID0gdXRpbGl0eS5nZXRGdW5jdGlvbk5hbWUoY29udGV4dC5jb25zdHJ1Y3Rvcik7XHJcblxyXG4gICAgICAgICAgICBpZiAoY29udGV4dCA9PSAnT2JqZWN0Jykge1xyXG4gICAgICAgICAgICAgICAgY29udGV4dCA9ICdhbm9ueW1vdXMnO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnRleHQgPSBfTUFJTl9MT0dHRVI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcblx0cmV0dXJuIG5ldyBMb2dnZXIoY29udGV4dCwge1xyXG5cdFx0J2FwcGVuZCcgOiBfYXBwZW5kXHJcblx0fSk7XHJcblxyXG59XHJcblxyXG5cclxuXHJcbi8qKlxyXG4gKiBTZXRzIHRoZSBsb2cgbGV2ZWwgZm9yIGFsbCBhcHBlbmRlcnMgb2YgYSBsb2dnZXIsIG9yIHNwZWNpZmllZCBsb2dnZXJcclxuICpcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJPZiBsb2c0anNcclxuICpcclxuICogQHBhcmFtIHtudW1iZXJ9IGxvZ0xldmVsXHJcbiAqIEBwYXJhbSB7c3RyaW5nPX0gbG9nZ2VyXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gc2V0TG9nTGV2ZWwobG9nTGV2ZWwsIGxvZ2dlcikge1xyXG5cclxuICAgIGlmIChsb2dMZXZlbCBpbnN0YW5jZW9mIE51bWJlcikge1xyXG5cclxuICAgICAgICBpZiAobG9nZ2VyKSB7XHJcbiAgICAgICAgICAgIGlmIChfbG9nZ2Vyc1tsb2dnZXJdKSB7XHJcbiAgICAgICAgICAgICAgICBfbG9nZ2Vyc1tsb2dnZXJdLnNldExvZ0xldmVsKGxvZ0xldmVsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiBfbG9nZ2Vycykge1xyXG4gICAgICAgICAgICAgICAgaWYgKF9sb2dnZXJzLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBfbG9nZ2Vyc1trZXldLmZvckVhY2goZnVuY3Rpb24gKGFwcGVuZGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcGVuZGVyLnNldExvZ0xldmVsKGxvZ0xldmVsKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5hZGRBcHBlbmRlcihDb25zb2xlQXBwZW5kZXIpO1xyXG5cclxuZXhwb3J0IHsgTG9nTGV2ZWwgfTtcclxuZXhwb3J0IHsgTG9nQXBwZW5kZXIgfTtcclxuIl19