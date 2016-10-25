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
    'layout': '%d{yyyy-MM-dd HH:mm:ss.SSS} [%level] %logger - %message'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7UUEyRWdCO2dDQXNJQTtnQ0ErRUE7Z0NBMkNBOztBQXRUaEI7OztJQUFZOztBQUNaOzs7SUFBWTs7QUFDWjs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBYkEsSUFBSSx5Q0FBSjs7Ozs7O0FBTUEsSUFBSSw4Q0FBSjs7Ozs7O0FBYUEsSUFBTSxlQUFlLE1BQWY7Ozs7Ozs7QUFPTixJQUFNLGtCQUFrQjtBQUNwQiw4QkFBMkIsSUFBM0I7QUFDQSxpQkFBYyxDQUFDO0FBQ1gsNEVBRFc7QUFFWCxpQkFBVSwyQ0FBUyxJQUFUO0tBRkEsQ0FBZDtBQUlBLGVBQVksQ0FBQztBQUNULG9CQUFhLFNBQWI7QUFDQSxpQkFBVSwyQ0FBUyxJQUFUO0tBRkYsQ0FBWjtBQUlBLGNBQVcseURBQVg7Q0FWRTs7Ozs7O0FBaUJOLElBQU0sb0JBQW9CLENBQUMsUUFBRCxFQUFXLFNBQVgsRUFBc0IsVUFBdEIsRUFBa0MsYUFBbEMsRUFBaUQsV0FBakQsQ0FBcEI7OztBQUdOLElBQUksYUFBYSxFQUFiOztBQUVKLElBQUksaUJBQWlCLElBQWpCOztBQUVKLElBQUksYUFBYSxLQUFiOztBQUVKLElBQUksV0FBVyxFQUFYOzs7Ozs7Ozs7O0FBVUcsU0FBUyxTQUFULENBQW1CLE1BQW5CLEVBQTJCOztBQUVqQyxRQUFJLFVBQUosRUFBZ0I7QUFDZixnQkFBUSxLQUFSLENBQWMsZ0RBQWQsRUFEZTtBQUVmLGVBRmU7S0FBaEI7O0FBS0EsUUFBSSxDQUFDLGNBQUQsRUFBaUI7QUFDZCx5QkFBaUIsRUFBakIsQ0FEYztLQUFyQjs7QUFJRyxRQUFJLENBQUMsT0FBTyxNQUFQLElBQWlCLENBQUMsZUFBZSxNQUFmLEVBQXVCO0FBQzFDLHVCQUFlLE1BQWYsR0FBd0IsZ0JBQWdCLE1BQWhCLENBRGtCO0tBQTlDLE1BRU8sSUFBSSxPQUFPLE1BQVAsRUFBZTtBQUN0Qix1QkFBZSxNQUFmLEdBQXdCLE9BQU8sTUFBUCxDQURGO0tBQW5COzs7QUFidUIsdUJBa0JqQyxDQUFvQixPQUFPLFNBQVAsQ0FBcEI7O0FBbEJpQyxxQkFvQjlCLENBQWtCLE9BQU8sT0FBUCxDQUFsQixDQXBCOEI7O0FBc0I5QixRQUFJLE9BQU8sTUFBUCxFQUFlOztBQUVmLGtCQUFVLFVBQVYsQ0FBcUIsT0FBTyxNQUFQLENBQXJCLENBRmU7O0FBSWYsYUFBSyxJQUFJLEdBQUosSUFBVyxRQUFoQixFQUEwQjtBQUN0QixnQkFBSSxTQUFTLGNBQVQsQ0FBd0IsR0FBeEIsQ0FBSixFQUFrQztBQUM5Qix5QkFBUyxHQUFULEVBQWMsT0FBZCxDQUFzQixVQUFVLFFBQVYsRUFBb0I7QUFDdEMsNkJBQVMsU0FBVCxDQUFtQixPQUFPLE1BQVAsQ0FBbkIsQ0FEc0M7aUJBQXBCLENBQXRCLENBRDhCO2FBQWxDO1NBREo7S0FKSjs7QUFjQSxxQkFBaUIsTUFBakIsQ0FwQzhCO0NBQTNCOzs7Ozs7Ozs7O0FBZ0RQLElBQUksc0JBQXNCLFNBQXRCLG1CQUFzQixDQUFVLFNBQVYsRUFBcUI7O0FBRTNDLFFBQUkscUJBQXFCLEtBQXJCLEVBQTRCOztBQUU1QixrQkFBVSxPQUFWLENBQWtCLG9CQUFZO0FBQzFCLGdCQUFJLG9CQUFvQixRQUFwQixFQUE4QjtBQUM5Qiw0QkFBWSxRQUFaLEVBRDhCO2FBQWxDO1NBRGMsQ0FBbEIsQ0FGNEI7S0FBaEMsTUFRTztBQUNILGdCQUFRLEtBQVIsQ0FBYyxnQ0FBZCxFQURHO0tBUlA7Q0FGc0I7Ozs7Ozs7Ozs7QUF3QjFCLElBQUksb0JBQW9CLFNBQXBCLGlCQUFvQixDQUFVLE9BQVYsRUFBbUI7O0FBRTFDLFFBQUksRUFBRSxtQkFBbUIsS0FBbkIsQ0FBRixFQUE2QjtBQUNoQyxjQUFNLElBQUksS0FBSixDQUFVLGlCQUFWLENBQU4sQ0FEZ0M7S0FBakM7O0FBSUcsWUFBUSxPQUFSLENBQWdCLFVBQVUsTUFBVixFQUFrQjs7QUFFOUIsWUFBSSxDQUFDLE9BQU8sTUFBUCxJQUFpQixPQUFPLE9BQU8sTUFBUCxLQUFrQixRQUF6QixFQUFtQztBQUNyRCxtQkFBTyxNQUFQLEdBQWdCLGVBQWUsTUFBZixDQURxQztTQUF6RDs7QUFJQSxlQUFPLEdBQVAsR0FBYSxPQUFPLEdBQVAsSUFBYyxZQUFkLENBTmlCO0FBTzlCLGVBQU8sUUFBUCxHQUFrQixPQUFPLFFBQVAsSUFBbUIsMkNBQVMsS0FBVCxDQVBQOztBQVM5QixpQkFBUyxPQUFPLEdBQVAsQ0FBVCxHQUF1Qix1QkFBdUIsT0FBTyxRQUFQLEVBQWlCLE9BQU8sTUFBUCxDQUEvRCxDQVQ4QjtLQUFsQixDQUFoQixDQU51QztDQUFuQjs7Ozs7Ozs7Ozs7OztBQWdDeEIsSUFBSSx5QkFBeUIsU0FBekIsc0JBQXlCLENBQVUsUUFBVixFQUFvQixNQUFwQixFQUE0Qjs7QUFFckQsUUFBSSx1Q0FBSixDQUZxRDtBQUdyRCxRQUFJLGVBQWUsRUFBZixDQUhpRDs7QUFLckQsV0FBTyxJQUFQLENBQVksVUFBWixFQUF3QixPQUF4QixDQUFnQyxVQUFVLEdBQVYsRUFBZTs7QUFFM0MsaUJBQVMsVUFBQyxDQUFXLEdBQVgsRUFBZ0IsU0FBaEIseURBQUQsR0FBcUQsSUFBSSxXQUFXLEdBQVgsQ0FBSixFQUFyRCxHQUE2RSxXQUFXLEdBQVgsR0FBN0UsQ0FGa0M7O0FBSTNDLGVBQU8sV0FBUCxDQUFtQixRQUFuQixFQUoyQztBQUszQyxlQUFPLFNBQVAsQ0FBaUIsTUFBakIsRUFMMkM7O0FBTzNDLHFCQUFhLElBQWIsQ0FBa0IsTUFBbEIsRUFQMkM7S0FBZixDQUFoQyxDQUxxRDs7QUFnQnhELFdBQU8sWUFBUCxDQWhCd0Q7Q0FBNUI7Ozs7Ozs7Ozs7OztBQThCdEIsU0FBUyxXQUFULENBQXFCLFFBQXJCLEVBQStCOztBQUVyQyxRQUFJLGNBQWMsQ0FBQyxlQUFlLHNCQUFmLEVBQXVDO0FBQ3pELGdCQUFRLEtBQVIsQ0FBYyxrREFBZCxFQUR5RDtBQUV6RCxlQUZ5RDtLQUExRDs7QUFLRyxzQkFBa0IsUUFBbEI7OztBQVBrQyxRQVU5QixDQUFDLFdBQVcsU0FBUyxJQUFULENBQVosRUFBNEI7QUFDNUIsbUJBQVcsU0FBUyxJQUFULENBQVgsR0FBNEIsUUFBNUIsQ0FENEI7S0FBaEM7Q0FWRzs7Ozs7Ozs7Ozs7QUF5QlAsSUFBSSxvQkFBb0IsU0FBcEIsaUJBQW9CLENBQVUsUUFBVixFQUFvQjs7OztBQUl4QyxRQUFJLFNBQVMsU0FBVCx5REFBSixFQUErQztBQUMzQyxlQUQyQztLQUEvQyxNQUVPLElBQUksRUFBRSxvQkFBb0IsUUFBcEIsQ0FBRixFQUFpQztBQUM5QyxjQUFNLElBQUksS0FBSixDQUFVLHVEQUFWLENBQU4sQ0FEOEM7S0FBckM7OztBQU5pQyxRQVd2QyxjQUFjLFVBQWQ7OztBQVh1QyxxQkFjeEMsQ0FBa0IsT0FBbEIsQ0FBMEIsVUFBVSxPQUFWLEVBQW1CO0FBQ3pDLFlBQUksWUFBWSxPQUFaLEtBQXdCLFNBQXhCLElBQXFDLEVBQUUsWUFBWSxPQUFaLGFBQWdDLFFBQWhDLENBQUYsRUFBNkM7QUFDbEYsa0JBQU0sSUFBSSxLQUFKLHlFQUF1RCxPQUF2RCxDQUFOLENBRGtGO1NBQXRGO0tBRHNCLENBQTFCLENBZHdDO0NBQXBCOzs7Ozs7Ozs7O0FBOEJ4QixTQUFTLE9BQVQsQ0FBaUIsUUFBakIsRUFBMkI7OztBQUcxQixpQkFBYSxJQUFiOzs7QUFIMEIsS0FNdEIsU0FBUyxTQUFTLE1BQVQsQ0FBVCxJQUE2QixTQUFTLFlBQVQsQ0FBN0IsQ0FBRCxDQUFzRCxPQUF0RCxDQUE4RCxVQUFVLE1BQVYsRUFBa0I7QUFDNUUsWUFBSSxPQUFPLFFBQVAsQ0FBZ0IsU0FBUyxLQUFULENBQXBCLEVBQXFDO0FBQ2pDLG1CQUFPLE1BQVAsQ0FBYyxRQUFkLEVBRGlDO1NBQXJDO0tBRDBELENBQTlELENBTnVCO0NBQTNCOzs7Ozs7Ozs7Ozs7QUF3Qk8sU0FBUyxTQUFULENBQW1CLE9BQW5CLEVBQTRCOzs7QUFHbEMsUUFBSSxDQUFDLGNBQUQsRUFBaUI7QUFDcEIsa0JBQVUsZUFBVixFQURvQjtLQUFyQjs7O0FBSGtDLFFBUTNCLE9BQU8sT0FBUCxJQUFrQixRQUFsQixFQUE0Qjs7QUFFNUIsWUFBSSxPQUFPLE9BQVAsSUFBa0IsVUFBbEIsRUFBOEI7QUFDOUIsc0JBQVUsUUFBUSxlQUFSLENBQXdCLE9BQXhCLENBQVYsQ0FEOEI7U0FBbEMsTUFFTyxJQUFJLGlDQUFPLHlEQUFQLElBQWtCLFFBQWxCLEVBQTRCOztBQUVuQyxzQkFBVSxRQUFRLGVBQVIsQ0FBd0IsUUFBUSxXQUFSLENBQWxDLENBRm1DOztBQUluQyxnQkFBSSxXQUFXLFFBQVgsRUFBcUI7QUFDckIsMEJBQVUsV0FBVixDQURxQjthQUF6QjtTQUpHLE1BUUE7QUFDSCxzQkFBVSxXQUFWLENBREc7U0FSQTtLQUpYOztBQWtCSCxXQUFPLDJDQUFXLE9BQVgsRUFBb0I7QUFDMUIsa0JBQVcsT0FBWDtLQURNLENBQVAsQ0ExQmtDO0NBQTVCOzs7Ozs7Ozs7OztBQTJDQSxTQUFTLFdBQVQsQ0FBcUIsUUFBckIsRUFBK0IsTUFBL0IsRUFBdUM7O0FBRTFDLFFBQUksb0JBQW9CLE1BQXBCLEVBQTRCOztBQUU1QixZQUFJLE1BQUosRUFBWTtBQUNSLGdCQUFJLFNBQVMsTUFBVCxDQUFKLEVBQXNCO0FBQ2xCLHlCQUFTLE1BQVQsRUFBaUIsV0FBakIsQ0FBNkIsUUFBN0IsRUFEa0I7YUFBdEI7U0FESixNQUlPO0FBQ0gsaUJBQUssSUFBSSxHQUFKLElBQVcsUUFBaEIsRUFBMEI7QUFDdEIsb0JBQUksU0FBUyxjQUFULENBQXdCLEdBQXhCLENBQUosRUFBa0M7QUFDOUIsNkJBQVMsR0FBVCxFQUFjLE9BQWQsQ0FBc0IsVUFBVSxRQUFWLEVBQW9CO0FBQ3RDLGlDQUFTLFdBQVQsQ0FBcUIsUUFBckIsRUFEc0M7cUJBQXBCLENBQXRCLENBRDhCO2lCQUFsQzthQURKO1NBTEo7S0FGSjtDQUZHOztBQXNCUDs7Z0NBRVM7Z0NBQ0EiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogbG9nNGpzIDxodHRwczovL2dpdGh1Yi5jb20vYW5pZ2VuZXJvL2xvZzRqcz5cclxuICpcclxuICogQ29weXJpZ2h0IDIwMTYgUm9iaW4gU2NodWx0eiA8aHR0cDovL2FuaWdlbmVyby5jb20+XHJcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZVxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBIb2xkcyB0aGUgZGVmaW5pdGlvbiBmb3IgdGhlIGFwcGVuZGVyIGNsb3N1cmVcclxuICpcclxuICogQHR5cGVkZWYge3sgYXBwZW5kIDogZnVuY3Rpb24gKG51bWJlciwgTE9HX0VWRU5UKSwgaXNBY3RpdmUgOiBmdW5jdGlvbigpLFxyXG4gKiAgICAgICAgICBzZXRMb2dMZXZlbCA6IGZ1bmN0aW9uKG51bWJlciksIHNldExheW91dCA6IGZ1bmN0aW9uKHN0cmluZykgfX1cclxuICovXHJcbmxldCBBUFBFTkRFUjtcclxuXHJcbi8qKlxyXG4gKiBAdHlwZWRlZiB7eyBhbGxvd0FwcGVuZGVySW5qZWN0aW9uIDogYm9vbGVhbiwgYXBwZW5kZXJzIDogQXJyYXkuPEFQUEVOREVSPixcclxuICogXHRcdFx0YXBwbGljYXRpb24gOiBPYmplY3QsIGxvZ2dlcnMgOiBBcnJheS48TG9nQXBwZW5kZXI+LCBsYXlvdXQgOiBzdHJpbmcgfX1cclxuICovXHJcbmxldCBDT05GSUdfUEFSQU1TO1xyXG5cclxuaW1wb3J0ICogYXMgZm9ybWF0dGVyIGZyb20gJy4vZm9ybWF0dGVyJztcclxuaW1wb3J0ICogYXMgdXRpbGl0eSBmcm9tICcuL3V0aWxpdHknO1xyXG5pbXBvcnQge0xvZ0FwcGVuZGVyfSBmcm9tICcuL2FwcGVuZGVyL2FwcGVuZGVyJztcclxuaW1wb3J0IHtMb2dnZXJ9IGZyb20gJy4vbG9nZ2VyL2xvZ2dlcic7XHJcbmltcG9ydCB7TG9nTGV2ZWx9IGZyb20gJy4vY29uc3QvbG9nTGV2ZWwnO1xyXG5pbXBvcnQge0NvbnNvbGVBcHBlbmRlcn0gZnJvbSAnLi9hcHBlbmRlci9jb25zb2xlQXBwZW5kZXInO1xyXG5cclxuLyoqXHJcbiAqIFRoZSBuYW1lIG9mIHRoZSBtYWluIGxvZ2dlci4gV2UgdXNlIHRoaXMgaW4gY2FzZSBubyBsb2dnZXIgaXMgc3BlY2lmaWVkXHJcbiAqIEBjb25zdFxyXG4gKi9cclxuY29uc3QgX01BSU5fTE9HR0VSID0gJ21haW4nO1xyXG5cclxuLyoqXHJcbiAqIFRoZSBkZWZhdWx0IGNvbmZpZ3VyYXRpb24gZm9yIGxvZzRqczIuIElmIG5vIGNvbmZpZ3VyYXRpb24gaXMgc3BlY2lmaWVkLCB0aGVuIHRoaXNcclxuICogY29uZmlndXJhdGlvbiB3aWxsIGJlIGluamVjdGVkXHJcbiAqIEBjb25zdFxyXG4gKi9cclxuY29uc3QgX0RFRkFVTFRfQ09ORklHID0ge1xyXG4gICAgJ2FsbG93QXBwZW5kZXJJbmplY3Rpb24nIDogdHJ1ZSxcclxuICAgICdhcHBlbmRlcnMnIDogW3tcclxuICAgICAgICAnYXBwZW5kZXInIDogQ29uc29sZUFwcGVuZGVyLFxyXG4gICAgICAgICdsZXZlbCcgOiBMb2dMZXZlbC5JTkZPXHJcblx0fV0sXHJcbiAgICAnbG9nZ2VycycgOiBbe1xyXG4gICAgICAgICdhcHBlbmRlcicgOiAnY29uc29sZScsXHJcbiAgICAgICAgJ2xldmVsJyA6IExvZ0xldmVsLklORk9cclxuICAgIH1dLFxyXG4gICAgJ2xheW91dCcgOiAnJWR7eXl5eS1NTS1kZCBISDptbTpzcy5TU1N9IFslbGV2ZWxdICVsb2dnZXIgLSAlbWVzc2FnZSdcclxufTtcclxuXHJcbi8qKlxyXG4gKiBUaGUgbWV0aG9kcyB0aGF0IGFuIGFwcGVuZGVyIG11c3QgY29udGFpblxyXG4gKiBAY29uc3RcclxuICovXHJcbmNvbnN0IF9BUFBFTkRFUl9NRVRIT0RTID0gWydhcHBlbmQnLCAnZ2V0TmFtZScsICdpc0FjdGl2ZScsICdzZXRMb2dMZXZlbCcsICdzZXRMYXlvdXQnXTtcclxuXHJcbi8qKiBAdHlwZSB7T2JqZWN0fSAqL1xyXG5sZXQgX2FwcGVuZGVycyA9IHt9O1xyXG4vKiogQHR5cGUgez9DT05GSUdfUEFSQU1TfSAqL1xyXG5sZXQgX2NvbmZpZ3VyYXRpb24gPSBudWxsO1xyXG4vKiogQHR5cGUge2Jvb2xlYW59ICovXHJcbmxldCBfZmluYWxpemVkID0gZmFsc2U7XHJcbi8qKiBAdHlwZSB7T2JqZWN0fSAqL1xyXG5sZXQgX2xvZ2dlcnMgPSB7fTtcclxuXHJcbi8qKlxyXG4gKiBDb25maWd1cmVzIHRoZSBsb2dnZXJcclxuICpcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJPZiBsb2c0anNcclxuICpcclxuICogQHBhcmFtcyB7Q09ORklHX1BBUkFNU30gY29uZmlnXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gY29uZmlndXJlKGNvbmZpZykge1xyXG5cclxuXHRpZiAoX2ZpbmFsaXplZCkge1xyXG5cdFx0Y29uc29sZS5lcnJvcignQ291bGQgbm90IGNvbmZpZ3VyZS4gTG9nVXRpbGl0eSBhbHJlYWR5IGluIHVzZScpO1xyXG5cdFx0cmV0dXJuO1xyXG5cdH1cclxuXHJcblx0aWYgKCFfY29uZmlndXJhdGlvbikge1xyXG4gICAgICAgIF9jb25maWd1cmF0aW9uID0ge307XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFjb25maWcubGF5b3V0ICYmICFfY29uZmlndXJhdGlvbi5sYXlvdXQpIHtcclxuICAgICAgICBfY29uZmlndXJhdGlvbi5sYXlvdXQgPSBfREVGQVVMVF9DT05GSUcubGF5b3V0O1xyXG4gICAgfSBlbHNlIGlmIChjb25maWcubGF5b3V0KSB7XHJcbiAgICAgICAgX2NvbmZpZ3VyYXRpb24ubGF5b3V0ID0gY29uZmlnLmxheW91dDtcclxuICAgIH1cclxuXHJcblx0Ly8gY29uZmlndXJlIHRoZSBhcHBlbmRlcnNcclxuXHRfY29uZmlndXJlQXBwZW5kZXJzKGNvbmZpZy5hcHBlbmRlcnMpO1xyXG4gICAgLy8gY29uZmlndXJlIHRoZSBsb2dnZXJzXHJcbiAgICBfY29uZmlndXJlTG9nZ2Vycyhjb25maWcubG9nZ2Vycyk7XHJcblxyXG4gICAgaWYgKGNvbmZpZy5sYXlvdXQpIHtcclxuXHJcbiAgICAgICAgZm9ybWF0dGVyLnByZUNvbXBpbGUoY29uZmlnLmxheW91dCk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGtleSBpbiBfbG9nZ2Vycykge1xyXG4gICAgICAgICAgICBpZiAoX2xvZ2dlcnMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgX2xvZ2dlcnNba2V5XS5mb3JFYWNoKGZ1bmN0aW9uIChhcHBlbmRlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGFwcGVuZGVyLnNldExheW91dChjb25maWcubGF5b3V0KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBfY29uZmlndXJhdGlvbiA9IGNvbmZpZztcclxuXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDb25maWd1cmVzIGFwcGVuZGVyc1xyXG4gKlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAZnVuY3Rpb25cclxuICpcclxuICogQHBhcmFtIHtBcnJheS48TG9nQXBwZW5kZXJ8ZnVuY3Rpb24+fSBhcHBlbmRlcnNcclxuICovXHJcbmxldCBfY29uZmlndXJlQXBwZW5kZXJzID0gZnVuY3Rpb24gKGFwcGVuZGVycykge1xyXG5cclxuICAgIGlmIChhcHBlbmRlcnMgaW5zdGFuY2VvZiBBcnJheSkge1xyXG5cclxuICAgICAgICBhcHBlbmRlcnMuZm9yRWFjaChhcHBlbmRlciA9PiB7XHJcbiAgICAgICAgICAgIGlmIChhcHBlbmRlciBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBhZGRBcHBlbmRlcihhcHBlbmRlcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ludmFsaWQgYXBwZW5kZXIgY29uZmlndXJhdGlvbicpO1xyXG4gICAgfVxyXG5cclxufTtcclxuXHJcbi8qKlxyXG4gKiBDb25maWd1cmVzIHRoZSBsb2dnZXJzXHJcbiAqXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBmdW5jdGlvblxyXG4gKlxyXG4gKiBAcGFyYW0ge0FycmF5LjxPYmplY3Q+fSBsb2dnZXJzXHJcbiAqL1xyXG5sZXQgX2NvbmZpZ3VyZUxvZ2dlcnMgPSBmdW5jdGlvbiAobG9nZ2Vycykge1xyXG5cclxuXHRpZiAoIShsb2dnZXJzIGluc3RhbmNlb2YgQXJyYXkpKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgbG9nZ2VycycpO1xyXG5cdH1cclxuXHJcbiAgICBsb2dnZXJzLmZvckVhY2goZnVuY3Rpb24gKGxvZ2dlcikge1xyXG5cclxuICAgICAgICBpZiAoIWxvZ2dlci5sYXlvdXQgfHwgdHlwZW9mIGxvZ2dlci5sYXlvdXQgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIGxvZ2dlci5sYXlvdXQgPSBfY29uZmlndXJhdGlvbi5sYXlvdXQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsb2dnZXIudGFnID0gbG9nZ2VyLnRhZyB8fCBfTUFJTl9MT0dHRVI7XHJcbiAgICAgICAgbG9nZ2VyLmxvZ0xldmVsID0gbG9nZ2VyLmxvZ0xldmVsIHx8IExvZ0xldmVsLkVSUk9SO1xyXG5cclxuICAgICAgICBfbG9nZ2Vyc1tsb2dnZXIudGFnXSA9IF9nZXRBcHBlbmRlcnNGb3JMb2dnZXIobG9nZ2VyLmxvZ0xldmVsLCBsb2dnZXIubGF5b3V0KTtcclxuXHJcbiAgICB9KTtcclxuXHJcbn07XHJcblxyXG4vKipcclxuICogR2V0cyB0aGUgYXBwZW5kZXJzIGZvciB0aGUgbGV2ZWwgYW5kIGxheW91dFxyXG4gKlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAZnVuY3Rpb25cclxuICpcclxuICogQHBhcmFtIHtudW1iZXJ9IGxvZ0xldmVsXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBsYXlvdXRcclxuICpcclxuICogQHJldHVybnMge0FycmF5fVxyXG4gKi9cclxubGV0IF9nZXRBcHBlbmRlcnNGb3JMb2dnZXIgPSBmdW5jdGlvbiAobG9nTGV2ZWwsIGxheW91dCkge1xyXG5cclxuICAgIGxldCBsb2dnZXI7XHJcbiAgICBsZXQgYXBwZW5kZXJMaXN0ID0gW107XHJcblxyXG4gICAgT2JqZWN0LmtleXMoX2FwcGVuZGVycykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XHJcblxyXG4gICAgICAgIGxvZ2dlciA9IChfYXBwZW5kZXJzW2tleV0ucHJvdG90eXBlIGluc3RhbmNlb2YgTG9nQXBwZW5kZXIpID8gbmV3IF9hcHBlbmRlcnNba2V5XSgpIDogX2FwcGVuZGVyc1trZXldKCk7XHJcblxyXG4gICAgICAgIGxvZ2dlci5zZXRMb2dMZXZlbChsb2dMZXZlbCk7XHJcbiAgICAgICAgbG9nZ2VyLnNldExheW91dChsYXlvdXQpO1xyXG5cclxuICAgICAgICBhcHBlbmRlckxpc3QucHVzaChsb2dnZXIpO1xyXG5cclxuICAgIH0pO1xyXG5cclxuXHRyZXR1cm4gYXBwZW5kZXJMaXN0O1xyXG5cclxufTtcclxuXHJcbi8qKlxyXG4gKiBBZGRzIGFuIGFwcGVuZGVyIHRvIHRoZSBhcHBlbmRlciBxdWV1ZS4gSWYgdGhlIHN0YWNrIGlzIGZpbmFsaXplZCwgYW5kXHJcbiAqIHRoZSBhbGxvd0FwcGVuZGVySW5qZWN0aW9uIGlzIHNldCB0byBmYWxzZSwgdGhlbiB0aGUgZXZlbnQgd2lsbCBub3QgYmVcclxuICogYXBwZW5kZWRcclxuICpcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJPZiBsb2c0anNcclxuICpcclxuICogQHBhcmFtcyB7TG9nQXBwZW5kZXJ9IGFwcGVuZGVyXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gYWRkQXBwZW5kZXIoYXBwZW5kZXIpIHtcclxuXHJcblx0aWYgKF9maW5hbGl6ZWQgJiYgIV9jb25maWd1cmF0aW9uLmFsbG93QXBwZW5kZXJJbmplY3Rpb24pIHtcclxuXHRcdGNvbnNvbGUuZXJyb3IoJ0Nhbm5vdCBhZGQgYXBwZW5kZXIgd2hlbiBjb25maWd1cmF0aW9uIGZpbmFsaXplZCcpO1xyXG5cdFx0cmV0dXJuO1xyXG5cdH1cclxuXHJcbiAgICBfdmFsaWRhdGVBcHBlbmRlcihhcHBlbmRlcik7XHJcblxyXG4gICAgLy8gb25seSBwdXQgdGhlIGFwcGVuZGVyIGludG8gdGhlIHNldCBpZiBpdCBkb2Vzbid0IGV4aXN0IGFscmVhZHlcclxuICAgIGlmICghX2FwcGVuZGVyc1thcHBlbmRlci5uYW1lXSkge1xyXG4gICAgICAgIF9hcHBlbmRlcnNbYXBwZW5kZXIubmFtZV0gPSBhcHBlbmRlcjtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBWYWxpZGF0ZXMgdGhhdCB0aGUgYXBwZW5kZXJcclxuICpcclxuICogQHByaXZhdGVcclxuICogQGZ1bmN0aW9uXHJcbiAqXHJcbiAqIEBwYXJhbXMge0FQUEVOREVSfSBhcHBlbmRlclxyXG4gKiBAdGhyb3dzIHtFcnJvcn0gaWYgdGhlIGFwcGVuZGVyIGlzIGludmFsaWRcclxuICovXHJcbmxldCBfdmFsaWRhdGVBcHBlbmRlciA9IGZ1bmN0aW9uIChhcHBlbmRlcikge1xyXG5cclxuICAgIC8vIGlmIHdlIGFyZSBydW5uaW5nIEVTNiwgd2UgY2FuIG1ha2Ugc3VyZSBpdCBleHRlbmRzIExvZ0FwcGVuZGVyXHJcbiAgICAvLyBvdGhlcndpc2UsIGl0IG11c3QgYmUgYSBmdW5jdGlvblxyXG4gICAgaWYgKGFwcGVuZGVyLnByb3RvdHlwZSBpbnN0YW5jZW9mIExvZ0FwcGVuZGVyKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfSBlbHNlIGlmICghKGFwcGVuZGVyIGluc3RhbmNlb2YgRnVuY3Rpb24pKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgYXBwZW5kZXI6IG5vdCBhIGZ1bmN0aW9uIG9yIGNsYXNzIExvZ0FwcGVuZGVyJyk7XHJcblx0fVxyXG5cclxuXHQvLyBpbnN0YW50aWF0ZSB0aGUgYXBwZW5kZXIgZnVuY3Rpb25cclxuXHRsZXQgYXBwZW5kZXJPYmogPSBhcHBlbmRlcigpO1xyXG5cclxuICAgIC8vIGVuc3VyZSB0aGF0IHRoZSBhcHBlbmRlciBtZXRob2RzIGFyZSBwcmVzZW50IChhbmQgYXJlIGZ1bmN0aW9ucylcclxuICAgIF9BUFBFTkRFUl9NRVRIT0RTLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICBpZiAoYXBwZW5kZXJPYmpbZWxlbWVudF0gPT0gdW5kZWZpbmVkIHx8ICEoYXBwZW5kZXJPYmpbZWxlbWVudF0gaW5zdGFuY2VvZiBGdW5jdGlvbikpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGFwcGVuZGVyOiBtaXNzaW5nL2ludmFsaWQgbWV0aG9kOiAke2VsZW1lbnR9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEFwcGVuZHMgdGhlIGxvZyBldmVudFxyXG4gKlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAZnVuY3Rpb25cclxuICpcclxuICogQHBhcmFtIHtPYmplY3R9IGxvZ0V2ZW50XHJcbiAqL1xyXG5mdW5jdGlvbiBfYXBwZW5kKGxvZ0V2ZW50KSB7XHJcblxyXG5cdC8vIGZpbmFsaXplIHRoZSBjb25maWd1cmF0aW9uIHRvIG1ha2Ugc3VyZSBubyBvdGhlciBhcHBlbmRlciBjYW4gYmUgaW5qZWN0ZWQgKGlmIHNldClcclxuXHRfZmluYWxpemVkID0gdHJ1ZTtcclxuXHJcbiAgICAvLyBjeWNsZSB0aHJvdWdoIGVhY2ggYXBwZW5kZXIgZm9yIHRoZSBsb2dnZXIgYW5kIGFwcGVuZCB0aGUgbG9nZ2luZyBldmVudFxyXG4gICAgKF9sb2dnZXJzW2xvZ0V2ZW50LmxvZ2dlcl0gfHwgX2xvZ2dlcnNbX01BSU5fTE9HR0VSXSkuZm9yRWFjaChmdW5jdGlvbiAobG9nZ2VyKSB7XHJcbiAgICAgICAgaWYgKGxvZ2dlci5pc0FjdGl2ZShsb2dFdmVudC5sZXZlbCkpIHtcclxuICAgICAgICAgICAgbG9nZ2VyLmFwcGVuZChsb2dFdmVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG59XHJcblxyXG4vKipcclxuICogSGFuZGxlcyBjcmVhdGluZyB0aGUgbG9nZ2VyIGFuZCByZXR1cm5pbmcgaXRcclxuICpcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJPZiBsb2c0anNcclxuICpcclxuICogQHBhcmFtIHtmdW5jdGlvbnxzdHJpbmd9IGNvbnRleHRcclxuICpcclxuICogQHJldHVybiB7TG9nZ2VyfVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGdldExvZ2dlcihjb250ZXh0KSB7XHJcblxyXG5cdC8vIHdlIG5lZWQgdG8gaW5pdGlhbGl6ZSBpZiB3ZSBoYXZlbid0XHJcblx0aWYgKCFfY29uZmlndXJhdGlvbikge1xyXG5cdFx0Y29uZmlndXJlKF9ERUZBVUxUX0NPTkZJRyk7XHJcblx0fVxyXG5cclxuICAgIC8vIGRldGVybWluZSB0aGUgY29udGV4dFxyXG4gICAgaWYgKHR5cGVvZiBjb250ZXh0ICE9ICdzdHJpbmcnKSB7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgY29udGV4dCA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIGNvbnRleHQgPSB1dGlsaXR5LmdldEZ1bmN0aW9uTmFtZShjb250ZXh0KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBjb250ZXh0ID09ICdvYmplY3QnKSB7XHJcblxyXG4gICAgICAgICAgICBjb250ZXh0ID0gdXRpbGl0eS5nZXRGdW5jdGlvbk5hbWUoY29udGV4dC5jb25zdHJ1Y3Rvcik7XHJcblxyXG4gICAgICAgICAgICBpZiAoY29udGV4dCA9PSAnT2JqZWN0Jykge1xyXG4gICAgICAgICAgICAgICAgY29udGV4dCA9ICdhbm9ueW1vdXMnO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnRleHQgPSAnYW5vbnltb3VzJztcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuXHRyZXR1cm4gbmV3IExvZ2dlcihjb250ZXh0LCB7XHJcblx0XHQnYXBwZW5kJyA6IF9hcHBlbmRcclxuXHR9KTtcclxuXHJcbn1cclxuXHJcblxyXG5cclxuLyoqXHJcbiAqIFNldHMgdGhlIGxvZyBsZXZlbCBmb3IgYWxsIGFwcGVuZGVycyBvZiBhIGxvZ2dlciwgb3Igc3BlY2lmaWVkIGxvZ2dlclxyXG4gKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGxvZzRqc1xyXG4gKlxyXG4gKiBAcGFyYW0ge251bWJlcn0gbG9nTGV2ZWxcclxuICogQHBhcmFtIHtzdHJpbmc9fSBsb2dnZXJcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRMb2dMZXZlbChsb2dMZXZlbCwgbG9nZ2VyKSB7XHJcblxyXG4gICAgaWYgKGxvZ0xldmVsIGluc3RhbmNlb2YgTnVtYmVyKSB7XHJcblxyXG4gICAgICAgIGlmIChsb2dnZXIpIHtcclxuICAgICAgICAgICAgaWYgKF9sb2dnZXJzW2xvZ2dlcl0pIHtcclxuICAgICAgICAgICAgICAgIF9sb2dnZXJzW2xvZ2dlcl0uc2V0TG9nTGV2ZWwobG9nTGV2ZWwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZm9yIChsZXQga2V5IGluIF9sb2dnZXJzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoX2xvZ2dlcnMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIF9sb2dnZXJzW2tleV0uZm9yRWFjaChmdW5jdGlvbiAoYXBwZW5kZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXBwZW5kZXIuc2V0TG9nTGV2ZWwobG9nTGV2ZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmFkZEFwcGVuZGVyKENvbnNvbGVBcHBlbmRlcik7XHJcblxyXG5leHBvcnQgeyBMb2dMZXZlbCB9O1xyXG5leHBvcnQgeyBMb2dBcHBlbmRlciB9O1xyXG4iXX0=