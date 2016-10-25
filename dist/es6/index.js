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
 * The default configuration for log4js2. If no configuration is specified, then this
 * configuration will be injected
 * @const
 */
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

        for (let key in _loggers) {
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
let _configureAppenders = function (appenders) {

    if (appenders instanceof Array) {

        appenders.forEach(appender => {
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
//# sourceMappingURL=data:application/json;base64,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SUFBa0IsVUFBbEIsRUFBOEI7QUFDOUIsc0JBQVUsUUFBUSxlQUFSLENBQXdCLE9BQXhCLENBQVYsQ0FEOEI7U0FBbEMsTUFFTyxJQUFJLE9BQU8sT0FBUCxJQUFrQixRQUFsQixFQUE0Qjs7QUFFbkMsc0JBQVUsUUFBUSxlQUFSLENBQXdCLFFBQVEsV0FBUixDQUFsQyxDQUZtQzs7QUFJbkMsZ0JBQUksV0FBVyxRQUFYLEVBQXFCO0FBQ3JCLDBCQUFVLFdBQVYsQ0FEcUI7YUFBekI7U0FKRyxNQVFBO0FBQ0gsc0JBQVUsV0FBVixDQURHO1NBUkE7S0FKWDs7QUFrQkgsV0FBTywyQ0FBVyxPQUFYLEVBQW9CO0FBQzFCLGtCQUFXLE9BQVg7S0FETSxDQUFQLENBMUJrQztDQUE1Qjs7Ozs7Ozs7Ozs7QUEyQ0EsU0FBUyxXQUFULENBQXFCLFFBQXJCLEVBQStCLE1BQS9CLEVBQXVDOztBQUUxQyxRQUFJLG9CQUFvQixNQUFwQixFQUE0Qjs7QUFFNUIsWUFBSSxNQUFKLEVBQVk7QUFDUixnQkFBSSxTQUFTLE1BQVQsQ0FBSixFQUFzQjtBQUNsQix5QkFBUyxNQUFULEVBQWlCLFdBQWpCLENBQTZCLFFBQTdCLEVBRGtCO2FBQXRCO1NBREosTUFJTztBQUNILGlCQUFLLElBQUksR0FBSixJQUFXLFFBQWhCLEVBQTBCO0FBQ3RCLG9CQUFJLFNBQVMsY0FBVCxDQUF3QixHQUF4QixDQUFKLEVBQWtDO0FBQzlCLDZCQUFTLEdBQVQsRUFBYyxPQUFkLENBQXNCLFVBQVUsUUFBVixFQUFvQjtBQUN0QyxpQ0FBUyxXQUFULENBQXFCLFFBQXJCLEVBRHNDO3FCQUFwQixDQUF0QixDQUQ4QjtpQkFBbEM7YUFESjtTQUxKO0tBRko7Q0FGRzs7QUFzQlA7O2dDQUVTO2dDQUNBIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIGxvZzRqcyA8aHR0cHM6Ly9naXRodWIuY29tL2FuaWdlbmVyby9sb2c0anM+XHJcbiAqXHJcbiAqIENvcHlyaWdodCAyMDE2IFJvYmluIFNjaHVsdHogPGh0dHA6Ly9hbmlnZW5lcm8uY29tPlxyXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2VcclxuICovXHJcblxyXG4vKipcclxuICogSG9sZHMgdGhlIGRlZmluaXRpb24gZm9yIHRoZSBhcHBlbmRlciBjbG9zdXJlXHJcbiAqXHJcbiAqIEB0eXBlZGVmIHt7IGFwcGVuZCA6IGZ1bmN0aW9uIChudW1iZXIsIExPR19FVkVOVCksIGlzQWN0aXZlIDogZnVuY3Rpb24oKSxcclxuICogICAgICAgICAgc2V0TG9nTGV2ZWwgOiBmdW5jdGlvbihudW1iZXIpLCBzZXRMYXlvdXQgOiBmdW5jdGlvbihzdHJpbmcpIH19XHJcbiAqL1xyXG5sZXQgQVBQRU5ERVI7XHJcblxyXG4vKipcclxuICogQHR5cGVkZWYge3sgYWxsb3dBcHBlbmRlckluamVjdGlvbiA6IGJvb2xlYW4sIGFwcGVuZGVycyA6IEFycmF5LjxBUFBFTkRFUj4sXHJcbiAqIFx0XHRcdGFwcGxpY2F0aW9uIDogT2JqZWN0LCBsb2dnZXJzIDogQXJyYXkuPExvZ0FwcGVuZGVyPiwgbGF5b3V0IDogc3RyaW5nIH19XHJcbiAqL1xyXG5sZXQgQ09ORklHX1BBUkFNUztcclxuXHJcbmltcG9ydCAqIGFzIGZvcm1hdHRlciBmcm9tICcuL2Zvcm1hdHRlcic7XHJcbmltcG9ydCAqIGFzIHV0aWxpdHkgZnJvbSAnLi91dGlsaXR5JztcclxuaW1wb3J0IHtMb2dBcHBlbmRlcn0gZnJvbSAnLi9hcHBlbmRlci9hcHBlbmRlcic7XHJcbmltcG9ydCB7TG9nZ2VyfSBmcm9tICcuL2xvZ2dlci9sb2dnZXInO1xyXG5pbXBvcnQge0xvZ0xldmVsfSBmcm9tICcuL2NvbnN0L2xvZ0xldmVsJztcclxuaW1wb3J0IHtDb25zb2xlQXBwZW5kZXJ9IGZyb20gJy4vYXBwZW5kZXIvY29uc29sZUFwcGVuZGVyJztcclxuXHJcbi8qKlxyXG4gKiBUaGUgbmFtZSBvZiB0aGUgbWFpbiBsb2dnZXIuIFdlIHVzZSB0aGlzIGluIGNhc2Ugbm8gbG9nZ2VyIGlzIHNwZWNpZmllZFxyXG4gKiBAY29uc3RcclxuICovXHJcbmNvbnN0IF9NQUlOX0xPR0dFUiA9ICdtYWluJztcclxuXHJcbi8qKlxyXG4gKiBUaGUgZGVmYXVsdCBjb25maWd1cmF0aW9uIGZvciBsb2c0anMyLiBJZiBubyBjb25maWd1cmF0aW9uIGlzIHNwZWNpZmllZCwgdGhlbiB0aGlzXHJcbiAqIGNvbmZpZ3VyYXRpb24gd2lsbCBiZSBpbmplY3RlZFxyXG4gKiBAY29uc3RcclxuICovXHJcbmNvbnN0IF9ERUZBVUxUX0NPTkZJRyA9IHtcclxuICAgICdhbGxvd0FwcGVuZGVySW5qZWN0aW9uJyA6IHRydWUsXHJcbiAgICAnYXBwZW5kZXJzJyA6IFt7XHJcbiAgICAgICAgJ2FwcGVuZGVyJyA6IENvbnNvbGVBcHBlbmRlcixcclxuICAgICAgICAnbGV2ZWwnIDogTG9nTGV2ZWwuSU5GT1xyXG5cdH1dLFxyXG4gICAgJ2xvZ2dlcnMnIDogW3tcclxuICAgICAgICAnYXBwZW5kZXInIDogJ2NvbnNvbGUnLFxyXG4gICAgICAgICdsZXZlbCcgOiBMb2dMZXZlbC5JTkZPXHJcbiAgICB9XSxcclxuICAgICdsYXlvdXQnIDogJyVke3l5eXktTU0tZGQgSEg6bW06c3MuU1NTfSBbJWxldmVsXSAlbG9nZ2VyIC0gJW1lc3NhZ2UnXHJcbn07XHJcblxyXG4vKipcclxuICogVGhlIG1ldGhvZHMgdGhhdCBhbiBhcHBlbmRlciBtdXN0IGNvbnRhaW5cclxuICogQGNvbnN0XHJcbiAqL1xyXG5jb25zdCBfQVBQRU5ERVJfTUVUSE9EUyA9IFsnYXBwZW5kJywgJ2dldE5hbWUnLCAnaXNBY3RpdmUnLCAnc2V0TG9nTGV2ZWwnLCAnc2V0TGF5b3V0J107XHJcblxyXG4vKiogQHR5cGUge09iamVjdH0gKi9cclxubGV0IF9hcHBlbmRlcnMgPSB7fTtcclxuLyoqIEB0eXBlIHs/Q09ORklHX1BBUkFNU30gKi9cclxubGV0IF9jb25maWd1cmF0aW9uID0gbnVsbDtcclxuLyoqIEB0eXBlIHtib29sZWFufSAqL1xyXG5sZXQgX2ZpbmFsaXplZCA9IGZhbHNlO1xyXG4vKiogQHR5cGUge09iamVjdH0gKi9cclxubGV0IF9sb2dnZXJzID0ge307XHJcblxyXG4vKipcclxuICogQ29uZmlndXJlcyB0aGUgbG9nZ2VyXHJcbiAqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyT2YgbG9nNGpzXHJcbiAqXHJcbiAqIEBwYXJhbXMge0NPTkZJR19QQVJBTVN9IGNvbmZpZ1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGNvbmZpZ3VyZShjb25maWcpIHtcclxuXHJcblx0aWYgKF9maW5hbGl6ZWQpIHtcclxuXHRcdGNvbnNvbGUuZXJyb3IoJ0NvdWxkIG5vdCBjb25maWd1cmUuIExvZ1V0aWxpdHkgYWxyZWFkeSBpbiB1c2UnKTtcclxuXHRcdHJldHVybjtcclxuXHR9XHJcblxyXG5cdGlmICghX2NvbmZpZ3VyYXRpb24pIHtcclxuICAgICAgICBfY29uZmlndXJhdGlvbiA9IHt9O1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghY29uZmlnLmxheW91dCAmJiAhX2NvbmZpZ3VyYXRpb24ubGF5b3V0KSB7XHJcbiAgICAgICAgX2NvbmZpZ3VyYXRpb24ubGF5b3V0ID0gX0RFRkFVTFRfQ09ORklHLmxheW91dDtcclxuICAgIH0gZWxzZSBpZiAoY29uZmlnLmxheW91dCkge1xyXG4gICAgICAgIF9jb25maWd1cmF0aW9uLmxheW91dCA9IGNvbmZpZy5sYXlvdXQ7XHJcbiAgICB9XHJcblxyXG5cdC8vIGNvbmZpZ3VyZSB0aGUgYXBwZW5kZXJzXHJcblx0X2NvbmZpZ3VyZUFwcGVuZGVycyhjb25maWcuYXBwZW5kZXJzKTtcclxuICAgIC8vIGNvbmZpZ3VyZSB0aGUgbG9nZ2Vyc1xyXG4gICAgX2NvbmZpZ3VyZUxvZ2dlcnMoY29uZmlnLmxvZ2dlcnMpO1xyXG5cclxuICAgIGlmIChjb25maWcubGF5b3V0KSB7XHJcblxyXG4gICAgICAgIGZvcm1hdHRlci5wcmVDb21waWxlKGNvbmZpZy5sYXlvdXQpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBrZXkgaW4gX2xvZ2dlcnMpIHtcclxuICAgICAgICAgICAgaWYgKF9sb2dnZXJzLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgIF9sb2dnZXJzW2tleV0uZm9yRWFjaChmdW5jdGlvbiAoYXBwZW5kZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBhcHBlbmRlci5zZXRMYXlvdXQoY29uZmlnLmxheW91dCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgX2NvbmZpZ3VyYXRpb24gPSBjb25maWc7XHJcblxyXG59XHJcblxyXG4vKipcclxuICogQ29uZmlndXJlcyBhcHBlbmRlcnNcclxuICpcclxuICogQHByaXZhdGVcclxuICogQGZ1bmN0aW9uXHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXkuPExvZ0FwcGVuZGVyfGZ1bmN0aW9uPn0gYXBwZW5kZXJzXHJcbiAqL1xyXG5sZXQgX2NvbmZpZ3VyZUFwcGVuZGVycyA9IGZ1bmN0aW9uIChhcHBlbmRlcnMpIHtcclxuXHJcbiAgICBpZiAoYXBwZW5kZXJzIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuXHJcbiAgICAgICAgYXBwZW5kZXJzLmZvckVhY2goYXBwZW5kZXIgPT4ge1xyXG4gICAgICAgICAgICBpZiAoYXBwZW5kZXIgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xyXG4gICAgICAgICAgICAgICAgYWRkQXBwZW5kZXIoYXBwZW5kZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCdJbnZhbGlkIGFwcGVuZGVyIGNvbmZpZ3VyYXRpb24nKTtcclxuICAgIH1cclxuXHJcbn07XHJcblxyXG4vKipcclxuICogQ29uZmlndXJlcyB0aGUgbG9nZ2Vyc1xyXG4gKlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAZnVuY3Rpb25cclxuICpcclxuICogQHBhcmFtIHtBcnJheS48T2JqZWN0Pn0gbG9nZ2Vyc1xyXG4gKi9cclxubGV0IF9jb25maWd1cmVMb2dnZXJzID0gZnVuY3Rpb24gKGxvZ2dlcnMpIHtcclxuXHJcblx0aWYgKCEobG9nZ2VycyBpbnN0YW5jZW9mIEFycmF5KSkge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGxvZ2dlcnMnKTtcclxuXHR9XHJcblxyXG4gICAgbG9nZ2Vycy5mb3JFYWNoKGZ1bmN0aW9uIChsb2dnZXIpIHtcclxuXHJcbiAgICAgICAgaWYgKCFsb2dnZXIubGF5b3V0IHx8IHR5cGVvZiBsb2dnZXIubGF5b3V0ICE9PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICBsb2dnZXIubGF5b3V0ID0gX2NvbmZpZ3VyYXRpb24ubGF5b3V0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbG9nZ2VyLnRhZyA9IGxvZ2dlci50YWcgfHwgX01BSU5fTE9HR0VSO1xyXG4gICAgICAgIGxvZ2dlci5sb2dMZXZlbCA9IGxvZ2dlci5sb2dMZXZlbCB8fCBMb2dMZXZlbC5FUlJPUjtcclxuXHJcbiAgICAgICAgX2xvZ2dlcnNbbG9nZ2VyLnRhZ10gPSBfZ2V0QXBwZW5kZXJzRm9yTG9nZ2VyKGxvZ2dlci5sb2dMZXZlbCwgbG9nZ2VyLmxheW91dCk7XHJcblxyXG4gICAgfSk7XHJcblxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEdldHMgdGhlIGFwcGVuZGVycyBmb3IgdGhlIGxldmVsIGFuZCBsYXlvdXRcclxuICpcclxuICogQHByaXZhdGVcclxuICogQGZ1bmN0aW9uXHJcbiAqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBsb2dMZXZlbFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gbGF5b3V0XHJcbiAqXHJcbiAqIEByZXR1cm5zIHtBcnJheX1cclxuICovXHJcbmxldCBfZ2V0QXBwZW5kZXJzRm9yTG9nZ2VyID0gZnVuY3Rpb24gKGxvZ0xldmVsLCBsYXlvdXQpIHtcclxuXHJcbiAgICBsZXQgbG9nZ2VyO1xyXG4gICAgbGV0IGFwcGVuZGVyTGlzdCA9IFtdO1xyXG5cclxuICAgIE9iamVjdC5rZXlzKF9hcHBlbmRlcnMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xyXG5cclxuICAgICAgICBsb2dnZXIgPSAoX2FwcGVuZGVyc1trZXldLnByb3RvdHlwZSBpbnN0YW5jZW9mIExvZ0FwcGVuZGVyKSA/IG5ldyBfYXBwZW5kZXJzW2tleV0oKSA6IF9hcHBlbmRlcnNba2V5XSgpO1xyXG5cclxuICAgICAgICBsb2dnZXIuc2V0TG9nTGV2ZWwobG9nTGV2ZWwpO1xyXG4gICAgICAgIGxvZ2dlci5zZXRMYXlvdXQobGF5b3V0KTtcclxuXHJcbiAgICAgICAgYXBwZW5kZXJMaXN0LnB1c2gobG9nZ2VyKTtcclxuXHJcbiAgICB9KTtcclxuXHJcblx0cmV0dXJuIGFwcGVuZGVyTGlzdDtcclxuXHJcbn07XHJcblxyXG4vKipcclxuICogQWRkcyBhbiBhcHBlbmRlciB0byB0aGUgYXBwZW5kZXIgcXVldWUuIElmIHRoZSBzdGFjayBpcyBmaW5hbGl6ZWQsIGFuZFxyXG4gKiB0aGUgYWxsb3dBcHBlbmRlckluamVjdGlvbiBpcyBzZXQgdG8gZmFsc2UsIHRoZW4gdGhlIGV2ZW50IHdpbGwgbm90IGJlXHJcbiAqIGFwcGVuZGVkXHJcbiAqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyT2YgbG9nNGpzXHJcbiAqXHJcbiAqIEBwYXJhbXMge0xvZ0FwcGVuZGVyfSBhcHBlbmRlclxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGFkZEFwcGVuZGVyKGFwcGVuZGVyKSB7XHJcblxyXG5cdGlmIChfZmluYWxpemVkICYmICFfY29uZmlndXJhdGlvbi5hbGxvd0FwcGVuZGVySW5qZWN0aW9uKSB7XHJcblx0XHRjb25zb2xlLmVycm9yKCdDYW5ub3QgYWRkIGFwcGVuZGVyIHdoZW4gY29uZmlndXJhdGlvbiBmaW5hbGl6ZWQnKTtcclxuXHRcdHJldHVybjtcclxuXHR9XHJcblxyXG4gICAgX3ZhbGlkYXRlQXBwZW5kZXIoYXBwZW5kZXIpO1xyXG5cclxuICAgIC8vIG9ubHkgcHV0IHRoZSBhcHBlbmRlciBpbnRvIHRoZSBzZXQgaWYgaXQgZG9lc24ndCBleGlzdCBhbHJlYWR5XHJcbiAgICBpZiAoIV9hcHBlbmRlcnNbYXBwZW5kZXIubmFtZV0pIHtcclxuICAgICAgICBfYXBwZW5kZXJzW2FwcGVuZGVyLm5hbWVdID0gYXBwZW5kZXI7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG4vKipcclxuICogVmFsaWRhdGVzIHRoYXQgdGhlIGFwcGVuZGVyXHJcbiAqXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBmdW5jdGlvblxyXG4gKlxyXG4gKiBAcGFyYW1zIHtBUFBFTkRFUn0gYXBwZW5kZXJcclxuICogQHRocm93cyB7RXJyb3J9IGlmIHRoZSBhcHBlbmRlciBpcyBpbnZhbGlkXHJcbiAqL1xyXG5sZXQgX3ZhbGlkYXRlQXBwZW5kZXIgPSBmdW5jdGlvbiAoYXBwZW5kZXIpIHtcclxuXHJcbiAgICAvLyBpZiB3ZSBhcmUgcnVubmluZyBFUzYsIHdlIGNhbiBtYWtlIHN1cmUgaXQgZXh0ZW5kcyBMb2dBcHBlbmRlclxyXG4gICAgLy8gb3RoZXJ3aXNlLCBpdCBtdXN0IGJlIGEgZnVuY3Rpb25cclxuICAgIGlmIChhcHBlbmRlci5wcm90b3R5cGUgaW5zdGFuY2VvZiBMb2dBcHBlbmRlcikge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH0gZWxzZSBpZiAoIShhcHBlbmRlciBpbnN0YW5jZW9mIEZ1bmN0aW9uKSkge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGFwcGVuZGVyOiBub3QgYSBmdW5jdGlvbiBvciBjbGFzcyBMb2dBcHBlbmRlcicpO1xyXG5cdH1cclxuXHJcblx0Ly8gaW5zdGFudGlhdGUgdGhlIGFwcGVuZGVyIGZ1bmN0aW9uXHJcblx0bGV0IGFwcGVuZGVyT2JqID0gYXBwZW5kZXIoKTtcclxuXHJcbiAgICAvLyBlbnN1cmUgdGhhdCB0aGUgYXBwZW5kZXIgbWV0aG9kcyBhcmUgcHJlc2VudCAoYW5kIGFyZSBmdW5jdGlvbnMpXHJcbiAgICBfQVBQRU5ERVJfTUVUSE9EUy5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAgICAgaWYgKGFwcGVuZGVyT2JqW2VsZW1lbnRdID09IHVuZGVmaW5lZCB8fCAhKGFwcGVuZGVyT2JqW2VsZW1lbnRdIGluc3RhbmNlb2YgRnVuY3Rpb24pKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBhcHBlbmRlcjogbWlzc2luZy9pbnZhbGlkIG1ldGhvZDogJHtlbGVtZW50fWApO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxufTtcclxuXHJcbi8qKlxyXG4gKiBBcHBlbmRzIHRoZSBsb2cgZXZlbnRcclxuICpcclxuICogQHByaXZhdGVcclxuICogQGZ1bmN0aW9uXHJcbiAqXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBsb2dFdmVudFxyXG4gKi9cclxuZnVuY3Rpb24gX2FwcGVuZChsb2dFdmVudCkge1xyXG5cclxuXHQvLyBmaW5hbGl6ZSB0aGUgY29uZmlndXJhdGlvbiB0byBtYWtlIHN1cmUgbm8gb3RoZXIgYXBwZW5kZXIgY2FuIGJlIGluamVjdGVkIChpZiBzZXQpXHJcblx0X2ZpbmFsaXplZCA9IHRydWU7XHJcblxyXG4gICAgLy8gY3ljbGUgdGhyb3VnaCBlYWNoIGFwcGVuZGVyIGZvciB0aGUgbG9nZ2VyIGFuZCBhcHBlbmQgdGhlIGxvZ2dpbmcgZXZlbnRcclxuICAgIChfbG9nZ2Vyc1tsb2dFdmVudC5sb2dnZXJdIHx8IF9sb2dnZXJzW19NQUlOX0xPR0dFUl0pLmZvckVhY2goZnVuY3Rpb24gKGxvZ2dlcikge1xyXG4gICAgICAgIGlmIChsb2dnZXIuaXNBY3RpdmUobG9nRXZlbnQubGV2ZWwpKSB7XHJcbiAgICAgICAgICAgIGxvZ2dlci5hcHBlbmQobG9nRXZlbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxufVxyXG5cclxuLyoqXHJcbiAqIEhhbmRsZXMgY3JlYXRpbmcgdGhlIGxvZ2dlciBhbmQgcmV0dXJuaW5nIGl0XHJcbiAqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyT2YgbG9nNGpzXHJcbiAqXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb258c3RyaW5nfSBjb250ZXh0XHJcbiAqXHJcbiAqIEByZXR1cm4ge0xvZ2dlcn1cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRMb2dnZXIoY29udGV4dCkge1xyXG5cclxuXHQvLyB3ZSBuZWVkIHRvIGluaXRpYWxpemUgaWYgd2UgaGF2ZW4ndFxyXG5cdGlmICghX2NvbmZpZ3VyYXRpb24pIHtcclxuXHRcdGNvbmZpZ3VyZShfREVGQVVMVF9DT05GSUcpO1xyXG5cdH1cclxuXHJcbiAgICAvLyBkZXRlcm1pbmUgdGhlIGNvbnRleHRcclxuICAgIGlmICh0eXBlb2YgY29udGV4dCAhPSAnc3RyaW5nJykge1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mIGNvbnRleHQgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICBjb250ZXh0ID0gdXRpbGl0eS5nZXRGdW5jdGlvbk5hbWUoY29udGV4dCk7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgY29udGV4dCA9PSAnb2JqZWN0Jykge1xyXG5cclxuICAgICAgICAgICAgY29udGV4dCA9IHV0aWxpdHkuZ2V0RnVuY3Rpb25OYW1lKGNvbnRleHQuY29uc3RydWN0b3IpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGNvbnRleHQgPT0gJ09iamVjdCcpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQgPSAnYW5vbnltb3VzJztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb250ZXh0ID0gJ2Fub255bW91cyc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcblx0cmV0dXJuIG5ldyBMb2dnZXIoY29udGV4dCwge1xyXG5cdFx0J2FwcGVuZCcgOiBfYXBwZW5kXHJcblx0fSk7XHJcblxyXG59XHJcblxyXG5cclxuXHJcbi8qKlxyXG4gKiBTZXRzIHRoZSBsb2cgbGV2ZWwgZm9yIGFsbCBhcHBlbmRlcnMgb2YgYSBsb2dnZXIsIG9yIHNwZWNpZmllZCBsb2dnZXJcclxuICpcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJPZiBsb2c0anNcclxuICpcclxuICogQHBhcmFtIHtudW1iZXJ9IGxvZ0xldmVsXHJcbiAqIEBwYXJhbSB7c3RyaW5nPX0gbG9nZ2VyXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gc2V0TG9nTGV2ZWwobG9nTGV2ZWwsIGxvZ2dlcikge1xyXG5cclxuICAgIGlmIChsb2dMZXZlbCBpbnN0YW5jZW9mIE51bWJlcikge1xyXG5cclxuICAgICAgICBpZiAobG9nZ2VyKSB7XHJcbiAgICAgICAgICAgIGlmIChfbG9nZ2Vyc1tsb2dnZXJdKSB7XHJcbiAgICAgICAgICAgICAgICBfbG9nZ2Vyc1tsb2dnZXJdLnNldExvZ0xldmVsKGxvZ0xldmVsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiBfbG9nZ2Vycykge1xyXG4gICAgICAgICAgICAgICAgaWYgKF9sb2dnZXJzLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBfbG9nZ2Vyc1trZXldLmZvckVhY2goZnVuY3Rpb24gKGFwcGVuZGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcGVuZGVyLnNldExvZ0xldmVsKGxvZ0xldmVsKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5hZGRBcHBlbmRlcihDb25zb2xlQXBwZW5kZXIpO1xyXG5cclxuZXhwb3J0IHsgTG9nTGV2ZWwgfTtcclxuZXhwb3J0IHsgTG9nQXBwZW5kZXIgfTtcclxuIl19