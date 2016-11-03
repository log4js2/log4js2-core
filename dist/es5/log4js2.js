(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["log4js"] = factory();
	else
		root["log4js"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';

	exports.__esModule = true;
	exports.LogAppender = exports.LogLevel = undefined;

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	exports.configure = configure;
	/*istanbul ignore next*/exports.addAppender = addAppender;
	/*istanbul ignore next*/exports.getLogger = getLogger;
	/*istanbul ignore next*/exports.setLogLevel = setLogLevel;

	var /*istanbul ignore next*/_formatter = __webpack_require__(1);

	/*istanbul ignore next*/
	var formatter = _interopRequireWildcard(_formatter);

	var /*istanbul ignore next*/_utility = __webpack_require__(3);

	/*istanbul ignore next*/
	var utility = _interopRequireWildcard(_utility);

	var /*istanbul ignore next*/_appender = __webpack_require__(7);

	var /*istanbul ignore next*/_logger = __webpack_require__(8);

	var /*istanbul ignore next*/_logLevel = __webpack_require__(4);

	var /*istanbul ignore next*/_consoleAppender = __webpack_require__(9);

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

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';

	exports.__esModule = true;
	exports.preCompile = preCompile;
	/*istanbul ignore next*/exports.format = format;

	var /*istanbul ignore next*/_dateFormatter = __webpack_require__(2);

	var /*istanbul ignore next*/_utility = __webpack_require__(3);

	/*istanbul ignore next*/
	var utility = _interopRequireWildcard(_utility);

	var /*istanbul ignore next*/_logLevel = __webpack_require__(4);

	/*istanbul ignore next*/
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	/** @const */
	var _COMMAND_REGEX = /%([a-z,A-Z]+)(?=\{|)/;

	/** @type {Object} */
	/**
	 * log4js <https://github.com/anigenero/log4js>
	 *
	 * Copyright 2016-present Robin Schultz <http://anigenero.com>
	 * Released under the MIT License
	 */

	var _compiledLayouts = {};

	/**
	 * @function
	 * @memberOf formatter
	 *
	 * @param {LOG_EVENT} logEvent
	 *
	 * @return {string}
	 */
	var _formatLogger = function _formatLogger(logEvent) {
	  return logEvent.logger;
	};

	/**
	 * @function
	 * @memberOf formatter
	 *
	 * @param {LOG_EVENT} logEvent
	 * @param {Array.<string>} params
	 *
	 * @return {string}
	 */
	var _formatDate = function _formatDate(logEvent, params) {
	  return (/*istanbul ignore next*/(0, _dateFormatter.dateFormat)(logEvent.date, params[0])
	  );
	};

	/**
	 * @function
	 * @memberOf formatter
	 *
	 * @param {LOG_EVENT} logEvent
	 *
	 * @return {string}
	 */
	var _formatException = function _formatException(logEvent) {

	  var message = '';

	  if (logEvent.error != null) {

	    if (logEvent.error.stack != undefined) {
	      var stacks = logEvent.error.stack.split(/\n/g);
	      stacks.forEach(function (stack) {
	        message += /*istanbul ignore next*/'\t' + stack + '\n';
	      });
	    } else if (logEvent.error.message != null && logEvent.error.message != '') {
	      message += /*istanbul ignore next*/'\t' + logEvent.error.name + ': ' + logEvent.error.message + '\n';
	    }
	  }

	  return message;
	};

	/**
	 * Formats the file (e.g. test.js) to the file
	 *
	 * @private
	 * @function
	 * @memberOf formatter
	 *
	 * @param {LOG_EVENT} logEvent
	 */
	var _formatFile = function _formatFile(logEvent) {

	  if (!logEvent.file) {
	    _getFileDetails(logEvent);
	  }

	  return logEvent.file;
	};

	/**
	 * @function
	 * @memberOf formatter
	 *
	 * @param {LOG_EVENT} logEvent
	 *
	 * @return {string}
	 */
	var _formatLineNumber = function _formatLineNumber(logEvent) {

	  if (!logEvent.lineNumber) {
	    _getFileDetails(logEvent);
	  }

	  return (/*istanbul ignore next*/'' + logEvent.lineNumber
	  );
	};

	/**
	 * @function
	 * @memberOf formatter
	 *
	 * @param {LOG_EVENT} logEvent
	 * @param {Array.<string>} params
	 *
	 * @return {string}
	 */
	var _formatMapMessage = function _formatMapMessage(logEvent, params) {
	  var message = null;
	  if (logEvent.properties) {

	    message = [];
	    for (var key in logEvent.properties) {
	      if (params[0]) {
	        if (params[0] == key) {
	          message.push(logEvent.properties[key]);
	        }
	      } else {
	        message.push('{' + key + ',' + logEvent.properties[key] + '}');
	      }
	    }

	    return '{' + message.join(',') + '}';
	  }
	  return message;
	};

	/**
	 * @function
	 * @memberOf formatter
	 *
	 * @param {LOG_EVENT} logEvent
	 *
	 * @return {string}
	 */
	var _formatLogMessage = function _formatLogMessage(logEvent) {
	  return logEvent.message;
	};

	/**
	 * @function
	 * @memberOf formatter
	 *
	 * @param {LOG_EVENT} logEvent
	 *
	 * @return {string}
	 */
	var _formatMethodName = function _formatMethodName(logEvent) {
	  return utility.getFunctionName(logEvent.method);
	};

	/**
	 * @private
	 * @function
	 * @memberOf formatter
	 */
	var _formatLineSeparator = function _formatLineSeparator() {
	  return '\n';
	};

	/**
	 * @function
	 * @memberOf formatter
	 *
	 * @param {LOG_EVENT} logEvent
	 *
	 * @return {string}
	 */
	var _formatLevel = function _formatLevel(logEvent) {

	  switch (logEvent.level) {

	    case /*istanbul ignore next*/_logLevel.LogLevel.FATAL:
	      return 'FATAL';
	    case /*istanbul ignore next*/_logLevel.LogLevel.ERROR:
	      return 'ERROR';
	    case /*istanbul ignore next*/_logLevel.LogLevel.WARN:
	      return 'WARN';
	    case /*istanbul ignore next*/_logLevel.LogLevel.INFO:
	      return 'INFO';
	    case /*istanbul ignore next*/_logLevel.LogLevel.DEBUG:
	      return 'DEBUG';
	    case /*istanbul ignore next*/_logLevel.LogLevel.TRACE:
	    default:
	      return 'TRACE';

	  }
	};

	/**
	 * @function
	 * @memberOf formatter
	 *
	 * @param {LOG_EVENT} logEvent
	 *
	 * @return {string}
	 */
	var _formatRelative = function _formatRelative(logEvent) {
	  return '' + logEvent.relative;
	};

	/**
	 * @function
	 * @memberOf formatter
	 *
	 * @param {LOG_EVENT} logEvent
	 *
	 * @return {string}
	 */
	var _formatSequenceNumber = function _formatSequenceNumber(logEvent) {
	  return '' + logEvent.sequence;
	};

	var _formatters = {
	  'c|logger': _formatLogger,
	  'd|date': _formatDate,
	  'ex|exception|throwable': _formatException,
	  'F|file': _formatFile,
	  'K|map|MAP': _formatMapMessage,
	  'L|line': _formatLineNumber,
	  'm|msg|message': _formatLogMessage,
	  'M|method': _formatMethodName,
	  'n': _formatLineSeparator,
	  'p|level': _formatLevel,
	  'r|relative': _formatRelative,
	  'sn|sequenceNumber': _formatSequenceNumber
	};

	/**
	 * Get the compiled layout for the specified layout string. If the compiled layout does not
	 * exist, then we want to create it.
	 *
	 * @function
	 * @memberOf formatter
	 *
	 * @param {string} layout
	 *
	 * @return {Array.<string|function>}
	 */
	var _getCompiledLayout = function _getCompiledLayout(layout) {

	  if (_compiledLayouts[layout]) {
	    return _compiledLayouts[layout];
	  }

	  return _compileLayout(layout);
	};

	/**
	 * Compiles a layout into an array. The array contains functions
	 *
	 * @function
	 * @memberOf formatter
	 *
	 * @param {string} layout
	 *
	 * @return {Array.<string|function>}
	 */
	var _compileLayout = function _compileLayout(layout) {

	  var index = layout.indexOf('%');
	  var currentFormatString = '';
	  var formatArray = [];

	  if (index != 0) {
	    formatArray.push(layout.substring(0, index));
	  }

	  do {

	    var startIndex = index;
	    var endIndex = index = layout.indexOf('%', index + 1);

	    if (endIndex < 0) {
	      currentFormatString = layout.substring(startIndex);
	    } else {
	      currentFormatString = layout.substring(startIndex, endIndex);
	    }

	    formatArray.push(_getFormatterObject(currentFormatString));
	  } while (index > -1);

	  // set the format array to the specified compiled layout
	  _compiledLayouts[layout] = formatArray;

	  return formatArray;
	};

	/**
	 * @function
	 * @memberOf formatter
	 *
	 * @param {string} formatString
	 *
	 * @return {Object|string}
	 */
	var _getFormatterObject = function _getFormatterObject(formatString) {

	  var result = _COMMAND_REGEX.exec(formatString);
	  if (result != null && result.length == 2) {

	    var formatter = _getFormatterFunction(result[1]);
	    if (!formatter) {
	      return null;
	    }

	    var params = _getLayoutTagParams(formatString);

	    var after = '';
	    var endIndex = formatString.lastIndexOf('}');
	    if (endIndex != -1) {
	      after = formatString.substring(endIndex + 1);
	    } else {
	      after = formatString.substring(result.index + result[1].length + 1);
	    }

	    return {
	      'formatter': formatter,
	      'params': params,
	      'after': after
	    };
	  }

	  return formatString;
	};

	/**
	 * Determines what formatter function has been configured
	 *
	 * @function
	 * @memberOf formatter
	 *
	 * @param {string} command
	 *
	 * @return {?string}
	 */
	var _getFormatterFunction = function _getFormatterFunction(command) {

	  var regex = /*istanbul ignore next*/void 0;
	  for (var key in _formatters) {
	    if (_formatters.hasOwnProperty(key)) {
	      regex = new RegExp('^(' + key + ')$');
	      if (regex.exec(command)) {
	        return _formatters[key];
	      }
	    }
	  }

	  return null;
	};

	/**
	 * Gets the layout tag params associated with the layout tag. So, for example, '%d{yyyy-MM-dd}`
	 * would output an array of ['yyyy-MM-dd']
	 *
	 * @private
	 * @function
	 *
	 * @param {string} command
	 *
	 * @return {Array.<string>}
	 */
	var _getLayoutTagParams = function _getLayoutTagParams(command) {

	  var params = [];
	  var result = command.match(/\{([^}]*)(?=})/g);
	  if (result != null) {
	    for (var i = 0; i < result.length; i++) {
	      params.push(result[i].substring(1));
	    }
	  }

	  return params;
	};

	/**
	 * Handles formatting the log event using the specified formatter array
	 *
	 * @private
	 * @function
	 *
	 * @param {Array.<function|string>} formatter
	 * @param {LOG_EVENT} logEvent
	 *
	 * @return {string}
	 */
	var _formatLogEvent = function _formatLogEvent(formatter, logEvent) {

	  var response = /*istanbul ignore next*/void 0;
	  var message = '';
	  var count = formatter.length;
	  for (var i = 0; i < count; i++) {
	    if (formatter[i] !== null) {

	      if (formatter[i] instanceof Object) {

	        response = formatter[i].formatter(logEvent, formatter[i].params);
	        if (response != null) {
	          message += response;
	        }
	        message += formatter[i].after;
	      } else {
	        message += formatter[i];
	      }
	    }
	  }

	  return message.trim();
	};

	/**
	 *
	 * @private
	 * @function
	 * @memberOf formatter
	 *
	 * @param {LOG_EVENT} logEvent
	 */
	var _getFileDetails = function _getFileDetails(logEvent) {

	  if (logEvent.logErrorStack) {

	    var parts = logEvent.logErrorStack.stack.split(/\n/g);
	    var file = parts[3];
	    file = file.replace(/at (.*\(|)(file|http|https|)(:|)(\/|)*/, '');
	    file = file.replace(')', '');
	    file = file.replace(typeof location !== 'undefined' ? location.host : '', '').trim();

	    var fileParts = file.split(/\:/g);

	    logEvent.column = fileParts.pop();
	    logEvent.lineNumber = fileParts.pop();

	    if (true) {
	      var path = __webpack_require__(5);
	      var appDir = path.dirname(__webpack_require__.c[0].filename);
	      logEvent.filename = fileParts.join(':').replace(appDir, '').replace(/(\\|\/)/, '');
	    } else {
	      logEvent.filename = fileParts.join(':');
	    }
	  } else {

	    logEvent.column = '?';
	    logEvent.filename = 'anonymous';
	    logEvent.lineNumber = '?';
	  }
	};

	/**
	 * @function
	 * @memberOf formatter
	 *
	 * @param {string} layout
	 *
	 * @return {string}
	 */
	function preCompile(layout) {
	  _getCompiledLayout(layout);
	}

	/**
	 * @function
	 * @memberOf formatter
	 *
	 * @param {string} layout
	 * @param {LOG_EVENT} logEvent
	 *
	 * @return {string}
	 */
	function format(layout, logEvent) {
	  return _formatLogEvent(_getCompiledLayout(layout), logEvent);
	}
	//# sourceMappingURL=data:application/json;base64,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aEQsRUFBMkQsRUFBM0QsQ0FBcEIsQ0FIa0M7S0FBbkMsTUFJTztBQUNOLGVBQVMsUUFBVCxHQUFvQixVQUFVLElBQVYsQ0FBZSxHQUFmLENBQXBCLENBRE07S0FKUDtHQWJELE1BcUJPOztBQUVOLGFBQVMsTUFBVCxHQUFrQixHQUFsQixDQUZNO0FBR04sYUFBUyxRQUFULEdBQW9CLFdBQXBCLENBSE07QUFJTixhQUFTLFVBQVQsR0FBc0IsR0FBdEIsQ0FKTTtHQXJCUDtDQUZxQjs7Ozs7Ozs7OztBQXlDZixTQUFTLFVBQVQsQ0FBb0IsTUFBcEIsRUFBNEI7QUFDbEMscUJBQW1CLE1BQW5CLEVBRGtDO0NBQTVCOzs7Ozs7Ozs7OztBQWFBLFNBQVMsTUFBVCxDQUFnQixNQUFoQixFQUF3QixRQUF4QixFQUFrQztBQUN4QyxTQUFPLGdCQUFnQixtQkFBbUIsTUFBbkIsQ0FBaEIsRUFBNEMsUUFBNUMsQ0FBUCxDQUR3QztDQUFsQyIsImZpbGUiOiJmb3JtYXR0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogbG9nNGpzIDxodHRwczovL2dpdGh1Yi5jb20vYW5pZ2VuZXJvL2xvZzRqcz5cclxuICpcclxuICogQ29weXJpZ2h0IDIwMTYtcHJlc2VudCBSb2JpbiBTY2h1bHR6IDxodHRwOi8vYW5pZ2VuZXJvLmNvbT5cclxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlXHJcbiAqL1xyXG5cclxuaW1wb3J0IHtkYXRlRm9ybWF0fSBmcm9tICcuL2RhdGVGb3JtYXR0ZXInO1xyXG5pbXBvcnQgKiBhcyB1dGlsaXR5IGZyb20gJy4vdXRpbGl0eSc7XHJcbmltcG9ydCB7TG9nTGV2ZWx9IGZyb20gJy4vY29uc3QvbG9nTGV2ZWwnO1xyXG5cclxuLyoqIEBjb25zdCAqL1xyXG5jb25zdCBfQ09NTUFORF9SRUdFWCA9IC8lKFthLXosQS1aXSspKD89XFx7fCkvO1xyXG5cclxuLyoqIEB0eXBlIHtPYmplY3R9ICovXHJcbmxldCBfY29tcGlsZWRMYXlvdXRzID0ge307XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcclxuICpcclxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XHJcbiAqXHJcbiAqIEByZXR1cm4ge3N0cmluZ31cclxuICovXHJcbmxldCBfZm9ybWF0TG9nZ2VyID0gZnVuY3Rpb24gKGxvZ0V2ZW50KSB7XHJcblx0cmV0dXJuIGxvZ0V2ZW50LmxvZ2dlcjtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGZvcm1hdHRlclxyXG4gKlxyXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcclxuICogQHBhcmFtIHtBcnJheS48c3RyaW5nPn0gcGFyYW1zXHJcbiAqXHJcbiAqIEByZXR1cm4ge3N0cmluZ31cclxuICovXHJcbmxldCBfZm9ybWF0RGF0ZSA9IGZ1bmN0aW9uIChsb2dFdmVudCwgcGFyYW1zKSB7XHJcblx0cmV0dXJuIGRhdGVGb3JtYXQobG9nRXZlbnQuZGF0ZSwgcGFyYW1zWzBdKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGZvcm1hdHRlclxyXG4gKlxyXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcclxuICpcclxuICogQHJldHVybiB7c3RyaW5nfVxyXG4gKi9cclxubGV0IF9mb3JtYXRFeGNlcHRpb24gPSBmdW5jdGlvbiAobG9nRXZlbnQpIHtcclxuXHJcbiAgICBsZXQgbWVzc2FnZSA9ICcnO1xyXG5cclxuICAgIGlmIChsb2dFdmVudC5lcnJvciAhPSBudWxsKSB7XHJcblxyXG5cdFx0aWYgKGxvZ0V2ZW50LmVycm9yLnN0YWNrICE9IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRsZXQgc3RhY2tzID0gbG9nRXZlbnQuZXJyb3Iuc3RhY2suc3BsaXQoL1xcbi9nKTtcclxuICAgICAgICAgICAgc3RhY2tzLmZvckVhY2goZnVuY3Rpb24gKHN0YWNrKSB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlICs9IGBcXHQke3N0YWNrfVxcbmA7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cdFx0fSBlbHNlIGlmIChsb2dFdmVudC5lcnJvci5tZXNzYWdlICE9IG51bGwgJiYgbG9nRXZlbnQuZXJyb3IubWVzc2FnZSAhPSAnJykge1xyXG5cdFx0XHRtZXNzYWdlICs9IGBcXHQke2xvZ0V2ZW50LmVycm9yLm5hbWV9OiAke2xvZ0V2ZW50LmVycm9yLm1lc3NhZ2V9XFxuYDtcclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHRyZXR1cm4gbWVzc2FnZTtcclxuXHJcbn07XHJcblxyXG4vKipcclxuICogRm9ybWF0cyB0aGUgZmlsZSAoZS5nLiB0ZXN0LmpzKSB0byB0aGUgZmlsZVxyXG4gKlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGZvcm1hdHRlclxyXG4gKlxyXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcclxuICovXHJcbmxldCBfZm9ybWF0RmlsZSA9IGZ1bmN0aW9uIChsb2dFdmVudCkge1xyXG5cclxuICAgIGlmICghbG9nRXZlbnQuZmlsZSkge1xyXG5cdFx0X2dldEZpbGVEZXRhaWxzKGxvZ0V2ZW50KTtcclxuXHR9XHJcblxyXG5cdHJldHVybiBsb2dFdmVudC5maWxlO1xyXG5cclxufTtcclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGZvcm1hdHRlclxyXG4gKlxyXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcclxuICpcclxuICogQHJldHVybiB7c3RyaW5nfVxyXG4gKi9cclxubGV0IF9mb3JtYXRMaW5lTnVtYmVyID0gZnVuY3Rpb24gKGxvZ0V2ZW50KSB7XHJcblxyXG4gICAgaWYgKCFsb2dFdmVudC5saW5lTnVtYmVyKSB7XHJcblx0XHRfZ2V0RmlsZURldGFpbHMobG9nRXZlbnQpO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIGAke2xvZ0V2ZW50LmxpbmVOdW1iZXJ9YDtcclxuXHJcbn07XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcclxuICpcclxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XHJcbiAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz59IHBhcmFtc1xyXG4gKlxyXG4gKiBAcmV0dXJuIHtzdHJpbmd9XHJcbiAqL1xyXG5sZXQgX2Zvcm1hdE1hcE1lc3NhZ2UgPSBmdW5jdGlvbiAobG9nRXZlbnQsIHBhcmFtcykge1xyXG5cdGxldCBtZXNzYWdlID0gbnVsbDtcclxuXHRpZiAobG9nRXZlbnQucHJvcGVydGllcykge1xyXG5cclxuXHRcdG1lc3NhZ2UgPSBbXTtcclxuXHRcdGZvciAobGV0IGtleSBpbiBsb2dFdmVudC5wcm9wZXJ0aWVzKSB7XHJcblx0XHRcdGlmIChwYXJhbXNbMF0pIHtcclxuXHRcdFx0XHRpZiAocGFyYW1zWzBdID09IGtleSkge1xyXG5cdFx0XHRcdFx0bWVzc2FnZS5wdXNoKGxvZ0V2ZW50LnByb3BlcnRpZXNba2V5XSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdG1lc3NhZ2UucHVzaCgneycgKyBrZXkgKyAnLCcgKyBsb2dFdmVudC5wcm9wZXJ0aWVzW2tleV0gKyAnfScpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuICd7JyArIG1lc3NhZ2Uuam9pbignLCcpICsgJ30nO1xyXG5cclxuXHR9XHJcblx0cmV0dXJuIG1lc3NhZ2U7XHJcbn07XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcclxuICpcclxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XHJcbiAqXHJcbiAqIEByZXR1cm4ge3N0cmluZ31cclxuICovXHJcbmxldCBfZm9ybWF0TG9nTWVzc2FnZSA9IGZ1bmN0aW9uIChsb2dFdmVudCkge1xyXG5cdHJldHVybiBsb2dFdmVudC5tZXNzYWdlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXHJcbiAqXHJcbiAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dFdmVudFxyXG4gKlxyXG4gKiBAcmV0dXJuIHtzdHJpbmd9XHJcbiAqL1xyXG5sZXQgX2Zvcm1hdE1ldGhvZE5hbWUgPSBmdW5jdGlvbiAobG9nRXZlbnQpIHtcclxuXHRyZXR1cm4gdXRpbGl0eS5nZXRGdW5jdGlvbk5hbWUobG9nRXZlbnQubWV0aG9kKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGZvcm1hdHRlclxyXG4gKi9cclxubGV0IF9mb3JtYXRMaW5lU2VwYXJhdG9yID0gZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiAnXFxuJztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGZvcm1hdHRlclxyXG4gKlxyXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcclxuICpcclxuICogQHJldHVybiB7c3RyaW5nfVxyXG4gKi9cclxubGV0IF9mb3JtYXRMZXZlbCA9IGZ1bmN0aW9uIChsb2dFdmVudCkge1xyXG5cclxuICAgIHN3aXRjaCAobG9nRXZlbnQubGV2ZWwpIHtcclxuXHJcbiAgICAgICAgY2FzZSBMb2dMZXZlbC5GQVRBTDpcclxuICAgICAgICAgICAgcmV0dXJuICdGQVRBTCc7XHJcbiAgICAgICAgY2FzZSBMb2dMZXZlbC5FUlJPUjpcclxuICAgICAgICAgICAgcmV0dXJuICdFUlJPUic7XHJcbiAgICAgICAgY2FzZSBMb2dMZXZlbC5XQVJOOlxyXG4gICAgICAgICAgICByZXR1cm4gJ1dBUk4nO1xyXG4gICAgICAgIGNhc2UgTG9nTGV2ZWwuSU5GTzpcclxuICAgICAgICAgICAgcmV0dXJuICdJTkZPJztcclxuICAgICAgICBjYXNlIExvZ0xldmVsLkRFQlVHOlxyXG4gICAgICAgICAgICByZXR1cm4gJ0RFQlVHJztcclxuICAgICAgICBjYXNlIExvZ0xldmVsLlRSQUNFOlxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiAnVFJBQ0UnO1xyXG5cclxuICAgIH1cclxuXHJcbn07XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcclxuICpcclxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XHJcbiAqXHJcbiAqIEByZXR1cm4ge3N0cmluZ31cclxuICovXHJcbmxldCBfZm9ybWF0UmVsYXRpdmUgPSBmdW5jdGlvbiAobG9nRXZlbnQpIHtcclxuXHRyZXR1cm4gJycgKyBsb2dFdmVudC5yZWxhdGl2ZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGZvcm1hdHRlclxyXG4gKlxyXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcclxuICpcclxuICogQHJldHVybiB7c3RyaW5nfVxyXG4gKi9cclxubGV0IF9mb3JtYXRTZXF1ZW5jZU51bWJlciA9IGZ1bmN0aW9uIChsb2dFdmVudCkge1xyXG5cdHJldHVybiAnJyArIGxvZ0V2ZW50LnNlcXVlbmNlO1xyXG59O1xyXG5cclxubGV0IF9mb3JtYXR0ZXJzID0ge1xyXG5cdCdjfGxvZ2dlcicgOiBfZm9ybWF0TG9nZ2VyLFxyXG5cdCdkfGRhdGUnIDogX2Zvcm1hdERhdGUsXHJcblx0J2V4fGV4Y2VwdGlvbnx0aHJvd2FibGUnIDogX2Zvcm1hdEV4Y2VwdGlvbixcclxuXHQnRnxmaWxlJyA6IF9mb3JtYXRGaWxlLFxyXG5cdCdLfG1hcHxNQVAnIDogX2Zvcm1hdE1hcE1lc3NhZ2UsXHJcblx0J0x8bGluZScgOiBfZm9ybWF0TGluZU51bWJlcixcclxuXHQnbXxtc2d8bWVzc2FnZScgOiBfZm9ybWF0TG9nTWVzc2FnZSxcclxuXHQnTXxtZXRob2QnIDogX2Zvcm1hdE1ldGhvZE5hbWUsXHJcblx0J24nIDogX2Zvcm1hdExpbmVTZXBhcmF0b3IsXHJcblx0J3B8bGV2ZWwnIDogX2Zvcm1hdExldmVsLFxyXG5cdCdyfHJlbGF0aXZlJyA6IF9mb3JtYXRSZWxhdGl2ZSxcclxuXHQnc258c2VxdWVuY2VOdW1iZXInIDogX2Zvcm1hdFNlcXVlbmNlTnVtYmVyXHJcbn07XHJcblxyXG4vKipcclxuICogR2V0IHRoZSBjb21waWxlZCBsYXlvdXQgZm9yIHRoZSBzcGVjaWZpZWQgbGF5b3V0IHN0cmluZy4gSWYgdGhlIGNvbXBpbGVkIGxheW91dCBkb2VzIG5vdFxyXG4gKiBleGlzdCwgdGhlbiB3ZSB3YW50IHRvIGNyZWF0ZSBpdC5cclxuICpcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IGxheW91dFxyXG4gKlxyXG4gKiBAcmV0dXJuIHtBcnJheS48c3RyaW5nfGZ1bmN0aW9uPn1cclxuICovXHJcbmxldCBfZ2V0Q29tcGlsZWRMYXlvdXQgPSBmdW5jdGlvbiAobGF5b3V0KSB7XHJcblxyXG5cdGlmIChfY29tcGlsZWRMYXlvdXRzW2xheW91dF0pIHtcclxuXHRcdHJldHVybiBfY29tcGlsZWRMYXlvdXRzW2xheW91dF07XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gX2NvbXBpbGVMYXlvdXQobGF5b3V0KTtcclxuXHJcbn07XHJcblxyXG4vKipcclxuICogQ29tcGlsZXMgYSBsYXlvdXQgaW50byBhbiBhcnJheS4gVGhlIGFycmF5IGNvbnRhaW5zIGZ1bmN0aW9uc1xyXG4gKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGZvcm1hdHRlclxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gbGF5b3V0XHJcbiAqXHJcbiAqIEByZXR1cm4ge0FycmF5LjxzdHJpbmd8ZnVuY3Rpb24+fVxyXG4gKi9cclxubGV0IF9jb21waWxlTGF5b3V0ID0gZnVuY3Rpb24gKGxheW91dCkge1xyXG5cclxuXHRsZXQgaW5kZXggPSBsYXlvdXQuaW5kZXhPZignJScpO1xyXG5cdGxldCBjdXJyZW50Rm9ybWF0U3RyaW5nID0gJyc7XHJcblx0bGV0IGZvcm1hdEFycmF5ID0gW107XHJcblxyXG5cdGlmIChpbmRleCAhPSAwKSB7XHJcblx0XHRmb3JtYXRBcnJheS5wdXNoKGxheW91dC5zdWJzdHJpbmcoMCwgaW5kZXgpKTtcclxuXHR9XHJcblxyXG5cdGRvIHtcclxuXHJcblx0XHRsZXQgc3RhcnRJbmRleCA9IGluZGV4O1xyXG5cdFx0bGV0IGVuZEluZGV4ID0gaW5kZXggPSBsYXlvdXQuaW5kZXhPZignJScsIGluZGV4ICsgMSk7XHJcblxyXG5cdFx0aWYgKGVuZEluZGV4IDwgMCkge1xyXG5cdFx0XHRjdXJyZW50Rm9ybWF0U3RyaW5nID0gbGF5b3V0LnN1YnN0cmluZyhzdGFydEluZGV4KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGN1cnJlbnRGb3JtYXRTdHJpbmcgPSBsYXlvdXQuc3Vic3RyaW5nKHN0YXJ0SW5kZXgsIGVuZEluZGV4KTtcclxuXHRcdH1cclxuXHJcblx0XHRmb3JtYXRBcnJheS5wdXNoKF9nZXRGb3JtYXR0ZXJPYmplY3QoY3VycmVudEZvcm1hdFN0cmluZykpO1xyXG5cclxuXHR9IHdoaWxlIChpbmRleCA+IC0xKTtcclxuXHJcbiAgICAvLyBzZXQgdGhlIGZvcm1hdCBhcnJheSB0byB0aGUgc3BlY2lmaWVkIGNvbXBpbGVkIGxheW91dFxyXG5cdF9jb21waWxlZExheW91dHNbbGF5b3V0XSA9IGZvcm1hdEFycmF5O1xyXG5cclxuXHRyZXR1cm4gZm9ybWF0QXJyYXk7XHJcblxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBmb3JtYXRTdHJpbmdcclxuICpcclxuICogQHJldHVybiB7T2JqZWN0fHN0cmluZ31cclxuICovXHJcbmxldCBfZ2V0Rm9ybWF0dGVyT2JqZWN0ID0gZnVuY3Rpb24gKGZvcm1hdFN0cmluZykge1xyXG5cclxuXHRsZXQgcmVzdWx0ID0gX0NPTU1BTkRfUkVHRVguZXhlYyhmb3JtYXRTdHJpbmcpO1xyXG5cdGlmIChyZXN1bHQgIT0gbnVsbCAmJiByZXN1bHQubGVuZ3RoID09IDIpIHtcclxuXHJcblx0XHRsZXQgZm9ybWF0dGVyID0gX2dldEZvcm1hdHRlckZ1bmN0aW9uKHJlc3VsdFsxXSk7XHJcblx0XHRpZiAoIWZvcm1hdHRlcikge1xyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgcGFyYW1zID0gX2dldExheW91dFRhZ1BhcmFtcyhmb3JtYXRTdHJpbmcpO1xyXG5cclxuXHRcdGxldCBhZnRlciA9ICcnO1xyXG5cdFx0bGV0IGVuZEluZGV4ID0gZm9ybWF0U3RyaW5nLmxhc3RJbmRleE9mKCd9Jyk7XHJcblx0XHRpZiAoZW5kSW5kZXggIT0gLTEpIHtcclxuXHRcdFx0YWZ0ZXIgPSBmb3JtYXRTdHJpbmcuc3Vic3RyaW5nKGVuZEluZGV4ICsgMSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRhZnRlciA9IGZvcm1hdFN0cmluZy5zdWJzdHJpbmcocmVzdWx0LmluZGV4ICsgcmVzdWx0WzFdLmxlbmd0aCArIDEpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdCdmb3JtYXR0ZXInIDogZm9ybWF0dGVyLFxyXG5cdFx0XHQncGFyYW1zJyA6IHBhcmFtcyxcclxuXHRcdFx0J2FmdGVyJyA6IGFmdGVyXHJcblx0XHR9O1xyXG5cclxuXHR9XHJcblxyXG5cdHJldHVybiBmb3JtYXRTdHJpbmc7XHJcblxyXG59O1xyXG5cclxuLyoqXHJcbiAqIERldGVybWluZXMgd2hhdCBmb3JtYXR0ZXIgZnVuY3Rpb24gaGFzIGJlZW4gY29uZmlndXJlZFxyXG4gKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGZvcm1hdHRlclxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gY29tbWFuZFxyXG4gKlxyXG4gKiBAcmV0dXJuIHs/c3RyaW5nfVxyXG4gKi9cclxubGV0IF9nZXRGb3JtYXR0ZXJGdW5jdGlvbiA9IGZ1bmN0aW9uIChjb21tYW5kKSB7XHJcblxyXG5cdGxldCByZWdleDtcclxuXHRmb3IgKGxldCBrZXkgaW4gX2Zvcm1hdHRlcnMpIHtcclxuICAgICAgICBpZiAoX2Zvcm1hdHRlcnMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgICByZWdleCA9IG5ldyBSZWdFeHAoJ14oJyArIGtleSArICcpJCcpO1xyXG4gICAgICAgICAgICBpZiAocmVnZXguZXhlYyhjb21tYW5kKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIF9mb3JtYXR0ZXJzW2tleV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gbnVsbDtcclxuXHJcbn07XHJcblxyXG4vKipcclxuICogR2V0cyB0aGUgbGF5b3V0IHRhZyBwYXJhbXMgYXNzb2NpYXRlZCB3aXRoIHRoZSBsYXlvdXQgdGFnLiBTbywgZm9yIGV4YW1wbGUsICclZHt5eXl5LU1NLWRkfWBcclxuICogd291bGQgb3V0cHV0IGFuIGFycmF5IG9mIFsneXl5eS1NTS1kZCddXHJcbiAqXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBmdW5jdGlvblxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gY29tbWFuZFxyXG4gKlxyXG4gKiBAcmV0dXJuIHtBcnJheS48c3RyaW5nPn1cclxuICovXHJcbmxldCBfZ2V0TGF5b3V0VGFnUGFyYW1zID0gZnVuY3Rpb24gKGNvbW1hbmQpIHtcclxuXHJcblx0bGV0IHBhcmFtcyA9IFtdO1xyXG5cdGxldCByZXN1bHQgPSBjb21tYW5kLm1hdGNoKC9cXHsoW159XSopKD89fSkvZyk7XHJcblx0aWYgKHJlc3VsdCAhPSBudWxsKSB7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHJlc3VsdC5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRwYXJhbXMucHVzaChyZXN1bHRbaV0uc3Vic3RyaW5nKDEpKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJldHVybiBwYXJhbXM7XHJcblxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEhhbmRsZXMgZm9ybWF0dGluZyB0aGUgbG9nIGV2ZW50IHVzaW5nIHRoZSBzcGVjaWZpZWQgZm9ybWF0dGVyIGFycmF5XHJcbiAqXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBmdW5jdGlvblxyXG4gKlxyXG4gKiBAcGFyYW0ge0FycmF5LjxmdW5jdGlvbnxzdHJpbmc+fSBmb3JtYXR0ZXJcclxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XHJcbiAqXHJcbiAqIEByZXR1cm4ge3N0cmluZ31cclxuICovXHJcbmxldCBfZm9ybWF0TG9nRXZlbnQgPSBmdW5jdGlvbiAoZm9ybWF0dGVyLCBsb2dFdmVudCkge1xyXG5cclxuXHRsZXQgcmVzcG9uc2U7XHJcblx0bGV0IG1lc3NhZ2UgPSAnJztcclxuXHRsZXQgY291bnQgPSBmb3JtYXR0ZXIubGVuZ3RoO1xyXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xyXG5cdFx0aWYgKGZvcm1hdHRlcltpXSAhPT0gbnVsbCkge1xyXG5cclxuXHRcdFx0aWYgKGZvcm1hdHRlcltpXSBpbnN0YW5jZW9mIE9iamVjdCkge1xyXG5cclxuXHRcdFx0XHRyZXNwb25zZSA9IGZvcm1hdHRlcltpXS5mb3JtYXR0ZXIobG9nRXZlbnQsIGZvcm1hdHRlcltpXS5wYXJhbXMpO1xyXG5cdFx0XHRcdGlmIChyZXNwb25zZSAhPSBudWxsKSB7XHJcblx0XHRcdFx0XHRtZXNzYWdlICs9IHJlc3BvbnNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRtZXNzYWdlICs9IGZvcm1hdHRlcltpXS5hZnRlcjtcclxuXHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0bWVzc2FnZSArPSBmb3JtYXR0ZXJbaV07XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gbWVzc2FnZS50cmltKCk7XHJcblxyXG59O1xyXG5cclxuLyoqXHJcbiAqXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXHJcbiAqXHJcbiAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dFdmVudFxyXG4gKi9cclxubGV0IF9nZXRGaWxlRGV0YWlscyA9IGZ1bmN0aW9uIChsb2dFdmVudCkge1xyXG5cclxuXHRpZiAobG9nRXZlbnQubG9nRXJyb3JTdGFjaykge1xyXG5cclxuXHRcdGxldCBwYXJ0cyA9IGxvZ0V2ZW50LmxvZ0Vycm9yU3RhY2suc3RhY2suc3BsaXQoL1xcbi9nKTtcclxuXHRcdGxldCBmaWxlID0gcGFydHNbM107XHJcblx0XHRmaWxlID0gZmlsZS5yZXBsYWNlKC9hdCAoLipcXCh8KShmaWxlfGh0dHB8aHR0cHN8KSg6fCkoXFwvfCkqLywgJycpO1xyXG5cdFx0ZmlsZSA9IGZpbGUucmVwbGFjZSgnKScsICcnKTtcclxuXHRcdGZpbGUgPSBmaWxlLnJlcGxhY2UoKHR5cGVvZiBsb2NhdGlvbiAhPT0gJ3VuZGVmaW5lZCcpID8gbG9jYXRpb24uaG9zdCA6ICcnLCAnJykudHJpbSgpO1xyXG5cclxuXHRcdGxldCBmaWxlUGFydHMgPSBmaWxlLnNwbGl0KC9cXDovZyk7XHJcblxyXG5cdFx0bG9nRXZlbnQuY29sdW1uID0gZmlsZVBhcnRzLnBvcCgpO1xyXG5cdFx0bG9nRXZlbnQubGluZU51bWJlciA9IGZpbGVQYXJ0cy5wb3AoKTtcclxuXHJcblx0XHRpZiAodHlwZW9mIGRlZmluZSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0bGV0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XHJcblx0XHRcdGxldCBhcHBEaXIgPSBwYXRoLmRpcm5hbWUocmVxdWlyZS5tYWluLmZpbGVuYW1lKTtcclxuXHRcdFx0bG9nRXZlbnQuZmlsZW5hbWUgPSBmaWxlUGFydHMuam9pbignOicpLnJlcGxhY2UoYXBwRGlyLCAnJykucmVwbGFjZSgvKFxcXFx8XFwvKS8sICcnKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGxvZ0V2ZW50LmZpbGVuYW1lID0gZmlsZVBhcnRzLmpvaW4oJzonKTtcclxuXHRcdH1cclxuXHJcblx0fSBlbHNlIHtcclxuXHJcblx0XHRsb2dFdmVudC5jb2x1bW4gPSAnPyc7XHJcblx0XHRsb2dFdmVudC5maWxlbmFtZSA9ICdhbm9ueW1vdXMnO1xyXG5cdFx0bG9nRXZlbnQubGluZU51bWJlciA9ICc/JztcclxuXHJcblx0fVxyXG5cclxufTtcclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGZvcm1hdHRlclxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gbGF5b3V0XHJcbiAqXHJcbiAqIEByZXR1cm4ge3N0cmluZ31cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBwcmVDb21waWxlKGxheW91dCkge1xyXG5cdF9nZXRDb21waWxlZExheW91dChsYXlvdXQpO1xyXG59XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IGxheW91dFxyXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcclxuICpcclxuICogQHJldHVybiB7c3RyaW5nfVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdChsYXlvdXQsIGxvZ0V2ZW50KSB7XHJcblx0cmV0dXJuIF9mb3JtYXRMb2dFdmVudChfZ2V0Q29tcGlsZWRMYXlvdXQobGF5b3V0KSwgbG9nRXZlbnQpO1xyXG59XHJcbiJdfQ==

/***/ },
/* 2 */
/***/ function(module, exports) {

	/*istanbul ignore next*/'use strict';

	exports.__esModule = true;
	exports.dateFormat = dateFormat;
	/**
	 * log4js <https://github.com/anigenero/log4js2>
	 *
	 * Copyright 2016-present Robin Schultz <http://anigenero.com>
	 * Released under the MIT License
	 */

	var i18n = {
		'd': ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
		'm': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
	};

	var TOKEN = /d{1,4}|M{1,4}|yy(?:yy)?|([HhmsAa])\1?|[LloSZ]|'[^']*'|'[^']*'/g;
	var TIMEZONE = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g;
	var TIMEZONE_CLIP = /[^-+\dA-Z]/g;

	/**
	 * Predefined DATE formats (specified by logj2)
	 * @private
	 * @type {{DEFAULT: string, ABSOLUTE: string, COMPACT: string, DATE: string, ISO8601: string, ISO8601_BASIC: string}}
	 */
	var _PREDEFINED = {
		'DEFAULT': 'yyyy-MM-dd HH:mm:ss,S',
		'ABSOLUTE': 'HH:MM:ss,S',
		'COMPACT': 'yyyyMMddHHmmssS',
		'DATE': 'dd MMM yyyy HH:mm:ss,S',
		'ISO8601': 'yyyy-MM-ddTHH:mm:ss,S',
		'ISO8601_BASIC': 'yyyyMMddTHHmmss,S'
	};

	/**
	 * Pads numbers in the date format
	 *
	 * @param value
	 * @param length
	 *
	 * @returns {?string}
	 */
	function pad(value, length) {

		value = String(value);
		length = length || 2;

		while (value.length < length) {
			value = '0' + value;
		}

		return value;
	}

	/**
	 * Formats the date
	 * @param date
	 * @param mask
	 * @returns {string}
	 */
	function dateFormat(date, mask) {

		if (_PREDEFINED[mask]) {
			mask = _PREDEFINED[mask];
		} else {
			mask = String(mask || _PREDEFINED.DEFAULT);
		}

		// check if the date format is set for UTC
		var isUTC = mask.slice(0, 4) == 'UTC:';
		if (isUTC) {
			mask = mask.slice(4);
		}

		var prefix = isUTC ? 'getUTC' : 'get';
		var day = date[prefix + 'Day']();
		var month = date[prefix + 'Month']();
		var fullYear = date[prefix + 'FullYear']();
		var hours = date[prefix + 'Hours']();
		var minutes = date[prefix + 'Minutes']();
		var seconds = date[prefix + 'Seconds']();
		var milliseconds = date[prefix + 'Milliseconds']();
		var offset = isUTC ? 0 : date.getTimezoneOffset();

		var flags = {
			'd': date.getDate(),
			'dd': pad(date.getDate()),
			'ddd': i18n.d[day],
			'dddd': i18n.d[day + 7],
			'M': month + 1,
			'MM': pad(month + 1),
			'MMM': i18n.m[month],
			'MMMM': i18n.m[month + 12],
			'yy': String(fullYear).slice(2),
			'yyyy': fullYear,
			'h': hours % 12 || 12,
			'hh': pad(hours % 12 || 12),
			'H': hours,
			'HH': pad(hours),
			'm': minutes,
			'mm': pad(minutes),
			's': seconds,
			'ss': pad(seconds),
			'S': pad(milliseconds, 1),
			'a': hours < 12 ? 'a' : 'p',
			'aa': hours < 12 ? 'am' : 'pm',
			'A': hours < 12 ? 'A' : 'P',
			'AA': hours < 12 ? 'AM' : 'PM',
			'Z': isUTC ? 'UTC' : (String(date).match(TIMEZONE) || ['']).pop().replace(TIMEZONE_CLIP, ''),
			'o': (offset > 0 ? '-' : '+') + pad(Math.floor(Math.abs(offset) / 60) * 100 + Math.abs(offset) % 60, 4)
		};

		return mask.replace(TOKEN, function ($0) {
			return $0 in flags ? flags[$0] : $0;
		});
	}
	//# sourceMappingURL=data:application/json;base64,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SUFBbUIsRUFBbkIsQ0FBWCxHQUFvQyxHQUFwQyxHQUEwQyxLQUFLLEdBQUwsQ0FBUyxNQUFULElBQW1CLEVBQW5CLEVBQXVCLENBQXJFLENBQTNCO0VBekJILENBeEJrQzs7QUFvRHRDLFFBQU8sS0FBSyxPQUFMLENBQWEsS0FBYixFQUFvQixVQUFVLEVBQVYsRUFBYztBQUN4QyxTQUFPLE1BQU0sS0FBTixHQUFjLE1BQU0sRUFBTixDQUFkLEdBQTBCLEVBQTFCLENBRGlDO0VBQWQsQ0FBM0IsQ0FwRHNDO0NBQWhDIiwiZmlsZSI6ImRhdGVGb3JtYXR0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogbG9nNGpzIDxodHRwczovL2dpdGh1Yi5jb20vYW5pZ2VuZXJvL2xvZzRqczI+XHJcbiAqXHJcbiAqIENvcHlyaWdodCAyMDE2LXByZXNlbnQgUm9iaW4gU2NodWx0eiA8aHR0cDovL2FuaWdlbmVyby5jb20+XHJcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZVxyXG4gKi9cclxuXHJcbmxldCBpMThuID0ge1xyXG5cdCdkJyA6IFsgJ1N1bicsICdNb24nLCAnVHVlJywgJ1dlZCcsICdUaHUnLCAnRnJpJywgJ1NhdCcsICdTdW5kYXknLCAnTW9uZGF5JyxcclxuXHRcdCdUdWVzZGF5JywgJ1dlZG5lc2RheScsICdUaHVyc2RheScsICdGcmlkYXknLCAnU2F0dXJkYXknIF0sXHJcblx0J20nIDogWyAnSmFuJywgJ0ZlYicsICdNYXInLCAnQXByJywgJ01heScsICdKdW4nLCAnSnVsJywgJ0F1ZycsICdTZXAnLFxyXG5cdFx0J09jdCcsICdOb3YnLCAnRGVjJywgJ0phbnVhcnknLCAnRmVicnVhcnknLCAnTWFyY2gnLCAnQXByaWwnLCAnTWF5JywgJ0p1bmUnLFxyXG5cdFx0J0p1bHknLCAnQXVndXN0JywgJ1NlcHRlbWJlcicsICdPY3RvYmVyJywgJ05vdmVtYmVyJywgJ0RlY2VtYmVyJyBdXHJcbn07XHJcblxyXG5jb25zdCBUT0tFTiA9IC9kezEsNH18TXsxLDR9fHl5KD86eXkpP3woW0hobXNBYV0pXFwxP3xbTGxvU1pdfCdbXiddKid8J1teJ10qJy9nO1xyXG5jb25zdCBUSU1FWk9ORSA9IC9cXGIoPzpbUE1DRUFdW1NEUF1UfCg/OlBhY2lmaWN8TW91bnRhaW58Q2VudHJhbHxFYXN0ZXJufEF0bGFudGljKSAoPzpTdGFuZGFyZHxEYXlsaWdodHxQcmV2YWlsaW5nKSBUaW1lfCg/OkdNVHxVVEMpKD86Wy0rXVxcZHs0fSk/KVxcYi9nO1xyXG5jb25zdCBUSU1FWk9ORV9DTElQID0gL1teLStcXGRBLVpdL2c7XHJcblxyXG4vKipcclxuICogUHJlZGVmaW5lZCBEQVRFIGZvcm1hdHMgKHNwZWNpZmllZCBieSBsb2dqMilcclxuICogQHByaXZhdGVcclxuICogQHR5cGUge3tERUZBVUxUOiBzdHJpbmcsIEFCU09MVVRFOiBzdHJpbmcsIENPTVBBQ1Q6IHN0cmluZywgREFURTogc3RyaW5nLCBJU084NjAxOiBzdHJpbmcsIElTTzg2MDFfQkFTSUM6IHN0cmluZ319XHJcbiAqL1xyXG5jb25zdCBfUFJFREVGSU5FRCA9IHtcclxuICAgICdERUZBVUxUJyA6ICd5eXl5LU1NLWRkIEhIOm1tOnNzLFMnLFxyXG4gICAgJ0FCU09MVVRFJyA6ICdISDpNTTpzcyxTJyxcclxuICAgICdDT01QQUNUJyA6ICd5eXl5TU1kZEhIbW1zc1MnLFxyXG4gICAgJ0RBVEUnIDogJ2RkIE1NTSB5eXl5IEhIOm1tOnNzLFMnLFxyXG4gICAgJ0lTTzg2MDEnIDogJ3l5eXktTU0tZGRUSEg6bW06c3MsUycsXHJcbiAgICAnSVNPODYwMV9CQVNJQycgOiAneXl5eU1NZGRUSEhtbXNzLFMnXHJcbn07XHJcblxyXG4vKipcclxuICogUGFkcyBudW1iZXJzIGluIHRoZSBkYXRlIGZvcm1hdFxyXG4gKlxyXG4gKiBAcGFyYW0gdmFsdWVcclxuICogQHBhcmFtIGxlbmd0aFxyXG4gKlxyXG4gKiBAcmV0dXJucyB7P3N0cmluZ31cclxuICovXHJcbmZ1bmN0aW9uIHBhZCh2YWx1ZSwgbGVuZ3RoKSB7XHJcblxyXG4gICAgdmFsdWUgPSBTdHJpbmcodmFsdWUpO1xyXG5cdGxlbmd0aCA9IGxlbmd0aCB8fCAyO1xyXG5cclxuICAgIHdoaWxlICh2YWx1ZS5sZW5ndGggPCBsZW5ndGgpIHtcclxuXHRcdHZhbHVlID0gJzAnICsgdmFsdWU7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gdmFsdWU7XHJcblxyXG59XHJcblxyXG4vKipcclxuICogRm9ybWF0cyB0aGUgZGF0ZVxyXG4gKiBAcGFyYW0gZGF0ZVxyXG4gKiBAcGFyYW0gbWFza1xyXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGRhdGVGb3JtYXQoZGF0ZSwgbWFzaykge1xyXG5cclxuICAgIGlmIChfUFJFREVGSU5FRFttYXNrXSkge1xyXG4gICAgICAgIG1hc2sgPSBfUFJFREVGSU5FRFttYXNrXTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbWFzayA9IFN0cmluZyhtYXNrIHx8IF9QUkVERUZJTkVELkRFRkFVTFQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGNoZWNrIGlmIHRoZSBkYXRlIGZvcm1hdCBpcyBzZXQgZm9yIFVUQ1xyXG4gICAgbGV0IGlzVVRDID0gKG1hc2suc2xpY2UoMCwgNCkgPT0gJ1VUQzonKTtcclxuXHRpZiAoaXNVVEMpIHtcclxuXHRcdG1hc2sgPSBtYXNrLnNsaWNlKDQpO1xyXG5cdH1cclxuXHJcblx0bGV0IHByZWZpeCA9IGlzVVRDID8gJ2dldFVUQycgOiAnZ2V0JztcclxuXHRsZXQgZGF5ID0gZGF0ZVtwcmVmaXggKyAnRGF5J10oKTtcclxuXHRsZXQgbW9udGggPSBkYXRlW3ByZWZpeCArICdNb250aCddKCk7XHJcblx0bGV0IGZ1bGxZZWFyID0gZGF0ZVtwcmVmaXggKyAnRnVsbFllYXInXSgpO1xyXG5cdGxldCBob3VycyA9IGRhdGVbcHJlZml4ICsgJ0hvdXJzJ10oKTtcclxuXHRsZXQgbWludXRlcyA9IGRhdGVbcHJlZml4ICsgJ01pbnV0ZXMnXSgpO1xyXG5cdGxldCBzZWNvbmRzID0gZGF0ZVtwcmVmaXggKyAnU2Vjb25kcyddKCk7XHJcblx0bGV0IG1pbGxpc2Vjb25kcyA9IGRhdGVbcHJlZml4ICsgJ01pbGxpc2Vjb25kcyddKCk7XHJcblx0bGV0IG9mZnNldCA9IGlzVVRDID8gMCA6IGRhdGUuZ2V0VGltZXpvbmVPZmZzZXQoKTtcclxuXHJcblx0bGV0IGZsYWdzID0ge1xyXG5cdFx0J2QnIDogZGF0ZS5nZXREYXRlKCksXHJcblx0XHQnZGQnIDogcGFkKGRhdGUuZ2V0RGF0ZSgpKSxcclxuXHRcdCdkZGQnIDogaTE4bi5kW2RheV0sXHJcblx0XHQnZGRkZCcgOiBpMThuLmRbZGF5ICsgN10sXHJcblx0XHQnTScgOiBtb250aCArIDEsXHJcblx0XHQnTU0nIDogcGFkKG1vbnRoICsgMSksXHJcblx0XHQnTU1NJyA6IGkxOG4ubVttb250aF0sXHJcblx0XHQnTU1NTScgOiBpMThuLm1bbW9udGggKyAxMl0sXHJcblx0XHQneXknIDogU3RyaW5nKGZ1bGxZZWFyKS5zbGljZSgyKSxcclxuXHRcdCd5eXl5JyA6IGZ1bGxZZWFyLFxyXG5cdFx0J2gnIDogaG91cnMgJSAxMiB8fCAxMixcclxuXHRcdCdoaCcgOiBwYWQoaG91cnMgJSAxMiB8fCAxMiksXHJcblx0XHQnSCcgOiBob3VycyxcclxuXHRcdCdISCcgOiBwYWQoaG91cnMpLFxyXG5cdFx0J20nIDogbWludXRlcyxcclxuXHRcdCdtbScgOiBwYWQobWludXRlcyksXHJcblx0XHQncycgOiBzZWNvbmRzLFxyXG5cdFx0J3NzJyA6IHBhZChzZWNvbmRzKSxcclxuXHRcdCdTJyA6IHBhZChtaWxsaXNlY29uZHMsIDEpLFxyXG5cdFx0J2EnIDogaG91cnMgPCAxMiA/ICdhJyA6ICdwJyxcclxuXHRcdCdhYScgOiBob3VycyA8IDEyID8gJ2FtJyA6ICdwbScsXHJcblx0XHQnQScgOiBob3VycyA8IDEyID8gJ0EnIDogJ1AnLFxyXG5cdFx0J0FBJyA6IGhvdXJzIDwgMTIgPyAnQU0nIDogJ1BNJyxcclxuXHRcdCdaJyA6IGlzVVRDID8gJ1VUQycgOiAoU3RyaW5nKGRhdGUpLm1hdGNoKFRJTUVaT05FKSB8fCBbICcnIF0pLnBvcCgpLnJlcGxhY2UoVElNRVpPTkVfQ0xJUCwgJycpLFxyXG5cdFx0J28nIDogKG9mZnNldCA+IDAgPyAnLScgOiAnKycpICsgcGFkKE1hdGguZmxvb3IoTWF0aC5hYnMob2Zmc2V0KSAvIDYwKSAqIDEwMCArIE1hdGguYWJzKG9mZnNldCkgJSA2MCwgNClcclxuXHR9O1xyXG5cclxuXHRyZXR1cm4gbWFzay5yZXBsYWNlKFRPS0VOLCBmdW5jdGlvbiAoJDApIHtcclxuXHRcdHJldHVybiAkMCBpbiBmbGFncyA/IGZsYWdzWyQwXSA6ICQwO1xyXG5cdH0pO1xyXG5cclxufVxyXG4iXX0=

/***/ },
/* 3 */
/***/ function(module, exports) {

	/*istanbul ignore next*/'use strict';

	exports.__esModule = true;
	exports.getFunctionName = getFunctionName;
	/**
	 * Gets the function name of the specified function
	 *
	 * @function
	 *
	 * @param func
	 *
	 * @returns {string}
	 */
	function getFunctionName(func) {

	    // get the name of the function
	    var name = func.toString().substring('function '.length);
	    name = name.substring(0, name.indexOf('('));

	    // if the string is not empty
	    return name && name.trim() ? name : 'anonymous';
	}
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxpdHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O1FBU2dCOzs7Ozs7Ozs7O0FBQVQsU0FBUyxlQUFULENBQXlCLElBQXpCLEVBQStCOzs7QUFHbEMsUUFBSSxPQUFPLEtBQUssUUFBTCxHQUFnQixTQUFoQixDQUEwQixZQUFZLE1BQVosQ0FBakMsQ0FIOEI7QUFJbEMsV0FBTyxLQUFLLFNBQUwsQ0FBZSxDQUFmLEVBQWtCLEtBQUssT0FBTCxDQUFhLEdBQWIsQ0FBbEIsQ0FBUDs7O0FBSmtDLFdBTzNCLElBQUMsSUFBUSxLQUFLLElBQUwsRUFBUixHQUF1QixJQUF4QixHQUErQixXQUEvQixDQVAyQjtDQUEvQiIsImZpbGUiOiJ1dGlsaXR5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEdldHMgdGhlIGZ1bmN0aW9uIG5hbWUgb2YgdGhlIHNwZWNpZmllZCBmdW5jdGlvblxyXG4gKlxyXG4gKiBAZnVuY3Rpb25cclxuICpcclxuICogQHBhcmFtIGZ1bmNcclxuICpcclxuICogQHJldHVybnMge3N0cmluZ31cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRGdW5jdGlvbk5hbWUoZnVuYykge1xyXG5cclxuICAgIC8vIGdldCB0aGUgbmFtZSBvZiB0aGUgZnVuY3Rpb25cclxuICAgIGxldCBuYW1lID0gZnVuYy50b1N0cmluZygpLnN1YnN0cmluZygnZnVuY3Rpb24gJy5sZW5ndGgpO1xyXG4gICAgbmFtZSA9IG5hbWUuc3Vic3RyaW5nKDAsIG5hbWUuaW5kZXhPZignKCcpKTtcclxuXHJcbiAgICAvLyBpZiB0aGUgc3RyaW5nIGlzIG5vdCBlbXB0eVxyXG4gICAgcmV0dXJuIChuYW1lICYmIG5hbWUudHJpbSgpKSA/IG5hbWUgOiAnYW5vbnltb3VzJztcclxuXHJcbn1cclxuIl19

/***/ },
/* 4 */
/***/ function(module, exports) {

	/*istanbul ignore next*/'use strict';

	exports.__esModule = true;
	/**
	 * log4js <https://github.com/anigenero/log4js>
	 *
	 * Copyright 2016-present Robin Schultz <http://anigenero.com>
	 * Released under the MIT License
	 */

	/**
	 * @type {{OFF: number, FATAL: number, ERROR: number, WARN: number, INFO: number, DEBUG: number, TRACE: number, ALL: number}}
	 */
	var LogLevel = /*istanbul ignore next*/exports.LogLevel = {
	  'OFF': 0,
	  'FATAL': 100,
	  'ERROR': 200,
	  'WARN': 300,
	  'INFO': 400,
	  'DEBUG': 500,
	  'TRACE': 600,
	  'ALL': 2147483647
	};
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnN0XFxsb2dMZXZlbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBVU8sSUFBTSxzREFBVztBQUNwQixTQUFRLENBQVI7QUFDQSxXQUFVLEdBQVY7QUFDQSxXQUFVLEdBQVY7QUFDQSxVQUFTLEdBQVQ7QUFDQSxVQUFTLEdBQVQ7QUFDQSxXQUFVLEdBQVY7QUFDQSxXQUFVLEdBQVY7QUFDQSxTQUFRLFVBQVI7Q0FSUyIsImZpbGUiOiJjb25zdFxcbG9nTGV2ZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogbG9nNGpzIDxodHRwczovL2dpdGh1Yi5jb20vYW5pZ2VuZXJvL2xvZzRqcz5cclxuICpcclxuICogQ29weXJpZ2h0IDIwMTYtcHJlc2VudCBSb2JpbiBTY2h1bHR6IDxodHRwOi8vYW5pZ2VuZXJvLmNvbT5cclxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEB0eXBlIHt7T0ZGOiBudW1iZXIsIEZBVEFMOiBudW1iZXIsIEVSUk9SOiBudW1iZXIsIFdBUk46IG51bWJlciwgSU5GTzogbnVtYmVyLCBERUJVRzogbnVtYmVyLCBUUkFDRTogbnVtYmVyLCBBTEw6IG51bWJlcn19XHJcbiAqL1xyXG5leHBvcnQgY29uc3QgTG9nTGV2ZWwgPSB7XHJcbiAgICAnT0ZGJyA6IDAsXHJcbiAgICAnRkFUQUwnIDogMTAwLFxyXG4gICAgJ0VSUk9SJyA6IDIwMCxcclxuICAgICdXQVJOJyA6IDMwMCxcclxuICAgICdJTkZPJyA6IDQwMCxcclxuICAgICdERUJVRycgOiA1MDAsXHJcbiAgICAnVFJBQ0UnIDogNjAwLFxyXG4gICAgJ0FMTCcgOiAyMTQ3NDgzNjQ3XHJcbn07XHJcbiJdfQ==

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	// resolves . and .. elements in a path array with directory names there
	// must be no slashes, empty elements, or device names (c:\) in the array
	// (so also no leading and trailing slashes - it does not distinguish
	// relative and absolute paths)
	function normalizeArray(parts, allowAboveRoot) {
	  // if the path tries to go above the root, `up` ends up > 0
	  var up = 0;
	  for (var i = parts.length - 1; i >= 0; i--) {
	    var last = parts[i];
	    if (last === '.') {
	      parts.splice(i, 1);
	    } else if (last === '..') {
	      parts.splice(i, 1);
	      up++;
	    } else if (up) {
	      parts.splice(i, 1);
	      up--;
	    }
	  }

	  // if the path is allowed to go above the root, restore leading ..s
	  if (allowAboveRoot) {
	    for (; up--; up) {
	      parts.unshift('..');
	    }
	  }

	  return parts;
	}

	// Split a filename into [root, dir, basename, ext], unix version
	// 'root' is just a slash, or nothing.
	var splitPathRe =
	    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
	var splitPath = function(filename) {
	  return splitPathRe.exec(filename).slice(1);
	};

	// path.resolve([from ...], to)
	// posix version
	exports.resolve = function() {
	  var resolvedPath = '',
	      resolvedAbsolute = false;

	  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
	    var path = (i >= 0) ? arguments[i] : process.cwd();

	    // Skip empty and invalid entries
	    if (typeof path !== 'string') {
	      throw new TypeError('Arguments to path.resolve must be strings');
	    } else if (!path) {
	      continue;
	    }

	    resolvedPath = path + '/' + resolvedPath;
	    resolvedAbsolute = path.charAt(0) === '/';
	  }

	  // At this point the path should be resolved to a full absolute path, but
	  // handle relative paths to be safe (might happen when process.cwd() fails)

	  // Normalize the path
	  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
	    return !!p;
	  }), !resolvedAbsolute).join('/');

	  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
	};

	// path.normalize(path)
	// posix version
	exports.normalize = function(path) {
	  var isAbsolute = exports.isAbsolute(path),
	      trailingSlash = substr(path, -1) === '/';

	  // Normalize the path
	  path = normalizeArray(filter(path.split('/'), function(p) {
	    return !!p;
	  }), !isAbsolute).join('/');

	  if (!path && !isAbsolute) {
	    path = '.';
	  }
	  if (path && trailingSlash) {
	    path += '/';
	  }

	  return (isAbsolute ? '/' : '') + path;
	};

	// posix version
	exports.isAbsolute = function(path) {
	  return path.charAt(0) === '/';
	};

	// posix version
	exports.join = function() {
	  var paths = Array.prototype.slice.call(arguments, 0);
	  return exports.normalize(filter(paths, function(p, index) {
	    if (typeof p !== 'string') {
	      throw new TypeError('Arguments to path.join must be strings');
	    }
	    return p;
	  }).join('/'));
	};


	// path.relative(from, to)
	// posix version
	exports.relative = function(from, to) {
	  from = exports.resolve(from).substr(1);
	  to = exports.resolve(to).substr(1);

	  function trim(arr) {
	    var start = 0;
	    for (; start < arr.length; start++) {
	      if (arr[start] !== '') break;
	    }

	    var end = arr.length - 1;
	    for (; end >= 0; end--) {
	      if (arr[end] !== '') break;
	    }

	    if (start > end) return [];
	    return arr.slice(start, end - start + 1);
	  }

	  var fromParts = trim(from.split('/'));
	  var toParts = trim(to.split('/'));

	  var length = Math.min(fromParts.length, toParts.length);
	  var samePartsLength = length;
	  for (var i = 0; i < length; i++) {
	    if (fromParts[i] !== toParts[i]) {
	      samePartsLength = i;
	      break;
	    }
	  }

	  var outputParts = [];
	  for (var i = samePartsLength; i < fromParts.length; i++) {
	    outputParts.push('..');
	  }

	  outputParts = outputParts.concat(toParts.slice(samePartsLength));

	  return outputParts.join('/');
	};

	exports.sep = '/';
	exports.delimiter = ':';

	exports.dirname = function(path) {
	  var result = splitPath(path),
	      root = result[0],
	      dir = result[1];

	  if (!root && !dir) {
	    // No dirname whatsoever
	    return '.';
	  }

	  if (dir) {
	    // It has a dirname, strip trailing slash
	    dir = dir.substr(0, dir.length - 1);
	  }

	  return root + dir;
	};


	exports.basename = function(path, ext) {
	  var f = splitPath(path)[2];
	  // TODO: make this comparison case-insensitive on windows?
	  if (ext && f.substr(-1 * ext.length) === ext) {
	    f = f.substr(0, f.length - ext.length);
	  }
	  return f;
	};


	exports.extname = function(path) {
	  return splitPath(path)[3];
	};

	function filter (xs, f) {
	    if (xs.filter) return xs.filter(f);
	    var res = [];
	    for (var i = 0; i < xs.length; i++) {
	        if (f(xs[i], i, xs)) res.push(xs[i]);
	    }
	    return res;
	}

	// String.prototype.substr - negative index don't work in IE8
	var substr = 'ab'.substr(-1) === 'b'
	    ? function (str, start, len) { return str.substr(start, len) }
	    : function (str, start, len) {
	        if (start < 0) start = str.length + start;
	        return str.substr(start, len);
	    }
	;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ },
/* 6 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';

	exports.__esModule = true;
	exports.LogAppender = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var /*istanbul ignore next*/_formatter = __webpack_require__(1);

	/*istanbul ignore next*/
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var LogAppender = exports.LogAppender = function () {
	    function LogAppender() {
	        _classCallCheck(this, LogAppender);
	    }

	    /**
	     * Returns whether or not the appender is active
	     * @returns {boolean}
	     */

	    LogAppender.prototype.isActive = function isActive() {
	        return true;
	    };

	    /**
	     * Appends the log
	     * @param {Object} logEvent
	     */


	    LogAppender.prototype.append = function append(logEvent) {}
	    // stub


	    /**
	     * Gets the current log level
	     * @returns {number}
	     */
	    ;

	    LogAppender.prototype.getLogLevel = function getLogLevel() {
	        return this.logLevel;
	    };

	    /**
	     * Sets the log level of the appender
	     * @param {number} logLevel
	     */


	    LogAppender.prototype.setLogLevel = function setLogLevel(logLevel) {
	        this.logLevel = logLevel;
	    };

	    /**
	     * Sets the layout of the appender
	     * @param {string} layout
	     */


	    LogAppender.prototype.setLayout = function setLayout(layout) {
	        this.layout = layout;
	    };

	    /**
	     * Gets the layout associated with the appender
	     * @returns {string}
	     */


	    LogAppender.prototype.getLayout = function getLayout() {
	        return this.layout;
	    };

	    /**
	     * Formats the log event using the layout provided
	     * @param {Object} logEvent
	     */


	    LogAppender.prototype.format = function format(logEvent) {
	        return (/*istanbul ignore next*/(0, _formatter.format)(this.getLayout(), logEvent)
	        );
	    };

	    _createClass(LogAppender, null, [{
	        key: 'name',


	        /**
	         * Gets the name of the appender (e.g. 'console')
	         * @returns {null}
	         */
	        get: function get() {
	            return null;
	        }
	    }]);

	    return LogAppender;
	}();
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcGVuZGVyXFxhcHBlbmRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7O0lBRWE7Ozs7Ozs7Ozs7MEJBY1QsK0JBQVc7QUFDUCxlQUFPLElBQVAsQ0FETzs7Ozs7Ozs7OzBCQVFYLHlCQUFPLFVBQVU7Ozs7Ozs7Ozs7MEJBUWpCLHFDQUFjO0FBQ1YsZUFBTyxLQUFLLFFBQUwsQ0FERzs7Ozs7Ozs7OzBCQVFkLG1DQUFZLFVBQVU7QUFDbEIsYUFBSyxRQUFMLEdBQWdCLFFBQWhCLENBRGtCOzs7Ozs7Ozs7MEJBUXRCLCtCQUFVLFFBQVE7QUFDZCxhQUFLLE1BQUwsR0FBYyxNQUFkLENBRGM7Ozs7Ozs7OzswQkFRbEIsaUNBQVk7QUFDUixlQUFPLEtBQUssTUFBTCxDQURDOzs7Ozs7Ozs7MEJBUVoseUJBQU8sVUFBVTtBQUNiLGVBQU8sZ0RBQU8sS0FBSyxTQUFMLEVBQVAsRUFBeUIsUUFBekIsQ0FBUDtVQURhOzs7Ozs7Ozs7Ozs0QkF4REM7QUFDZCxtQkFBTyxJQUFQLENBRGMiLCJmaWxlIjoiYXBwZW5kZXJcXGFwcGVuZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtmb3JtYXR9IGZyb20gJy4uL2Zvcm1hdHRlcic7XHJcblxyXG5leHBvcnQgY2xhc3MgTG9nQXBwZW5kZXIge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0cyB0aGUgbmFtZSBvZiB0aGUgYXBwZW5kZXIgKGUuZy4gJ2NvbnNvbGUnKVxyXG4gICAgICogQHJldHVybnMge251bGx9XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBnZXQgbmFtZSgpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgd2hldGhlciBvciBub3QgdGhlIGFwcGVuZGVyIGlzIGFjdGl2ZVxyXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICAgKi9cclxuICAgIGlzQWN0aXZlKCkge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQXBwZW5kcyB0aGUgbG9nXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gbG9nRXZlbnRcclxuICAgICAqL1xyXG4gICAgYXBwZW5kKGxvZ0V2ZW50KSB7XHJcbiAgICAgICAgLy8gc3R1YlxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0cyB0aGUgY3VycmVudCBsb2cgbGV2ZWxcclxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIGdldExvZ0xldmVsKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmxvZ0xldmVsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB0aGUgbG9nIGxldmVsIG9mIHRoZSBhcHBlbmRlclxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxvZ0xldmVsXHJcbiAgICAgKi9cclxuICAgIHNldExvZ0xldmVsKGxvZ0xldmVsKSB7XHJcbiAgICAgICAgdGhpcy5sb2dMZXZlbCA9IGxvZ0xldmVsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB0aGUgbGF5b3V0IG9mIHRoZSBhcHBlbmRlclxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGxheW91dFxyXG4gICAgICovXHJcbiAgICBzZXRMYXlvdXQobGF5b3V0KSB7XHJcbiAgICAgICAgdGhpcy5sYXlvdXQgPSBsYXlvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXRzIHRoZSBsYXlvdXQgYXNzb2NpYXRlZCB3aXRoIHRoZSBhcHBlbmRlclxyXG4gICAgICogQHJldHVybnMge3N0cmluZ31cclxuICAgICAqL1xyXG4gICAgZ2V0TGF5b3V0KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmxheW91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEZvcm1hdHMgdGhlIGxvZyBldmVudCB1c2luZyB0aGUgbGF5b3V0IHByb3ZpZGVkXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gbG9nRXZlbnRcclxuICAgICAqL1xyXG4gICAgZm9ybWF0KGxvZ0V2ZW50KSB7XHJcbiAgICAgICAgcmV0dXJuIGZvcm1hdCh0aGlzLmdldExheW91dCgpLCBsb2dFdmVudCk7XHJcbiAgICB9XHJcblxyXG59XHJcbiJdfQ==

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';

	exports.__esModule = true;
	exports.Logger = Logger;

	var /*istanbul ignore next*/_logLevel = __webpack_require__(4);

	/**
	 * Holds the definition for the log event object
	 *
	 * @typedef {{ date : number, error : Object, filename: string, lineNumber: ?string, column: ?string,
	 *      logErrorStack : Object, file : String, level : number, logger : string, message : string,
	 *      method : Function, properties : Object=, relative : number, sequence : number }}
	 */
	var LOG_EVENT = /*istanbul ignore next*/void 0; /**
	                                                 * log4js <https://github.com/anigenero/log4js>
	                                                 *
	                                                 * Copyright 2016-present Robin Schultz <http://anigenero.com>
	                                                 * Released under the MIT License
	                                                 */

	function Logger(context, appenderObj) {

		/** @type {string} */
		var _logContext = context;
		/** @typeof {number} */
		var _logSequence = 1;
		/** @typeof {number} */
		var _relative = new Date().getTime();

		/**
	  * Logs an error event
	     *
	     * @function
	     * @memberOf Logger
	  */
		this.error = function () {
			appenderObj.append(_constructLogEvent( /*istanbul ignore next*/_logLevel.LogLevel.ERROR, arguments));
		};

		/**
	  * Logs a warning
	     *
	     * @function
	     * @memberOf Logger
	  */
		this.warn = function () {
			appenderObj.append(_constructLogEvent( /*istanbul ignore next*/_logLevel.LogLevel.WARN, arguments));
		};

		/**
	  * Logs an info level event
	     *
	     * @function
	     * @memberOf Logger
	  */
		this.info = function () {
			appenderObj.append(_constructLogEvent( /*istanbul ignore next*/_logLevel.LogLevel.INFO, arguments));
		};

		/**
	  * Logs a debug event
	     *
	     * @function
	     * @memberOf Logger
	  */
		this.debug = function () {
			appenderObj.append(_constructLogEvent( /*istanbul ignore next*/_logLevel.LogLevel.DEBUG, arguments));
		};

		/**
	  * Logs a trace event
	     *
	     * @function
	     * @memberOf Logger
	  */
		this.trace = function () {
			appenderObj.append(_constructLogEvent( /*istanbul ignore next*/_logLevel.LogLevel.TRACE, arguments));
		};

		/**
	  * @function
	  *
	  * @param {number} level
	  * @param {Array.<Object>} args
	  *
	  * @return {LOG_EVENT}
	  */
		function _constructLogEvent(level, args) {

			var logTime = new Date();
			var error = null;

			// this looks horrible, but this is the only way to catch the stack for IE to later parse the stack
			try {
				throw new Error();
			} catch (e) {
				error = e;
			}

			var loggingEvent = {
				'date': logTime,
				'error': null,
				'logErrorStack': error,
				'file': null,
				'level': level,
				'lineNumber': null,
				'logger': _logContext,
				'message': '',
				'method': !_isStrict() ? args.callee.caller : 0,
				'properties': undefined,
				'relative': logTime.getTime() - _relative,
				'sequence': _logSequence++
			};

			var messageStubs = 0;
			for (var i = 0; i < args.length; i++) {

				if (i === 0) {
					loggingEvent.message = args[i];
					var stubs = /\{}/g.exec(loggingEvent.message);
					messageStubs = stubs instanceof Array ? stubs.length : 0;
				} else if (messageStubs > 0) {
					loggingEvent.message = loggingEvent.message.replace(/\{}/, args[i]);
					messageStubs--;
				} else if (args[i] instanceof Error) {
					loggingEvent.error = args[i];
				} else {
					loggingEvent.properties = args[i];
				}
			}

			return loggingEvent;
		}

		/**
	  * Returns whether or not the script is in strict mode
	  *
	  * @private
	  * @function
	  *
	  * @returns {boolean}
	  */
		var _isStrict = function _isStrict() {
			return !this;
		};

		return this;
	}
	//# sourceMappingURL=data:application/json;base64,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QUFhLFVBQWIsR0FBMEIsS0FBSyxDQUFMLENBQTFCLENBRE07SUFGQTtHQVRSOztBQWlCQSxTQUFPLFlBQVAsQ0E3Q3dDO0VBQXpDOzs7Ozs7Ozs7O0FBbkU0QyxLQTRIeEMsWUFBWSxTQUFaLFNBQVksR0FBWTtBQUNyQixTQUFPLENBQUMsSUFBRCxDQURjO0VBQVosQ0E1SDRCOztBQWdJNUMsUUFBTyxJQUFQLENBaEk0QztDQUF0QyIsImZpbGUiOiJsb2dnZXJcXGxvZ2dlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBsb2c0anMgPGh0dHBzOi8vZ2l0aHViLmNvbS9hbmlnZW5lcm8vbG9nNGpzPlxyXG4gKlxyXG4gKiBDb3B5cmlnaHQgMjAxNi1wcmVzZW50IFJvYmluIFNjaHVsdHogPGh0dHA6Ly9hbmlnZW5lcm8uY29tPlxyXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2VcclxuICovXHJcblxyXG5pbXBvcnQge0xvZ0xldmVsfSBmcm9tICcuLi9jb25zdC9sb2dMZXZlbCc7XHJcblxyXG4vKipcclxuICogSG9sZHMgdGhlIGRlZmluaXRpb24gZm9yIHRoZSBsb2cgZXZlbnQgb2JqZWN0XHJcbiAqXHJcbiAqIEB0eXBlZGVmIHt7IGRhdGUgOiBudW1iZXIsIGVycm9yIDogT2JqZWN0LCBmaWxlbmFtZTogc3RyaW5nLCBsaW5lTnVtYmVyOiA/c3RyaW5nLCBjb2x1bW46ID9zdHJpbmcsXHJcbiAqICAgICAgbG9nRXJyb3JTdGFjayA6IE9iamVjdCwgZmlsZSA6IFN0cmluZywgbGV2ZWwgOiBudW1iZXIsIGxvZ2dlciA6IHN0cmluZywgbWVzc2FnZSA6IHN0cmluZyxcclxuICogICAgICBtZXRob2QgOiBGdW5jdGlvbiwgcHJvcGVydGllcyA6IE9iamVjdD0sIHJlbGF0aXZlIDogbnVtYmVyLCBzZXF1ZW5jZSA6IG51bWJlciB9fVxyXG4gKi9cclxubGV0IExPR19FVkVOVDtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBMb2dnZXIoY29udGV4dCwgYXBwZW5kZXJPYmopIHtcclxuXHJcbiAgICAvKiogQHR5cGUge3N0cmluZ30gKi9cclxuICAgIGxldCBfbG9nQ29udGV4dCA9IGNvbnRleHQ7XHJcbiAgICAvKiogQHR5cGVvZiB7bnVtYmVyfSAqL1xyXG4gICAgbGV0IF9sb2dTZXF1ZW5jZSA9IDE7XHJcblx0LyoqIEB0eXBlb2Yge251bWJlcn0gKi9cclxuXHRsZXQgX3JlbGF0aXZlID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKTtcclxuXHJcblx0LyoqXHJcblx0ICogTG9ncyBhbiBlcnJvciBldmVudFxyXG4gICAgICpcclxuICAgICAqIEBmdW5jdGlvblxyXG4gICAgICogQG1lbWJlck9mIExvZ2dlclxyXG5cdCAqL1xyXG5cdHRoaXMuZXJyb3IgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRhcHBlbmRlck9iai5hcHBlbmQoX2NvbnN0cnVjdExvZ0V2ZW50KExvZ0xldmVsLkVSUk9SLCBhcmd1bWVudHMpKTtcclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBMb2dzIGEgd2FybmluZ1xyXG4gICAgICpcclxuICAgICAqIEBmdW5jdGlvblxyXG4gICAgICogQG1lbWJlck9mIExvZ2dlclxyXG5cdCAqL1xyXG5cdHRoaXMud2FybiA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdGFwcGVuZGVyT2JqLmFwcGVuZChfY29uc3RydWN0TG9nRXZlbnQoTG9nTGV2ZWwuV0FSTiwgYXJndW1lbnRzKSk7XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogTG9ncyBhbiBpbmZvIGxldmVsIGV2ZW50XHJcbiAgICAgKlxyXG4gICAgICogQGZ1bmN0aW9uXHJcbiAgICAgKiBAbWVtYmVyT2YgTG9nZ2VyXHJcblx0ICovXHJcblx0dGhpcy5pbmZvID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0YXBwZW5kZXJPYmouYXBwZW5kKF9jb25zdHJ1Y3RMb2dFdmVudChMb2dMZXZlbC5JTkZPLCBhcmd1bWVudHMpKTtcclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBMb2dzIGEgZGVidWcgZXZlbnRcclxuICAgICAqXHJcbiAgICAgKiBAZnVuY3Rpb25cclxuICAgICAqIEBtZW1iZXJPZiBMb2dnZXJcclxuXHQgKi9cclxuXHR0aGlzLmRlYnVnID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0YXBwZW5kZXJPYmouYXBwZW5kKF9jb25zdHJ1Y3RMb2dFdmVudChMb2dMZXZlbC5ERUJVRywgYXJndW1lbnRzKSk7XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogTG9ncyBhIHRyYWNlIGV2ZW50XHJcbiAgICAgKlxyXG4gICAgICogQGZ1bmN0aW9uXHJcbiAgICAgKiBAbWVtYmVyT2YgTG9nZ2VyXHJcblx0ICovXHJcblx0dGhpcy50cmFjZSA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdGFwcGVuZGVyT2JqLmFwcGVuZChfY29uc3RydWN0TG9nRXZlbnQoTG9nTGV2ZWwuVFJBQ0UsIGFyZ3VtZW50cykpO1xyXG5cdH07XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBmdW5jdGlvblxyXG5cdCAqXHJcblx0ICogQHBhcmFtIHtudW1iZXJ9IGxldmVsXHJcblx0ICogQHBhcmFtIHtBcnJheS48T2JqZWN0Pn0gYXJnc1xyXG5cdCAqXHJcblx0ICogQHJldHVybiB7TE9HX0VWRU5UfVxyXG5cdCAqL1xyXG5cdGZ1bmN0aW9uIF9jb25zdHJ1Y3RMb2dFdmVudChsZXZlbCwgYXJncykge1xyXG5cclxuXHRcdGxldCBsb2dUaW1lID0gbmV3IERhdGUoKTtcclxuXHRcdGxldCBlcnJvciA9IG51bGw7XHJcblxyXG5cdFx0Ly8gdGhpcyBsb29rcyBob3JyaWJsZSwgYnV0IHRoaXMgaXMgdGhlIG9ubHkgd2F5IHRvIGNhdGNoIHRoZSBzdGFjayBmb3IgSUUgdG8gbGF0ZXIgcGFyc2UgdGhlIHN0YWNrXHJcblx0XHR0cnkge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoKTtcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0ZXJyb3IgPSBlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBsb2dnaW5nRXZlbnQgPSB7XHJcblx0XHRcdCdkYXRlJyA6IGxvZ1RpbWUsXHJcblx0XHRcdCdlcnJvcicgOiBudWxsLFxyXG5cdFx0XHQnbG9nRXJyb3JTdGFjaycgOiBlcnJvcixcclxuXHRcdFx0J2ZpbGUnIDogbnVsbCxcclxuXHRcdFx0J2xldmVsJyA6IGxldmVsLFxyXG5cdFx0XHQnbGluZU51bWJlcicgOiBudWxsLFxyXG5cdFx0XHQnbG9nZ2VyJyA6IF9sb2dDb250ZXh0LFxyXG5cdFx0XHQnbWVzc2FnZScgOiAnJyxcclxuXHRcdFx0J21ldGhvZCcgOiAhX2lzU3RyaWN0KCkgPyBhcmdzLmNhbGxlZS5jYWxsZXIgOiAwLFxyXG5cdFx0XHQncHJvcGVydGllcycgOiB1bmRlZmluZWQsXHJcblx0XHRcdCdyZWxhdGl2ZScgOiBsb2dUaW1lLmdldFRpbWUoKSAtIF9yZWxhdGl2ZSxcclxuXHRcdFx0J3NlcXVlbmNlJyA6IF9sb2dTZXF1ZW5jZSsrXHJcblx0XHR9O1xyXG5cclxuXHRcdGxldCBtZXNzYWdlU3R1YnMgPSAwO1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XHJcblxyXG5cdFx0XHRpZiAoaSA9PT0gMCkge1xyXG5cdFx0XHRcdGxvZ2dpbmdFdmVudC5tZXNzYWdlID0gYXJnc1tpXTtcclxuXHRcdFx0XHRsZXQgc3R1YnMgPSAoL1xce30vZykuZXhlYyhsb2dnaW5nRXZlbnQubWVzc2FnZSk7XHJcblx0XHRcdFx0bWVzc2FnZVN0dWJzID0gKHN0dWJzIGluc3RhbmNlb2YgQXJyYXkpID8gc3R1YnMubGVuZ3RoIDogMDtcclxuXHRcdFx0fSBlbHNlIGlmIChtZXNzYWdlU3R1YnMgPiAwKSB7XHJcblx0XHRcdFx0bG9nZ2luZ0V2ZW50Lm1lc3NhZ2UgPSBsb2dnaW5nRXZlbnQubWVzc2FnZS5yZXBsYWNlKC9cXHt9LywgYXJnc1tpXSk7XHJcblx0XHRcdFx0bWVzc2FnZVN0dWJzLS07XHJcblx0XHRcdH0gZWxzZSBpZiAoYXJnc1tpXSBpbnN0YW5jZW9mIEVycm9yKSB7XHJcblx0XHRcdFx0bG9nZ2luZ0V2ZW50LmVycm9yID0gYXJnc1tpXTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRsb2dnaW5nRXZlbnQucHJvcGVydGllcyA9IGFyZ3NbaV07XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGxvZ2dpbmdFdmVudDtcclxuXHJcblx0fVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgc2NyaXB0IGlzIGluIHN0cmljdCBtb2RlXHJcbiAgICAgKlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEBmdW5jdGlvblxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAgICovXHJcblx0bGV0IF9pc1N0cmljdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gIXRoaXM7XHJcbiAgICB9O1xyXG5cclxuXHRyZXR1cm4gdGhpcztcclxuXHJcbn1cclxuIl19

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';

	exports.__esModule = true;
	exports.ConsoleAppender = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var /*istanbul ignore next*/_appender = __webpack_require__(7);

	var /*istanbul ignore next*/_logLevel = __webpack_require__(4);

	/*istanbul ignore next*/
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * log4js <https://github.com/anigenero/log4js>
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Copyright 2016-present Robin Schultz <http://anigenero.com>
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Released under the MIT License
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

	var ConsoleAppender = exports.ConsoleAppender = function (_LogAppender) {
		_inherits(ConsoleAppender, _LogAppender);

		function ConsoleAppender() {
			_classCallCheck(this, ConsoleAppender);

			return _possibleConstructorReturn(this, _LogAppender.apply(this, arguments));
		}

		/**
	  * Appends the log event
	  * @param logEvent
	  */

		ConsoleAppender.prototype.append = function append(logEvent) {
			if (logEvent.level <= this.getLogLevel()) {
				this._appendToConsole(logEvent);
			}
		};

		/**
	  * @private
	  * @function
	  *
	  * @param {LOG_EVENT} logEvent
	  */


		ConsoleAppender.prototype._appendToConsole = function _appendToConsole(logEvent) {

			var message = this.format(logEvent);

			if (logEvent.level == /*istanbul ignore next*/_logLevel.LogLevel.ERROR) {
				console.error(message);
			} else if (logEvent.level == /*istanbul ignore next*/_logLevel.LogLevel.WARN) {
				console.warn(message);
			} else if (logEvent.level == /*istanbul ignore next*/_logLevel.LogLevel.INFO) {
				console.info(message);
			} else if ([/*istanbul ignore next*/_logLevel.LogLevel.DEBUG, /*istanbul ignore next*/_logLevel.LogLevel.TRACE].indexOf(logEvent.level) > -1) {
				console.log(message);
			}
		};

		_createClass(ConsoleAppender, null, [{
			key: 'name',
			get: function get() {
				return 'console';
			}
		}]);

		return ConsoleAppender;
	}(_appender.LogAppender);
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcGVuZGVyXFxjb25zb2xlQXBwZW5kZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQU9BOztBQUNBOzs7Ozs7Ozs7Ozs7OztJQUVhOzs7Ozs7Ozs7Ozs7OzsyQkFVVCx5QkFBTyxVQUFVO0FBQ2IsTUFBSSxTQUFTLEtBQVQsSUFBa0IsS0FBSyxXQUFMLEVBQWxCLEVBQXNDO0FBQ3RDLFFBQUssZ0JBQUwsQ0FBc0IsUUFBdEIsRUFEc0M7R0FBMUM7Ozs7Ozs7Ozs7OzJCQVdQLDZDQUFpQixVQUFVOztBQUUxQixNQUFJLFVBQVUsS0FBSyxNQUFMLENBQVksUUFBWixDQUFWLENBRnNCOztBQUkxQixNQUFJLFNBQVMsS0FBVCxJQUFrQiwyQ0FBUyxLQUFULEVBQWdCO0FBQ3JDLFdBQVEsS0FBUixDQUFjLE9BQWQsRUFEcUM7R0FBdEMsTUFFTyxJQUFJLFNBQVMsS0FBVCxJQUFrQiwyQ0FBUyxJQUFULEVBQWU7QUFDM0MsV0FBUSxJQUFSLENBQWEsT0FBYixFQUQyQztHQUFyQyxNQUVBLElBQUksU0FBUyxLQUFULElBQWtCLDJDQUFTLElBQVQsRUFBZTtBQUMzQyxXQUFRLElBQVIsQ0FBYSxPQUFiLEVBRDJDO0dBQXJDLE1BRUEsSUFBSSxDQUFDLDJDQUFTLEtBQVQsRUFBZ0IsMkNBQVMsS0FBVCxDQUFqQixDQUFpQyxPQUFqQyxDQUF5QyxTQUFTLEtBQVQsQ0FBekMsR0FBMkQsQ0FBQyxDQUFELEVBQUk7QUFDekUsV0FBUSxHQUFSLENBQVksT0FBWixFQUR5RTtHQUFuRTs7Ozs7c0JBOUJhO0FBQ2QsVUFBTyxTQUFQLENBRGMiLCJmaWxlIjoiYXBwZW5kZXJcXGNvbnNvbGVBcHBlbmRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBsb2c0anMgPGh0dHBzOi8vZ2l0aHViLmNvbS9hbmlnZW5lcm8vbG9nNGpzPlxyXG4gKlxyXG4gKiBDb3B5cmlnaHQgMjAxNi1wcmVzZW50IFJvYmluIFNjaHVsdHogPGh0dHA6Ly9hbmlnZW5lcm8uY29tPlxyXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2VcclxuICovXHJcblxyXG5pbXBvcnQge0xvZ0FwcGVuZGVyfSBmcm9tICcuL2FwcGVuZGVyJztcclxuaW1wb3J0IHtMb2dMZXZlbH0gZnJvbSAnLi4vY29uc3QvbG9nTGV2ZWwnO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbnNvbGVBcHBlbmRlciBleHRlbmRzIExvZ0FwcGVuZGVyIHtcclxuXHJcbiAgICBzdGF0aWMgZ2V0IG5hbWUoKSB7XHJcbiAgICAgICAgcmV0dXJuICdjb25zb2xlJztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFwcGVuZHMgdGhlIGxvZyBldmVudFxyXG4gICAgICogQHBhcmFtIGxvZ0V2ZW50XHJcbiAgICAgKi9cclxuICAgIGFwcGVuZChsb2dFdmVudCkge1xyXG4gICAgICAgIGlmIChsb2dFdmVudC5sZXZlbCA8PSB0aGlzLmdldExvZ0xldmVsKCkpIHtcclxuICAgICAgICAgICAgdGhpcy5fYXBwZW5kVG9Db25zb2xlKGxvZ0V2ZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBwcml2YXRlXHJcblx0ICogQGZ1bmN0aW9uXHJcblx0ICpcclxuXHQgKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcclxuXHQgKi9cclxuXHRfYXBwZW5kVG9Db25zb2xlKGxvZ0V2ZW50KSB7XHJcblxyXG5cdFx0bGV0IG1lc3NhZ2UgPSB0aGlzLmZvcm1hdChsb2dFdmVudCk7XHJcblxyXG5cdFx0aWYgKGxvZ0V2ZW50LmxldmVsID09IExvZ0xldmVsLkVSUk9SKSB7XHJcblx0XHRcdGNvbnNvbGUuZXJyb3IobWVzc2FnZSk7XHJcblx0XHR9IGVsc2UgaWYgKGxvZ0V2ZW50LmxldmVsID09IExvZ0xldmVsLldBUk4pIHtcclxuXHRcdFx0Y29uc29sZS53YXJuKG1lc3NhZ2UpO1xyXG5cdFx0fSBlbHNlIGlmIChsb2dFdmVudC5sZXZlbCA9PSBMb2dMZXZlbC5JTkZPKSB7XHJcblx0XHRcdGNvbnNvbGUuaW5mbyhtZXNzYWdlKTtcclxuXHRcdH0gZWxzZSBpZiAoW0xvZ0xldmVsLkRFQlVHLCBMb2dMZXZlbC5UUkFDRV0uaW5kZXhPZihsb2dFdmVudC5sZXZlbCkgPiAtMSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhtZXNzYWdlKTtcclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxufVxyXG4iXX0=

/***/ }
/******/ ])
});
;