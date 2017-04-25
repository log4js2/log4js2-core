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
    if (typeof context !== 'string') {

        if (typeof context === 'function') {
            context = utility.getFunctionName(context);
        } else if (typeof context === 'object') {

            context = utility.getFunctionName(context.constructor);

            if (context === 'Object') {
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

    if (Number.isInteger(logLevel)) {

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbImNvbmZpZ3VyZSIsImFkZEFwcGVuZGVyIiwiZ2V0TG9nZ2VyIiwic2V0TG9nTGV2ZWwiLCJmb3JtYXR0ZXIiLCJ1dGlsaXR5IiwiQVBQRU5ERVIiLCJDT05GSUdfUEFSQU1TIiwiX01BSU5fTE9HR0VSIiwiX0RFRkFVTFRfQVBQRU5ERVJTIiwiSU5GTyIsIl9ERUZBVUxUX0NPTkZJRyIsIl9BUFBFTkRFUl9NRVRIT0RTIiwiX2FwcGVuZGVycyIsIl9jb25maWd1cmF0aW9uIiwiX2ZpbmFsaXplZCIsIl9sb2dnZXJzIiwiY29uZmlnIiwiY29uc29sZSIsImVycm9yIiwibGF5b3V0IiwiX2NvbmZpZ3VyZUFwcGVuZGVycyIsImFwcGVuZGVycyIsIl9jb25maWd1cmVMb2dnZXJzIiwibG9nZ2VycyIsIkFycmF5IiwiZm9yRWFjaCIsImFwcGVuZGVyIiwiRnVuY3Rpb24iLCJFcnJvciIsImxvZ2dlciIsInRhZyIsImxvZ0xldmVsIiwiRVJST1IiLCJfZ2V0QXBwZW5kZXJzRm9yTG9nZ2VyIiwiYXBwZW5kZXJMaXN0IiwiT2JqZWN0Iiwia2V5cyIsImtleSIsInByb3RvdHlwZSIsInNldExheW91dCIsInB1c2giLCJhbGxvd0FwcGVuZGVySW5qZWN0aW9uIiwiX3ZhbGlkYXRlQXBwZW5kZXIiLCJuYW1lIiwiYXBwZW5kZXJPYmoiLCJlbGVtZW50IiwidW5kZWZpbmVkIiwiX2FwcGVuZCIsImxvZ0V2ZW50IiwiaXNBY3RpdmUiLCJsZXZlbCIsImFwcGVuZCIsImNvbnRleHQiLCJnZXRGdW5jdGlvbk5hbWUiLCJjb25zdHJ1Y3RvciIsIk51bWJlciIsImlzSW50ZWdlciIsImhhc093blByb3BlcnR5IiwiTG9nTGV2ZWwiLCJMb2dBcHBlbmRlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7O1FBZ0ZnQkEsUyxHQUFBQSxTO2dDQXFIQUMsVyxHQUFBQSxXO2dDQStFQUMsUyxHQUFBQSxTO2dDQTJDQUMsVyxHQUFBQSxXOztBQTFTaEI7OzRC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Ozs7Ozs7O0FBU08sU0FBUzdDLFdBQVQsQ0FBcUI2QixRQUFyQixFQUErQkYsTUFBL0IsRUFBdUM7O0FBRTFDLFFBQUkwQixPQUFPQyxTQUFQLENBQWlCekIsUUFBakIsQ0FBSixFQUFnQzs7QUFFNUIsWUFBSUYsTUFBSixFQUFZO0FBQ1IsZ0JBQUlkLFNBQVNjLE1BQVQsQ0FBSixFQUFzQjtBQUNsQmQseUJBQVNjLE1BQVQsRUFBaUIzQixXQUFqQixDQUE2QjZCLFFBQTdCO0FBQ0g7QUFDSixTQUpELE1BSU87QUFDSCxpQkFBSyxJQUFJTSxHQUFULElBQWdCdEIsUUFBaEIsRUFBMEI7QUFDdEIsb0JBQUlBLFNBQVMwQyxjQUFULENBQXdCcEIsR0FBeEIsQ0FBSixFQUFrQztBQUM5QnRCLDZCQUFTc0IsR0FBVCxFQUFjWixPQUFkLENBQXNCLFVBQVVDLFFBQVYsRUFBb0I7QUFDdENBLGlDQUFTeEIsV0FBVCxDQUFxQjZCLFFBQXJCO0FBQ0gscUJBRkQ7QUFHSDtBQUNKO0FBQ0o7QUFFSjtBQUVKOztBQUVEL0I7O2dDQUVTMEQsUTtnQ0FDQUMsVyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogbG9nNGpzIDxodHRwczovL2dpdGh1Yi5jb20vYW5pZ2VuZXJvL2xvZzRqcz5cbiAqXG4gKiBDb3B5cmlnaHQgMjAxNiBSb2JpbiBTY2h1bHR6IDxodHRwOi8vYW5pZ2VuZXJvLmNvbT5cbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZVxuICovXG5cbi8qKlxuICogSG9sZHMgdGhlIGRlZmluaXRpb24gZm9yIHRoZSBhcHBlbmRlciBjbG9zdXJlXG4gKlxuICogQHR5cGVkZWYge3sgYXBwZW5kIDogZnVuY3Rpb24gKG51bWJlciwgTE9HX0VWRU5UKSwgaXNBY3RpdmUgOiBmdW5jdGlvbigpLFxuICogICAgICAgICAgc2V0TG9nTGV2ZWwgOiBmdW5jdGlvbihudW1iZXIpLCBzZXRMYXlvdXQgOiBmdW5jdGlvbihzdHJpbmcpIH19XG4gKi9cbmxldCBBUFBFTkRFUjtcblxuLyoqXG4gKiBAdHlwZWRlZiB7eyBhbGxvd0FwcGVuZGVySW5qZWN0aW9uIDogYm9vbGVhbiwgYXBwZW5kZXJzIDogQXJyYXkuPEFQUEVOREVSPixcbiAqIFx0XHRcdGFwcGxpY2F0aW9uIDogT2JqZWN0LCBsb2dnZXJzIDogQXJyYXkuPExvZ0FwcGVuZGVyPiwgbGF5b3V0IDogc3RyaW5nIH19XG4gKi9cbmxldCBDT05GSUdfUEFSQU1TO1xuXG5pbXBvcnQgKiBhcyBmb3JtYXR0ZXIgZnJvbSAnLi9mb3JtYXR0ZXInO1xuaW1wb3J0ICogYXMgdXRpbGl0eSBmcm9tICcuL3V0aWxpdHknO1xuaW1wb3J0IHtMb2dBcHBlbmRlcn0gZnJvbSAnLi9hcHBlbmRlci9hcHBlbmRlcic7XG5pbXBvcnQge0xvZ2dlcn0gZnJvbSAnLi9sb2dnZXIvbG9nZ2VyJztcbmltcG9ydCB7TG9nTGV2ZWx9IGZyb20gJy4vY29uc3QvbG9nTGV2ZWwnO1xuaW1wb3J0IHtDb25zb2xlQXBwZW5kZXJ9IGZyb20gJy4vYXBwZW5kZXIvY29uc29sZUFwcGVuZGVyJztcblxuLyoqXG4gKiBUaGUgbmFtZSBvZiB0aGUgbWFpbiBsb2dnZXIuIFdlIHVzZSB0aGlzIGluIGNhc2Ugbm8gbG9nZ2VyIGlzIHNwZWNpZmllZFxuICogQGNvbnN0XG4gKi9cbmNvbnN0IF9NQUlOX0xPR0dFUiA9ICdtYWluJztcblxuLyoqXG4gKiBUaGUgZGVmYXVsdCBhcHBlbmRlcnMgdGhhdCBzaG91bGQgYmUgaW5jbHVkZWQgaWYgbm8gYXBwZW5kZXJzIGFyZSBzcGVjaWZpZWRcbiAqIEBjb25zdFxuICovXG5jb25zdCBfREVGQVVMVF9BUFBFTkRFUlMgPSBbe1xuICAgICdhcHBlbmRlcicgOiBDb25zb2xlQXBwZW5kZXIsXG4gICAgJ2xldmVsJyA6IExvZ0xldmVsLklORk9cbn1dO1xuXG4vKipcbiAqIFRoZSBkZWZhdWx0IGNvbmZpZ3VyYXRpb24gZm9yIGxvZzRqczIuIElmIG5vIGNvbmZpZ3VyYXRpb24gaXMgc3BlY2lmaWVkLCB0aGVuIHRoaXNcbiAqIGNvbmZpZ3VyYXRpb24gd2lsbCBiZSBpbmplY3RlZFxuICogQGNvbnN0XG4gKi9cbmNvbnN0IF9ERUZBVUxUX0NPTkZJRyA9IHtcbiAgICAnYWxsb3dBcHBlbmRlckluamVjdGlvbicgOiB0cnVlLFxuICAgICdhcHBlbmRlcnMnIDogX0RFRkFVTFRfQVBQRU5ERVJTLFxuICAgICdsb2dnZXJzJyA6IFt7XG4gICAgICAgICdsZXZlbCcgOiBMb2dMZXZlbC5JTkZPXG4gICAgfV0sXG4gICAgJ2xheW91dCcgOiAnJWQgWyVwXSAlYyAtICVtJ1xufTtcblxuLyoqXG4gKiBUaGUgbWV0aG9kcyB0aGF0IGFuIGFwcGVuZGVyIG11c3QgY29udGFpblxuICogQGNvbnN0XG4gKi9cbmNvbnN0IF9BUFBFTkRFUl9NRVRIT0RTID0gWydhcHBlbmQnLCAnZ2V0TmFtZScsICdpc0FjdGl2ZScsICdzZXRMb2dMZXZlbCcsICdzZXRMYXlvdXQnXTtcblxuLyoqIEB0eXBlIHtPYmplY3R9ICovXG5sZXQgX2FwcGVuZGVycyA9IHt9O1xuLyoqIEB0eXBlIHs/Q09ORklHX1BBUkFNU30gKi9cbmxldCBfY29uZmlndXJhdGlvbiA9IG51bGw7XG4vKiogQHR5cGUge2Jvb2xlYW59ICovXG5sZXQgX2ZpbmFsaXplZCA9IGZhbHNlO1xuLyoqIEB0eXBlIHtPYmplY3R9ICovXG5sZXQgX2xvZ2dlcnMgPSB7fTtcblxuLyoqXG4gKiBDb25maWd1cmVzIHRoZSBsb2dnZXJcbiAqXG4gKiBAZnVuY3Rpb25cbiAqIEBtZW1iZXJPZiBsb2c0anNcbiAqXG4gKiBAcGFyYW1zIHtDT05GSUdfUEFSQU1TfSBjb25maWdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbmZpZ3VyZShjb25maWcpIHtcblxuXHRpZiAoX2ZpbmFsaXplZCkge1xuXHRcdGNvbnNvbGUuZXJyb3IoJ0NvdWxkIG5vdCBjb25maWd1cmUgLSBhbHJlYWR5IGluIHVzZScpO1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGlmICghX2NvbmZpZ3VyYXRpb24pIHtcbiAgICAgICAgX2NvbmZpZ3VyYXRpb24gPSB7fTtcbiAgICB9XG5cbiAgICAvLyBzZXQgdGhlIGRlZmF1bHQgbGF5b3V0XG4gICAgaWYgKCFjb25maWcubGF5b3V0ICYmICFfY29uZmlndXJhdGlvbi5sYXlvdXQpIHtcbiAgICAgICAgX2NvbmZpZ3VyYXRpb24ubGF5b3V0ID0gX0RFRkFVTFRfQ09ORklHLmxheW91dDtcbiAgICB9IGVsc2UgaWYgKGNvbmZpZy5sYXlvdXQpIHtcbiAgICAgICAgX2NvbmZpZ3VyYXRpb24ubGF5b3V0ID0gY29uZmlnLmxheW91dDtcbiAgICB9XG5cblx0Ly8gY29uZmlndXJlIHRoZSBhcHBlbmRlcnNcblx0X2NvbmZpZ3VyZUFwcGVuZGVycyhjb25maWcuYXBwZW5kZXJzKTtcbiAgICAvLyBjb25maWd1cmUgdGhlIGxvZ2dlcnNcbiAgICBfY29uZmlndXJlTG9nZ2Vycyhjb25maWcubG9nZ2Vycyk7XG5cbn1cblxuLyoqXG4gKiBDb25maWd1cmVzIGFwcGVuZGVyc1xuICpcbiAqIEBwcml2YXRlXG4gKiBAZnVuY3Rpb25cbiAqXG4gKiBAcGFyYW0ge0FycmF5LjxMb2dBcHBlbmRlcnxmdW5jdGlvbj59IGFwcGVuZGVyc1xuICovXG5sZXQgX2NvbmZpZ3VyZUFwcGVuZGVycyA9IGZ1bmN0aW9uIChhcHBlbmRlcnMpIHtcblxuICAgIGlmICghKGFwcGVuZGVycyBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgICBhcHBlbmRlcnMgPSBfREVGQVVMVF9BUFBFTkRFUlM7XG4gICAgfVxuXG4gICAgYXBwZW5kZXJzLmZvckVhY2goYXBwZW5kZXIgPT4ge1xuICAgICAgICBpZiAoYXBwZW5kZXIgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgICAgICAgICAgYWRkQXBwZW5kZXIoYXBwZW5kZXIpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbn07XG5cbi8qKlxuICogQ29uZmlndXJlcyB0aGUgbG9nZ2Vyc1xuICpcbiAqIEBwcml2YXRlXG4gKiBAZnVuY3Rpb25cbiAqXG4gKiBAcGFyYW0ge0FycmF5LjxPYmplY3Q+fSBsb2dnZXJzXG4gKi9cbmxldCBfY29uZmlndXJlTG9nZ2VycyA9IGZ1bmN0aW9uIChsb2dnZXJzKSB7XG5cblx0aWYgKCEobG9nZ2VycyBpbnN0YW5jZW9mIEFycmF5KSkge1xuXHRcdHRocm93IG5ldyBFcnJvcignSW52YWxpZCBsb2dnZXJzJyk7XG5cdH1cblxuICAgIGxvZ2dlcnMuZm9yRWFjaChmdW5jdGlvbiAobG9nZ2VyKSB7XG5cbiAgICAgICAgaWYgKCFsb2dnZXIubGF5b3V0IHx8IHR5cGVvZiBsb2dnZXIubGF5b3V0ICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgbG9nZ2VyLmxheW91dCA9IF9jb25maWd1cmF0aW9uLmxheW91dDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxvZ2dlci50YWcgPSBsb2dnZXIudGFnIHx8IF9NQUlOX0xPR0dFUjtcbiAgICAgICAgbG9nZ2VyLmxvZ0xldmVsID0gbG9nZ2VyLmxvZ0xldmVsIHx8IExvZ0xldmVsLkVSUk9SO1xuXG4gICAgICAgIF9sb2dnZXJzW2xvZ2dlci50YWddID0gX2dldEFwcGVuZGVyc0ZvckxvZ2dlcihsb2dnZXIubG9nTGV2ZWwsIGxvZ2dlci5sYXlvdXQpO1xuXG4gICAgfSk7XG5cbn07XG5cbi8qKlxuICogR2V0cyB0aGUgYXBwZW5kZXJzIGZvciB0aGUgbGV2ZWwgYW5kIGxheW91dFxuICpcbiAqIEBwcml2YXRlXG4gKiBAZnVuY3Rpb25cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gbG9nTGV2ZWxcbiAqIEBwYXJhbSB7c3RyaW5nfSBsYXlvdXRcbiAqXG4gKiBAcmV0dXJucyB7QXJyYXl9XG4gKi9cbmxldCBfZ2V0QXBwZW5kZXJzRm9yTG9nZ2VyID0gZnVuY3Rpb24gKGxvZ0xldmVsLCBsYXlvdXQpIHtcblxuICAgIGxldCBsb2dnZXI7XG4gICAgbGV0IGFwcGVuZGVyTGlzdCA9IFtdO1xuXG4gICAgT2JqZWN0LmtleXMoX2FwcGVuZGVycykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cbiAgICAgICAgbG9nZ2VyID0gKF9hcHBlbmRlcnNba2V5XS5wcm90b3R5cGUgaW5zdGFuY2VvZiBMb2dBcHBlbmRlcikgPyBuZXcgX2FwcGVuZGVyc1trZXldKCkgOiBfYXBwZW5kZXJzW2tleV0oKTtcblxuICAgICAgICBsb2dnZXIuc2V0TG9nTGV2ZWwobG9nTGV2ZWwpO1xuICAgICAgICBsb2dnZXIuc2V0TGF5b3V0KGxheW91dCk7XG5cbiAgICAgICAgYXBwZW5kZXJMaXN0LnB1c2gobG9nZ2VyKTtcblxuICAgIH0pO1xuXG5cdHJldHVybiBhcHBlbmRlckxpc3Q7XG5cbn07XG5cbi8qKlxuICogQWRkcyBhbiBhcHBlbmRlciB0byB0aGUgYXBwZW5kZXIgcXVldWUuIElmIHRoZSBzdGFjayBpcyBmaW5hbGl6ZWQsIGFuZFxuICogdGhlIGFsbG93QXBwZW5kZXJJbmplY3Rpb24gaXMgc2V0IHRvIGZhbHNlLCB0aGVuIHRoZSBldmVudCB3aWxsIG5vdCBiZVxuICogYXBwZW5kZWRcbiAqXG4gKiBAZnVuY3Rpb25cbiAqIEBtZW1iZXJPZiBsb2c0anNcbiAqXG4gKiBAcGFyYW1zIHtMb2dBcHBlbmRlcn0gYXBwZW5kZXJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZEFwcGVuZGVyKGFwcGVuZGVyKSB7XG5cblx0aWYgKF9maW5hbGl6ZWQgJiYgIV9jb25maWd1cmF0aW9uLmFsbG93QXBwZW5kZXJJbmplY3Rpb24pIHtcblx0XHRjb25zb2xlLmVycm9yKCdDYW5ub3QgYWRkIGFwcGVuZGVyIHdoZW4gY29uZmlndXJhdGlvbiBmaW5hbGl6ZWQnKTtcblx0XHRyZXR1cm47XG5cdH1cblxuICAgIF92YWxpZGF0ZUFwcGVuZGVyKGFwcGVuZGVyKTtcblxuICAgIC8vIG9ubHkgcHV0IHRoZSBhcHBlbmRlciBpbnRvIHRoZSBzZXQgaWYgaXQgZG9lc24ndCBleGlzdCBhbHJlYWR5XG4gICAgaWYgKCFfYXBwZW5kZXJzW2FwcGVuZGVyLm5hbWVdKSB7XG4gICAgICAgIF9hcHBlbmRlcnNbYXBwZW5kZXIubmFtZV0gPSBhcHBlbmRlcjtcbiAgICB9XG5cbn1cblxuLyoqXG4gKiBWYWxpZGF0ZXMgdGhhdCB0aGUgYXBwZW5kZXJcbiAqXG4gKiBAcHJpdmF0ZVxuICogQGZ1bmN0aW9uXG4gKlxuICogQHBhcmFtcyB7QVBQRU5ERVJ9IGFwcGVuZGVyXG4gKiBAdGhyb3dzIHtFcnJvcn0gaWYgdGhlIGFwcGVuZGVyIGlzIGludmFsaWRcbiAqL1xubGV0IF92YWxpZGF0ZUFwcGVuZGVyID0gZnVuY3Rpb24gKGFwcGVuZGVyKSB7XG5cbiAgICAvLyBpZiB3ZSBhcmUgcnVubmluZyBFUzYsIHdlIGNhbiBtYWtlIHN1cmUgaXQgZXh0ZW5kcyBMb2dBcHBlbmRlclxuICAgIC8vIG90aGVyd2lzZSwgaXQgbXVzdCBiZSBhIGZ1bmN0aW9uXG4gICAgaWYgKGFwcGVuZGVyLnByb3RvdHlwZSBpbnN0YW5jZW9mIExvZ0FwcGVuZGVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9IGVsc2UgaWYgKCEoYXBwZW5kZXIgaW5zdGFuY2VvZiBGdW5jdGlvbikpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgYXBwZW5kZXI6IG5vdCBhIGZ1bmN0aW9uIG9yIGNsYXNzIExvZ0FwcGVuZGVyJyk7XG5cdH1cblxuXHQvLyBpbnN0YW50aWF0ZSB0aGUgYXBwZW5kZXIgZnVuY3Rpb25cblx0bGV0IGFwcGVuZGVyT2JqID0gYXBwZW5kZXIoKTtcblxuICAgIC8vIGVuc3VyZSB0aGF0IHRoZSBhcHBlbmRlciBtZXRob2RzIGFyZSBwcmVzZW50IChhbmQgYXJlIGZ1bmN0aW9ucylcbiAgICBfQVBQRU5ERVJfTUVUSE9EUy5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIGlmIChhcHBlbmRlck9ialtlbGVtZW50XSA9PSB1bmRlZmluZWQgfHwgIShhcHBlbmRlck9ialtlbGVtZW50XSBpbnN0YW5jZW9mIEZ1bmN0aW9uKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGFwcGVuZGVyOiBtaXNzaW5nL2ludmFsaWQgbWV0aG9kOiAke2VsZW1lbnR9YCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxufTtcblxuLyoqXG4gKiBBcHBlbmRzIHRoZSBsb2cgZXZlbnRcbiAqXG4gKiBAcHJpdmF0ZVxuICogQGZ1bmN0aW9uXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGxvZ0V2ZW50XG4gKi9cbmZ1bmN0aW9uIF9hcHBlbmQobG9nRXZlbnQpIHtcblxuXHQvLyBmaW5hbGl6ZSB0aGUgY29uZmlndXJhdGlvbiB0byBtYWtlIHN1cmUgbm8gb3RoZXIgYXBwZW5kZXIgY2FuIGJlIGluamVjdGVkIChpZiBzZXQpXG5cdF9maW5hbGl6ZWQgPSB0cnVlO1xuXG4gICAgLy8gY3ljbGUgdGhyb3VnaCBlYWNoIGFwcGVuZGVyIGZvciB0aGUgbG9nZ2VyIGFuZCBhcHBlbmQgdGhlIGxvZ2dpbmcgZXZlbnRcbiAgICAoX2xvZ2dlcnNbbG9nRXZlbnQubG9nZ2VyXSB8fCBfbG9nZ2Vyc1tfTUFJTl9MT0dHRVJdKS5mb3JFYWNoKGZ1bmN0aW9uIChsb2dnZXIpIHtcbiAgICAgICAgaWYgKGxvZ2dlci5pc0FjdGl2ZShsb2dFdmVudC5sZXZlbCkpIHtcbiAgICAgICAgICAgIGxvZ2dlci5hcHBlbmQobG9nRXZlbnQpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbn1cblxuLyoqXG4gKiBIYW5kbGVzIGNyZWF0aW5nIHRoZSBsb2dnZXIgYW5kIHJldHVybmluZyBpdFxuICpcbiAqIEBmdW5jdGlvblxuICogQG1lbWJlck9mIGxvZzRqc1xuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb258c3RyaW5nPX0gY29udGV4dFxuICpcbiAqIEByZXR1cm4ge0xvZ2dlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldExvZ2dlcihjb250ZXh0KSB7XG5cblx0Ly8gd2UgbmVlZCB0byBpbml0aWFsaXplIGlmIHdlIGhhdmVuJ3Rcblx0aWYgKCFfY29uZmlndXJhdGlvbikge1xuXHRcdGNvbmZpZ3VyZShfREVGQVVMVF9DT05GSUcpO1xuXHR9XG5cbiAgICAvLyBkZXRlcm1pbmUgdGhlIGNvbnRleHRcbiAgICBpZiAodHlwZW9mIGNvbnRleHQgIT09ICdzdHJpbmcnKSB7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBjb250ZXh0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjb250ZXh0ID0gdXRpbGl0eS5nZXRGdW5jdGlvbk5hbWUoY29udGV4dCk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGNvbnRleHQgPT09ICdvYmplY3QnKSB7XG5cbiAgICAgICAgICAgIGNvbnRleHQgPSB1dGlsaXR5LmdldEZ1bmN0aW9uTmFtZShjb250ZXh0LmNvbnN0cnVjdG9yKTtcblxuICAgICAgICAgICAgaWYgKGNvbnRleHQgPT09ICdPYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgY29udGV4dCA9ICdhbm9ueW1vdXMnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb250ZXh0ID0gX01BSU5fTE9HR0VSO1xuICAgICAgICB9XG5cbiAgICB9XG5cblx0cmV0dXJuIG5ldyBMb2dnZXIoY29udGV4dCwge1xuXHRcdCdhcHBlbmQnIDogX2FwcGVuZFxuXHR9KTtcblxufVxuXG5cblxuLyoqXG4gKiBTZXRzIHRoZSBsb2cgbGV2ZWwgZm9yIGFsbCBhcHBlbmRlcnMgb2YgYSBsb2dnZXIsIG9yIHNwZWNpZmllZCBsb2dnZXJcbiAqXG4gKiBAZnVuY3Rpb25cbiAqIEBtZW1iZXJPZiBsb2c0anNcbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gbG9nTGV2ZWxcbiAqIEBwYXJhbSB7c3RyaW5nPX0gbG9nZ2VyXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRMb2dMZXZlbChsb2dMZXZlbCwgbG9nZ2VyKSB7XG5cbiAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcihsb2dMZXZlbCkpIHtcblxuICAgICAgICBpZiAobG9nZ2VyKSB7XG4gICAgICAgICAgICBpZiAoX2xvZ2dlcnNbbG9nZ2VyXSkge1xuICAgICAgICAgICAgICAgIF9sb2dnZXJzW2xvZ2dlcl0uc2V0TG9nTGV2ZWwobG9nTGV2ZWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9yIChsZXQga2V5IGluIF9sb2dnZXJzKSB7XG4gICAgICAgICAgICAgICAgaWYgKF9sb2dnZXJzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgX2xvZ2dlcnNba2V5XS5mb3JFYWNoKGZ1bmN0aW9uIChhcHBlbmRlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXBwZW5kZXIuc2V0TG9nTGV2ZWwobG9nTGV2ZWwpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH1cblxufVxuXG5hZGRBcHBlbmRlcihDb25zb2xlQXBwZW5kZXIpO1xuXG5leHBvcnQgeyBMb2dMZXZlbCB9O1xuZXhwb3J0IHsgTG9nQXBwZW5kZXIgfTtcbiJdfQ==