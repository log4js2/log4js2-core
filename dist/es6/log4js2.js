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

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.formatter = exports.LogAppender = exports.LogLevel = undefined;
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

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
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
	const _COMMAND_REGEX = /%([a-z,A-Z]+)(?=\{|)/;

	/** @type {Object} */
	/**
	 * log4js <https://github.com/anigenero/log4js>
	 *
	 * Copyright 2016-present Robin Schultz <http://anigenero.com>
	 * Released under the MIT License
	 */

	let _compiledLayouts = {};

	/**
	 * @function
	 * @memberOf formatter
	 *
	 * @param {LOG_EVENT} logEvent
	 *
	 * @return {string}
	 */
	let _formatLogger = function (logEvent) {
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
	let _formatDate = function (logEvent, params) {
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
	let _formatException = function (logEvent) {

	  let message = '';

	  if (logEvent.error != null) {

	    if (logEvent.error.stack != undefined) {
	      let stacks = logEvent.error.stack.split(/\n/g);
	      stacks.forEach(function (stack) {
	        message += `\t${ stack }\n`;
	      });
	    } else if (logEvent.error.message != null && logEvent.error.message != '') {
	      message += `\t${ logEvent.error.name }: ${ logEvent.error.message }\n`;
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
	let _formatFile = function (logEvent) {

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
	let _formatLineNumber = function (logEvent) {

	  if (!logEvent.lineNumber) {
	    _getFileDetails(logEvent);
	  }

	  return `${ logEvent.lineNumber }`;
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
	let _formatMapMessage = function (logEvent, params) {
	  let message = null;
	  if (logEvent.properties) {

	    message = [];
	    for (let key in logEvent.properties) {
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
	let _formatLogMessage = function (logEvent) {
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
	let _formatMethodName = function (logEvent) {
	  return utility.getFunctionName(logEvent.method);
	};

	/**
	 * @private
	 * @function
	 * @memberOf formatter
	 */
	let _formatLineSeparator = function () {
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
	let _formatLevel = function (logEvent) {

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
	let _formatRelative = function (logEvent) {
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
	let formatSequenceNumber_ = function (logEvent) {
	  return '' + logEvent.sequence;
	};

	let _formatters = {
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
	  'sn|sequenceNumber': formatSequenceNumber_
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
	let _getCompiledLayout = function (layout) {

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
	let _compileLayout = function (layout) {

	  let index = layout.indexOf('%');
	  let currentFormatString = '';
	  let formatArray = [];

	  if (index != 0) {
	    formatArray.push(layout.substring(0, index));
	  }

	  do {

	    let startIndex = index;
	    let endIndex = index = layout.indexOf('%', index + 1);

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
	let _getFormatterObject = function (formatString) {

	  let result = _COMMAND_REGEX.exec(formatString);
	  if (result != null && result.length == 2) {

	    let formatter = _getFormatterFunction(result[1]);
	    if (!formatter) {
	      return null;
	    }

	    let params = _getLayoutTagParams(formatString);

	    let after = '';
	    let endIndex = formatString.lastIndexOf('}');
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
	 * @function
	 * @memberOf formatter
	 *
	 * @param {string} command
	 *
	 * @return {?string}
	 */
	let _getFormatterFunction = function (command) {

	  let regex;
	  for (let key in _formatters) {
	    regex = new RegExp('^' + key + '$');
	    if (regex.exec(command)) {
	      return _formatters[key];
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
	let _getLayoutTagParams = function (command) {

	  let params = [];
	  let result = command.match(/\{([^}]*)(?=})/g);
	  if (result != null) {
	    for (let i = 0; i < result.length; i++) {
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
	let _formatLogEvent = function (formatter, logEvent) {

	  let response;
	  let message = '';
	  let count = formatter.length;
	  for (let i = 0; i < count; i++) {
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
	let _getFileDetails = function (logEvent) {

	  if (logEvent.logErrorStack) {

	    let parts = logEvent.logErrorStack.stack.split(/\n/g);
	    let file = parts[3];
	    file = file.replace(/at (.*\(|)(file|http|https|)(:|)(\/|)*/, '');
	    file = file.replace(')', '');
	    file = file.replace(typeof location !== 'undefined' ? location.host : '', '').trim();

	    let fileParts = file.split(/\:/g);

	    logEvent.column = fileParts.pop();
	    logEvent.lineNumber = fileParts.pop();

	    if (true) {
	      let path = __webpack_require__(5);
	      let appDir = path.dirname(__webpack_require__.c[0].filename);
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
	//# sourceMappingURL=data:application/json;base64,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Q0FKTTtHQXJCUDtDQUZxQjs7Ozs7Ozs7OztBQXlDZixTQUFTLFVBQVQsQ0FBb0IsTUFBcEIsRUFBNEI7QUFDbEMscUJBQW1CLE1BQW5CLEVBRGtDO0NBQTVCOzs7Ozs7Ozs7OztBQWFBLFNBQVMsTUFBVCxDQUFnQixNQUFoQixFQUF3QixRQUF4QixFQUFrQztBQUN4QyxTQUFPLGdCQUFnQixtQkFBbUIsTUFBbkIsQ0FBaEIsRUFBNEMsUUFBNUMsQ0FBUCxDQUR3QztDQUFsQyIsImZpbGUiOiJmb3JtYXR0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogbG9nNGpzIDxodHRwczovL2dpdGh1Yi5jb20vYW5pZ2VuZXJvL2xvZzRqcz5cclxuICpcclxuICogQ29weXJpZ2h0IDIwMTYtcHJlc2VudCBSb2JpbiBTY2h1bHR6IDxodHRwOi8vYW5pZ2VuZXJvLmNvbT5cclxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlXHJcbiAqL1xyXG5cclxuaW1wb3J0IHtkYXRlRm9ybWF0fSBmcm9tICcuL2RhdGVGb3JtYXR0ZXInO1xyXG5pbXBvcnQgKiBhcyB1dGlsaXR5IGZyb20gJy4vdXRpbGl0eSc7XHJcbmltcG9ydCB7TG9nTGV2ZWx9IGZyb20gJy4vY29uc3QvbG9nTGV2ZWwnO1xyXG5cclxuLyoqIEBjb25zdCAqL1xyXG5jb25zdCBfQ09NTUFORF9SRUdFWCA9IC8lKFthLXosQS1aXSspKD89XFx7fCkvO1xyXG5cclxuLyoqIEB0eXBlIHtPYmplY3R9ICovXHJcbmxldCBfY29tcGlsZWRMYXlvdXRzID0ge307XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcclxuICpcclxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XHJcbiAqXHJcbiAqIEByZXR1cm4ge3N0cmluZ31cclxuICovXHJcbmxldCBfZm9ybWF0TG9nZ2VyID0gZnVuY3Rpb24gKGxvZ0V2ZW50KSB7XHJcblx0cmV0dXJuIGxvZ0V2ZW50LmxvZ2dlcjtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGZvcm1hdHRlclxyXG4gKlxyXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcclxuICogQHBhcmFtIHtBcnJheS48c3RyaW5nPn0gcGFyYW1zXHJcbiAqXHJcbiAqIEByZXR1cm4ge3N0cmluZ31cclxuICovXHJcbmxldCBfZm9ybWF0RGF0ZSA9IGZ1bmN0aW9uIChsb2dFdmVudCwgcGFyYW1zKSB7XHJcblx0cmV0dXJuIGRhdGVGb3JtYXQobG9nRXZlbnQuZGF0ZSwgcGFyYW1zWzBdKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGZvcm1hdHRlclxyXG4gKlxyXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcclxuICpcclxuICogQHJldHVybiB7c3RyaW5nfVxyXG4gKi9cclxubGV0IF9mb3JtYXRFeGNlcHRpb24gPSBmdW5jdGlvbiAobG9nRXZlbnQpIHtcclxuXHJcbiAgICBsZXQgbWVzc2FnZSA9ICcnO1xyXG5cclxuICAgIGlmIChsb2dFdmVudC5lcnJvciAhPSBudWxsKSB7XHJcblxyXG5cdFx0aWYgKGxvZ0V2ZW50LmVycm9yLnN0YWNrICE9IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRsZXQgc3RhY2tzID0gbG9nRXZlbnQuZXJyb3Iuc3RhY2suc3BsaXQoL1xcbi9nKTtcclxuICAgICAgICAgICAgc3RhY2tzLmZvckVhY2goZnVuY3Rpb24gKHN0YWNrKSB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlICs9IGBcXHQke3N0YWNrfVxcbmA7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cdFx0fSBlbHNlIGlmIChsb2dFdmVudC5lcnJvci5tZXNzYWdlICE9IG51bGwgJiYgbG9nRXZlbnQuZXJyb3IubWVzc2FnZSAhPSAnJykge1xyXG5cdFx0XHRtZXNzYWdlICs9IGBcXHQke2xvZ0V2ZW50LmVycm9yLm5hbWV9OiAke2xvZ0V2ZW50LmVycm9yLm1lc3NhZ2V9XFxuYDtcclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHRyZXR1cm4gbWVzc2FnZTtcclxuXHJcbn07XHJcblxyXG4vKipcclxuICogRm9ybWF0cyB0aGUgZmlsZSAoZS5nLiB0ZXN0LmpzKSB0byB0aGUgZmlsZVxyXG4gKlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGZvcm1hdHRlclxyXG4gKlxyXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcclxuICovXHJcbmxldCBfZm9ybWF0RmlsZSA9IGZ1bmN0aW9uIChsb2dFdmVudCkge1xyXG5cclxuICAgIGlmICghbG9nRXZlbnQuZmlsZSkge1xyXG5cdFx0X2dldEZpbGVEZXRhaWxzKGxvZ0V2ZW50KTtcclxuXHR9XHJcblxyXG5cdHJldHVybiBsb2dFdmVudC5maWxlO1xyXG5cclxufTtcclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGZvcm1hdHRlclxyXG4gKlxyXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcclxuICpcclxuICogQHJldHVybiB7c3RyaW5nfVxyXG4gKi9cclxubGV0IF9mb3JtYXRMaW5lTnVtYmVyID0gZnVuY3Rpb24gKGxvZ0V2ZW50KSB7XHJcblxyXG4gICAgaWYgKCFsb2dFdmVudC5saW5lTnVtYmVyKSB7XHJcblx0XHRfZ2V0RmlsZURldGFpbHMobG9nRXZlbnQpO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIGAke2xvZ0V2ZW50LmxpbmVOdW1iZXJ9YDtcclxuXHJcbn07XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcclxuICpcclxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XHJcbiAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz59IHBhcmFtc1xyXG4gKlxyXG4gKiBAcmV0dXJuIHtzdHJpbmd9XHJcbiAqL1xyXG5sZXQgX2Zvcm1hdE1hcE1lc3NhZ2UgPSBmdW5jdGlvbiAobG9nRXZlbnQsIHBhcmFtcykge1xyXG5cdGxldCBtZXNzYWdlID0gbnVsbDtcclxuXHRpZiAobG9nRXZlbnQucHJvcGVydGllcykge1xyXG5cclxuXHRcdG1lc3NhZ2UgPSBbXTtcclxuXHRcdGZvciAobGV0IGtleSBpbiBsb2dFdmVudC5wcm9wZXJ0aWVzKSB7XHJcblx0XHRcdGlmIChwYXJhbXNbMF0pIHtcclxuXHRcdFx0XHRpZiAocGFyYW1zWzBdID09IGtleSkge1xyXG5cdFx0XHRcdFx0bWVzc2FnZS5wdXNoKGxvZ0V2ZW50LnByb3BlcnRpZXNba2V5XSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdG1lc3NhZ2UucHVzaCgneycgKyBrZXkgKyAnLCcgKyBsb2dFdmVudC5wcm9wZXJ0aWVzW2tleV0gKyAnfScpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuICd7JyArIG1lc3NhZ2Uuam9pbignLCcpICsgJ30nO1xyXG5cclxuXHR9XHJcblx0cmV0dXJuIG1lc3NhZ2U7XHJcbn07XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcclxuICpcclxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XHJcbiAqXHJcbiAqIEByZXR1cm4ge3N0cmluZ31cclxuICovXHJcbmxldCBfZm9ybWF0TG9nTWVzc2FnZSA9IGZ1bmN0aW9uIChsb2dFdmVudCkge1xyXG5cdHJldHVybiBsb2dFdmVudC5tZXNzYWdlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXHJcbiAqXHJcbiAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dFdmVudFxyXG4gKlxyXG4gKiBAcmV0dXJuIHtzdHJpbmd9XHJcbiAqL1xyXG5sZXQgX2Zvcm1hdE1ldGhvZE5hbWUgPSBmdW5jdGlvbiAobG9nRXZlbnQpIHtcclxuXHRyZXR1cm4gdXRpbGl0eS5nZXRGdW5jdGlvbk5hbWUobG9nRXZlbnQubWV0aG9kKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGZvcm1hdHRlclxyXG4gKi9cclxubGV0IF9mb3JtYXRMaW5lU2VwYXJhdG9yID0gZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiAnXFxuJztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGZvcm1hdHRlclxyXG4gKlxyXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcclxuICpcclxuICogQHJldHVybiB7c3RyaW5nfVxyXG4gKi9cclxubGV0IF9mb3JtYXRMZXZlbCA9IGZ1bmN0aW9uIChsb2dFdmVudCkge1xyXG5cclxuICAgIHN3aXRjaCAobG9nRXZlbnQubGV2ZWwpIHtcclxuXHJcbiAgICAgICAgY2FzZSBMb2dMZXZlbC5GQVRBTDpcclxuICAgICAgICAgICAgcmV0dXJuICdGQVRBTCc7XHJcbiAgICAgICAgY2FzZSBMb2dMZXZlbC5FUlJPUjpcclxuICAgICAgICAgICAgcmV0dXJuICdFUlJPUic7XHJcbiAgICAgICAgY2FzZSBMb2dMZXZlbC5XQVJOOlxyXG4gICAgICAgICAgICByZXR1cm4gJ1dBUk4nO1xyXG4gICAgICAgIGNhc2UgTG9nTGV2ZWwuSU5GTzpcclxuICAgICAgICAgICAgcmV0dXJuICdJTkZPJztcclxuICAgICAgICBjYXNlIExvZ0xldmVsLkRFQlVHOlxyXG4gICAgICAgICAgICByZXR1cm4gJ0RFQlVHJztcclxuICAgICAgICBjYXNlIExvZ0xldmVsLlRSQUNFOlxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiAnVFJBQ0UnO1xyXG5cclxuICAgIH1cclxuXHJcbn07XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcclxuICpcclxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XHJcbiAqXHJcbiAqIEByZXR1cm4ge3N0cmluZ31cclxuICovXHJcbmxldCBfZm9ybWF0UmVsYXRpdmUgPSBmdW5jdGlvbiAobG9nRXZlbnQpIHtcclxuXHRyZXR1cm4gJycgKyBsb2dFdmVudC5yZWxhdGl2ZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGZvcm1hdHRlclxyXG4gKlxyXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcclxuICpcclxuICogQHJldHVybiB7c3RyaW5nfVxyXG4gKi9cclxubGV0IGZvcm1hdFNlcXVlbmNlTnVtYmVyXyA9IGZ1bmN0aW9uIChsb2dFdmVudCkge1xyXG5cdHJldHVybiAnJyArIGxvZ0V2ZW50LnNlcXVlbmNlO1xyXG59O1xyXG5cclxubGV0IF9mb3JtYXR0ZXJzID0ge1xyXG5cdCdjfGxvZ2dlcicgOiBfZm9ybWF0TG9nZ2VyLFxyXG5cdCdkfGRhdGUnIDogX2Zvcm1hdERhdGUsXHJcblx0J2V4fGV4Y2VwdGlvbnx0aHJvd2FibGUnIDogX2Zvcm1hdEV4Y2VwdGlvbixcclxuXHQnRnxmaWxlJyA6IF9mb3JtYXRGaWxlLFxyXG5cdCdLfG1hcHxNQVAnIDogX2Zvcm1hdE1hcE1lc3NhZ2UsXHJcblx0J0x8bGluZScgOiBfZm9ybWF0TGluZU51bWJlcixcclxuXHQnbXxtc2d8bWVzc2FnZScgOiBfZm9ybWF0TG9nTWVzc2FnZSxcclxuXHQnTXxtZXRob2QnIDogX2Zvcm1hdE1ldGhvZE5hbWUsXHJcblx0J24nIDogX2Zvcm1hdExpbmVTZXBhcmF0b3IsXHJcblx0J3B8bGV2ZWwnIDogX2Zvcm1hdExldmVsLFxyXG5cdCdyfHJlbGF0aXZlJyA6IF9mb3JtYXRSZWxhdGl2ZSxcclxuXHQnc258c2VxdWVuY2VOdW1iZXInIDogZm9ybWF0U2VxdWVuY2VOdW1iZXJfXHJcbn07XHJcblxyXG4vKipcclxuICogR2V0IHRoZSBjb21waWxlZCBsYXlvdXQgZm9yIHRoZSBzcGVjaWZpZWQgbGF5b3V0IHN0cmluZy4gSWYgdGhlIGNvbXBpbGVkIGxheW91dCBkb2VzIG5vdFxyXG4gKiBleGlzdCwgdGhlbiB3ZSB3YW50IHRvIGNyZWF0ZSBpdC5cclxuICpcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IGxheW91dFxyXG4gKlxyXG4gKiBAcmV0dXJuIHtBcnJheS48c3RyaW5nfGZ1bmN0aW9uPn1cclxuICovXHJcbmxldCBfZ2V0Q29tcGlsZWRMYXlvdXQgPSBmdW5jdGlvbiAobGF5b3V0KSB7XHJcblxyXG5cdGlmIChfY29tcGlsZWRMYXlvdXRzW2xheW91dF0pIHtcclxuXHRcdHJldHVybiBfY29tcGlsZWRMYXlvdXRzW2xheW91dF07XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gX2NvbXBpbGVMYXlvdXQobGF5b3V0KTtcclxuXHJcbn07XHJcblxyXG4vKipcclxuICogQ29tcGlsZXMgYSBsYXlvdXQgaW50byBhbiBhcnJheS4gVGhlIGFycmF5IGNvbnRhaW5zIGZ1bmN0aW9uc1xyXG4gKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGZvcm1hdHRlclxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gbGF5b3V0XHJcbiAqXHJcbiAqIEByZXR1cm4ge0FycmF5LjxzdHJpbmd8ZnVuY3Rpb24+fVxyXG4gKi9cclxubGV0IF9jb21waWxlTGF5b3V0ID0gZnVuY3Rpb24gKGxheW91dCkge1xyXG5cclxuXHRsZXQgaW5kZXggPSBsYXlvdXQuaW5kZXhPZignJScpO1xyXG5cdGxldCBjdXJyZW50Rm9ybWF0U3RyaW5nID0gJyc7XHJcblx0bGV0IGZvcm1hdEFycmF5ID0gW107XHJcblxyXG5cdGlmIChpbmRleCAhPSAwKSB7XHJcblx0XHRmb3JtYXRBcnJheS5wdXNoKGxheW91dC5zdWJzdHJpbmcoMCwgaW5kZXgpKTtcclxuXHR9XHJcblxyXG5cdGRvIHtcclxuXHJcblx0XHRsZXQgc3RhcnRJbmRleCA9IGluZGV4O1xyXG5cdFx0bGV0IGVuZEluZGV4ID0gaW5kZXggPSBsYXlvdXQuaW5kZXhPZignJScsIGluZGV4ICsgMSk7XHJcblxyXG5cdFx0aWYgKGVuZEluZGV4IDwgMCkge1xyXG5cdFx0XHRjdXJyZW50Rm9ybWF0U3RyaW5nID0gbGF5b3V0LnN1YnN0cmluZyhzdGFydEluZGV4KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGN1cnJlbnRGb3JtYXRTdHJpbmcgPSBsYXlvdXQuc3Vic3RyaW5nKHN0YXJ0SW5kZXgsIGVuZEluZGV4KTtcclxuXHRcdH1cclxuXHJcblx0XHRmb3JtYXRBcnJheS5wdXNoKF9nZXRGb3JtYXR0ZXJPYmplY3QoY3VycmVudEZvcm1hdFN0cmluZykpO1xyXG5cclxuXHR9IHdoaWxlIChpbmRleCA+IC0xKTtcclxuXHJcbiAgICAvLyBzZXQgdGhlIGZvcm1hdCBhcnJheSB0byB0aGUgc3BlY2lmaWVkIGNvbXBpbGVkIGxheW91dFxyXG5cdF9jb21waWxlZExheW91dHNbbGF5b3V0XSA9IGZvcm1hdEFycmF5O1xyXG5cclxuXHRyZXR1cm4gZm9ybWF0QXJyYXk7XHJcblxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBmb3JtYXRTdHJpbmdcclxuICpcclxuICogQHJldHVybiB7T2JqZWN0fHN0cmluZ31cclxuICovXHJcbmxldCBfZ2V0Rm9ybWF0dGVyT2JqZWN0ID0gZnVuY3Rpb24gKGZvcm1hdFN0cmluZykge1xyXG5cclxuXHRsZXQgcmVzdWx0ID0gX0NPTU1BTkRfUkVHRVguZXhlYyhmb3JtYXRTdHJpbmcpO1xyXG5cdGlmIChyZXN1bHQgIT0gbnVsbCAmJiByZXN1bHQubGVuZ3RoID09IDIpIHtcclxuXHJcblx0XHRsZXQgZm9ybWF0dGVyID0gX2dldEZvcm1hdHRlckZ1bmN0aW9uKHJlc3VsdFsxXSk7XHJcblx0XHRpZiAoIWZvcm1hdHRlcikge1xyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgcGFyYW1zID0gX2dldExheW91dFRhZ1BhcmFtcyhmb3JtYXRTdHJpbmcpO1xyXG5cclxuXHRcdGxldCBhZnRlciA9ICcnO1xyXG5cdFx0bGV0IGVuZEluZGV4ID0gZm9ybWF0U3RyaW5nLmxhc3RJbmRleE9mKCd9Jyk7XHJcblx0XHRpZiAoZW5kSW5kZXggIT0gLTEpIHtcclxuXHRcdFx0YWZ0ZXIgPSBmb3JtYXRTdHJpbmcuc3Vic3RyaW5nKGVuZEluZGV4ICsgMSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRhZnRlciA9IGZvcm1hdFN0cmluZy5zdWJzdHJpbmcocmVzdWx0LmluZGV4ICsgcmVzdWx0WzFdLmxlbmd0aCArIDEpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdCdmb3JtYXR0ZXInIDogZm9ybWF0dGVyLFxyXG5cdFx0XHQncGFyYW1zJyA6IHBhcmFtcyxcclxuXHRcdFx0J2FmdGVyJyA6IGFmdGVyXHJcblx0XHR9O1xyXG5cclxuXHR9XHJcblxyXG5cdHJldHVybiBmb3JtYXRTdHJpbmc7XHJcblxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb21tYW5kXHJcbiAqXHJcbiAqIEByZXR1cm4gez9zdHJpbmd9XHJcbiAqL1xyXG5sZXQgX2dldEZvcm1hdHRlckZ1bmN0aW9uID0gZnVuY3Rpb24gKGNvbW1hbmQpIHtcclxuXHJcblx0bGV0IHJlZ2V4O1xyXG5cdGZvciAobGV0IGtleSBpbiBfZm9ybWF0dGVycykge1xyXG5cdFx0cmVnZXggPSBuZXcgUmVnRXhwKCdeJyArIGtleSArICckJyk7XHJcblx0XHRpZiAocmVnZXguZXhlYyhjb21tYW5kKSkge1xyXG5cdFx0XHRyZXR1cm4gX2Zvcm1hdHRlcnNba2V5XTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJldHVybiBudWxsO1xyXG5cclxufTtcclxuXHJcbi8qKlxyXG4gKiBHZXRzIHRoZSBsYXlvdXQgdGFnIHBhcmFtcyBhc3NvY2lhdGVkIHdpdGggdGhlIGxheW91dCB0YWcuIFNvLCBmb3IgZXhhbXBsZSwgJyVke3l5eXktTU0tZGR9YFxyXG4gKiB3b3VsZCBvdXRwdXQgYW4gYXJyYXkgb2YgWyd5eXl5LU1NLWRkJ11cclxuICpcclxuICogQHByaXZhdGVcclxuICogQGZ1bmN0aW9uXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb21tYW5kXHJcbiAqXHJcbiAqIEByZXR1cm4ge0FycmF5LjxzdHJpbmc+fVxyXG4gKi9cclxubGV0IF9nZXRMYXlvdXRUYWdQYXJhbXMgPSBmdW5jdGlvbiAoY29tbWFuZCkge1xyXG5cclxuXHRsZXQgcGFyYW1zID0gW107XHJcblx0bGV0IHJlc3VsdCA9IGNvbW1hbmQubWF0Y2goL1xceyhbXn1dKikoPz19KS9nKTtcclxuXHRpZiAocmVzdWx0ICE9IG51bGwpIHtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcmVzdWx0Lmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHBhcmFtcy5wdXNoKHJlc3VsdFtpXS5zdWJzdHJpbmcoMSkpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIHBhcmFtcztcclxuXHJcbn07XHJcblxyXG4vKipcclxuICogSGFuZGxlcyBmb3JtYXR0aW5nIHRoZSBsb2cgZXZlbnQgdXNpbmcgdGhlIHNwZWNpZmllZCBmb3JtYXR0ZXIgYXJyYXlcclxuICpcclxuICogQHByaXZhdGVcclxuICogQGZ1bmN0aW9uXHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXkuPGZ1bmN0aW9ufHN0cmluZz59IGZvcm1hdHRlclxyXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcclxuICpcclxuICogQHJldHVybiB7c3RyaW5nfVxyXG4gKi9cclxubGV0IF9mb3JtYXRMb2dFdmVudCA9IGZ1bmN0aW9uIChmb3JtYXR0ZXIsIGxvZ0V2ZW50KSB7XHJcblxyXG5cdGxldCByZXNwb25zZTtcclxuXHRsZXQgbWVzc2FnZSA9ICcnO1xyXG5cdGxldCBjb3VudCA9IGZvcm1hdHRlci5sZW5ndGg7XHJcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XHJcblx0XHRpZiAoZm9ybWF0dGVyW2ldICE9PSBudWxsKSB7XHJcblxyXG5cdFx0XHRpZiAoZm9ybWF0dGVyW2ldIGluc3RhbmNlb2YgT2JqZWN0KSB7XHJcblxyXG5cdFx0XHRcdHJlc3BvbnNlID0gZm9ybWF0dGVyW2ldLmZvcm1hdHRlcihsb2dFdmVudCwgZm9ybWF0dGVyW2ldLnBhcmFtcyk7XHJcblx0XHRcdFx0aWYgKHJlc3BvbnNlICE9IG51bGwpIHtcclxuXHRcdFx0XHRcdG1lc3NhZ2UgKz0gcmVzcG9uc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG1lc3NhZ2UgKz0gZm9ybWF0dGVyW2ldLmFmdGVyO1xyXG5cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRtZXNzYWdlICs9IGZvcm1hdHRlcltpXTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJldHVybiBtZXNzYWdlLnRyaW0oKTtcclxuXHJcbn07XHJcblxyXG4vKipcclxuICpcclxuICogQHByaXZhdGVcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcclxuICpcclxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XHJcbiAqL1xyXG5sZXQgX2dldEZpbGVEZXRhaWxzID0gZnVuY3Rpb24gKGxvZ0V2ZW50KSB7XHJcblxyXG5cdGlmIChsb2dFdmVudC5sb2dFcnJvclN0YWNrKSB7XHJcblxyXG5cdFx0bGV0IHBhcnRzID0gbG9nRXZlbnQubG9nRXJyb3JTdGFjay5zdGFjay5zcGxpdCgvXFxuL2cpO1xyXG5cdFx0bGV0IGZpbGUgPSBwYXJ0c1szXTtcclxuXHRcdGZpbGUgPSBmaWxlLnJlcGxhY2UoL2F0ICguKlxcKHwpKGZpbGV8aHR0cHxodHRwc3wpKDp8KShcXC98KSovLCAnJyk7XHJcblx0XHRmaWxlID0gZmlsZS5yZXBsYWNlKCcpJywgJycpO1xyXG5cdFx0ZmlsZSA9IGZpbGUucmVwbGFjZSgodHlwZW9mIGxvY2F0aW9uICE9PSAndW5kZWZpbmVkJykgPyBsb2NhdGlvbi5ob3N0IDogJycsICcnKS50cmltKCk7XHJcblxyXG5cdFx0bGV0IGZpbGVQYXJ0cyA9IGZpbGUuc3BsaXQoL1xcOi9nKTtcclxuXHJcblx0XHRsb2dFdmVudC5jb2x1bW4gPSBmaWxlUGFydHMucG9wKCk7XHJcblx0XHRsb2dFdmVudC5saW5lTnVtYmVyID0gZmlsZVBhcnRzLnBvcCgpO1xyXG5cclxuXHRcdGlmICh0eXBlb2YgZGVmaW5lICE9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHRsZXQgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcclxuXHRcdFx0bGV0IGFwcERpciA9IHBhdGguZGlybmFtZShyZXF1aXJlLm1haW4uZmlsZW5hbWUpO1xyXG5cdFx0XHRsb2dFdmVudC5maWxlbmFtZSA9IGZpbGVQYXJ0cy5qb2luKCc6JykucmVwbGFjZShhcHBEaXIsICcnKS5yZXBsYWNlKC8oXFxcXHxcXC8pLywgJycpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0bG9nRXZlbnQuZmlsZW5hbWUgPSBmaWxlUGFydHMuam9pbignOicpO1xyXG5cdFx0fVxyXG5cclxuXHR9IGVsc2Uge1xyXG5cclxuXHRcdGxvZ0V2ZW50LmNvbHVtbiA9ICc/JztcclxuXHRcdGxvZ0V2ZW50LmZpbGVuYW1lID0gJ2Fub255bW91cyc7XHJcblx0XHRsb2dFdmVudC5saW5lTnVtYmVyID0gJz8nO1xyXG5cclxuXHR9XHJcblxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBsYXlvdXRcclxuICpcclxuICogQHJldHVybiB7c3RyaW5nfVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHByZUNvbXBpbGUobGF5b3V0KSB7XHJcblx0X2dldENvbXBpbGVkTGF5b3V0KGxheW91dCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGZvcm1hdHRlclxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gbGF5b3V0XHJcbiAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dFdmVudFxyXG4gKlxyXG4gKiBAcmV0dXJuIHtzdHJpbmd9XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0KGxheW91dCwgbG9nRXZlbnQpIHtcclxuXHRyZXR1cm4gX2Zvcm1hdExvZ0V2ZW50KF9nZXRDb21waWxlZExheW91dChsYXlvdXQpLCBsb2dFdmVudCk7XHJcbn1cclxuIl19

/***/ },
/* 2 */
/***/ function(module, exports) {

	/*istanbul ignore next*/'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.dateFormat = dateFormat;
	/**
	 * log4js <https://github.com/anigenero/log4js2>
	 *
	 * Copyright 2016-present Robin Schultz <http://anigenero.com>
	 * Released under the MIT License
	 */

	let i18n = {
		'dayNames': ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
		'monthNames': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
	};

	const TOKEN = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|'[^']*'|'[^']*'/g;
	const TIMEZONE = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g;
	const TIMEZONE_CLIP = /[^-+\dA-Z]/g;

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

	function dateFormat(date, mask, utc) {

		// You can't provide utc if you skip other args (use the 'UTC:' mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == '[object String]' && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date();
		if (isNaN(date)) {
			throw new SyntaxError('invalid date');
		}

		mask = String(mask || 'yyyy-mm-dd HH:MM:ss,S');

		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == 'UTC:') {
			mask = mask.slice(4);
			utc = true;
		}

		let _ = utc ? 'getUTC' : 'get';
		let d = date[_ + 'Date']();
		let D = date[_ + 'Day']();
		let m = date[_ + 'Month']();
		let y = date[_ + 'FullYear']();
		let H = date[_ + 'Hours']();
		let M = date[_ + 'Minutes']();
		let s = date[_ + 'Seconds']();
		let L = date[_ + 'Milliseconds']();
		let o = utc ? 0 : date.getTimezoneOffset();
		let flags = {
			'd': d,
			'dd': pad(d),
			'ddd': i18n.dayNames[D],
			'dddd': i18n.dayNames[D + 7],
			'M': m + 1,
			'MM': pad(m + 1),
			'MMM': i18n.monthNames[m],
			'MMMM': i18n.monthNames[m + 12],
			'yy': String(y).slice(2),
			'yyyy': y,
			'h': H % 12 || 12,
			'hh': pad(H % 12 || 12),
			'H': H,
			'HH': pad(H),
			'm': M,
			'mm': pad(M),
			's': s,
			'ss': pad(s),
			'S': pad(L, 1),
			't': H < 12 ? 'a' : 'p',
			'tt': H < 12 ? 'am' : 'pm',
			'T': H < 12 ? 'A' : 'P',
			'TT': H < 12 ? 'AM' : 'PM',
			'Z': utc ? 'UTC' : (String(date).match(TIMEZONE) || ['']).pop().replace(TIMEZONE_CLIP, ''),
			'o': (o > 0 ? '-' : '+') + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4)
		};

		return mask.replace(TOKEN, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	}
	//# sourceMappingURL=data:application/json;base64,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aEMsQ0FBRCxDQUF5QyxHQUF6QyxHQUErQyxPQUEvQyxDQUF1RCxhQUF2RCxFQUFzRSxFQUF0RSxDQUFkO0FBQ04sT0FBTSxDQUFDLElBQUksQ0FBSixHQUFRLEdBQVIsR0FBYyxHQUFkLENBQUQsR0FBc0IsSUFBSSxLQUFLLEtBQUwsQ0FBVyxLQUFLLEdBQUwsQ0FBUyxDQUFULElBQWMsRUFBZCxDQUFYLEdBQStCLEdBQS9CLEdBQXFDLEtBQUssR0FBTCxDQUFTLENBQVQsSUFBYyxFQUFkLEVBQWtCLENBQTNELENBQXRCO0VBekJILENBaEN1Qzs7QUE0RDNDLFFBQU8sS0FBSyxPQUFMLENBQWEsS0FBYixFQUFvQixVQUFVLEVBQVYsRUFBYztBQUN4QyxTQUFPLE1BQU0sS0FBTixHQUFjLE1BQU0sRUFBTixDQUFkLEdBQTBCLEdBQUcsS0FBSCxDQUFTLENBQVQsRUFBWSxHQUFHLE1BQUgsR0FBWSxDQUFaLENBQXRDLENBRGlDO0VBQWQsQ0FBM0IsQ0E1RDJDO0NBQXJDIiwiZmlsZSI6ImRhdGVGb3JtYXR0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogbG9nNGpzIDxodHRwczovL2dpdGh1Yi5jb20vYW5pZ2VuZXJvL2xvZzRqczI+XHJcbiAqXHJcbiAqIENvcHlyaWdodCAyMDE2LXByZXNlbnQgUm9iaW4gU2NodWx0eiA8aHR0cDovL2FuaWdlbmVyby5jb20+XHJcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZVxyXG4gKi9cclxuXHJcbmxldCBpMThuID0ge1xyXG5cdCdkYXlOYW1lcycgOiBbICdTdW4nLCAnTW9uJywgJ1R1ZScsICdXZWQnLCAnVGh1JywgJ0ZyaScsICdTYXQnLCAnU3VuZGF5JywgJ01vbmRheScsXHJcblx0XHQnVHVlc2RheScsICdXZWRuZXNkYXknLCAnVGh1cnNkYXknLCAnRnJpZGF5JywgJ1NhdHVyZGF5JyBdLFxyXG5cdCdtb250aE5hbWVzJyA6IFsgJ0phbicsICdGZWInLCAnTWFyJywgJ0FwcicsICdNYXknLCAnSnVuJywgJ0p1bCcsICdBdWcnLCAnU2VwJyxcclxuXHRcdCdPY3QnLCAnTm92JywgJ0RlYycsICdKYW51YXJ5JywgJ0ZlYnJ1YXJ5JywgJ01hcmNoJywgJ0FwcmlsJywgJ01heScsICdKdW5lJyxcclxuXHRcdCdKdWx5JywgJ0F1Z3VzdCcsICdTZXB0ZW1iZXInLCAnT2N0b2JlcicsICdOb3ZlbWJlcicsICdEZWNlbWJlcicgXVxyXG59O1xyXG5cclxuY29uc3QgVE9LRU4gPSAvZHsxLDR9fG17MSw0fXx5eSg/Onl5KT98KFtIaE1zVHRdKVxcMT98W0xsb1NaXXwnW14nXSonfCdbXiddKicvZztcclxuY29uc3QgVElNRVpPTkUgPSAvXFxiKD86W1BNQ0VBXVtTRFBdVHwoPzpQYWNpZmljfE1vdW50YWlufENlbnRyYWx8RWFzdGVybnxBdGxhbnRpYykgKD86U3RhbmRhcmR8RGF5bGlnaHR8UHJldmFpbGluZykgVGltZXwoPzpHTVR8VVRDKSg/OlstK11cXGR7NH0pPylcXGIvZztcclxuY29uc3QgVElNRVpPTkVfQ0xJUCA9IC9bXi0rXFxkQS1aXS9nO1xyXG5cclxuLyoqXHJcbiAqIFBhZHMgbnVtYmVycyBpbiB0aGUgZGF0ZSBmb3JtYXRcclxuICpcclxuICogQHBhcmFtIHZhbHVlXHJcbiAqIEBwYXJhbSBsZW5ndGhcclxuICpcclxuICogQHJldHVybnMgez9zdHJpbmd9XHJcbiAqL1xyXG5mdW5jdGlvbiBwYWQodmFsdWUsIGxlbmd0aCkge1xyXG5cdHZhbHVlID0gU3RyaW5nKHZhbHVlKTtcclxuXHRsZW5ndGggPSBsZW5ndGggfHwgMjtcclxuXHR3aGlsZSAodmFsdWUubGVuZ3RoIDwgbGVuZ3RoKSB7XHJcblx0XHR2YWx1ZSA9ICcwJyArIHZhbHVlO1xyXG5cdH1cclxuXHRyZXR1cm4gdmFsdWU7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkYXRlRm9ybWF0KGRhdGUsIG1hc2ssIHV0Yykge1xyXG5cclxuXHQvLyBZb3UgY2FuJ3QgcHJvdmlkZSB1dGMgaWYgeW91IHNraXAgb3RoZXIgYXJncyAodXNlIHRoZSAnVVRDOicgbWFzayBwcmVmaXgpXHJcblx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMSAmJiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZGF0ZSkgPT0gJ1tvYmplY3QgU3RyaW5nXScgJiYgISgvXFxkLykudGVzdChkYXRlKSkge1xyXG5cdFx0bWFzayA9IGRhdGU7XHJcblx0XHRkYXRlID0gdW5kZWZpbmVkO1xyXG5cdH1cclxuXHJcblx0Ly8gUGFzc2luZyBkYXRlIHRocm91Z2ggRGF0ZSBhcHBsaWVzIERhdGUucGFyc2UsIGlmIG5lY2Vzc2FyeVxyXG5cdGRhdGUgPSBkYXRlID8gbmV3IERhdGUoZGF0ZSkgOiBuZXcgRGF0ZSgpO1xyXG5cdGlmIChpc05hTihkYXRlKSkge1xyXG5cdFx0dGhyb3cgbmV3IFN5bnRheEVycm9yKCdpbnZhbGlkIGRhdGUnKTtcclxuXHR9XHJcblxyXG5cdG1hc2sgPSBTdHJpbmcobWFzayB8fCAneXl5eS1tbS1kZCBISDpNTTpzcyxTJyk7XHJcblxyXG5cdC8vIEFsbG93IHNldHRpbmcgdGhlIHV0YyBhcmd1bWVudCB2aWEgdGhlIG1hc2tcclxuXHRpZiAobWFzay5zbGljZSgwLCA0KSA9PSAnVVRDOicpIHtcclxuXHRcdG1hc2sgPSBtYXNrLnNsaWNlKDQpO1xyXG5cdFx0dXRjID0gdHJ1ZTtcclxuXHR9XHJcblxyXG5cdGxldCBfID0gdXRjID8gJ2dldFVUQycgOiAnZ2V0JztcclxuXHRsZXQgZCA9IGRhdGVbXyArICdEYXRlJ10oKTtcclxuXHRsZXQgRCA9IGRhdGVbXyArICdEYXknXSgpO1xyXG5cdGxldCBtID0gZGF0ZVtfICsgJ01vbnRoJ10oKTtcclxuXHRsZXQgeSA9IGRhdGVbXyArICdGdWxsWWVhciddKCk7XHJcblx0bGV0IEggPSBkYXRlW18gKyAnSG91cnMnXSgpO1xyXG5cdGxldCBNID0gZGF0ZVtfICsgJ01pbnV0ZXMnXSgpO1xyXG5cdGxldCBzID0gZGF0ZVtfICsgJ1NlY29uZHMnXSgpO1xyXG5cdGxldCBMID0gZGF0ZVtfICsgJ01pbGxpc2Vjb25kcyddKCk7XHJcblx0bGV0IG8gPSB1dGMgPyAwIDogZGF0ZS5nZXRUaW1lem9uZU9mZnNldCgpO1xyXG5cdGxldCBmbGFncyA9IHtcclxuXHRcdCdkJyA6IGQsXHJcblx0XHQnZGQnIDogcGFkKGQpLFxyXG5cdFx0J2RkZCcgOiBpMThuLmRheU5hbWVzW0RdLFxyXG5cdFx0J2RkZGQnIDogaTE4bi5kYXlOYW1lc1tEICsgN10sXHJcblx0XHQnTScgOiBtICsgMSxcclxuXHRcdCdNTScgOiBwYWQobSArIDEpLFxyXG5cdFx0J01NTScgOiBpMThuLm1vbnRoTmFtZXNbbV0sXHJcblx0XHQnTU1NTScgOiBpMThuLm1vbnRoTmFtZXNbbSArIDEyXSxcclxuXHRcdCd5eScgOiBTdHJpbmcoeSkuc2xpY2UoMiksXHJcblx0XHQneXl5eScgOiB5LFxyXG5cdFx0J2gnIDogSCAlIDEyIHx8IDEyLFxyXG5cdFx0J2hoJyA6IHBhZChIICUgMTIgfHwgMTIpLFxyXG5cdFx0J0gnIDogSCxcclxuXHRcdCdISCcgOiBwYWQoSCksXHJcblx0XHQnbScgOiBNLFxyXG5cdFx0J21tJyA6IHBhZChNKSxcclxuXHRcdCdzJyA6IHMsXHJcblx0XHQnc3MnIDogcGFkKHMpLFxyXG5cdFx0J1MnIDogcGFkKEwsIDEpLFxyXG5cdFx0J3QnIDogSCA8IDEyID8gJ2EnIDogJ3AnLFxyXG5cdFx0J3R0JyA6IEggPCAxMiA/ICdhbScgOiAncG0nLFxyXG5cdFx0J1QnIDogSCA8IDEyID8gJ0EnIDogJ1AnLFxyXG5cdFx0J1RUJyA6IEggPCAxMiA/ICdBTScgOiAnUE0nLFxyXG5cdFx0J1onIDogdXRjID8gJ1VUQycgOiAoU3RyaW5nKGRhdGUpLm1hdGNoKFRJTUVaT05FKSB8fCBbICcnIF0pLnBvcCgpLnJlcGxhY2UoVElNRVpPTkVfQ0xJUCwgJycpLFxyXG5cdFx0J28nIDogKG8gPiAwID8gJy0nIDogJysnKSArIHBhZChNYXRoLmZsb29yKE1hdGguYWJzKG8pIC8gNjApICogMTAwICsgTWF0aC5hYnMobykgJSA2MCwgNClcclxuXHR9O1xyXG5cclxuXHRyZXR1cm4gbWFzay5yZXBsYWNlKFRPS0VOLCBmdW5jdGlvbiAoJDApIHtcclxuXHRcdHJldHVybiAkMCBpbiBmbGFncyA/IGZsYWdzWyQwXSA6ICQwLnNsaWNlKDEsICQwLmxlbmd0aCAtIDEpO1xyXG5cdH0pO1xyXG5cclxufVxyXG4iXX0=

/***/ },
/* 3 */
/***/ function(module, exports) {

	/*istanbul ignore next*/'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.getFunctionName = getFunctionName;
	function getFunctionName(func) {

	    if (typeof func !== 'function') {
	        return 'anonymous';
	    }

	    let functionName = func.toString();
	    functionName = functionName.substring('function '.length);
	    functionName = functionName.substring(0, functionName.indexOf('('));

	    return functionName !== '' ? functionName : 'anonymous';
	}
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxpdHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFBZ0I7QUFBVCxTQUFTLGVBQVQsQ0FBeUIsSUFBekIsRUFBK0I7O0FBRWxDLFFBQUksT0FBTyxJQUFQLEtBQWdCLFVBQWhCLEVBQTRCO0FBQzVCLGVBQU8sV0FBUCxDQUQ0QjtLQUFoQzs7QUFJQSxRQUFJLGVBQWUsS0FBSyxRQUFMLEVBQWYsQ0FOOEI7QUFPbEMsbUJBQWUsYUFBYSxTQUFiLENBQXVCLFlBQVksTUFBWixDQUF0QyxDQVBrQztBQVFsQyxtQkFBZSxhQUFhLFNBQWIsQ0FBdUIsQ0FBdkIsRUFBMEIsYUFBYSxPQUFiLENBQXFCLEdBQXJCLENBQTFCLENBQWYsQ0FSa0M7O0FBVWxDLFdBQU8sWUFBQyxLQUFpQixFQUFqQixHQUF1QixZQUF4QixHQUF1QyxXQUF2QyxDQVYyQjtDQUEvQiIsImZpbGUiOiJ1dGlsaXR5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIGdldEZ1bmN0aW9uTmFtZShmdW5jKSB7XHJcblxyXG4gICAgaWYgKHR5cGVvZiBmdW5jICE9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgcmV0dXJuICdhbm9ueW1vdXMnO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBmdW5jdGlvbk5hbWUgPSBmdW5jLnRvU3RyaW5nKCk7XHJcbiAgICBmdW5jdGlvbk5hbWUgPSBmdW5jdGlvbk5hbWUuc3Vic3RyaW5nKCdmdW5jdGlvbiAnLmxlbmd0aCk7XHJcbiAgICBmdW5jdGlvbk5hbWUgPSBmdW5jdGlvbk5hbWUuc3Vic3RyaW5nKDAsIGZ1bmN0aW9uTmFtZS5pbmRleE9mKCcoJykpO1xyXG5cclxuICAgIHJldHVybiAoZnVuY3Rpb25OYW1lICE9PSAnJykgPyBmdW5jdGlvbk5hbWUgOiAnYW5vbnltb3VzJztcclxuXHJcbn1cclxuIl19

/***/ },
/* 4 */
/***/ function(module, exports) {

	/*istanbul ignore next*/'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * log4js <https://github.com/anigenero/log4js>
	 *
	 * Copyright 2016-present Robin Schultz <http://anigenero.com>
	 * Released under the MIT License
	 */

	/**
	 * @type {{OFF: number, FATAL: number, ERROR: number, WARN: number, INFO: number, DEBUG: number, TRACE: number, ALL: number}}
	 */
	const LogLevel = /*istanbul ignore next*/exports.LogLevel = {
	  'OFF': 0,
	  'FATAL': 100,
	  'ERROR': 200,
	  'WARN': 300,
	  'INFO': 400,
	  'DEBUG': 500,
	  'TRACE': 600,
	  'ALL': 2147483647
	};
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnN0XFxsb2dMZXZlbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFVTyxNQUFNLHNEQUFXO0FBQ3BCLFNBQVEsQ0FBUjtBQUNBLFdBQVUsR0FBVjtBQUNBLFdBQVUsR0FBVjtBQUNBLFVBQVMsR0FBVDtBQUNBLFVBQVMsR0FBVDtBQUNBLFdBQVUsR0FBVjtBQUNBLFdBQVUsR0FBVjtBQUNBLFNBQVEsVUFBUjtDQVJTIiwiZmlsZSI6ImNvbnN0XFxsb2dMZXZlbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBsb2c0anMgPGh0dHBzOi8vZ2l0aHViLmNvbS9hbmlnZW5lcm8vbG9nNGpzPlxyXG4gKlxyXG4gKiBDb3B5cmlnaHQgMjAxNi1wcmVzZW50IFJvYmluIFNjaHVsdHogPGh0dHA6Ly9hbmlnZW5lcm8uY29tPlxyXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2VcclxuICovXHJcblxyXG4vKipcclxuICogQHR5cGUge3tPRkY6IG51bWJlciwgRkFUQUw6IG51bWJlciwgRVJST1I6IG51bWJlciwgV0FSTjogbnVtYmVyLCBJTkZPOiBudW1iZXIsIERFQlVHOiBudW1iZXIsIFRSQUNFOiBudW1iZXIsIEFMTDogbnVtYmVyfX1cclxuICovXHJcbmV4cG9ydCBjb25zdCBMb2dMZXZlbCA9IHtcclxuICAgICdPRkYnIDogMCxcclxuICAgICdGQVRBTCcgOiAxMDAsXHJcbiAgICAnRVJST1InIDogMjAwLFxyXG4gICAgJ1dBUk4nIDogMzAwLFxyXG4gICAgJ0lORk8nIDogNDAwLFxyXG4gICAgJ0RFQlVHJyA6IDUwMCxcclxuICAgICdUUkFDRScgOiA2MDAsXHJcbiAgICAnQUxMJyA6IDIxNDc0ODM2NDdcclxufTtcclxuIl19

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

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.LogAppender = undefined;

	var /*istanbul ignore next*/_formatter = __webpack_require__(1);

	class LogAppender {

	    /**
	     *
	     * @returns {null}
	     */
	    static get name() {
	        return null;
	    }

	    /**
	     *
	     * @param logEvent
	     */
	    append(logEvent) {}

	    getLogLevel() {
	        return this.logLevel;
	    }

	    /**
	     *
	     * @param {number} logLevel
	     */
	    setLogLevel(logLevel) {
	        this.logLevel = logLevel;
	    }

	    /**
	     *
	     * @param layout
	     */
	    setLayout(layout) {
	        this.layout = layout;
	    }

	    getLayout() {
	        return this.layout;
	    }

	    /**
	     *
	     * @param logEvent
	     */
	    format(logEvent) {
	        return (/*istanbul ignore next*/(0, _formatter.format)(this.getLayout(), logEvent)
	        );
	    }

	}
	/*istanbul ignore next*/exports.LogAppender = LogAppender;
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcGVuZGVyXFxhcHBlbmRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBRU8sTUFBTSxXQUFOLENBQWtCOzs7Ozs7QUFNckIsZUFBVyxJQUFYLEdBQWtCO0FBQ2QsZUFBTyxJQUFQLENBRGM7S0FBbEI7Ozs7OztBQU5xQixVQWNyQixDQUFPLFFBQVAsRUFBaUIsRUFBakI7O0FBSUEsa0JBQWM7QUFDVixlQUFPLEtBQUssUUFBTCxDQURHO0tBQWQ7Ozs7OztBQWxCcUIsZUEwQnJCLENBQVksUUFBWixFQUFzQjtBQUNsQixhQUFLLFFBQUwsR0FBZ0IsUUFBaEIsQ0FEa0I7S0FBdEI7Ozs7OztBQTFCcUIsYUFrQ3JCLENBQVUsTUFBVixFQUFrQjtBQUNkLGFBQUssTUFBTCxHQUFjLE1BQWQsQ0FEYztLQUFsQjs7QUFJQSxnQkFBWTtBQUNSLGVBQU8sS0FBSyxNQUFMLENBREM7S0FBWjs7Ozs7O0FBdENxQixVQThDckIsQ0FBTyxRQUFQLEVBQWlCO0FBQ2IsZUFBTyxnREFBTyxLQUFLLFNBQUwsRUFBUCxFQUF5QixRQUF6QixDQUFQO1VBRGE7S0FBakI7O0NBOUNHO2dDQUFNIiwiZmlsZSI6ImFwcGVuZGVyXFxhcHBlbmRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Zm9ybWF0fSBmcm9tICcuLi9mb3JtYXR0ZXInO1xyXG5cclxuZXhwb3J0IGNsYXNzIExvZ0FwcGVuZGVyIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7bnVsbH1cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGdldCBuYW1lKCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBsb2dFdmVudFxyXG4gICAgICovXHJcbiAgICBhcHBlbmQobG9nRXZlbnQpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TG9nTGV2ZWwoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubG9nTGV2ZWw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxvZ0xldmVsXHJcbiAgICAgKi9cclxuICAgIHNldExvZ0xldmVsKGxvZ0xldmVsKSB7XHJcbiAgICAgICAgdGhpcy5sb2dMZXZlbCA9IGxvZ0xldmVsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBsYXlvdXRcclxuICAgICAqL1xyXG4gICAgc2V0TGF5b3V0KGxheW91dCkge1xyXG4gICAgICAgIHRoaXMubGF5b3V0ID0gbGF5b3V0O1xyXG4gICAgfVxyXG5cclxuICAgIGdldExheW91dCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5sYXlvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGxvZ0V2ZW50XHJcbiAgICAgKi9cclxuICAgIGZvcm1hdChsb2dFdmVudCkge1xyXG4gICAgICAgIHJldHVybiBmb3JtYXQodGhpcy5nZXRMYXlvdXQoKSwgbG9nRXZlbnQpO1xyXG4gICAgfVxyXG5cclxufVxyXG4iXX0=

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.Logger = Logger;

	var /*istanbul ignore next*/_logLevel = __webpack_require__(4);

	/**
	 * Holds the definition for the log event object
	 *
	 * @typedef {{ date : number, error : Object, filename: string, lineNumber: ?string, column: ?string,
	 *      logErrorStack : Object, file : String, level : number, logger : string, message : string,
	 *      method : Function, properties : Object=, relative : number, sequence : number }}
	 */
	let LOG_EVENT; /**
	                * log4js <https://github.com/anigenero/log4js>
	                *
	                * Copyright 2016-present Robin Schultz <http://anigenero.com>
	                * Released under the MIT License
	                */

	function Logger(context, appenderObj) {

		/** @type {string} */
		let _logContext = context;
		/** @typeof {number} */
		let _logSequence = 1;
		/** @typeof {number} */
		let _relative = new Date().getTime();

		/**
	  * Logs an error event
	  */
		this.error = function () {
			appenderObj.append(_constructLogEvent( /*istanbul ignore next*/_logLevel.LogLevel.ERROR, arguments));
		};

		/**
	  * Logs a warning
	  */
		this.warn = function () {
			appenderObj.append(_constructLogEvent( /*istanbul ignore next*/_logLevel.LogLevel.WARN, arguments));
		};

		/**
	  * Logs an info level event
	  */
		this.info = function () {
			appenderObj.append(_constructLogEvent( /*istanbul ignore next*/_logLevel.LogLevel.INFO, arguments));
		};

		/**
	  * Logs a debug event
	  */
		this.debug = function () {
			appenderObj.append(_constructLogEvent( /*istanbul ignore next*/_logLevel.LogLevel.DEBUG, arguments));
		};

		/**
	  * Logs a trace event
	  */
		this.trace = function () {
			appenderObj.append(_constructLogEvent( /*istanbul ignore next*/_logLevel.LogLevel.TRACE, arguments));
		};

		/**
	  * @function
	  *
	  * @param {number} level
	  * @param {Array} arguments
	  *
	  * @return {LOG_EVENT}
	  */
		function _constructLogEvent(level, args) {

			let logTime = new Date();
			let error = null;

			// this looks horrible, but this is the only way to catch the stack for IE to later parse the stack
			try {
				throw new Error();
			} catch (e) {
				error = e;
			}

			let loggingEvent = {
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

			let messageStubs = 0;
			for (let i = 0; i < args.length; i++) {

				if (i === 0) {
					loggingEvent.message = args[i];
					let stubs = /\{}/g.exec(loggingEvent.message);
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
	  *
	  * @returns {boolean}
	  * @private
	  */
		let _isStrict = function () {
			return !this;
		};

		return this;
	}
	//# sourceMappingURL=data:application/json;base64,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LEtBQUssQ0FBTCxDQUExQixDQURNO0lBRkE7R0FUUjs7QUFpQkEsU0FBTyxZQUFQLENBN0N3QztFQUF6Qzs7Ozs7OztBQXBENEMsS0EwR3hDLFlBQVksWUFBWTtBQUNyQixTQUFPLENBQUMsSUFBRCxDQURjO0VBQVosQ0ExRzRCOztBQThHNUMsUUFBTyxJQUFQLENBOUc0QztDQUF0QyIsImZpbGUiOiJsb2dnZXJcXGxvZ2dlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBsb2c0anMgPGh0dHBzOi8vZ2l0aHViLmNvbS9hbmlnZW5lcm8vbG9nNGpzPlxyXG4gKlxyXG4gKiBDb3B5cmlnaHQgMjAxNi1wcmVzZW50IFJvYmluIFNjaHVsdHogPGh0dHA6Ly9hbmlnZW5lcm8uY29tPlxyXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2VcclxuICovXHJcblxyXG5pbXBvcnQge0xvZ0xldmVsfSBmcm9tICcuLi9jb25zdC9sb2dMZXZlbCc7XHJcblxyXG4vKipcclxuICogSG9sZHMgdGhlIGRlZmluaXRpb24gZm9yIHRoZSBsb2cgZXZlbnQgb2JqZWN0XHJcbiAqXHJcbiAqIEB0eXBlZGVmIHt7IGRhdGUgOiBudW1iZXIsIGVycm9yIDogT2JqZWN0LCBmaWxlbmFtZTogc3RyaW5nLCBsaW5lTnVtYmVyOiA/c3RyaW5nLCBjb2x1bW46ID9zdHJpbmcsXHJcbiAqICAgICAgbG9nRXJyb3JTdGFjayA6IE9iamVjdCwgZmlsZSA6IFN0cmluZywgbGV2ZWwgOiBudW1iZXIsIGxvZ2dlciA6IHN0cmluZywgbWVzc2FnZSA6IHN0cmluZyxcclxuICogICAgICBtZXRob2QgOiBGdW5jdGlvbiwgcHJvcGVydGllcyA6IE9iamVjdD0sIHJlbGF0aXZlIDogbnVtYmVyLCBzZXF1ZW5jZSA6IG51bWJlciB9fVxyXG4gKi9cclxubGV0IExPR19FVkVOVDtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBMb2dnZXIoY29udGV4dCwgYXBwZW5kZXJPYmopIHtcclxuXHJcbiAgICAvKiogQHR5cGUge3N0cmluZ30gKi9cclxuICAgIGxldCBfbG9nQ29udGV4dCA9IGNvbnRleHQ7XHJcbiAgICAvKiogQHR5cGVvZiB7bnVtYmVyfSAqL1xyXG4gICAgbGV0IF9sb2dTZXF1ZW5jZSA9IDE7XHJcblx0LyoqIEB0eXBlb2Yge251bWJlcn0gKi9cclxuXHRsZXQgX3JlbGF0aXZlID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKTtcclxuXHJcblx0LyoqXHJcblx0ICogTG9ncyBhbiBlcnJvciBldmVudFxyXG5cdCAqL1xyXG5cdHRoaXMuZXJyb3IgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRhcHBlbmRlck9iai5hcHBlbmQoX2NvbnN0cnVjdExvZ0V2ZW50KExvZ0xldmVsLkVSUk9SLCBhcmd1bWVudHMpKTtcclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBMb2dzIGEgd2FybmluZ1xyXG5cdCAqL1xyXG5cdHRoaXMud2FybiA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdGFwcGVuZGVyT2JqLmFwcGVuZChfY29uc3RydWN0TG9nRXZlbnQoTG9nTGV2ZWwuV0FSTiwgYXJndW1lbnRzKSk7XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogTG9ncyBhbiBpbmZvIGxldmVsIGV2ZW50XHJcblx0ICovXHJcblx0dGhpcy5pbmZvID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0YXBwZW5kZXJPYmouYXBwZW5kKF9jb25zdHJ1Y3RMb2dFdmVudChMb2dMZXZlbC5JTkZPLCBhcmd1bWVudHMpKTtcclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBMb2dzIGEgZGVidWcgZXZlbnRcclxuXHQgKi9cclxuXHR0aGlzLmRlYnVnID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0YXBwZW5kZXJPYmouYXBwZW5kKF9jb25zdHJ1Y3RMb2dFdmVudChMb2dMZXZlbC5ERUJVRywgYXJndW1lbnRzKSk7XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogTG9ncyBhIHRyYWNlIGV2ZW50XHJcblx0ICovXHJcblx0dGhpcy50cmFjZSA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdGFwcGVuZGVyT2JqLmFwcGVuZChfY29uc3RydWN0TG9nRXZlbnQoTG9nTGV2ZWwuVFJBQ0UsIGFyZ3VtZW50cykpO1xyXG5cdH07XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBmdW5jdGlvblxyXG5cdCAqXHJcblx0ICogQHBhcmFtIHtudW1iZXJ9IGxldmVsXHJcblx0ICogQHBhcmFtIHtBcnJheX0gYXJndW1lbnRzXHJcblx0ICpcclxuXHQgKiBAcmV0dXJuIHtMT0dfRVZFTlR9XHJcblx0ICovXHJcblx0ZnVuY3Rpb24gX2NvbnN0cnVjdExvZ0V2ZW50KGxldmVsLCBhcmdzKSB7XHJcblxyXG5cdFx0bGV0IGxvZ1RpbWUgPSBuZXcgRGF0ZSgpO1xyXG5cdFx0bGV0IGVycm9yID0gbnVsbDtcclxuXHJcblx0XHQvLyB0aGlzIGxvb2tzIGhvcnJpYmxlLCBidXQgdGhpcyBpcyB0aGUgb25seSB3YXkgdG8gY2F0Y2ggdGhlIHN0YWNrIGZvciBJRSB0byBsYXRlciBwYXJzZSB0aGUgc3RhY2tcclxuXHRcdHRyeSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcigpO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRlcnJvciA9IGU7XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IGxvZ2dpbmdFdmVudCA9IHtcclxuXHRcdFx0J2RhdGUnIDogbG9nVGltZSxcclxuXHRcdFx0J2Vycm9yJyA6IG51bGwsXHJcblx0XHRcdCdsb2dFcnJvclN0YWNrJyA6IGVycm9yLFxyXG5cdFx0XHQnZmlsZScgOiBudWxsLFxyXG5cdFx0XHQnbGV2ZWwnIDogbGV2ZWwsXHJcblx0XHRcdCdsaW5lTnVtYmVyJyA6IG51bGwsXHJcblx0XHRcdCdsb2dnZXInIDogX2xvZ0NvbnRleHQsXHJcblx0XHRcdCdtZXNzYWdlJyA6ICcnLFxyXG5cdFx0XHQnbWV0aG9kJyA6ICFfaXNTdHJpY3QoKSA/IGFyZ3MuY2FsbGVlLmNhbGxlciA6IDAsXHJcblx0XHRcdCdwcm9wZXJ0aWVzJyA6IHVuZGVmaW5lZCxcclxuXHRcdFx0J3JlbGF0aXZlJyA6IGxvZ1RpbWUuZ2V0VGltZSgpIC0gX3JlbGF0aXZlLFxyXG5cdFx0XHQnc2VxdWVuY2UnIDogX2xvZ1NlcXVlbmNlKytcclxuXHRcdH07XHJcblxyXG5cdFx0bGV0IG1lc3NhZ2VTdHVicyA9IDA7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcclxuXHJcblx0XHRcdGlmIChpID09PSAwKSB7XHJcblx0XHRcdFx0bG9nZ2luZ0V2ZW50Lm1lc3NhZ2UgPSBhcmdzW2ldO1xyXG5cdFx0XHRcdGxldCBzdHVicyA9ICgvXFx7fS9nKS5leGVjKGxvZ2dpbmdFdmVudC5tZXNzYWdlKTtcclxuXHRcdFx0XHRtZXNzYWdlU3R1YnMgPSAoc3R1YnMgaW5zdGFuY2VvZiBBcnJheSkgPyBzdHVicy5sZW5ndGggOiAwO1xyXG5cdFx0XHR9IGVsc2UgaWYgKG1lc3NhZ2VTdHVicyA+IDApIHtcclxuXHRcdFx0XHRsb2dnaW5nRXZlbnQubWVzc2FnZSA9IGxvZ2dpbmdFdmVudC5tZXNzYWdlLnJlcGxhY2UoL1xce30vLCBhcmdzW2ldKTtcclxuXHRcdFx0XHRtZXNzYWdlU3R1YnMtLTtcclxuXHRcdFx0fSBlbHNlIGlmIChhcmdzW2ldIGluc3RhbmNlb2YgRXJyb3IpIHtcclxuXHRcdFx0XHRsb2dnaW5nRXZlbnQuZXJyb3IgPSBhcmdzW2ldO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGxvZ2dpbmdFdmVudC5wcm9wZXJ0aWVzID0gYXJnc1tpXTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gbG9nZ2luZ0V2ZW50O1xyXG5cclxuXHR9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcblx0bGV0IF9pc1N0cmljdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gIXRoaXM7XHJcbiAgICB9O1xyXG5cclxuXHRyZXR1cm4gdGhpcztcclxuXHJcbn1cclxuIl19

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.ConsoleAppender = undefined;

	var /*istanbul ignore next*/_appender = __webpack_require__(7);

	var /*istanbul ignore next*/_logLevel = __webpack_require__(4);

	/**
	 * log4js <https://github.com/anigenero/log4js>
	 *
	 * Copyright 2016-present Robin Schultz <http://anigenero.com>
	 * Released under the MIT License
	 */

	class ConsoleAppender extends /*istanbul ignore next*/_appender.LogAppender {

		static get name() {
			return 'console';
		}

		/**
	  * Appends the log event
	  * @param logEvent
	  */
		append(logEvent) {
			if (logEvent.level <= this.getLogLevel()) {
				this._appendToConsole(logEvent);
			}
		}

		/**
	  * @private
	  * @function
	  *
	  * @param {LOG_EVENT} loggingEvent
	  */
		_appendToConsole(logEvent) {

			let message = this.format(logEvent);

			if (logEvent.level == /*istanbul ignore next*/_logLevel.LogLevel.ERROR) {
				console.error(message);
			} else if (logEvent.level == /*istanbul ignore next*/_logLevel.LogLevel.WARN) {
				console.warn(message);
			} else if (logEvent.level == /*istanbul ignore next*/_logLevel.LogLevel.INFO) {
				console.info(message);
			} else if ([/*istanbul ignore next*/_logLevel.LogLevel.DEBUG, /*istanbul ignore next*/_logLevel.LogLevel.TRACE].indexOf(logEvent.level) > -1) {
				console.log(message);
			}
		}

	}
	/*istanbul ignore next*/exports.ConsoleAppender = ConsoleAppender;
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcGVuZGVyXFxjb25zb2xlQXBwZW5kZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQU9BOztBQUNBOzs7Ozs7Ozs7QUFFTyxNQUFNLGVBQU4sdURBQTBDOztBQUU3QyxZQUFXLElBQVgsR0FBa0I7QUFDZCxTQUFPLFNBQVAsQ0FEYztFQUFsQjs7Ozs7O0FBRjZDLE9BVTdDLENBQU8sUUFBUCxFQUFpQjtBQUNiLE1BQUksU0FBUyxLQUFULElBQWtCLEtBQUssV0FBTCxFQUFsQixFQUFzQztBQUN0QyxRQUFLLGdCQUFMLENBQXNCLFFBQXRCLEVBRHNDO0dBQTFDO0VBREo7Ozs7Ozs7O0FBVjZDLGlCQXNCaEQsQ0FBaUIsUUFBakIsRUFBMkI7O0FBRTFCLE1BQUksVUFBVSxLQUFLLE1BQUwsQ0FBWSxRQUFaLENBQVYsQ0FGc0I7O0FBSTFCLE1BQUksU0FBUyxLQUFULElBQWtCLDJDQUFTLEtBQVQsRUFBZ0I7QUFDckMsV0FBUSxLQUFSLENBQWMsT0FBZCxFQURxQztHQUF0QyxNQUVPLElBQUksU0FBUyxLQUFULElBQWtCLDJDQUFTLElBQVQsRUFBZTtBQUMzQyxXQUFRLElBQVIsQ0FBYSxPQUFiLEVBRDJDO0dBQXJDLE1BRUEsSUFBSSxTQUFTLEtBQVQsSUFBa0IsMkNBQVMsSUFBVCxFQUFlO0FBQzNDLFdBQVEsSUFBUixDQUFhLE9BQWIsRUFEMkM7R0FBckMsTUFFQSxJQUFJLENBQUMsMkNBQVMsS0FBVCxFQUFnQiwyQ0FBUyxLQUFULENBQWpCLENBQWlDLE9BQWpDLENBQXlDLFNBQVMsS0FBVCxDQUF6QyxHQUEyRCxDQUFDLENBQUQsRUFBSTtBQUN6RSxXQUFRLEdBQVIsQ0FBWSxPQUFaLEVBRHlFO0dBQW5FO0VBVlI7O0NBdEJNO2dDQUFNIiwiZmlsZSI6ImFwcGVuZGVyXFxjb25zb2xlQXBwZW5kZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogbG9nNGpzIDxodHRwczovL2dpdGh1Yi5jb20vYW5pZ2VuZXJvL2xvZzRqcz5cclxuICpcclxuICogQ29weXJpZ2h0IDIwMTYtcHJlc2VudCBSb2JpbiBTY2h1bHR6IDxodHRwOi8vYW5pZ2VuZXJvLmNvbT5cclxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlXHJcbiAqL1xyXG5cclxuaW1wb3J0IHtMb2dBcHBlbmRlcn0gZnJvbSAnLi9hcHBlbmRlcic7XHJcbmltcG9ydCB7TG9nTGV2ZWx9IGZyb20gJy4uL2NvbnN0L2xvZ0xldmVsJztcclxuXHJcbmV4cG9ydCBjbGFzcyBDb25zb2xlQXBwZW5kZXIgZXh0ZW5kcyBMb2dBcHBlbmRlciB7XHJcblxyXG4gICAgc3RhdGljIGdldCBuYW1lKCkge1xyXG4gICAgICAgIHJldHVybiAnY29uc29sZSc7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBcHBlbmRzIHRoZSBsb2cgZXZlbnRcclxuICAgICAqIEBwYXJhbSBsb2dFdmVudFxyXG4gICAgICovXHJcbiAgICBhcHBlbmQobG9nRXZlbnQpIHtcclxuICAgICAgICBpZiAobG9nRXZlbnQubGV2ZWwgPD0gdGhpcy5nZXRMb2dMZXZlbCgpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2FwcGVuZFRvQ29uc29sZShsb2dFdmVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHQvKipcclxuXHQgKiBAcHJpdmF0ZVxyXG5cdCAqIEBmdW5jdGlvblxyXG5cdCAqXHJcblx0ICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ2dpbmdFdmVudFxyXG5cdCAqL1xyXG5cdF9hcHBlbmRUb0NvbnNvbGUobG9nRXZlbnQpIHtcclxuXHJcblx0XHRsZXQgbWVzc2FnZSA9IHRoaXMuZm9ybWF0KGxvZ0V2ZW50KTtcclxuXHJcblx0XHRpZiAobG9nRXZlbnQubGV2ZWwgPT0gTG9nTGV2ZWwuRVJST1IpIHtcclxuXHRcdFx0Y29uc29sZS5lcnJvcihtZXNzYWdlKTtcclxuXHRcdH0gZWxzZSBpZiAobG9nRXZlbnQubGV2ZWwgPT0gTG9nTGV2ZWwuV0FSTikge1xyXG5cdFx0XHRjb25zb2xlLndhcm4obWVzc2FnZSk7XHJcblx0XHR9IGVsc2UgaWYgKGxvZ0V2ZW50LmxldmVsID09IExvZ0xldmVsLklORk8pIHtcclxuXHRcdFx0Y29uc29sZS5pbmZvKG1lc3NhZ2UpO1xyXG5cdFx0fSBlbHNlIGlmIChbTG9nTGV2ZWwuREVCVUcsIExvZ0xldmVsLlRSQUNFXS5pbmRleE9mKGxvZ0V2ZW50LmxldmVsKSA+IC0xKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKG1lc3NhZ2UpO1xyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG59XHJcbiJdfQ==

/***/ }
/******/ ])
});
;