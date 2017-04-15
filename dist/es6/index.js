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

/*istanbul ignore next*/var formatter = _interopRequireWildcard(_formatter);

var /*istanbul ignore next*/_utility = require('./utility');

/*istanbul ignore next*/var utility = _interopRequireWildcard(_utility);

var /*istanbul ignore next*/_appender = require('./appender/appender');

var /*istanbul ignore next*/_logger = require('./logger/logger');

var /*istanbul ignore next*/_logLevel = require('./const/logLevel');

var /*istanbul ignore next*/_consoleAppender = require('./appender/consoleAppender');

/*istanbul ignore next*/function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbImNvbmZpZ3VyZSIsImFkZEFwcGVuZGVyIiwiZ2V0TG9nZ2VyIiwic2V0TG9nTGV2ZWwiLCJmb3JtYXR0ZXIiLCJ1dGlsaXR5IiwiQVBQRU5ERVIiLCJDT05GSUdfUEFSQU1TIiwiX01BSU5fTE9HR0VSIiwiX0RFRkFVTFRfQVBQRU5ERVJTIiwiSU5GTyIsIl9ERUZBVUxUX0NPTkZJRyIsIl9BUFBFTkRFUl9NRVRIT0RTIiwiX2FwcGVuZGVycyIsIl9jb25maWd1cmF0aW9uIiwiX2ZpbmFsaXplZCIsIl9sb2dnZXJzIiwiY29uZmlnIiwiY29uc29sZSIsImVycm9yIiwibGF5b3V0IiwiX2NvbmZpZ3VyZUFwcGVuZGVycyIsImFwcGVuZGVycyIsIl9jb25maWd1cmVMb2dnZXJzIiwibG9nZ2VycyIsIkFycmF5IiwiZm9yRWFjaCIsImFwcGVuZGVyIiwiRnVuY3Rpb24iLCJFcnJvciIsImxvZ2dlciIsInRhZyIsImxvZ0xldmVsIiwiRVJST1IiLCJfZ2V0QXBwZW5kZXJzRm9yTG9nZ2VyIiwiYXBwZW5kZXJMaXN0IiwiT2JqZWN0Iiwia2V5cyIsImtleSIsInByb3RvdHlwZSIsInNldExheW91dCIsInB1c2giLCJhbGxvd0FwcGVuZGVySW5qZWN0aW9uIiwiX3ZhbGlkYXRlQXBwZW5kZXIiLCJuYW1lIiwiYXBwZW5kZXJPYmoiLCJlbGVtZW50IiwidW5kZWZpbmVkIiwiX2FwcGVuZCIsImxvZ0V2ZW50IiwiaXNBY3RpdmUiLCJsZXZlbCIsImFwcGVuZCIsImNvbnRleHQiLCJnZXRGdW5jdGlvbk5hbWUiLCJjb25zdHJ1Y3RvciIsIk51bWJlciIsImhhc093blByb3BlcnR5IiwiTG9nTGV2ZWwiLCJMb2dBcHBlbmRlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7O1FBZ0ZnQkEsUyxHQUFBQSxTO2dDQXFIQUMsVyxHQUFBQSxXO2dDQStFQUMsUyxHQUFBQSxTO2dDQTJDQUMsVyxHQUFBQSxXOztBQTFTaEI7OzRCQUFZQyxTOztBQUNa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QUFTN0MsV0FBVCxDQUFxQjZCLFFBQXJCLEVBQStCRixNQUEvQixFQUF1Qzs7QUFFMUMsUUFBSUUsb0JBQW9Cd0IsTUFBeEIsRUFBZ0M7O0FBRTVCLFlBQUkxQixNQUFKLEVBQVk7QUFDUixnQkFBSWQsU0FBU2MsTUFBVCxDQUFKLEVBQXNCO0FBQ2xCZCx5QkFBU2MsTUFBVCxFQUFpQjNCLFdBQWpCLENBQTZCNkIsUUFBN0I7QUFDSDtBQUNKLFNBSkQsTUFJTztBQUNILGlCQUFLLElBQUlNLEdBQVQsSUFBZ0J0QixRQUFoQixFQUEwQjtBQUN0QixvQkFBSUEsU0FBU3lDLGNBQVQsQ0FBd0JuQixHQUF4QixDQUFKLEVBQWtDO0FBQzlCdEIsNkJBQVNzQixHQUFULEVBQWNaLE9BQWQsQ0FBc0IsVUFBVUMsUUFBVixFQUFvQjtBQUN0Q0EsaUNBQVN4QixXQUFULENBQXFCNkIsUUFBckI7QUFDSCxxQkFGRDtBQUdIO0FBQ0o7QUFDSjtBQUVKO0FBRUo7O0FBRUQvQjs7Z0NBRVN5RCxRO2dDQUNBQyxXIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBsb2c0anMgPGh0dHBzOi8vZ2l0aHViLmNvbS9hbmlnZW5lcm8vbG9nNGpzPlxuICpcbiAqIENvcHlyaWdodCAyMDE2IFJvYmluIFNjaHVsdHogPGh0dHA6Ly9hbmlnZW5lcm8uY29tPlxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlXG4gKi9cblxuLyoqXG4gKiBIb2xkcyB0aGUgZGVmaW5pdGlvbiBmb3IgdGhlIGFwcGVuZGVyIGNsb3N1cmVcbiAqXG4gKiBAdHlwZWRlZiB7eyBhcHBlbmQgOiBmdW5jdGlvbiAobnVtYmVyLCBMT0dfRVZFTlQpLCBpc0FjdGl2ZSA6IGZ1bmN0aW9uKCksXG4gKiAgICAgICAgICBzZXRMb2dMZXZlbCA6IGZ1bmN0aW9uKG51bWJlciksIHNldExheW91dCA6IGZ1bmN0aW9uKHN0cmluZykgfX1cbiAqL1xubGV0IEFQUEVOREVSO1xuXG4vKipcbiAqIEB0eXBlZGVmIHt7IGFsbG93QXBwZW5kZXJJbmplY3Rpb24gOiBib29sZWFuLCBhcHBlbmRlcnMgOiBBcnJheS48QVBQRU5ERVI+LFxuICogXHRcdFx0YXBwbGljYXRpb24gOiBPYmplY3QsIGxvZ2dlcnMgOiBBcnJheS48TG9nQXBwZW5kZXI+LCBsYXlvdXQgOiBzdHJpbmcgfX1cbiAqL1xubGV0IENPTkZJR19QQVJBTVM7XG5cbmltcG9ydCAqIGFzIGZvcm1hdHRlciBmcm9tICcuL2Zvcm1hdHRlcic7XG5pbXBvcnQgKiBhcyB1dGlsaXR5IGZyb20gJy4vdXRpbGl0eSc7XG5pbXBvcnQge0xvZ0FwcGVuZGVyfSBmcm9tICcuL2FwcGVuZGVyL2FwcGVuZGVyJztcbmltcG9ydCB7TG9nZ2VyfSBmcm9tICcuL2xvZ2dlci9sb2dnZXInO1xuaW1wb3J0IHtMb2dMZXZlbH0gZnJvbSAnLi9jb25zdC9sb2dMZXZlbCc7XG5pbXBvcnQge0NvbnNvbGVBcHBlbmRlcn0gZnJvbSAnLi9hcHBlbmRlci9jb25zb2xlQXBwZW5kZXInO1xuXG4vKipcbiAqIFRoZSBuYW1lIG9mIHRoZSBtYWluIGxvZ2dlci4gV2UgdXNlIHRoaXMgaW4gY2FzZSBubyBsb2dnZXIgaXMgc3BlY2lmaWVkXG4gKiBAY29uc3RcbiAqL1xuY29uc3QgX01BSU5fTE9HR0VSID0gJ21haW4nO1xuXG4vKipcbiAqIFRoZSBkZWZhdWx0IGFwcGVuZGVycyB0aGF0IHNob3VsZCBiZSBpbmNsdWRlZCBpZiBubyBhcHBlbmRlcnMgYXJlIHNwZWNpZmllZFxuICogQGNvbnN0XG4gKi9cbmNvbnN0IF9ERUZBVUxUX0FQUEVOREVSUyA9IFt7XG4gICAgJ2FwcGVuZGVyJyA6IENvbnNvbGVBcHBlbmRlcixcbiAgICAnbGV2ZWwnIDogTG9nTGV2ZWwuSU5GT1xufV07XG5cbi8qKlxuICogVGhlIGRlZmF1bHQgY29uZmlndXJhdGlvbiBmb3IgbG9nNGpzMi4gSWYgbm8gY29uZmlndXJhdGlvbiBpcyBzcGVjaWZpZWQsIHRoZW4gdGhpc1xuICogY29uZmlndXJhdGlvbiB3aWxsIGJlIGluamVjdGVkXG4gKiBAY29uc3RcbiAqL1xuY29uc3QgX0RFRkFVTFRfQ09ORklHID0ge1xuICAgICdhbGxvd0FwcGVuZGVySW5qZWN0aW9uJyA6IHRydWUsXG4gICAgJ2FwcGVuZGVycycgOiBfREVGQVVMVF9BUFBFTkRFUlMsXG4gICAgJ2xvZ2dlcnMnIDogW3tcbiAgICAgICAgJ2xldmVsJyA6IExvZ0xldmVsLklORk9cbiAgICB9XSxcbiAgICAnbGF5b3V0JyA6ICclZCBbJXBdICVjIC0gJW0nXG59O1xuXG4vKipcbiAqIFRoZSBtZXRob2RzIHRoYXQgYW4gYXBwZW5kZXIgbXVzdCBjb250YWluXG4gKiBAY29uc3RcbiAqL1xuY29uc3QgX0FQUEVOREVSX01FVEhPRFMgPSBbJ2FwcGVuZCcsICdnZXROYW1lJywgJ2lzQWN0aXZlJywgJ3NldExvZ0xldmVsJywgJ3NldExheW91dCddO1xuXG4vKiogQHR5cGUge09iamVjdH0gKi9cbmxldCBfYXBwZW5kZXJzID0ge307XG4vKiogQHR5cGUgez9DT05GSUdfUEFSQU1TfSAqL1xubGV0IF9jb25maWd1cmF0aW9uID0gbnVsbDtcbi8qKiBAdHlwZSB7Ym9vbGVhbn0gKi9cbmxldCBfZmluYWxpemVkID0gZmFsc2U7XG4vKiogQHR5cGUge09iamVjdH0gKi9cbmxldCBfbG9nZ2VycyA9IHt9O1xuXG4vKipcbiAqIENvbmZpZ3VyZXMgdGhlIGxvZ2dlclxuICpcbiAqIEBmdW5jdGlvblxuICogQG1lbWJlck9mIGxvZzRqc1xuICpcbiAqIEBwYXJhbXMge0NPTkZJR19QQVJBTVN9IGNvbmZpZ1xuICovXG5leHBvcnQgZnVuY3Rpb24gY29uZmlndXJlKGNvbmZpZykge1xuXG5cdGlmIChfZmluYWxpemVkKSB7XG5cdFx0Y29uc29sZS5lcnJvcignQ291bGQgbm90IGNvbmZpZ3VyZSAtIGFscmVhZHkgaW4gdXNlJyk7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0aWYgKCFfY29uZmlndXJhdGlvbikge1xuICAgICAgICBfY29uZmlndXJhdGlvbiA9IHt9O1xuICAgIH1cblxuICAgIC8vIHNldCB0aGUgZGVmYXVsdCBsYXlvdXRcbiAgICBpZiAoIWNvbmZpZy5sYXlvdXQgJiYgIV9jb25maWd1cmF0aW9uLmxheW91dCkge1xuICAgICAgICBfY29uZmlndXJhdGlvbi5sYXlvdXQgPSBfREVGQVVMVF9DT05GSUcubGF5b3V0O1xuICAgIH0gZWxzZSBpZiAoY29uZmlnLmxheW91dCkge1xuICAgICAgICBfY29uZmlndXJhdGlvbi5sYXlvdXQgPSBjb25maWcubGF5b3V0O1xuICAgIH1cblxuXHQvLyBjb25maWd1cmUgdGhlIGFwcGVuZGVyc1xuXHRfY29uZmlndXJlQXBwZW5kZXJzKGNvbmZpZy5hcHBlbmRlcnMpO1xuICAgIC8vIGNvbmZpZ3VyZSB0aGUgbG9nZ2Vyc1xuICAgIF9jb25maWd1cmVMb2dnZXJzKGNvbmZpZy5sb2dnZXJzKTtcblxufVxuXG4vKipcbiAqIENvbmZpZ3VyZXMgYXBwZW5kZXJzXG4gKlxuICogQHByaXZhdGVcbiAqIEBmdW5jdGlvblxuICpcbiAqIEBwYXJhbSB7QXJyYXkuPExvZ0FwcGVuZGVyfGZ1bmN0aW9uPn0gYXBwZW5kZXJzXG4gKi9cbmxldCBfY29uZmlndXJlQXBwZW5kZXJzID0gZnVuY3Rpb24gKGFwcGVuZGVycykge1xuXG4gICAgaWYgKCEoYXBwZW5kZXJzIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICAgIGFwcGVuZGVycyA9IF9ERUZBVUxUX0FQUEVOREVSUztcbiAgICB9XG5cbiAgICBhcHBlbmRlcnMuZm9yRWFjaChhcHBlbmRlciA9PiB7XG4gICAgICAgIGlmIChhcHBlbmRlciBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgICAgICAgICBhZGRBcHBlbmRlcihhcHBlbmRlcik7XG4gICAgICAgIH1cbiAgICB9KTtcblxufTtcblxuLyoqXG4gKiBDb25maWd1cmVzIHRoZSBsb2dnZXJzXG4gKlxuICogQHByaXZhdGVcbiAqIEBmdW5jdGlvblxuICpcbiAqIEBwYXJhbSB7QXJyYXkuPE9iamVjdD59IGxvZ2dlcnNcbiAqL1xubGV0IF9jb25maWd1cmVMb2dnZXJzID0gZnVuY3Rpb24gKGxvZ2dlcnMpIHtcblxuXHRpZiAoIShsb2dnZXJzIGluc3RhbmNlb2YgQXJyYXkpKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGxvZ2dlcnMnKTtcblx0fVxuXG4gICAgbG9nZ2Vycy5mb3JFYWNoKGZ1bmN0aW9uIChsb2dnZXIpIHtcblxuICAgICAgICBpZiAoIWxvZ2dlci5sYXlvdXQgfHwgdHlwZW9mIGxvZ2dlci5sYXlvdXQgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBsb2dnZXIubGF5b3V0ID0gX2NvbmZpZ3VyYXRpb24ubGF5b3V0O1xuICAgICAgICB9XG5cbiAgICAgICAgbG9nZ2VyLnRhZyA9IGxvZ2dlci50YWcgfHwgX01BSU5fTE9HR0VSO1xuICAgICAgICBsb2dnZXIubG9nTGV2ZWwgPSBsb2dnZXIubG9nTGV2ZWwgfHwgTG9nTGV2ZWwuRVJST1I7XG5cbiAgICAgICAgX2xvZ2dlcnNbbG9nZ2VyLnRhZ10gPSBfZ2V0QXBwZW5kZXJzRm9yTG9nZ2VyKGxvZ2dlci5sb2dMZXZlbCwgbG9nZ2VyLmxheW91dCk7XG5cbiAgICB9KTtcblxufTtcblxuLyoqXG4gKiBHZXRzIHRoZSBhcHBlbmRlcnMgZm9yIHRoZSBsZXZlbCBhbmQgbGF5b3V0XG4gKlxuICogQHByaXZhdGVcbiAqIEBmdW5jdGlvblxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBsb2dMZXZlbFxuICogQHBhcmFtIHtzdHJpbmd9IGxheW91dFxuICpcbiAqIEByZXR1cm5zIHtBcnJheX1cbiAqL1xubGV0IF9nZXRBcHBlbmRlcnNGb3JMb2dnZXIgPSBmdW5jdGlvbiAobG9nTGV2ZWwsIGxheW91dCkge1xuXG4gICAgbGV0IGxvZ2dlcjtcbiAgICBsZXQgYXBwZW5kZXJMaXN0ID0gW107XG5cbiAgICBPYmplY3Qua2V5cyhfYXBwZW5kZXJzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblxuICAgICAgICBsb2dnZXIgPSAoX2FwcGVuZGVyc1trZXldLnByb3RvdHlwZSBpbnN0YW5jZW9mIExvZ0FwcGVuZGVyKSA/IG5ldyBfYXBwZW5kZXJzW2tleV0oKSA6IF9hcHBlbmRlcnNba2V5XSgpO1xuXG4gICAgICAgIGxvZ2dlci5zZXRMb2dMZXZlbChsb2dMZXZlbCk7XG4gICAgICAgIGxvZ2dlci5zZXRMYXlvdXQobGF5b3V0KTtcblxuICAgICAgICBhcHBlbmRlckxpc3QucHVzaChsb2dnZXIpO1xuXG4gICAgfSk7XG5cblx0cmV0dXJuIGFwcGVuZGVyTGlzdDtcblxufTtcblxuLyoqXG4gKiBBZGRzIGFuIGFwcGVuZGVyIHRvIHRoZSBhcHBlbmRlciBxdWV1ZS4gSWYgdGhlIHN0YWNrIGlzIGZpbmFsaXplZCwgYW5kXG4gKiB0aGUgYWxsb3dBcHBlbmRlckluamVjdGlvbiBpcyBzZXQgdG8gZmFsc2UsIHRoZW4gdGhlIGV2ZW50IHdpbGwgbm90IGJlXG4gKiBhcHBlbmRlZFxuICpcbiAqIEBmdW5jdGlvblxuICogQG1lbWJlck9mIGxvZzRqc1xuICpcbiAqIEBwYXJhbXMge0xvZ0FwcGVuZGVyfSBhcHBlbmRlclxuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkQXBwZW5kZXIoYXBwZW5kZXIpIHtcblxuXHRpZiAoX2ZpbmFsaXplZCAmJiAhX2NvbmZpZ3VyYXRpb24uYWxsb3dBcHBlbmRlckluamVjdGlvbikge1xuXHRcdGNvbnNvbGUuZXJyb3IoJ0Nhbm5vdCBhZGQgYXBwZW5kZXIgd2hlbiBjb25maWd1cmF0aW9uIGZpbmFsaXplZCcpO1xuXHRcdHJldHVybjtcblx0fVxuXG4gICAgX3ZhbGlkYXRlQXBwZW5kZXIoYXBwZW5kZXIpO1xuXG4gICAgLy8gb25seSBwdXQgdGhlIGFwcGVuZGVyIGludG8gdGhlIHNldCBpZiBpdCBkb2Vzbid0IGV4aXN0IGFscmVhZHlcbiAgICBpZiAoIV9hcHBlbmRlcnNbYXBwZW5kZXIubmFtZV0pIHtcbiAgICAgICAgX2FwcGVuZGVyc1thcHBlbmRlci5uYW1lXSA9IGFwcGVuZGVyO1xuICAgIH1cblxufVxuXG4vKipcbiAqIFZhbGlkYXRlcyB0aGF0IHRoZSBhcHBlbmRlclxuICpcbiAqIEBwcml2YXRlXG4gKiBAZnVuY3Rpb25cbiAqXG4gKiBAcGFyYW1zIHtBUFBFTkRFUn0gYXBwZW5kZXJcbiAqIEB0aHJvd3Mge0Vycm9yfSBpZiB0aGUgYXBwZW5kZXIgaXMgaW52YWxpZFxuICovXG5sZXQgX3ZhbGlkYXRlQXBwZW5kZXIgPSBmdW5jdGlvbiAoYXBwZW5kZXIpIHtcblxuICAgIC8vIGlmIHdlIGFyZSBydW5uaW5nIEVTNiwgd2UgY2FuIG1ha2Ugc3VyZSBpdCBleHRlbmRzIExvZ0FwcGVuZGVyXG4gICAgLy8gb3RoZXJ3aXNlLCBpdCBtdXN0IGJlIGEgZnVuY3Rpb25cbiAgICBpZiAoYXBwZW5kZXIucHJvdG90eXBlIGluc3RhbmNlb2YgTG9nQXBwZW5kZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSBpZiAoIShhcHBlbmRlciBpbnN0YW5jZW9mIEZ1bmN0aW9uKSkge1xuXHRcdHRocm93IG5ldyBFcnJvcignSW52YWxpZCBhcHBlbmRlcjogbm90IGEgZnVuY3Rpb24gb3IgY2xhc3MgTG9nQXBwZW5kZXInKTtcblx0fVxuXG5cdC8vIGluc3RhbnRpYXRlIHRoZSBhcHBlbmRlciBmdW5jdGlvblxuXHRsZXQgYXBwZW5kZXJPYmogPSBhcHBlbmRlcigpO1xuXG4gICAgLy8gZW5zdXJlIHRoYXQgdGhlIGFwcGVuZGVyIG1ldGhvZHMgYXJlIHByZXNlbnQgKGFuZCBhcmUgZnVuY3Rpb25zKVxuICAgIF9BUFBFTkRFUl9NRVRIT0RTLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgaWYgKGFwcGVuZGVyT2JqW2VsZW1lbnRdID09IHVuZGVmaW5lZCB8fCAhKGFwcGVuZGVyT2JqW2VsZW1lbnRdIGluc3RhbmNlb2YgRnVuY3Rpb24pKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgYXBwZW5kZXI6IG1pc3NpbmcvaW52YWxpZCBtZXRob2Q6ICR7ZWxlbWVudH1gKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG59O1xuXG4vKipcbiAqIEFwcGVuZHMgdGhlIGxvZyBldmVudFxuICpcbiAqIEBwcml2YXRlXG4gKiBAZnVuY3Rpb25cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gbG9nRXZlbnRcbiAqL1xuZnVuY3Rpb24gX2FwcGVuZChsb2dFdmVudCkge1xuXG5cdC8vIGZpbmFsaXplIHRoZSBjb25maWd1cmF0aW9uIHRvIG1ha2Ugc3VyZSBubyBvdGhlciBhcHBlbmRlciBjYW4gYmUgaW5qZWN0ZWQgKGlmIHNldClcblx0X2ZpbmFsaXplZCA9IHRydWU7XG5cbiAgICAvLyBjeWNsZSB0aHJvdWdoIGVhY2ggYXBwZW5kZXIgZm9yIHRoZSBsb2dnZXIgYW5kIGFwcGVuZCB0aGUgbG9nZ2luZyBldmVudFxuICAgIChfbG9nZ2Vyc1tsb2dFdmVudC5sb2dnZXJdIHx8IF9sb2dnZXJzW19NQUlOX0xPR0dFUl0pLmZvckVhY2goZnVuY3Rpb24gKGxvZ2dlcikge1xuICAgICAgICBpZiAobG9nZ2VyLmlzQWN0aXZlKGxvZ0V2ZW50LmxldmVsKSkge1xuICAgICAgICAgICAgbG9nZ2VyLmFwcGVuZChsb2dFdmVudCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxufVxuXG4vKipcbiAqIEhhbmRsZXMgY3JlYXRpbmcgdGhlIGxvZ2dlciBhbmQgcmV0dXJuaW5nIGl0XG4gKlxuICogQGZ1bmN0aW9uXG4gKiBAbWVtYmVyT2YgbG9nNGpzXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbnxzdHJpbmc9fSBjb250ZXh0XG4gKlxuICogQHJldHVybiB7TG9nZ2VyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TG9nZ2VyKGNvbnRleHQpIHtcblxuXHQvLyB3ZSBuZWVkIHRvIGluaXRpYWxpemUgaWYgd2UgaGF2ZW4ndFxuXHRpZiAoIV9jb25maWd1cmF0aW9uKSB7XG5cdFx0Y29uZmlndXJlKF9ERUZBVUxUX0NPTkZJRyk7XG5cdH1cblxuICAgIC8vIGRldGVybWluZSB0aGUgY29udGV4dFxuICAgIGlmICh0eXBlb2YgY29udGV4dCAhPSAnc3RyaW5nJykge1xuXG4gICAgICAgIGlmICh0eXBlb2YgY29udGV4dCA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjb250ZXh0ID0gdXRpbGl0eS5nZXRGdW5jdGlvbk5hbWUoY29udGV4dCk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGNvbnRleHQgPT0gJ29iamVjdCcpIHtcblxuICAgICAgICAgICAgY29udGV4dCA9IHV0aWxpdHkuZ2V0RnVuY3Rpb25OYW1lKGNvbnRleHQuY29uc3RydWN0b3IpO1xuXG4gICAgICAgICAgICBpZiAoY29udGV4dCA9PSAnT2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIGNvbnRleHQgPSAnYW5vbnltb3VzJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29udGV4dCA9IF9NQUlOX0xPR0dFUjtcbiAgICAgICAgfVxuXG4gICAgfVxuXG5cdHJldHVybiBuZXcgTG9nZ2VyKGNvbnRleHQsIHtcblx0XHQnYXBwZW5kJyA6IF9hcHBlbmRcblx0fSk7XG5cbn1cblxuXG5cbi8qKlxuICogU2V0cyB0aGUgbG9nIGxldmVsIGZvciBhbGwgYXBwZW5kZXJzIG9mIGEgbG9nZ2VyLCBvciBzcGVjaWZpZWQgbG9nZ2VyXG4gKlxuICogQGZ1bmN0aW9uXG4gKiBAbWVtYmVyT2YgbG9nNGpzXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IGxvZ0xldmVsXG4gKiBAcGFyYW0ge3N0cmluZz19IGxvZ2dlclxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0TG9nTGV2ZWwobG9nTGV2ZWwsIGxvZ2dlcikge1xuXG4gICAgaWYgKGxvZ0xldmVsIGluc3RhbmNlb2YgTnVtYmVyKSB7XG5cbiAgICAgICAgaWYgKGxvZ2dlcikge1xuICAgICAgICAgICAgaWYgKF9sb2dnZXJzW2xvZ2dlcl0pIHtcbiAgICAgICAgICAgICAgICBfbG9nZ2Vyc1tsb2dnZXJdLnNldExvZ0xldmVsKGxvZ0xldmVsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiBfbG9nZ2Vycykge1xuICAgICAgICAgICAgICAgIGlmIChfbG9nZ2Vycy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIF9sb2dnZXJzW2tleV0uZm9yRWFjaChmdW5jdGlvbiAoYXBwZW5kZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcGVuZGVyLnNldExvZ0xldmVsKGxvZ0xldmVsKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG5cbn1cblxuYWRkQXBwZW5kZXIoQ29uc29sZUFwcGVuZGVyKTtcblxuZXhwb3J0IHsgTG9nTGV2ZWwgfTtcbmV4cG9ydCB7IExvZ0FwcGVuZGVyIH07XG4iXX0=