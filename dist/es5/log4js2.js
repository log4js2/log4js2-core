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
/***/ (function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';

	exports.__esModule = true;
	exports.LogAppender = exports.LogLevel = undefined;

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	exports.configure = configure;
	/*istanbul ignore next*/exports.addAppender = addAppender;
	/*istanbul ignore next*/exports.getLogger = getLogger;
	/*istanbul ignore next*/exports.setLogLevel = setLogLevel;

	var /*istanbul ignore next*/_formatter = __webpack_require__(1);

	/*istanbul ignore next*/var formatter = _interopRequireWildcard(_formatter);

	var /*istanbul ignore next*/_utility = __webpack_require__(3);

	/*istanbul ignore next*/var utility = _interopRequireWildcard(_utility);

	var /*istanbul ignore next*/_appender = __webpack_require__(7);

	var /*istanbul ignore next*/_logger = __webpack_require__(8);

	var /*istanbul ignore next*/_logLevel = __webpack_require__(4);

	var /*istanbul ignore next*/_consoleAppender = __webpack_require__(9);

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
	//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbImNvbmZpZ3VyZSIsImFkZEFwcGVuZGVyIiwiZ2V0TG9nZ2VyIiwic2V0TG9nTGV2ZWwiLCJmb3JtYXR0ZXIiLCJ1dGlsaXR5IiwiQVBQRU5ERVIiLCJDT05GSUdfUEFSQU1TIiwiX01BSU5fTE9HR0VSIiwiX0RFRkFVTFRfQVBQRU5ERVJTIiwiSU5GTyIsIl9ERUZBVUxUX0NPTkZJRyIsIl9BUFBFTkRFUl9NRVRIT0RTIiwiX2FwcGVuZGVycyIsIl9jb25maWd1cmF0aW9uIiwiX2ZpbmFsaXplZCIsIl9sb2dnZXJzIiwiY29uZmlnIiwiY29uc29sZSIsImVycm9yIiwibGF5b3V0IiwiX2NvbmZpZ3VyZUFwcGVuZGVycyIsImFwcGVuZGVycyIsIl9jb25maWd1cmVMb2dnZXJzIiwibG9nZ2VycyIsIkFycmF5IiwiZm9yRWFjaCIsImFwcGVuZGVyIiwiRnVuY3Rpb24iLCJFcnJvciIsImxvZ2dlciIsInRhZyIsImxvZ0xldmVsIiwiRVJST1IiLCJfZ2V0QXBwZW5kZXJzRm9yTG9nZ2VyIiwiYXBwZW5kZXJMaXN0IiwiT2JqZWN0Iiwia2V5cyIsImtleSIsInByb3RvdHlwZSIsInNldExheW91dCIsInB1c2giLCJhbGxvd0FwcGVuZGVySW5qZWN0aW9uIiwiX3ZhbGlkYXRlQXBwZW5kZXIiLCJuYW1lIiwiYXBwZW5kZXJPYmoiLCJlbGVtZW50IiwidW5kZWZpbmVkIiwiX2FwcGVuZCIsImxvZ0V2ZW50IiwiaXNBY3RpdmUiLCJsZXZlbCIsImFwcGVuZCIsImNvbnRleHQiLCJnZXRGdW5jdGlvbk5hbWUiLCJjb25zdHJ1Y3RvciIsIk51bWJlciIsImhhc093blByb3BlcnR5IiwiTG9nTGV2ZWwiLCJMb2dBcHBlbmRlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztRQWdGZ0JBLFMsR0FBQUEsUztnQ0FxSEFDLFcsR0FBQUEsVztnQ0ErRUFDLFMsR0FBQUEsUztnQ0EyQ0FDLFcsR0FBQUEsVzs7QUExU2hCOzs0QkFBWUMsUzs7QUFD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QVgsRUFBb0I7QUFDMUIsa0JBQVdMO0FBRGUsS0FBcEIsQ0FBUDtBQUlBOztBQUlEOzs7Ozs7Ozs7QUFTTyxTQUFTN0MsV0FBVCxDQUFxQjZCLFFBQXJCLEVBQStCRixNQUEvQixFQUF1Qzs7QUFFMUMsUUFBSUUsb0JBQW9Cd0IsTUFBeEIsRUFBZ0M7O0FBRTVCLFlBQUkxQixNQUFKLEVBQVk7QUFDUixnQkFBSWQsU0FBU2MsTUFBVCxDQUFKLEVBQXNCO0FBQ2xCZCx5QkFBU2MsTUFBVCxFQUFpQjNCLFdBQWpCLENBQTZCNkIsUUFBN0I7QUFDSDtBQUNKLFNBSkQsTUFJTztBQUNILGlCQUFLLElBQUlNLEdBQVQsSUFBZ0J0QixRQUFoQixFQUEwQjtBQUN0QixvQkFBSUEsU0FBU3lDLGNBQVQsQ0FBd0JuQixHQUF4QixDQUFKLEVBQWtDO0FBQzlCdEIsNkJBQVNzQixHQUFULEVBQWNaLE9BQWQsQ0FBc0IsVUFBVUMsUUFBVixFQUFvQjtBQUN0Q0EsaUNBQVN4QixXQUFULENBQXFCNkIsUUFBckI7QUFDSCxxQkFGRDtBQUdIO0FBQ0o7QUFDSjtBQUVKO0FBRUo7O0FBRUQvQjs7Z0NBRVN5RCxRO2dDQUNBQyxXIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBsb2c0anMgPGh0dHBzOi8vZ2l0aHViLmNvbS9hbmlnZW5lcm8vbG9nNGpzPlxuICpcbiAqIENvcHlyaWdodCAyMDE2IFJvYmluIFNjaHVsdHogPGh0dHA6Ly9hbmlnZW5lcm8uY29tPlxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlXG4gKi9cblxuLyoqXG4gKiBIb2xkcyB0aGUgZGVmaW5pdGlvbiBmb3IgdGhlIGFwcGVuZGVyIGNsb3N1cmVcbiAqXG4gKiBAdHlwZWRlZiB7eyBhcHBlbmQgOiBmdW5jdGlvbiAobnVtYmVyLCBMT0dfRVZFTlQpLCBpc0FjdGl2ZSA6IGZ1bmN0aW9uKCksXG4gKiAgICAgICAgICBzZXRMb2dMZXZlbCA6IGZ1bmN0aW9uKG51bWJlciksIHNldExheW91dCA6IGZ1bmN0aW9uKHN0cmluZykgfX1cbiAqL1xubGV0IEFQUEVOREVSO1xuXG4vKipcbiAqIEB0eXBlZGVmIHt7IGFsbG93QXBwZW5kZXJJbmplY3Rpb24gOiBib29sZWFuLCBhcHBlbmRlcnMgOiBBcnJheS48QVBQRU5ERVI+LFxuICogXHRcdFx0YXBwbGljYXRpb24gOiBPYmplY3QsIGxvZ2dlcnMgOiBBcnJheS48TG9nQXBwZW5kZXI+LCBsYXlvdXQgOiBzdHJpbmcgfX1cbiAqL1xubGV0IENPTkZJR19QQVJBTVM7XG5cbmltcG9ydCAqIGFzIGZvcm1hdHRlciBmcm9tICcuL2Zvcm1hdHRlcic7XG5pbXBvcnQgKiBhcyB1dGlsaXR5IGZyb20gJy4vdXRpbGl0eSc7XG5pbXBvcnQge0xvZ0FwcGVuZGVyfSBmcm9tICcuL2FwcGVuZGVyL2FwcGVuZGVyJztcbmltcG9ydCB7TG9nZ2VyfSBmcm9tICcuL2xvZ2dlci9sb2dnZXInO1xuaW1wb3J0IHtMb2dMZXZlbH0gZnJvbSAnLi9jb25zdC9sb2dMZXZlbCc7XG5pbXBvcnQge0NvbnNvbGVBcHBlbmRlcn0gZnJvbSAnLi9hcHBlbmRlci9jb25zb2xlQXBwZW5kZXInO1xuXG4vKipcbiAqIFRoZSBuYW1lIG9mIHRoZSBtYWluIGxvZ2dlci4gV2UgdXNlIHRoaXMgaW4gY2FzZSBubyBsb2dnZXIgaXMgc3BlY2lmaWVkXG4gKiBAY29uc3RcbiAqL1xuY29uc3QgX01BSU5fTE9HR0VSID0gJ21haW4nO1xuXG4vKipcbiAqIFRoZSBkZWZhdWx0IGFwcGVuZGVycyB0aGF0IHNob3VsZCBiZSBpbmNsdWRlZCBpZiBubyBhcHBlbmRlcnMgYXJlIHNwZWNpZmllZFxuICogQGNvbnN0XG4gKi9cbmNvbnN0IF9ERUZBVUxUX0FQUEVOREVSUyA9IFt7XG4gICAgJ2FwcGVuZGVyJyA6IENvbnNvbGVBcHBlbmRlcixcbiAgICAnbGV2ZWwnIDogTG9nTGV2ZWwuSU5GT1xufV07XG5cbi8qKlxuICogVGhlIGRlZmF1bHQgY29uZmlndXJhdGlvbiBmb3IgbG9nNGpzMi4gSWYgbm8gY29uZmlndXJhdGlvbiBpcyBzcGVjaWZpZWQsIHRoZW4gdGhpc1xuICogY29uZmlndXJhdGlvbiB3aWxsIGJlIGluamVjdGVkXG4gKiBAY29uc3RcbiAqL1xuY29uc3QgX0RFRkFVTFRfQ09ORklHID0ge1xuICAgICdhbGxvd0FwcGVuZGVySW5qZWN0aW9uJyA6IHRydWUsXG4gICAgJ2FwcGVuZGVycycgOiBfREVGQVVMVF9BUFBFTkRFUlMsXG4gICAgJ2xvZ2dlcnMnIDogW3tcbiAgICAgICAgJ2xldmVsJyA6IExvZ0xldmVsLklORk9cbiAgICB9XSxcbiAgICAnbGF5b3V0JyA6ICclZCBbJXBdICVjIC0gJW0nXG59O1xuXG4vKipcbiAqIFRoZSBtZXRob2RzIHRoYXQgYW4gYXBwZW5kZXIgbXVzdCBjb250YWluXG4gKiBAY29uc3RcbiAqL1xuY29uc3QgX0FQUEVOREVSX01FVEhPRFMgPSBbJ2FwcGVuZCcsICdnZXROYW1lJywgJ2lzQWN0aXZlJywgJ3NldExvZ0xldmVsJywgJ3NldExheW91dCddO1xuXG4vKiogQHR5cGUge09iamVjdH0gKi9cbmxldCBfYXBwZW5kZXJzID0ge307XG4vKiogQHR5cGUgez9DT05GSUdfUEFSQU1TfSAqL1xubGV0IF9jb25maWd1cmF0aW9uID0gbnVsbDtcbi8qKiBAdHlwZSB7Ym9vbGVhbn0gKi9cbmxldCBfZmluYWxpemVkID0gZmFsc2U7XG4vKiogQHR5cGUge09iamVjdH0gKi9cbmxldCBfbG9nZ2VycyA9IHt9O1xuXG4vKipcbiAqIENvbmZpZ3VyZXMgdGhlIGxvZ2dlclxuICpcbiAqIEBmdW5jdGlvblxuICogQG1lbWJlck9mIGxvZzRqc1xuICpcbiAqIEBwYXJhbXMge0NPTkZJR19QQVJBTVN9IGNvbmZpZ1xuICovXG5leHBvcnQgZnVuY3Rpb24gY29uZmlndXJlKGNvbmZpZykge1xuXG5cdGlmIChfZmluYWxpemVkKSB7XG5cdFx0Y29uc29sZS5lcnJvcignQ291bGQgbm90IGNvbmZpZ3VyZSAtIGFscmVhZHkgaW4gdXNlJyk7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0aWYgKCFfY29uZmlndXJhdGlvbikge1xuICAgICAgICBfY29uZmlndXJhdGlvbiA9IHt9O1xuICAgIH1cblxuICAgIC8vIHNldCB0aGUgZGVmYXVsdCBsYXlvdXRcbiAgICBpZiAoIWNvbmZpZy5sYXlvdXQgJiYgIV9jb25maWd1cmF0aW9uLmxheW91dCkge1xuICAgICAgICBfY29uZmlndXJhdGlvbi5sYXlvdXQgPSBfREVGQVVMVF9DT05GSUcubGF5b3V0O1xuICAgIH0gZWxzZSBpZiAoY29uZmlnLmxheW91dCkge1xuICAgICAgICBfY29uZmlndXJhdGlvbi5sYXlvdXQgPSBjb25maWcubGF5b3V0O1xuICAgIH1cblxuXHQvLyBjb25maWd1cmUgdGhlIGFwcGVuZGVyc1xuXHRfY29uZmlndXJlQXBwZW5kZXJzKGNvbmZpZy5hcHBlbmRlcnMpO1xuICAgIC8vIGNvbmZpZ3VyZSB0aGUgbG9nZ2Vyc1xuICAgIF9jb25maWd1cmVMb2dnZXJzKGNvbmZpZy5sb2dnZXJzKTtcblxufVxuXG4vKipcbiAqIENvbmZpZ3VyZXMgYXBwZW5kZXJzXG4gKlxuICogQHByaXZhdGVcbiAqIEBmdW5jdGlvblxuICpcbiAqIEBwYXJhbSB7QXJyYXkuPExvZ0FwcGVuZGVyfGZ1bmN0aW9uPn0gYXBwZW5kZXJzXG4gKi9cbmxldCBfY29uZmlndXJlQXBwZW5kZXJzID0gZnVuY3Rpb24gKGFwcGVuZGVycykge1xuXG4gICAgaWYgKCEoYXBwZW5kZXJzIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICAgIGFwcGVuZGVycyA9IF9ERUZBVUxUX0FQUEVOREVSUztcbiAgICB9XG5cbiAgICBhcHBlbmRlcnMuZm9yRWFjaChhcHBlbmRlciA9PiB7XG4gICAgICAgIGlmIChhcHBlbmRlciBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgICAgICAgICBhZGRBcHBlbmRlcihhcHBlbmRlcik7XG4gICAgICAgIH1cbiAgICB9KTtcblxufTtcblxuLyoqXG4gKiBDb25maWd1cmVzIHRoZSBsb2dnZXJzXG4gKlxuICogQHByaXZhdGVcbiAqIEBmdW5jdGlvblxuICpcbiAqIEBwYXJhbSB7QXJyYXkuPE9iamVjdD59IGxvZ2dlcnNcbiAqL1xubGV0IF9jb25maWd1cmVMb2dnZXJzID0gZnVuY3Rpb24gKGxvZ2dlcnMpIHtcblxuXHRpZiAoIShsb2dnZXJzIGluc3RhbmNlb2YgQXJyYXkpKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGxvZ2dlcnMnKTtcblx0fVxuXG4gICAgbG9nZ2Vycy5mb3JFYWNoKGZ1bmN0aW9uIChsb2dnZXIpIHtcblxuICAgICAgICBpZiAoIWxvZ2dlci5sYXlvdXQgfHwgdHlwZW9mIGxvZ2dlci5sYXlvdXQgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBsb2dnZXIubGF5b3V0ID0gX2NvbmZpZ3VyYXRpb24ubGF5b3V0O1xuICAgICAgICB9XG5cbiAgICAgICAgbG9nZ2VyLnRhZyA9IGxvZ2dlci50YWcgfHwgX01BSU5fTE9HR0VSO1xuICAgICAgICBsb2dnZXIubG9nTGV2ZWwgPSBsb2dnZXIubG9nTGV2ZWwgfHwgTG9nTGV2ZWwuRVJST1I7XG5cbiAgICAgICAgX2xvZ2dlcnNbbG9nZ2VyLnRhZ10gPSBfZ2V0QXBwZW5kZXJzRm9yTG9nZ2VyKGxvZ2dlci5sb2dMZXZlbCwgbG9nZ2VyLmxheW91dCk7XG5cbiAgICB9KTtcblxufTtcblxuLyoqXG4gKiBHZXRzIHRoZSBhcHBlbmRlcnMgZm9yIHRoZSBsZXZlbCBhbmQgbGF5b3V0XG4gKlxuICogQHByaXZhdGVcbiAqIEBmdW5jdGlvblxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBsb2dMZXZlbFxuICogQHBhcmFtIHtzdHJpbmd9IGxheW91dFxuICpcbiAqIEByZXR1cm5zIHtBcnJheX1cbiAqL1xubGV0IF9nZXRBcHBlbmRlcnNGb3JMb2dnZXIgPSBmdW5jdGlvbiAobG9nTGV2ZWwsIGxheW91dCkge1xuXG4gICAgbGV0IGxvZ2dlcjtcbiAgICBsZXQgYXBwZW5kZXJMaXN0ID0gW107XG5cbiAgICBPYmplY3Qua2V5cyhfYXBwZW5kZXJzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblxuICAgICAgICBsb2dnZXIgPSAoX2FwcGVuZGVyc1trZXldLnByb3RvdHlwZSBpbnN0YW5jZW9mIExvZ0FwcGVuZGVyKSA/IG5ldyBfYXBwZW5kZXJzW2tleV0oKSA6IF9hcHBlbmRlcnNba2V5XSgpO1xuXG4gICAgICAgIGxvZ2dlci5zZXRMb2dMZXZlbChsb2dMZXZlbCk7XG4gICAgICAgIGxvZ2dlci5zZXRMYXlvdXQobGF5b3V0KTtcblxuICAgICAgICBhcHBlbmRlckxpc3QucHVzaChsb2dnZXIpO1xuXG4gICAgfSk7XG5cblx0cmV0dXJuIGFwcGVuZGVyTGlzdDtcblxufTtcblxuLyoqXG4gKiBBZGRzIGFuIGFwcGVuZGVyIHRvIHRoZSBhcHBlbmRlciBxdWV1ZS4gSWYgdGhlIHN0YWNrIGlzIGZpbmFsaXplZCwgYW5kXG4gKiB0aGUgYWxsb3dBcHBlbmRlckluamVjdGlvbiBpcyBzZXQgdG8gZmFsc2UsIHRoZW4gdGhlIGV2ZW50IHdpbGwgbm90IGJlXG4gKiBhcHBlbmRlZFxuICpcbiAqIEBmdW5jdGlvblxuICogQG1lbWJlck9mIGxvZzRqc1xuICpcbiAqIEBwYXJhbXMge0xvZ0FwcGVuZGVyfSBhcHBlbmRlclxuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkQXBwZW5kZXIoYXBwZW5kZXIpIHtcblxuXHRpZiAoX2ZpbmFsaXplZCAmJiAhX2NvbmZpZ3VyYXRpb24uYWxsb3dBcHBlbmRlckluamVjdGlvbikge1xuXHRcdGNvbnNvbGUuZXJyb3IoJ0Nhbm5vdCBhZGQgYXBwZW5kZXIgd2hlbiBjb25maWd1cmF0aW9uIGZpbmFsaXplZCcpO1xuXHRcdHJldHVybjtcblx0fVxuXG4gICAgX3ZhbGlkYXRlQXBwZW5kZXIoYXBwZW5kZXIpO1xuXG4gICAgLy8gb25seSBwdXQgdGhlIGFwcGVuZGVyIGludG8gdGhlIHNldCBpZiBpdCBkb2Vzbid0IGV4aXN0IGFscmVhZHlcbiAgICBpZiAoIV9hcHBlbmRlcnNbYXBwZW5kZXIubmFtZV0pIHtcbiAgICAgICAgX2FwcGVuZGVyc1thcHBlbmRlci5uYW1lXSA9IGFwcGVuZGVyO1xuICAgIH1cblxufVxuXG4vKipcbiAqIFZhbGlkYXRlcyB0aGF0IHRoZSBhcHBlbmRlclxuICpcbiAqIEBwcml2YXRlXG4gKiBAZnVuY3Rpb25cbiAqXG4gKiBAcGFyYW1zIHtBUFBFTkRFUn0gYXBwZW5kZXJcbiAqIEB0aHJvd3Mge0Vycm9yfSBpZiB0aGUgYXBwZW5kZXIgaXMgaW52YWxpZFxuICovXG5sZXQgX3ZhbGlkYXRlQXBwZW5kZXIgPSBmdW5jdGlvbiAoYXBwZW5kZXIpIHtcblxuICAgIC8vIGlmIHdlIGFyZSBydW5uaW5nIEVTNiwgd2UgY2FuIG1ha2Ugc3VyZSBpdCBleHRlbmRzIExvZ0FwcGVuZGVyXG4gICAgLy8gb3RoZXJ3aXNlLCBpdCBtdXN0IGJlIGEgZnVuY3Rpb25cbiAgICBpZiAoYXBwZW5kZXIucHJvdG90eXBlIGluc3RhbmNlb2YgTG9nQXBwZW5kZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSBpZiAoIShhcHBlbmRlciBpbnN0YW5jZW9mIEZ1bmN0aW9uKSkge1xuXHRcdHRocm93IG5ldyBFcnJvcignSW52YWxpZCBhcHBlbmRlcjogbm90IGEgZnVuY3Rpb24gb3IgY2xhc3MgTG9nQXBwZW5kZXInKTtcblx0fVxuXG5cdC8vIGluc3RhbnRpYXRlIHRoZSBhcHBlbmRlciBmdW5jdGlvblxuXHRsZXQgYXBwZW5kZXJPYmogPSBhcHBlbmRlcigpO1xuXG4gICAgLy8gZW5zdXJlIHRoYXQgdGhlIGFwcGVuZGVyIG1ldGhvZHMgYXJlIHByZXNlbnQgKGFuZCBhcmUgZnVuY3Rpb25zKVxuICAgIF9BUFBFTkRFUl9NRVRIT0RTLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgaWYgKGFwcGVuZGVyT2JqW2VsZW1lbnRdID09IHVuZGVmaW5lZCB8fCAhKGFwcGVuZGVyT2JqW2VsZW1lbnRdIGluc3RhbmNlb2YgRnVuY3Rpb24pKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgYXBwZW5kZXI6IG1pc3NpbmcvaW52YWxpZCBtZXRob2Q6ICR7ZWxlbWVudH1gKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG59O1xuXG4vKipcbiAqIEFwcGVuZHMgdGhlIGxvZyBldmVudFxuICpcbiAqIEBwcml2YXRlXG4gKiBAZnVuY3Rpb25cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gbG9nRXZlbnRcbiAqL1xuZnVuY3Rpb24gX2FwcGVuZChsb2dFdmVudCkge1xuXG5cdC8vIGZpbmFsaXplIHRoZSBjb25maWd1cmF0aW9uIHRvIG1ha2Ugc3VyZSBubyBvdGhlciBhcHBlbmRlciBjYW4gYmUgaW5qZWN0ZWQgKGlmIHNldClcblx0X2ZpbmFsaXplZCA9IHRydWU7XG5cbiAgICAvLyBjeWNsZSB0aHJvdWdoIGVhY2ggYXBwZW5kZXIgZm9yIHRoZSBsb2dnZXIgYW5kIGFwcGVuZCB0aGUgbG9nZ2luZyBldmVudFxuICAgIChfbG9nZ2Vyc1tsb2dFdmVudC5sb2dnZXJdIHx8IF9sb2dnZXJzW19NQUlOX0xPR0dFUl0pLmZvckVhY2goZnVuY3Rpb24gKGxvZ2dlcikge1xuICAgICAgICBpZiAobG9nZ2VyLmlzQWN0aXZlKGxvZ0V2ZW50LmxldmVsKSkge1xuICAgICAgICAgICAgbG9nZ2VyLmFwcGVuZChsb2dFdmVudCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxufVxuXG4vKipcbiAqIEhhbmRsZXMgY3JlYXRpbmcgdGhlIGxvZ2dlciBhbmQgcmV0dXJuaW5nIGl0XG4gKlxuICogQGZ1bmN0aW9uXG4gKiBAbWVtYmVyT2YgbG9nNGpzXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbnxzdHJpbmc9fSBjb250ZXh0XG4gKlxuICogQHJldHVybiB7TG9nZ2VyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TG9nZ2VyKGNvbnRleHQpIHtcblxuXHQvLyB3ZSBuZWVkIHRvIGluaXRpYWxpemUgaWYgd2UgaGF2ZW4ndFxuXHRpZiAoIV9jb25maWd1cmF0aW9uKSB7XG5cdFx0Y29uZmlndXJlKF9ERUZBVUxUX0NPTkZJRyk7XG5cdH1cblxuICAgIC8vIGRldGVybWluZSB0aGUgY29udGV4dFxuICAgIGlmICh0eXBlb2YgY29udGV4dCAhPSAnc3RyaW5nJykge1xuXG4gICAgICAgIGlmICh0eXBlb2YgY29udGV4dCA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjb250ZXh0ID0gdXRpbGl0eS5nZXRGdW5jdGlvbk5hbWUoY29udGV4dCk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGNvbnRleHQgPT0gJ29iamVjdCcpIHtcblxuICAgICAgICAgICAgY29udGV4dCA9IHV0aWxpdHkuZ2V0RnVuY3Rpb25OYW1lKGNvbnRleHQuY29uc3RydWN0b3IpO1xuXG4gICAgICAgICAgICBpZiAoY29udGV4dCA9PSAnT2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIGNvbnRleHQgPSAnYW5vbnltb3VzJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29udGV4dCA9IF9NQUlOX0xPR0dFUjtcbiAgICAgICAgfVxuXG4gICAgfVxuXG5cdHJldHVybiBuZXcgTG9nZ2VyKGNvbnRleHQsIHtcblx0XHQnYXBwZW5kJyA6IF9hcHBlbmRcblx0fSk7XG5cbn1cblxuXG5cbi8qKlxuICogU2V0cyB0aGUgbG9nIGxldmVsIGZvciBhbGwgYXBwZW5kZXJzIG9mIGEgbG9nZ2VyLCBvciBzcGVjaWZpZWQgbG9nZ2VyXG4gKlxuICogQGZ1bmN0aW9uXG4gKiBAbWVtYmVyT2YgbG9nNGpzXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IGxvZ0xldmVsXG4gKiBAcGFyYW0ge3N0cmluZz19IGxvZ2dlclxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0TG9nTGV2ZWwobG9nTGV2ZWwsIGxvZ2dlcikge1xuXG4gICAgaWYgKGxvZ0xldmVsIGluc3RhbmNlb2YgTnVtYmVyKSB7XG5cbiAgICAgICAgaWYgKGxvZ2dlcikge1xuICAgICAgICAgICAgaWYgKF9sb2dnZXJzW2xvZ2dlcl0pIHtcbiAgICAgICAgICAgICAgICBfbG9nZ2Vyc1tsb2dnZXJdLnNldExvZ0xldmVsKGxvZ0xldmVsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiBfbG9nZ2Vycykge1xuICAgICAgICAgICAgICAgIGlmIChfbG9nZ2Vycy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIF9sb2dnZXJzW2tleV0uZm9yRWFjaChmdW5jdGlvbiAoYXBwZW5kZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcGVuZGVyLnNldExvZ0xldmVsKGxvZ0xldmVsKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG5cbn1cblxuYWRkQXBwZW5kZXIoQ29uc29sZUFwcGVuZGVyKTtcblxuZXhwb3J0IHsgTG9nTGV2ZWwgfTtcbmV4cG9ydCB7IExvZ0FwcGVuZGVyIH07XG4iXX0=

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';

	exports.__esModule = true;
	exports.preCompile = preCompile;
	/*istanbul ignore next*/exports.format = format;

	var /*istanbul ignore next*/_dateFormatter = __webpack_require__(2);

	var /*istanbul ignore next*/_utility = __webpack_require__(3);

	/*istanbul ignore next*/var utility = _interopRequireWildcard(_utility);

	var /*istanbul ignore next*/_logLevel = __webpack_require__(4);

	/*istanbul ignore next*/function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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
	//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZvcm1hdHRlci5qcyJdLCJuYW1lcyI6WyJwcmVDb21waWxlIiwiZm9ybWF0IiwidXRpbGl0eSIsIl9DT01NQU5EX1JFR0VYIiwiX2NvbXBpbGVkTGF5b3V0cyIsIl9mb3JtYXRMb2dnZXIiLCJsb2dFdmVudCIsImxvZ2dlciIsIl9mb3JtYXREYXRlIiwicGFyYW1zIiwiZGF0ZSIsIl9mb3JtYXRFeGNlcHRpb24iLCJtZXNzYWdlIiwiZXJyb3IiLCJzdGFjayIsInVuZGVmaW5lZCIsInN0YWNrcyIsInNwbGl0IiwiZm9yRWFjaCIsIm5hbWUiLCJfZm9ybWF0RmlsZSIsImZpbGUiLCJfZ2V0RmlsZURldGFpbHMiLCJfZm9ybWF0TGluZU51bWJlciIsImxpbmVOdW1iZXIiLCJfZm9ybWF0TWFwTWVzc2FnZSIsInByb3BlcnRpZXMiLCJrZXkiLCJwdXNoIiwiam9pbiIsIl9mb3JtYXRMb2dNZXNzYWdlIiwiX2Zvcm1hdE1ldGhvZE5hbWUiLCJnZXRGdW5jdGlvbk5hbWUiLCJtZXRob2QiLCJfZm9ybWF0TGluZVNlcGFyYXRvciIsIl9mb3JtYXRMZXZlbCIsImxldmVsIiwiRkFUQUwiLCJFUlJPUiIsIldBUk4iLCJJTkZPIiwiREVCVUciLCJUUkFDRSIsIl9mb3JtYXRSZWxhdGl2ZSIsInJlbGF0aXZlIiwiX2Zvcm1hdFNlcXVlbmNlTnVtYmVyIiwic2VxdWVuY2UiLCJfZm9ybWF0dGVycyIsIl9nZXRDb21waWxlZExheW91dCIsImxheW91dCIsIl9jb21waWxlTGF5b3V0IiwiaW5kZXgiLCJpbmRleE9mIiwiY3VycmVudEZvcm1hdFN0cmluZyIsImZvcm1hdEFycmF5Iiwic3Vic3RyaW5nIiwic3RhcnRJbmRleCIsImVuZEluZGV4IiwiX2dldEZvcm1hdHRlck9iamVjdCIsImZvcm1hdFN0cmluZyIsInJlc3VsdCIsImV4ZWMiLCJsZW5ndGgiLCJmb3JtYXR0ZXIiLCJfZ2V0Rm9ybWF0dGVyRnVuY3Rpb24iLCJfZ2V0TGF5b3V0VGFnUGFyYW1zIiwiYWZ0ZXIiLCJsYXN0SW5kZXhPZiIsImNvbW1hbmQiLCJyZWdleCIsImhhc093blByb3BlcnR5IiwiUmVnRXhwIiwibWF0Y2giLCJpIiwiX2Zvcm1hdExvZ0V2ZW50IiwicmVzcG9uc2UiLCJjb3VudCIsIk9iamVjdCIsInRyaW0iLCJsb2dFcnJvclN0YWNrIiwicGFydHMiLCJyZXBsYWNlIiwibG9jYXRpb24iLCJob3N0IiwiZmlsZVBhcnRzIiwiY29sdW1uIiwicG9wIiwiZGVmaW5lIiwicGF0aCIsInJlcXVpcmUiLCJhcHBEaXIiLCJkaXJuYW1lIiwibWFpbiIsImZpbGVuYW1lIl0sIm1hcHBpbmdzIjoiOzs7UUFpZWdCQSxVLEdBQUFBLFU7Z0NBYUFDLE0sR0FBQUEsTTs7QUF2ZWhCOztBQUNBOzs0QkFBWUMsTzs7QUFDWjs7OztBQUVBO0FBQ0EsSUFBTUMsaUJBQWlCLHNCQUF2Qjs7QUFFQTtBQWRBOzs7Ozs7O0FBZUEsSUFBSUMsbUJBQW1CLEVBQXZCOztBQUVBOzs7Ozs7OztBQVFBLElBQUlDLGdCQUFnQixTQUFoQkEsYUFBZ0IsQ0FBVUMsUUFBVixFQUFvQjtBQUN2QyxTQUFPQSxTQUFTQyxNQUFoQjtBQUNBLENBRkQ7O0FBSUE7Ozs7Ozs7OztBQVNBLElBQUlDLGNBQWMsU0FBZEEsV0FBYyxDQUFVRixRQUFWLEVBQW9CRyxNQUFwQixFQUE0QjtBQUM3QyxTQUFPLHdEQUFXSCxTQUFTSSxJQUFwQixFQUEwQkQsT0FBTyxDQUFQLENBQTFCO0FBQVA7QUFDQSxDQUZEOztBQUlBOzs7Ozs7OztBQVFBLElBQUlFLG1CQUFtQixTQUFuQkEsZ0JBQW1CLENBQVVMLFFBQVYsRUFBb0I7O0FBRXZDLE1BQUlNLFVBQVUsRUFBZDs7QUFFQSxNQUFJTixTQUFTTyxLQUFULElBQWtCLElBQXRCLEVBQTRCOztBQUU5QixRQUFJUCxTQUFTTyxLQUFULENBQWVDLEtBQWYsSUFBd0JDLFNBQTVCLEVBQXVDO0FBQ3RDLFVBQUlDLFNBQVNWLFNBQVNPLEtBQVQsQ0FBZUMsS0FBZixDQUFxQkcsS0FBckIsQ0FBMkIsS0FBM0Is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QVA7O0FBRUEsUUFBSU0sWUFBWS9ELEtBQUtKLEtBQUwsQ0FBVyxLQUFYLENBQWhCOztBQUVBWCxhQUFTK0UsTUFBVCxHQUFrQkQsVUFBVUUsR0FBVixFQUFsQjtBQUNBaEYsYUFBU2tCLFVBQVQsR0FBc0I0RCxVQUFVRSxHQUFWLEVBQXRCOztBQUVBLFFBQUksT0FBT0MsTUFBUCxLQUFrQixXQUF0QixFQUFtQztBQUNsQyxVQUFJQyxPQUFPQyxRQUFRLE1BQVIsQ0FBWDtBQUNBLFVBQUlDLFNBQVNGLEtBQUtHLE9BQUwsQ0FBYUYsUUFBUUcsSUFBUixDQUFhQyxRQUExQixDQUFiO0FBQ0F2RixlQUFTdUYsUUFBVCxHQUFvQlQsVUFBVXZELElBQVYsQ0FBZSxHQUFmLEVBQW9Cb0QsT0FBcEIsQ0FBNEJTLE1BQTVCLEVBQW9DLEVBQXBDLEVBQXdDVCxPQUF4QyxDQUFnRCxTQUFoRCxFQUEyRCxFQUEzRCxDQUFwQjtBQUNBLEtBSkQsTUFJTztBQUNOM0UsZUFBU3VGLFFBQVQsR0FBb0JULFVBQVV2RCxJQUFWLENBQWUsR0FBZixDQUFwQjtBQUNBO0FBRUQsR0FyQkQsTUFxQk87O0FBRU52QixhQUFTK0UsTUFBVCxHQUFrQixHQUFsQjtBQUNBL0UsYUFBU3VGLFFBQVQsR0FBb0IsV0FBcEI7QUFDQXZGLGFBQVNrQixVQUFULEdBQXNCLEdBQXRCO0FBRUE7QUFFRCxDQS9CRDs7QUFpQ0E7Ozs7Ozs7O0FBUU8sU0FBU3hCLFVBQVQsQ0FBb0JpRCxNQUFwQixFQUE0QjtBQUNsQ0QscUJBQW1CQyxNQUFuQjtBQUNBOztBQUVEOzs7Ozs7Ozs7QUFTTyxTQUFTaEQsTUFBVCxDQUFnQmdELE1BQWhCLEVBQXdCM0MsUUFBeEIsRUFBa0M7QUFDeEMsU0FBT29FLGdCQUFnQjFCLG1CQUFtQkMsTUFBbkIsQ0FBaEIsRUFBNEMzQyxRQUE1QyxDQUFQO0FBQ0EiLCJmaWxlIjoiZm9ybWF0dGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBsb2c0anMgPGh0dHBzOi8vZ2l0aHViLmNvbS9hbmlnZW5lcm8vbG9nNGpzPlxuICpcbiAqIENvcHlyaWdodCAyMDE2LXByZXNlbnQgUm9iaW4gU2NodWx0eiA8aHR0cDovL2FuaWdlbmVyby5jb20+XG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2RhdGVGb3JtYXR9IGZyb20gJy4vZGF0ZUZvcm1hdHRlcic7XG5pbXBvcnQgKiBhcyB1dGlsaXR5IGZyb20gJy4vdXRpbGl0eSc7XG5pbXBvcnQge0xvZ0xldmVsfSBmcm9tICcuL2NvbnN0L2xvZ0xldmVsJztcblxuLyoqIEBjb25zdCAqL1xuY29uc3QgX0NPTU1BTkRfUkVHRVggPSAvJShbYS16LEEtWl0rKSg/PVxce3wpLztcblxuLyoqIEB0eXBlIHtPYmplY3R9ICovXG5sZXQgX2NvbXBpbGVkTGF5b3V0cyA9IHt9O1xuXG4vKipcbiAqIEBmdW5jdGlvblxuICogQG1lbWJlck9mIGZvcm1hdHRlclxuICpcbiAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dFdmVudFxuICpcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xubGV0IF9mb3JtYXRMb2dnZXIgPSBmdW5jdGlvbiAobG9nRXZlbnQpIHtcblx0cmV0dXJuIGxvZ0V2ZW50LmxvZ2dlcjtcbn07XG5cbi8qKlxuICogQGZ1bmN0aW9uXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXG4gKlxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XG4gKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSBwYXJhbXNcbiAqXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmxldCBfZm9ybWF0RGF0ZSA9IGZ1bmN0aW9uIChsb2dFdmVudCwgcGFyYW1zKSB7XG5cdHJldHVybiBkYXRlRm9ybWF0KGxvZ0V2ZW50LmRhdGUsIHBhcmFtc1swXSk7XG59O1xuXG4vKipcbiAqIEBmdW5jdGlvblxuICogQG1lbWJlck9mIGZvcm1hdHRlclxuICpcbiAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dFdmVudFxuICpcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xubGV0IF9mb3JtYXRFeGNlcHRpb24gPSBmdW5jdGlvbiAobG9nRXZlbnQpIHtcblxuICAgIGxldCBtZXNzYWdlID0gJyc7XG5cbiAgICBpZiAobG9nRXZlbnQuZXJyb3IgIT0gbnVsbCkge1xuXG5cdFx0aWYgKGxvZ0V2ZW50LmVycm9yLnN0YWNrICE9IHVuZGVmaW5lZCkge1xuXHRcdFx0bGV0IHN0YWNrcyA9IGxvZ0V2ZW50LmVycm9yLnN0YWNrLnNwbGl0KC9cXG4vZyk7XG4gICAgICAgICAgICBzdGFja3MuZm9yRWFjaChmdW5jdGlvbiAoc3RhY2spIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlICs9IGBcXHQke3N0YWNrfVxcbmA7XG4gICAgICAgICAgICB9KTtcblx0XHR9IGVsc2UgaWYgKGxvZ0V2ZW50LmVycm9yLm1lc3NhZ2UgIT0gbnVsbCAmJiBsb2dFdmVudC5lcnJvci5tZXNzYWdlICE9ICcnKSB7XG5cdFx0XHRtZXNzYWdlICs9IGBcXHQke2xvZ0V2ZW50LmVycm9yLm5hbWV9OiAke2xvZ0V2ZW50LmVycm9yLm1lc3NhZ2V9XFxuYDtcblx0XHR9XG5cblx0fVxuXG5cdHJldHVybiBtZXNzYWdlO1xuXG59O1xuXG4vKipcbiAqIEZvcm1hdHMgdGhlIGZpbGUgKGUuZy4gdGVzdC5qcykgdG8gdGhlIGZpbGVcbiAqXG4gKiBAcHJpdmF0ZVxuICogQGZ1bmN0aW9uXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXG4gKlxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XG4gKi9cbmxldCBfZm9ybWF0RmlsZSA9IGZ1bmN0aW9uIChsb2dFdmVudCkge1xuXG4gICAgaWYgKCFsb2dFdmVudC5maWxlKSB7XG5cdFx0X2dldEZpbGVEZXRhaWxzKGxvZ0V2ZW50KTtcblx0fVxuXG5cdHJldHVybiBsb2dFdmVudC5maWxlO1xuXG59O1xuXG4vKipcbiAqIEBmdW5jdGlvblxuICogQG1lbWJlck9mIGZvcm1hdHRlclxuICpcbiAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dFdmVudFxuICpcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xubGV0IF9mb3JtYXRMaW5lTnVtYmVyID0gZnVuY3Rpb24gKGxvZ0V2ZW50KSB7XG5cbiAgICBpZiAoIWxvZ0V2ZW50LmxpbmVOdW1iZXIpIHtcblx0XHRfZ2V0RmlsZURldGFpbHMobG9nRXZlbnQpO1xuXHR9XG5cblx0cmV0dXJuIGAke2xvZ0V2ZW50LmxpbmVOdW1iZXJ9YDtcblxufTtcblxuLyoqXG4gKiBAZnVuY3Rpb25cbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcbiAqXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcbiAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz59IHBhcmFtc1xuICpcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xubGV0IF9mb3JtYXRNYXBNZXNzYWdlID0gZnVuY3Rpb24gKGxvZ0V2ZW50LCBwYXJhbXMpIHtcblx0bGV0IG1lc3NhZ2UgPSBudWxsO1xuXHRpZiAobG9nRXZlbnQucHJvcGVydGllcykge1xuXG5cdFx0bWVzc2FnZSA9IFtdO1xuXHRcdGZvciAobGV0IGtleSBpbiBsb2dFdmVudC5wcm9wZXJ0aWVzKSB7XG5cdFx0XHRpZiAocGFyYW1zWzBdKSB7XG5cdFx0XHRcdGlmIChwYXJhbXNbMF0gPT0ga2V5KSB7XG5cdFx0XHRcdFx0bWVzc2FnZS5wdXNoKGxvZ0V2ZW50LnByb3BlcnRpZXNba2V5XSk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG1lc3NhZ2UucHVzaCgneycgKyBrZXkgKyAnLCcgKyBsb2dFdmVudC5wcm9wZXJ0aWVzW2tleV0gKyAnfScpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiAneycgKyBtZXNzYWdlLmpvaW4oJywnKSArICd9JztcblxuXHR9XG5cdHJldHVybiBtZXNzYWdlO1xufTtcblxuLyoqXG4gKiBAZnVuY3Rpb25cbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcbiAqXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcbiAqXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmxldCBfZm9ybWF0TG9nTWVzc2FnZSA9IGZ1bmN0aW9uIChsb2dFdmVudCkge1xuXHRyZXR1cm4gbG9nRXZlbnQubWVzc2FnZTtcbn07XG5cbi8qKlxuICogQGZ1bmN0aW9uXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXG4gKlxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XG4gKlxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5sZXQgX2Zvcm1hdE1ldGhvZE5hbWUgPSBmdW5jdGlvbiAobG9nRXZlbnQpIHtcblx0cmV0dXJuIHV0aWxpdHkuZ2V0RnVuY3Rpb25OYW1lKGxvZ0V2ZW50Lm1ldGhvZCk7XG59O1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBAZnVuY3Rpb25cbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcbiAqL1xubGV0IF9mb3JtYXRMaW5lU2VwYXJhdG9yID0gZnVuY3Rpb24gKCkge1xuXHRyZXR1cm4gJ1xcbic7XG59O1xuXG4vKipcbiAqIEBmdW5jdGlvblxuICogQG1lbWJlck9mIGZvcm1hdHRlclxuICpcbiAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dFdmVudFxuICpcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xubGV0IF9mb3JtYXRMZXZlbCA9IGZ1bmN0aW9uIChsb2dFdmVudCkge1xuXG4gICAgc3dpdGNoIChsb2dFdmVudC5sZXZlbCkge1xuXG4gICAgICAgIGNhc2UgTG9nTGV2ZWwuRkFUQUw6XG4gICAgICAgICAgICByZXR1cm4gJ0ZBVEFMJztcbiAgICAgICAgY2FzZSBMb2dMZXZlbC5FUlJPUjpcbiAgICAgICAgICAgIHJldHVybiAnRVJST1InO1xuICAgICAgICBjYXNlIExvZ0xldmVsLldBUk46XG4gICAgICAgICAgICByZXR1cm4gJ1dBUk4nO1xuICAgICAgICBjYXNlIExvZ0xldmVsLklORk86XG4gICAgICAgICAgICByZXR1cm4gJ0lORk8nO1xuICAgICAgICBjYXNlIExvZ0xldmVsLkRFQlVHOlxuICAgICAgICAgICAgcmV0dXJuICdERUJVRyc7XG4gICAgICAgIGNhc2UgTG9nTGV2ZWwuVFJBQ0U6XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gJ1RSQUNFJztcblxuICAgIH1cblxufTtcblxuLyoqXG4gKiBAZnVuY3Rpb25cbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcbiAqXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcbiAqXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmxldCBfZm9ybWF0UmVsYXRpdmUgPSBmdW5jdGlvbiAobG9nRXZlbnQpIHtcblx0cmV0dXJuICcnICsgbG9nRXZlbnQucmVsYXRpdmU7XG59O1xuXG4vKipcbiAqIEBmdW5jdGlvblxuICogQG1lbWJlck9mIGZvcm1hdHRlclxuICpcbiAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dFdmVudFxuICpcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xubGV0IF9mb3JtYXRTZXF1ZW5jZU51bWJlciA9IGZ1bmN0aW9uIChsb2dFdmVudCkge1xuXHRyZXR1cm4gJycgKyBsb2dFdmVudC5zZXF1ZW5jZTtcbn07XG5cbmxldCBfZm9ybWF0dGVycyA9IHtcblx0J2N8bG9nZ2VyJyA6IF9mb3JtYXRMb2dnZXIsXG5cdCdkfGRhdGUnIDogX2Zvcm1hdERhdGUsXG5cdCdleHxleGNlcHRpb258dGhyb3dhYmxlJyA6IF9mb3JtYXRFeGNlcHRpb24sXG5cdCdGfGZpbGUnIDogX2Zvcm1hdEZpbGUsXG5cdCdLfG1hcHxNQVAnIDogX2Zvcm1hdE1hcE1lc3NhZ2UsXG5cdCdMfGxpbmUnIDogX2Zvcm1hdExpbmVOdW1iZXIsXG5cdCdtfG1zZ3xtZXNzYWdlJyA6IF9mb3JtYXRMb2dNZXNzYWdlLFxuXHQnTXxtZXRob2QnIDogX2Zvcm1hdE1ldGhvZE5hbWUsXG5cdCduJyA6IF9mb3JtYXRMaW5lU2VwYXJhdG9yLFxuXHQncHxsZXZlbCcgOiBfZm9ybWF0TGV2ZWwsXG5cdCdyfHJlbGF0aXZlJyA6IF9mb3JtYXRSZWxhdGl2ZSxcblx0J3NufHNlcXVlbmNlTnVtYmVyJyA6IF9mb3JtYXRTZXF1ZW5jZU51bWJlclxufTtcblxuLyoqXG4gKiBHZXQgdGhlIGNvbXBpbGVkIGxheW91dCBmb3IgdGhlIHNwZWNpZmllZCBsYXlvdXQgc3RyaW5nLiBJZiB0aGUgY29tcGlsZWQgbGF5b3V0IGRvZXMgbm90XG4gKiBleGlzdCwgdGhlbiB3ZSB3YW50IHRvIGNyZWF0ZSBpdC5cbiAqXG4gKiBAZnVuY3Rpb25cbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbGF5b3V0XG4gKlxuICogQHJldHVybiB7QXJyYXkuPHN0cmluZ3xmdW5jdGlvbj59XG4gKi9cbmxldCBfZ2V0Q29tcGlsZWRMYXlvdXQgPSBmdW5jdGlvbiAobGF5b3V0KSB7XG5cblx0aWYgKF9jb21waWxlZExheW91dHNbbGF5b3V0XSkge1xuXHRcdHJldHVybiBfY29tcGlsZWRMYXlvdXRzW2xheW91dF07XG5cdH1cblxuXHRyZXR1cm4gX2NvbXBpbGVMYXlvdXQobGF5b3V0KTtcblxufTtcblxuLyoqXG4gKiBDb21waWxlcyBhIGxheW91dCBpbnRvIGFuIGFycmF5LiBUaGUgYXJyYXkgY29udGFpbnMgZnVuY3Rpb25zXG4gKlxuICogQGZ1bmN0aW9uXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGxheW91dFxuICpcbiAqIEByZXR1cm4ge0FycmF5LjxzdHJpbmd8ZnVuY3Rpb24+fVxuICovXG5sZXQgX2NvbXBpbGVMYXlvdXQgPSBmdW5jdGlvbiAobGF5b3V0KSB7XG5cblx0bGV0IGluZGV4ID0gbGF5b3V0LmluZGV4T2YoJyUnKTtcblx0bGV0IGN1cnJlbnRGb3JtYXRTdHJpbmcgPSAnJztcblx0bGV0IGZvcm1hdEFycmF5ID0gW107XG5cblx0aWYgKGluZGV4ICE9IDApIHtcblx0XHRmb3JtYXRBcnJheS5wdXNoKGxheW91dC5zdWJzdHJpbmcoMCwgaW5kZXgpKTtcblx0fVxuXG5cdGRvIHtcblxuXHRcdGxldCBzdGFydEluZGV4ID0gaW5kZXg7XG5cdFx0bGV0IGVuZEluZGV4ID0gaW5kZXggPSBsYXlvdXQuaW5kZXhPZignJScsIGluZGV4ICsgMSk7XG5cblx0XHRpZiAoZW5kSW5kZXggPCAwKSB7XG5cdFx0XHRjdXJyZW50Rm9ybWF0U3RyaW5nID0gbGF5b3V0LnN1YnN0cmluZyhzdGFydEluZGV4KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y3VycmVudEZvcm1hdFN0cmluZyA9IGxheW91dC5zdWJzdHJpbmcoc3RhcnRJbmRleCwgZW5kSW5kZXgpO1xuXHRcdH1cblxuXHRcdGZvcm1hdEFycmF5LnB1c2goX2dldEZvcm1hdHRlck9iamVjdChjdXJyZW50Rm9ybWF0U3RyaW5nKSk7XG5cblx0fSB3aGlsZSAoaW5kZXggPiAtMSk7XG5cbiAgICAvLyBzZXQgdGhlIGZvcm1hdCBhcnJheSB0byB0aGUgc3BlY2lmaWVkIGNvbXBpbGVkIGxheW91dFxuXHRfY29tcGlsZWRMYXlvdXRzW2xheW91dF0gPSBmb3JtYXRBcnJheTtcblxuXHRyZXR1cm4gZm9ybWF0QXJyYXk7XG5cbn07XG5cbi8qKlxuICogQGZ1bmN0aW9uXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGZvcm1hdFN0cmluZ1xuICpcbiAqIEByZXR1cm4ge09iamVjdHxzdHJpbmd9XG4gKi9cbmxldCBfZ2V0Rm9ybWF0dGVyT2JqZWN0ID0gZnVuY3Rpb24gKGZvcm1hdFN0cmluZykge1xuXG5cdGxldCByZXN1bHQgPSBfQ09NTUFORF9SRUdFWC5leGVjKGZvcm1hdFN0cmluZyk7XG5cdGlmIChyZXN1bHQgIT0gbnVsbCAmJiByZXN1bHQubGVuZ3RoID09IDIpIHtcblxuXHRcdGxldCBmb3JtYXR0ZXIgPSBfZ2V0Rm9ybWF0dGVyRnVuY3Rpb24ocmVzdWx0WzFdKTtcblx0XHRpZiAoIWZvcm1hdHRlcikge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXG5cdFx0bGV0IHBhcmFtcyA9IF9nZXRMYXlvdXRUYWdQYXJhbXMoZm9ybWF0U3RyaW5nKTtcblxuXHRcdGxldCBhZnRlciA9ICcnO1xuXHRcdGxldCBlbmRJbmRleCA9IGZvcm1hdFN0cmluZy5sYXN0SW5kZXhPZignfScpO1xuXHRcdGlmIChlbmRJbmRleCAhPSAtMSkge1xuXHRcdFx0YWZ0ZXIgPSBmb3JtYXRTdHJpbmcuc3Vic3RyaW5nKGVuZEluZGV4ICsgMSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGFmdGVyID0gZm9ybWF0U3RyaW5nLnN1YnN0cmluZyhyZXN1bHQuaW5kZXggKyByZXN1bHRbMV0ubGVuZ3RoICsgMSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdCdmb3JtYXR0ZXInIDogZm9ybWF0dGVyLFxuXHRcdFx0J3BhcmFtcycgOiBwYXJhbXMsXG5cdFx0XHQnYWZ0ZXInIDogYWZ0ZXJcblx0XHR9O1xuXG5cdH1cblxuXHRyZXR1cm4gZm9ybWF0U3RyaW5nO1xuXG59O1xuXG4vKipcbiAqIERldGVybWluZXMgd2hhdCBmb3JtYXR0ZXIgZnVuY3Rpb24gaGFzIGJlZW4gY29uZmlndXJlZFxuICpcbiAqIEBmdW5jdGlvblxuICogQG1lbWJlck9mIGZvcm1hdHRlclxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb21tYW5kXG4gKlxuICogQHJldHVybiB7P3N0cmluZ31cbiAqL1xubGV0IF9nZXRGb3JtYXR0ZXJGdW5jdGlvbiA9IGZ1bmN0aW9uIChjb21tYW5kKSB7XG5cblx0bGV0IHJlZ2V4O1xuXHRmb3IgKGxldCBrZXkgaW4gX2Zvcm1hdHRlcnMpIHtcbiAgICAgICAgaWYgKF9mb3JtYXR0ZXJzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIHJlZ2V4ID0gbmV3IFJlZ0V4cCgnXignICsga2V5ICsgJykkJyk7XG4gICAgICAgICAgICBpZiAocmVnZXguZXhlYyhjb21tYW5kKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfZm9ybWF0dGVyc1trZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cdH1cblxuXHRyZXR1cm4gbnVsbDtcblxufTtcblxuLyoqXG4gKiBHZXRzIHRoZSBsYXlvdXQgdGFnIHBhcmFtcyBhc3NvY2lhdGVkIHdpdGggdGhlIGxheW91dCB0YWcuIFNvLCBmb3IgZXhhbXBsZSwgJyVke3l5eXktTU0tZGR9YFxuICogd291bGQgb3V0cHV0IGFuIGFycmF5IG9mIFsneXl5eS1NTS1kZCddXG4gKlxuICogQHByaXZhdGVcbiAqIEBmdW5jdGlvblxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb21tYW5kXG4gKlxuICogQHJldHVybiB7QXJyYXkuPHN0cmluZz59XG4gKi9cbmxldCBfZ2V0TGF5b3V0VGFnUGFyYW1zID0gZnVuY3Rpb24gKGNvbW1hbmQpIHtcblxuXHRsZXQgcGFyYW1zID0gW107XG5cdGxldCByZXN1bHQgPSBjb21tYW5kLm1hdGNoKC9cXHsoW159XSopKD89fSkvZyk7XG5cdGlmIChyZXN1bHQgIT0gbnVsbCkge1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcmVzdWx0Lmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRwYXJhbXMucHVzaChyZXN1bHRbaV0uc3Vic3RyaW5nKDEpKTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gcGFyYW1zO1xuXG59O1xuXG4vKipcbiAqIEhhbmRsZXMgZm9ybWF0dGluZyB0aGUgbG9nIGV2ZW50IHVzaW5nIHRoZSBzcGVjaWZpZWQgZm9ybWF0dGVyIGFycmF5XG4gKlxuICogQHByaXZhdGVcbiAqIEBmdW5jdGlvblxuICpcbiAqIEBwYXJhbSB7QXJyYXkuPGZ1bmN0aW9ufHN0cmluZz59IGZvcm1hdHRlclxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XG4gKlxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5sZXQgX2Zvcm1hdExvZ0V2ZW50ID0gZnVuY3Rpb24gKGZvcm1hdHRlciwgbG9nRXZlbnQpIHtcblxuXHRsZXQgcmVzcG9uc2U7XG5cdGxldCBtZXNzYWdlID0gJyc7XG5cdGxldCBjb3VudCA9IGZvcm1hdHRlci5sZW5ndGg7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuXHRcdGlmIChmb3JtYXR0ZXJbaV0gIT09IG51bGwpIHtcblxuXHRcdFx0aWYgKGZvcm1hdHRlcltpXSBpbnN0YW5jZW9mIE9iamVjdCkge1xuXG5cdFx0XHRcdHJlc3BvbnNlID0gZm9ybWF0dGVyW2ldLmZvcm1hdHRlcihsb2dFdmVudCwgZm9ybWF0dGVyW2ldLnBhcmFtcyk7XG5cdFx0XHRcdGlmIChyZXNwb25zZSAhPSBudWxsKSB7XG5cdFx0XHRcdFx0bWVzc2FnZSArPSByZXNwb25zZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRtZXNzYWdlICs9IGZvcm1hdHRlcltpXS5hZnRlcjtcblxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bWVzc2FnZSArPSBmb3JtYXR0ZXJbaV07XG5cdFx0XHR9XG5cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gbWVzc2FnZS50cmltKCk7XG5cbn07XG5cbi8qKlxuICpcbiAqIEBwcml2YXRlXG4gKiBAZnVuY3Rpb25cbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcbiAqXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcbiAqL1xubGV0IF9nZXRGaWxlRGV0YWlscyA9IGZ1bmN0aW9uIChsb2dFdmVudCkge1xuXG5cdGlmIChsb2dFdmVudC5sb2dFcnJvclN0YWNrKSB7XG5cblx0XHRsZXQgcGFydHMgPSBsb2dFdmVudC5sb2dFcnJvclN0YWNrLnN0YWNrLnNwbGl0KC9cXG4vZyk7XG5cdFx0bGV0IGZpbGUgPSBwYXJ0c1szXTtcblx0XHRmaWxlID0gZmlsZS5yZXBsYWNlKC9hdCAoLipcXCh8KShmaWxlfGh0dHB8aHR0cHN8KSg6fCkoXFwvfCkqLywgJycpO1xuXHRcdGZpbGUgPSBmaWxlLnJlcGxhY2UoJyknLCAnJyk7XG5cdFx0ZmlsZSA9IGZpbGUucmVwbGFjZSgodHlwZW9mIGxvY2F0aW9uICE9PSAndW5kZWZpbmVkJykgPyBsb2NhdGlvbi5ob3N0IDogJycsICcnKS50cmltKCk7XG5cblx0XHRsZXQgZmlsZVBhcnRzID0gZmlsZS5zcGxpdCgvXFw6L2cpO1xuXG5cdFx0bG9nRXZlbnQuY29sdW1uID0gZmlsZVBhcnRzLnBvcCgpO1xuXHRcdGxvZ0V2ZW50LmxpbmVOdW1iZXIgPSBmaWxlUGFydHMucG9wKCk7XG5cblx0XHRpZiAodHlwZW9mIGRlZmluZSAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdGxldCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuXHRcdFx0bGV0IGFwcERpciA9IHBhdGguZGlybmFtZShyZXF1aXJlLm1haW4uZmlsZW5hbWUpO1xuXHRcdFx0bG9nRXZlbnQuZmlsZW5hbWUgPSBmaWxlUGFydHMuam9pbignOicpLnJlcGxhY2UoYXBwRGlyLCAnJykucmVwbGFjZSgvKFxcXFx8XFwvKS8sICcnKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0bG9nRXZlbnQuZmlsZW5hbWUgPSBmaWxlUGFydHMuam9pbignOicpO1xuXHRcdH1cblxuXHR9IGVsc2Uge1xuXG5cdFx0bG9nRXZlbnQuY29sdW1uID0gJz8nO1xuXHRcdGxvZ0V2ZW50LmZpbGVuYW1lID0gJ2Fub255bW91cyc7XG5cdFx0bG9nRXZlbnQubGluZU51bWJlciA9ICc/JztcblxuXHR9XG5cbn07XG5cbi8qKlxuICogQGZ1bmN0aW9uXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGxheW91dFxuICpcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHByZUNvbXBpbGUobGF5b3V0KSB7XG5cdF9nZXRDb21waWxlZExheW91dChsYXlvdXQpO1xufVxuXG4vKipcbiAqIEBmdW5jdGlvblxuICogQG1lbWJlck9mIGZvcm1hdHRlclxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBsYXlvdXRcbiAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dFdmVudFxuICpcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdChsYXlvdXQsIGxvZ0V2ZW50KSB7XG5cdHJldHVybiBfZm9ybWF0TG9nRXZlbnQoX2dldENvbXBpbGVkTGF5b3V0KGxheW91dCksIGxvZ0V2ZW50KTtcbn1cbiJdfQ==

/***/ }),
/* 2 */
/***/ (function(module, exports) {

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
	//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRhdGVGb3JtYXR0ZXIuanMiXSwibmFtZXMiOlsiZGF0ZUZvcm1hdCIsImkxOG4iLCJUT0tFTiIsIlRJTUVaT05FIiwiVElNRVpPTkVfQ0xJUCIsIl9QUkVERUZJTkVEIiwicGFkIiwidmFsdWUiLCJsZW5ndGgiLCJTdHJpbmciLCJkYXRlIiwibWFzayIsIkRFRkFVTFQiLCJpc1VUQyIsInNsaWNlIiwicHJlZml4IiwiZGF5IiwibW9udGgiLCJmdWxsWWVhciIsImhvdXJzIiwibWludXRlcyIsInNlY29uZHMiLCJtaWxsaXNlY29uZHMiLCJvZmZzZXQiLCJnZXRUaW1lem9uZU9mZnNldCIsImZsYWdzIiwiZ2V0RGF0ZSIsImQiLCJtIiwibWF0Y2giLCJwb3AiLCJyZXBsYWNlIiwiTWF0aCIsImZsb29yIiwiYWJzIiwiJDAiXSwibWFwcGluZ3MiOiI7OztRQTREZ0JBLFUsR0FBQUEsVTtBQTVEaEI7Ozs7Ozs7QUFPQSxJQUFJQyxPQUFPO0FBQ1YsTUFBTSxDQUFFLEtBQUYsRUFBUyxLQUFULEVBQWdCLEtBQWhCLEVBQXVCLEtBQXZCLEVBQThCLEtBQTlCLEVBQXFDLEtBQXJDLEVBQTRDLEtBQTVDLEVBQW1ELFFBQW5ELEVBQTZELFFBQTdELEVBQ0wsU0FESyxFQUNNLFdBRE4sRUFDbUIsVUFEbkIsRUFDK0IsUUFEL0IsRUFDeUMsVUFEekMsQ0FESTtBQUdWLE1BQU0sQ0FBRSxLQUFGLEVBQVMsS0FBVCxFQUFnQixLQUFoQixFQUF1QixLQUF2QixFQUE4QixLQUE5QixFQUFxQyxLQUFyQyxFQUE0QyxLQUE1QyxFQUFtRCxLQUFuRCxFQUEwRCxLQUExRCxFQUNMLEtBREssRUFDRSxLQURGLEVBQ1MsS0FEVCxFQUNnQixTQURoQixFQUMyQixVQUQzQixFQUN1QyxPQUR2QyxFQUNnRCxPQURoRCxFQUN5RCxLQUR6RCxFQUNnRSxNQURoRSxFQUVMLE1BRkssRUFFRyxRQUZILEVBRWEsV0FGYixFQUUwQixTQUYxQixFQUVxQyxVQUZyQyxFQUVpRCxVQUZqRDtBQUhJ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QUFzQlgsT0FBTUEsUUFBUSxFQUFSLEdBQWEsR0FBYixHQUFtQixHQXRCZDtBQXVCWCxRQUFPQSxRQUFRLEVBQVIsR0FBYSxJQUFiLEdBQW9CLElBdkJoQjtBQXdCWCxPQUFNTixRQUFRLEtBQVIsR0FBZ0IsQ0FBQ0osT0FBT0MsSUFBUCxFQUFhbUIsS0FBYixDQUFtQjFCLFFBQW5CLEtBQWdDLENBQUUsRUFBRixDQUFqQyxFQUF5QzJCLEdBQXpDLEdBQStDQyxPQUEvQyxDQUF1RDNCLGFBQXZELEVBQXNFLEVBQXRFLENBeEJYO0FBeUJYLE9BQU0sQ0FBQ21CLFNBQVMsQ0FBVCxHQUFhLEdBQWIsR0FBbUIsR0FBcEIsSUFBMkJqQixJQUFJMEIsS0FBS0MsS0FBTCxDQUFXRCxLQUFLRSxHQUFMLENBQVNYLE1BQVQsSUFBbUIsRUFBOUIsSUFBb0MsR0FBcEMsR0FBMENTLEtBQUtFLEdBQUwsQ0FBU1gsTUFBVCxJQUFtQixFQUFqRSxFQUFxRSxDQUFyRTtBQXpCdEIsRUFBWjs7QUE0QkEsUUFBT1osS0FBS29CLE9BQUwsQ0FBYTdCLEtBQWIsRUFBb0IsVUFBVWlDLEVBQVYsRUFBYztBQUN4QyxTQUFPQSxNQUFNVixLQUFOLEdBQWNBLE1BQU1VLEVBQU4sQ0FBZCxHQUEwQkEsRUFBakM7QUFDQSxFQUZNLENBQVA7QUFJQSIsImZpbGUiOiJkYXRlRm9ybWF0dGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBsb2c0anMgPGh0dHBzOi8vZ2l0aHViLmNvbS9hbmlnZW5lcm8vbG9nNGpzMj5cbiAqXG4gKiBDb3B5cmlnaHQgMjAxNi1wcmVzZW50IFJvYmluIFNjaHVsdHogPGh0dHA6Ly9hbmlnZW5lcm8uY29tPlxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlXG4gKi9cblxubGV0IGkxOG4gPSB7XG5cdCdkJyA6IFsgJ1N1bicsICdNb24nLCAnVHVlJywgJ1dlZCcsICdUaHUnLCAnRnJpJywgJ1NhdCcsICdTdW5kYXknLCAnTW9uZGF5Jyxcblx0XHQnVHVlc2RheScsICdXZWRuZXNkYXknLCAnVGh1cnNkYXknLCAnRnJpZGF5JywgJ1NhdHVyZGF5JyBdLFxuXHQnbScgOiBbICdKYW4nLCAnRmViJywgJ01hcicsICdBcHInLCAnTWF5JywgJ0p1bicsICdKdWwnLCAnQXVnJywgJ1NlcCcsXG5cdFx0J09jdCcsICdOb3YnLCAnRGVjJywgJ0phbnVhcnknLCAnRmVicnVhcnknLCAnTWFyY2gnLCAnQXByaWwnLCAnTWF5JywgJ0p1bmUnLFxuXHRcdCdKdWx5JywgJ0F1Z3VzdCcsICdTZXB0ZW1iZXInLCAnT2N0b2JlcicsICdOb3ZlbWJlcicsICdEZWNlbWJlcicgXVxufTtcblxuY29uc3QgVE9LRU4gPSAvZHsxLDR9fE17MSw0fXx5eSg/Onl5KT98KFtIaG1zQWFdKVxcMT98W0xsb1NaXXwnW14nXSonfCdbXiddKicvZztcbmNvbnN0IFRJTUVaT05FID0gL1xcYig/OltQTUNFQV1bU0RQXVR8KD86UGFjaWZpY3xNb3VudGFpbnxDZW50cmFsfEVhc3Rlcm58QXRsYW50aWMpICg/OlN0YW5kYXJkfERheWxpZ2h0fFByZXZhaWxpbmcpIFRpbWV8KD86R01UfFVUQykoPzpbLStdXFxkezR9KT8pXFxiL2c7XG5jb25zdCBUSU1FWk9ORV9DTElQID0gL1teLStcXGRBLVpdL2c7XG5cbi8qKlxuICogUHJlZGVmaW5lZCBEQVRFIGZvcm1hdHMgKHNwZWNpZmllZCBieSBsb2dqMilcbiAqIEBwcml2YXRlXG4gKiBAdHlwZSB7e0RFRkFVTFQ6IHN0cmluZywgQUJTT0xVVEU6IHN0cmluZywgQ09NUEFDVDogc3RyaW5nLCBEQVRFOiBzdHJpbmcsIElTTzg2MDE6IHN0cmluZywgSVNPODYwMV9CQVNJQzogc3RyaW5nfX1cbiAqL1xuY29uc3QgX1BSRURFRklORUQgPSB7XG4gICAgJ0RFRkFVTFQnIDogJ3l5eXktTU0tZGQgSEg6bW06c3MsUycsXG4gICAgJ0FCU09MVVRFJyA6ICdISDpNTTpzcyxTJyxcbiAgICAnQ09NUEFDVCcgOiAneXl5eU1NZGRISG1tc3NTJyxcbiAgICAnREFURScgOiAnZGQgTU1NIHl5eXkgSEg6bW06c3MsUycsXG4gICAgJ0lTTzg2MDEnIDogJ3l5eXktTU0tZGRUSEg6bW06c3MsUycsXG4gICAgJ0lTTzg2MDFfQkFTSUMnIDogJ3l5eXlNTWRkVEhIbW1zcyxTJ1xufTtcblxuLyoqXG4gKiBQYWRzIG51bWJlcnMgaW4gdGhlIGRhdGUgZm9ybWF0XG4gKlxuICogQHBhcmFtIHZhbHVlXG4gKiBAcGFyYW0gbGVuZ3RoXG4gKlxuICogQHJldHVybnMgez9zdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIHBhZCh2YWx1ZSwgbGVuZ3RoKSB7XG5cbiAgICB2YWx1ZSA9IFN0cmluZyh2YWx1ZSk7XG5cdGxlbmd0aCA9IGxlbmd0aCB8fCAyO1xuXG4gICAgd2hpbGUgKHZhbHVlLmxlbmd0aCA8IGxlbmd0aCkge1xuXHRcdHZhbHVlID0gJzAnICsgdmFsdWU7XG5cdH1cblxuXHRyZXR1cm4gdmFsdWU7XG5cbn1cblxuLyoqXG4gKiBGb3JtYXRzIHRoZSBkYXRlXG4gKiBAcGFyYW0gZGF0ZVxuICogQHBhcmFtIG1hc2tcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkYXRlRm9ybWF0KGRhdGUsIG1hc2spIHtcblxuICAgIGlmIChfUFJFREVGSU5FRFttYXNrXSkge1xuICAgICAgICBtYXNrID0gX1BSRURFRklORURbbWFza107XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbWFzayA9IFN0cmluZyhtYXNrIHx8IF9QUkVERUZJTkVELkRFRkFVTFQpO1xuICAgIH1cblxuICAgIC8vIGNoZWNrIGlmIHRoZSBkYXRlIGZvcm1hdCBpcyBzZXQgZm9yIFVUQ1xuICAgIGxldCBpc1VUQyA9IChtYXNrLnNsaWNlKDAsIDQpID09ICdVVEM6Jyk7XG5cdGlmIChpc1VUQykge1xuXHRcdG1hc2sgPSBtYXNrLnNsaWNlKDQpO1xuXHR9XG5cblx0bGV0IHByZWZpeCA9IGlzVVRDID8gJ2dldFVUQycgOiAnZ2V0Jztcblx0bGV0IGRheSA9IGRhdGVbcHJlZml4ICsgJ0RheSddKCk7XG5cdGxldCBtb250aCA9IGRhdGVbcHJlZml4ICsgJ01vbnRoJ10oKTtcblx0bGV0IGZ1bGxZZWFyID0gZGF0ZVtwcmVmaXggKyAnRnVsbFllYXInXSgpO1xuXHRsZXQgaG91cnMgPSBkYXRlW3ByZWZpeCArICdIb3VycyddKCk7XG5cdGxldCBtaW51dGVzID0gZGF0ZVtwcmVmaXggKyAnTWludXRlcyddKCk7XG5cdGxldCBzZWNvbmRzID0gZGF0ZVtwcmVmaXggKyAnU2Vjb25kcyddKCk7XG5cdGxldCBtaWxsaXNlY29uZHMgPSBkYXRlW3ByZWZpeCArICdNaWxsaXNlY29uZHMnXSgpO1xuXHRsZXQgb2Zmc2V0ID0gaXNVVEMgPyAwIDogZGF0ZS5nZXRUaW1lem9uZU9mZnNldCgpO1xuXG5cdGxldCBmbGFncyA9IHtcblx0XHQnZCcgOiBkYXRlLmdldERhdGUoKSxcblx0XHQnZGQnIDogcGFkKGRhdGUuZ2V0RGF0ZSgpKSxcblx0XHQnZGRkJyA6IGkxOG4uZFtkYXldLFxuXHRcdCdkZGRkJyA6IGkxOG4uZFtkYXkgKyA3XSxcblx0XHQnTScgOiBtb250aCArIDEsXG5cdFx0J01NJyA6IHBhZChtb250aCArIDEpLFxuXHRcdCdNTU0nIDogaTE4bi5tW21vbnRoXSxcblx0XHQnTU1NTScgOiBpMThuLm1bbW9udGggKyAxMl0sXG5cdFx0J3l5JyA6IFN0cmluZyhmdWxsWWVhcikuc2xpY2UoMiksXG5cdFx0J3l5eXknIDogZnVsbFllYXIsXG5cdFx0J2gnIDogaG91cnMgJSAxMiB8fCAxMixcblx0XHQnaGgnIDogcGFkKGhvdXJzICUgMTIgfHwgMTIpLFxuXHRcdCdIJyA6IGhvdXJzLFxuXHRcdCdISCcgOiBwYWQoaG91cnMpLFxuXHRcdCdtJyA6IG1pbnV0ZXMsXG5cdFx0J21tJyA6IHBhZChtaW51dGVzKSxcblx0XHQncycgOiBzZWNvbmRzLFxuXHRcdCdzcycgOiBwYWQoc2Vjb25kcyksXG5cdFx0J1MnIDogcGFkKG1pbGxpc2Vjb25kcywgMSksXG5cdFx0J2EnIDogaG91cnMgPCAxMiA/ICdhJyA6ICdwJyxcblx0XHQnYWEnIDogaG91cnMgPCAxMiA/ICdhbScgOiAncG0nLFxuXHRcdCdBJyA6IGhvdXJzIDwgMTIgPyAnQScgOiAnUCcsXG5cdFx0J0FBJyA6IGhvdXJzIDwgMTIgPyAnQU0nIDogJ1BNJyxcblx0XHQnWicgOiBpc1VUQyA/ICdVVEMnIDogKFN0cmluZyhkYXRlKS5tYXRjaChUSU1FWk9ORSkgfHwgWyAnJyBdKS5wb3AoKS5yZXBsYWNlKFRJTUVaT05FX0NMSVAsICcnKSxcblx0XHQnbycgOiAob2Zmc2V0ID4gMCA/ICctJyA6ICcrJykgKyBwYWQoTWF0aC5mbG9vcihNYXRoLmFicyhvZmZzZXQpIC8gNjApICogMTAwICsgTWF0aC5hYnMob2Zmc2V0KSAlIDYwLCA0KVxuXHR9O1xuXG5cdHJldHVybiBtYXNrLnJlcGxhY2UoVE9LRU4sIGZ1bmN0aW9uICgkMCkge1xuXHRcdHJldHVybiAkMCBpbiBmbGFncyA/IGZsYWdzWyQwXSA6ICQwO1xuXHR9KTtcblxufVxuIl19

/***/ }),
/* 3 */
/***/ (function(module, exports) {

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
	//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxpdHkuanMiXSwibmFtZXMiOlsiZ2V0RnVuY3Rpb25OYW1lIiwiZnVuYyIsIm5hbWUiLCJ0b1N0cmluZyIsInN1YnN0cmluZyIsImxlbmd0aCIsImluZGV4T2YiLCJ0cmltIl0sIm1hcHBpbmdzIjoiOzs7UUFTZ0JBLGUsR0FBQUEsZTtBQVRoQjs7Ozs7Ozs7O0FBU08sU0FBU0EsZUFBVCxDQUF5QkMsSUFBekIsRUFBK0I7O0FBRWxDO0FBQ0EsTUFBSUMsT0FBT0QsS0FBS0UsUUFBTCxHQUFnQkMsU0FBaEIsQ0FBMEIsWUFBWUMsTUFBdEMsQ0FBWDtBQUNBSCxTQUFPQSxLQUFLRSxTQUFMLENBQWUsQ0FBZixFQUFrQkYsS0FBS0ksT0FBTCxDQUFhLEdBQWIsQ0FBbEIsQ0FBUDs7QUFFQTtBQUNBLFNBQVFKLFFBQVFBLEtBQUtLLElBQUwsRUFBVCxHQUF3QkwsSUFBeEIsR0FBK0IsV0FBdEM7QUFFSCIsImZpbGUiOiJ1dGlsaXR5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBHZXRzIHRoZSBmdW5jdGlvbiBuYW1lIG9mIHRoZSBzcGVjaWZpZWQgZnVuY3Rpb25cbiAqXG4gKiBAZnVuY3Rpb25cbiAqXG4gKiBAcGFyYW0gZnVuY1xuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRGdW5jdGlvbk5hbWUoZnVuYykge1xuXG4gICAgLy8gZ2V0IHRoZSBuYW1lIG9mIHRoZSBmdW5jdGlvblxuICAgIGxldCBuYW1lID0gZnVuYy50b1N0cmluZygpLnN1YnN0cmluZygnZnVuY3Rpb24gJy5sZW5ndGgpO1xuICAgIG5hbWUgPSBuYW1lLnN1YnN0cmluZygwLCBuYW1lLmluZGV4T2YoJygnKSk7XG5cbiAgICAvLyBpZiB0aGUgc3RyaW5nIGlzIG5vdCBlbXB0eVxuICAgIHJldHVybiAobmFtZSAmJiBuYW1lLnRyaW0oKSkgPyBuYW1lIDogJ2Fub255bW91cyc7XG5cbn1cbiJdfQ==

/***/ }),
/* 4 */
/***/ (function(module, exports) {

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
	//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnN0L2xvZ0xldmVsLmpzIl0sIm5hbWVzIjpbIkxvZ0xldmVsIl0sIm1hcHBpbmdzIjoiOzs7QUFBQTs7Ozs7OztBQU9BOzs7QUFHTyxJQUFNQSxzREFBVztBQUNwQixTQUFRLENBRFk7QUFFcEIsV0FBVSxHQUZVO0FBR3BCLFdBQVUsR0FIVTtBQUlwQixVQUFTLEdBSlc7QUFLcEIsVUFBUyxHQUxXO0FBTXBCLFdBQVUsR0FOVTtBQU9wQixXQUFVLEdBUFU7QUFRcEIsU0FBUTtBQVJZLENBQWpCIiwiZmlsZSI6ImNvbnN0L2xvZ0xldmVsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBsb2c0anMgPGh0dHBzOi8vZ2l0aHViLmNvbS9hbmlnZW5lcm8vbG9nNGpzPlxuICpcbiAqIENvcHlyaWdodCAyMDE2LXByZXNlbnQgUm9iaW4gU2NodWx0eiA8aHR0cDovL2FuaWdlbmVyby5jb20+XG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2VcbiAqL1xuXG4vKipcbiAqIEB0eXBlIHt7T0ZGOiBudW1iZXIsIEZBVEFMOiBudW1iZXIsIEVSUk9SOiBudW1iZXIsIFdBUk46IG51bWJlciwgSU5GTzogbnVtYmVyLCBERUJVRzogbnVtYmVyLCBUUkFDRTogbnVtYmVyLCBBTEw6IG51bWJlcn19XG4gKi9cbmV4cG9ydCBjb25zdCBMb2dMZXZlbCA9IHtcbiAgICAnT0ZGJyA6IDAsXG4gICAgJ0ZBVEFMJyA6IDEwMCxcbiAgICAnRVJST1InIDogMjAwLFxuICAgICdXQVJOJyA6IDMwMCxcbiAgICAnSU5GTycgOiA0MDAsXG4gICAgJ0RFQlVHJyA6IDUwMCxcbiAgICAnVFJBQ0UnIDogNjAwLFxuICAgICdBTEwnIDogMjE0NzQ4MzY0N1xufTtcbiJdfQ==

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

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

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
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
	    var timeout = runTimeout(cleanUpNextTick);
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
	    runClearTimeout(timeout);
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
	        runTimeout(drainQueue);
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


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';

	exports.__esModule = true;
	exports.LogAppender = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var /*istanbul ignore next*/_formatter = __webpack_require__(1);

	/*istanbul ignore next*/function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
	//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcGVuZGVyL2FwcGVuZGVyLmpzIl0sIm5hbWVzIjpbIkxvZ0FwcGVuZGVyIiwiaXNBY3RpdmUiLCJhcHBlbmQiLCJsb2dFdmVudCIsImdldExvZ0xldmVsIiwibG9nTGV2ZWwiLCJzZXRMb2dMZXZlbCIsInNldExheW91dCIsImxheW91dCIsImdldExheW91dCIsImZvcm1hdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOzs7O0lBRWFBLFcsV0FBQUEsVzs7Ozs7QUFVVDs7OzswQkFJQUMsUSx1QkFBVztBQUNQLGVBQU8sSUFBUDtBQUNILEs7O0FBRUQ7Ozs7OzswQkFJQUMsTSxtQkFBT0MsUSxFQUFVLENBRWhCO0FBREc7OztBQUdKOzs7Ozs7MEJBSUFDLFcsMEJBQWM7QUFDVixlQUFPLEtBQUtDLFFBQVo7QUFDSCxLOztBQUVEOzs7Ozs7MEJBSUFDLFcsd0JBQVlELFEsRUFBVTtBQUNsQixhQUFLQSxRQUFMLEdBQWdCQSxRQUFoQjtBQUNILEs7O0FBRUQ7Ozs7OzswQkFJQUUsUyxzQkFBVUMsTSxFQUFRO0FBQ2QsYUFBS0EsTUFBTCxHQUFjQSxNQUFkO0FBQ0gsSzs7QUFFRDs7Ozs7OzBCQUlBQyxTLHdCQUFZO0FBQ1IsZUFBTyxLQUFLRCxNQUFaO0FBQ0gsSzs7QUFFRDs7Ozs7OzBCQUlBRSxNLG1CQUFPUCxRLEVBQVU7QUFDYixlQUFPLGdEQUFPLEtBQUtNLFNBQUwsRUFBUCxFQUF5Qk4sUUFBekI7QUFBUDtBQUNILEs7Ozs7OztBQTlERDs7Ozs0QkFJa0I7QUFDZCxtQkFBTyxJQUFQO0FBQ0giLCJmaWxlIjoiYXBwZW5kZXIvYXBwZW5kZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2Zvcm1hdH0gZnJvbSAnLi4vZm9ybWF0dGVyJztcblxuZXhwb3J0IGNsYXNzIExvZ0FwcGVuZGVyIHtcblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIG5hbWUgb2YgdGhlIGFwcGVuZGVyIChlLmcuICdjb25zb2xlJylcbiAgICAgKiBAcmV0dXJucyB7bnVsbH1cbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IG5hbWUoKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgd2hldGhlciBvciBub3QgdGhlIGFwcGVuZGVyIGlzIGFjdGl2ZVxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqL1xuICAgIGlzQWN0aXZlKCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBcHBlbmRzIHRoZSBsb2dcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gbG9nRXZlbnRcbiAgICAgKi9cbiAgICBhcHBlbmQobG9nRXZlbnQpIHtcbiAgICAgICAgLy8gc3R1YlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIGN1cnJlbnQgbG9nIGxldmVsXG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKi9cbiAgICBnZXRMb2dMZXZlbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9nTGV2ZWw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgbG9nIGxldmVsIG9mIHRoZSBhcHBlbmRlclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsb2dMZXZlbFxuICAgICAqL1xuICAgIHNldExvZ0xldmVsKGxvZ0xldmVsKSB7XG4gICAgICAgIHRoaXMubG9nTGV2ZWwgPSBsb2dMZXZlbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBsYXlvdXQgb2YgdGhlIGFwcGVuZGVyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGxheW91dFxuICAgICAqL1xuICAgIHNldExheW91dChsYXlvdXQpIHtcbiAgICAgICAgdGhpcy5sYXlvdXQgPSBsYXlvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgbGF5b3V0IGFzc29jaWF0ZWQgd2l0aCB0aGUgYXBwZW5kZXJcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgIGdldExheW91dCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGF5b3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZvcm1hdHMgdGhlIGxvZyBldmVudCB1c2luZyB0aGUgbGF5b3V0IHByb3ZpZGVkXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGxvZ0V2ZW50XG4gICAgICovXG4gICAgZm9ybWF0KGxvZ0V2ZW50KSB7XG4gICAgICAgIHJldHVybiBmb3JtYXQodGhpcy5nZXRMYXlvdXQoKSwgbG9nRXZlbnQpO1xuICAgIH1cblxufVxuIl19

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

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

			var regex = /\{\}/g;
			for (var i = 0; i < args.length; i++) {

				if (i === 0) {
					loggingEvent.message = args[i];
				} else if (regex.exec(loggingEvent.message)) {
					loggingEvent.message = loggingEvent.message.replace(/\{\}/, args[i]);
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
	//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxvZ2dlci9sb2dnZXIuanMiXSwibmFtZXMiOlsiTG9nZ2VyIiwiTE9HX0VWRU5UIiwiY29udGV4dCIsImFwcGVuZGVyT2JqIiwiX2xvZ0NvbnRleHQiLCJfbG9nU2VxdWVuY2UiLCJfcmVsYXRpdmUiLCJEYXRlIiwiZ2V0VGltZSIsImVycm9yIiwiYXBwZW5kIiwiX2NvbnN0cnVjdExvZ0V2ZW50IiwiRVJST1IiLCJhcmd1bWVudHMiLCJ3YXJuIiwiV0FSTiIsImluZm8iLCJJTkZPIiwiZGVidWciLCJERUJVRyIsInRyYWNlIiwiVFJBQ0UiLCJsZXZlbCIsImFyZ3MiLCJsb2dUaW1lIiwiRXJyb3IiLCJlIiwibG9nZ2luZ0V2ZW50IiwiX2lzU3RyaWN0IiwiY2FsbGVlIiwiY2FsbGVyIiwidW5kZWZpbmVkIiwicmVnZXgiLCJpIiwibGVuZ3RoIiwibWVzc2FnZSIsImV4ZWMiLCJyZXBsYWNlIiwicHJvcGVydGllcyJdLCJtYXBwaW5ncyI6Ijs7O1FBa0JnQkEsTSxHQUFBQSxNOztBQVhoQjs7QUFFQTs7Ozs7OztBQU9BLElBQUlDLDBDQUFKLEMsQ0FoQkE7Ozs7Ozs7QUFrQk8sU0FBU0QsTUFBVCxDQUFnQkUsT0FBaEIsRUFBeUJDLFdBQXpCLEVBQXNDOztBQUV6QztBQUNBLEtBQUlDLGNBQWNGLE9BQWxCO0FBQ0E7QUFDQSxLQUFJRyxlQUFlLENBQW5CO0FBQ0g7QUFDQSxLQUFJQyxZQUFhLElBQUlDLElBQUosRUFBRCxDQUFhQyxPQUFiLEVBQWhCOztBQUVBOzs7Ozs7QUFNQSxNQUFLQyxLQUFMLEdBQWEsWUFBWTtBQUN4Qk4sY0FBWU8sTUFBWixDQUFtQkMsbUJBQW1CLDRDQUFTQyxLQUE1QixFQUFtQ0MsU0FBbkMsQ0FBbkI7QUFDQSxFQUZEOztBQUlBOzs7Ozs7QUFNQSxNQUFLQyxJQUFMLEdBQVksWUFBWTtBQUN2QlgsY0FBWU8sTUFBWixDQUFtQkMsbUJBQW1CLDRDQUFTSSxJQUE1QixFQUFrQ0YsU0FBbEMsQ0FBbkI7QUFDQSxFQUZEOztBQUlBOzs7Ozs7QUFNQSxNQUFLRyxJQUFMLEdBQVksWUFBWTtBQUN2QmIsY0FBWU8sTUFBWixDQUFtQkMsbUJBQW1CLDRDQUFTTSxJQUE1QixFQUFrQ0osU0FBbEMsQ0FBbkI7QUFDQSxFQUZEOztBQUlBOzs7Ozs7QUFNQSxNQUFLSyxLQUFMLEdBQWEsWUFBWTtBQUN4QmYsY0FBWU8sTUFBWixDQUFtQkMsbUJBQW1CLDRDQUFTUSxLQUE1QixFQUFtQ04sU0FBbkMsQ0FBbkI7QUFDQSxFQUZEOztBQUlBOzs7Ozs7QUFNQSxNQUFLTyxLQUFMLEdBQWEsWUFBWTtBQUN4QmpCLGNBQVlPLE1BQVosQ0FBbUJDLG1CQUFtQiw0Q0FBU1UsS0FBNUIsRUFBbUNSLFNBQW5DLENBQW5CO0FBQ0EsRUFGRDs7QUFJQTs7Ozs7Ozs7QUFRQSxVQUFTRixrQkFBVCxDQUE0QlcsS0FBNUIsRUFBbUNDLElBQW5DLEVBQXlDOztBQUV4QyxNQUFJQyxVQUFVLElBQUlqQixJQUFKLEVBQWQ7QUFDQSxNQUFJRSxRQUFRLElBQVo7O0FBRUE7QUFDQSxNQUFJO0FBQ0gsU0FBTSxJQUFJZ0IsS0FBSixFQUFOO0FBQ0EsR0FGRCxDQUVFLE9BQU9DLENBQVAsRUFBVTtBQUNYakIsV0FBUWlCLENBQVI7QUFDQTs7QUFFRCxNQUFJQyxlQUFlO0FBQ2xCLFdBQVNILE9BRFM7QUFFbEIsWUFBVSxJQUZRO0FBR2xCLG9CQUFrQmYsS0FIQTtBQUlsQixXQUFTLElBSlM7QUFLbEIsWUFBVWEsS0FMUTtBQU1sQixpQkFBZSxJQU5HO0FBT2xCLGFBQVdsQixXQVBPO0FBUWxCLGNBQVksRUFSTTtBQVNsQixhQUFXLENBQUN3QixXQUFELEdBQWVMLEtBQUtNLE1BQUwsQ0FBWUMsTUFBM0IsR0FBb0MsQ0FUN0I7QUFVbEIsaUJBQWVDLFNBVkc7QUFXbEIsZUFBYVAsUUFBUWhCLE9BQVIsS0FBb0JGLFNBWGY7QUFZbEIsZUFBYUQ7QUFaSyxHQUFuQjs7QUFlQSxNQUFJMkIsUUFBUSxPQUFaO0FBQ0EsT0FBSyxJQUFJQyxJQUFJLENBQWIsRUFBZ0JBLElBQUlWLEtBQUtXLE1BQXpCLEVBQWlDRCxHQUFqQyxFQUFzQzs7QUFFckMsT0FBSUEsTUFBTSxDQUFWLEVBQWE7QUFDWk4saUJBQWFRLE9BQWIsR0FBdUJaLEtBQUtVLENBQUwsQ0FBdkI7QUFDQSxJQUZELE1BRU8sSUFBSUQsTUFBTUksSUFBTixDQUFXVCxhQUFhUSxPQUF4QixDQUFKLEVBQXNDO0FBQzVDUixpQkFBYVEsT0FBYixHQUF1QlIsYUFBYVEsT0FBYixDQUFxQkUsT0FBckIsQ0FBNkIsTUFBN0IsRUFBcUNkLEtBQUtVLENBQUwsQ0FBckMsQ0FBdkI7QUFDQSxJQUZNLE1BRUEsSUFBSVYsS0FBS1UsQ0FBTCxhQUFtQlIsS0FBdkIsRUFBOEI7QUFDcENFLGlCQUFhbEIsS0FBYixHQUFxQmMsS0FBS1UsQ0FBTCxDQUFyQjtBQUNBLElBRk0sTUFFQTtBQUNOTixpQkFBYVcsVUFBYixHQUEwQmYsS0FBS1UsQ0FBTCxDQUExQjtBQUNBO0FBRUQ7O0FBRUQsU0FBT04sWUFBUDtBQUVBOztBQUVFOzs7Ozs7OztBQVFILEtBQUlDLFlBQVksU0FBWkEsU0FBWSxHQUFZO0FBQ3JCLFNBQU8sQ0FBQyxJQUFSO0FBQ0gsRUFGSjs7QUFJQSxRQUFPLElBQVA7QUFFQSIsImZpbGUiOiJsb2dnZXIvbG9nZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBsb2c0anMgPGh0dHBzOi8vZ2l0aHViLmNvbS9hbmlnZW5lcm8vbG9nNGpzPlxuICpcbiAqIENvcHlyaWdodCAyMDE2LXByZXNlbnQgUm9iaW4gU2NodWx0eiA8aHR0cDovL2FuaWdlbmVyby5jb20+XG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0xvZ0xldmVsfSBmcm9tICcuLi9jb25zdC9sb2dMZXZlbCc7XG5cbi8qKlxuICogSG9sZHMgdGhlIGRlZmluaXRpb24gZm9yIHRoZSBsb2cgZXZlbnQgb2JqZWN0XG4gKlxuICogQHR5cGVkZWYge3sgZGF0ZSA6IG51bWJlciwgZXJyb3IgOiBPYmplY3QsIGZpbGVuYW1lOiBzdHJpbmcsIGxpbmVOdW1iZXI6ID9zdHJpbmcsIGNvbHVtbjogP3N0cmluZyxcbiAqICAgICAgbG9nRXJyb3JTdGFjayA6IE9iamVjdCwgZmlsZSA6IFN0cmluZywgbGV2ZWwgOiBudW1iZXIsIGxvZ2dlciA6IHN0cmluZywgbWVzc2FnZSA6IHN0cmluZyxcbiAqICAgICAgbWV0aG9kIDogRnVuY3Rpb24sIHByb3BlcnRpZXMgOiBPYmplY3Q9LCByZWxhdGl2ZSA6IG51bWJlciwgc2VxdWVuY2UgOiBudW1iZXIgfX1cbiAqL1xubGV0IExPR19FVkVOVDtcblxuZXhwb3J0IGZ1bmN0aW9uIExvZ2dlcihjb250ZXh0LCBhcHBlbmRlck9iaikge1xuXG4gICAgLyoqIEB0eXBlIHtzdHJpbmd9ICovXG4gICAgbGV0IF9sb2dDb250ZXh0ID0gY29udGV4dDtcbiAgICAvKiogQHR5cGVvZiB7bnVtYmVyfSAqL1xuICAgIGxldCBfbG9nU2VxdWVuY2UgPSAxO1xuXHQvKiogQHR5cGVvZiB7bnVtYmVyfSAqL1xuXHRsZXQgX3JlbGF0aXZlID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKTtcblxuXHQvKipcblx0ICogTG9ncyBhbiBlcnJvciBldmVudFxuICAgICAqXG4gICAgICogQGZ1bmN0aW9uXG4gICAgICogQG1lbWJlck9mIExvZ2dlclxuXHQgKi9cblx0dGhpcy5lcnJvciA9IGZ1bmN0aW9uICgpIHtcblx0XHRhcHBlbmRlck9iai5hcHBlbmQoX2NvbnN0cnVjdExvZ0V2ZW50KExvZ0xldmVsLkVSUk9SLCBhcmd1bWVudHMpKTtcblx0fTtcblxuXHQvKipcblx0ICogTG9ncyBhIHdhcm5pbmdcbiAgICAgKlxuICAgICAqIEBmdW5jdGlvblxuICAgICAqIEBtZW1iZXJPZiBMb2dnZXJcblx0ICovXG5cdHRoaXMud2FybiA9IGZ1bmN0aW9uICgpIHtcblx0XHRhcHBlbmRlck9iai5hcHBlbmQoX2NvbnN0cnVjdExvZ0V2ZW50KExvZ0xldmVsLldBUk4sIGFyZ3VtZW50cykpO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBMb2dzIGFuIGluZm8gbGV2ZWwgZXZlbnRcbiAgICAgKlxuICAgICAqIEBmdW5jdGlvblxuICAgICAqIEBtZW1iZXJPZiBMb2dnZXJcblx0ICovXG5cdHRoaXMuaW5mbyA9IGZ1bmN0aW9uICgpIHtcblx0XHRhcHBlbmRlck9iai5hcHBlbmQoX2NvbnN0cnVjdExvZ0V2ZW50KExvZ0xldmVsLklORk8sIGFyZ3VtZW50cykpO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBMb2dzIGEgZGVidWcgZXZlbnRcbiAgICAgKlxuICAgICAqIEBmdW5jdGlvblxuICAgICAqIEBtZW1iZXJPZiBMb2dnZXJcblx0ICovXG5cdHRoaXMuZGVidWcgPSBmdW5jdGlvbiAoKSB7XG5cdFx0YXBwZW5kZXJPYmouYXBwZW5kKF9jb25zdHJ1Y3RMb2dFdmVudChMb2dMZXZlbC5ERUJVRywgYXJndW1lbnRzKSk7XG5cdH07XG5cblx0LyoqXG5cdCAqIExvZ3MgYSB0cmFjZSBldmVudFxuICAgICAqXG4gICAgICogQGZ1bmN0aW9uXG4gICAgICogQG1lbWJlck9mIExvZ2dlclxuXHQgKi9cblx0dGhpcy50cmFjZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRhcHBlbmRlck9iai5hcHBlbmQoX2NvbnN0cnVjdExvZ0V2ZW50KExvZ0xldmVsLlRSQUNFLCBhcmd1bWVudHMpKTtcblx0fTtcblxuXHQvKipcblx0ICogQGZ1bmN0aW9uXG5cdCAqXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBsZXZlbFxuXHQgKiBAcGFyYW0ge0FycmF5LjxPYmplY3Q+fSBhcmdzXG5cdCAqXG5cdCAqIEByZXR1cm4ge0xPR19FVkVOVH1cblx0ICovXG5cdGZ1bmN0aW9uIF9jb25zdHJ1Y3RMb2dFdmVudChsZXZlbCwgYXJncykge1xuXG5cdFx0bGV0IGxvZ1RpbWUgPSBuZXcgRGF0ZSgpO1xuXHRcdGxldCBlcnJvciA9IG51bGw7XG5cblx0XHQvLyB0aGlzIGxvb2tzIGhvcnJpYmxlLCBidXQgdGhpcyBpcyB0aGUgb25seSB3YXkgdG8gY2F0Y2ggdGhlIHN0YWNrIGZvciBJRSB0byBsYXRlciBwYXJzZSB0aGUgc3RhY2tcblx0XHR0cnkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCk7XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0ZXJyb3IgPSBlO1xuXHRcdH1cblxuXHRcdGxldCBsb2dnaW5nRXZlbnQgPSB7XG5cdFx0XHQnZGF0ZScgOiBsb2dUaW1lLFxuXHRcdFx0J2Vycm9yJyA6IG51bGwsXG5cdFx0XHQnbG9nRXJyb3JTdGFjaycgOiBlcnJvcixcblx0XHRcdCdmaWxlJyA6IG51bGwsXG5cdFx0XHQnbGV2ZWwnIDogbGV2ZWwsXG5cdFx0XHQnbGluZU51bWJlcicgOiBudWxsLFxuXHRcdFx0J2xvZ2dlcicgOiBfbG9nQ29udGV4dCxcblx0XHRcdCdtZXNzYWdlJyA6ICcnLFxuXHRcdFx0J21ldGhvZCcgOiAhX2lzU3RyaWN0KCkgPyBhcmdzLmNhbGxlZS5jYWxsZXIgOiAwLFxuXHRcdFx0J3Byb3BlcnRpZXMnIDogdW5kZWZpbmVkLFxuXHRcdFx0J3JlbGF0aXZlJyA6IGxvZ1RpbWUuZ2V0VGltZSgpIC0gX3JlbGF0aXZlLFxuXHRcdFx0J3NlcXVlbmNlJyA6IF9sb2dTZXF1ZW5jZSsrXG5cdFx0fTtcblxuXHRcdGxldCByZWdleCA9IC9cXHtcXH0vZztcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcblxuXHRcdFx0aWYgKGkgPT09IDApIHtcblx0XHRcdFx0bG9nZ2luZ0V2ZW50Lm1lc3NhZ2UgPSBhcmdzW2ldO1xuXHRcdFx0fSBlbHNlIGlmIChyZWdleC5leGVjKGxvZ2dpbmdFdmVudC5tZXNzYWdlKSkge1xuXHRcdFx0XHRsb2dnaW5nRXZlbnQubWVzc2FnZSA9IGxvZ2dpbmdFdmVudC5tZXNzYWdlLnJlcGxhY2UoL1xce1xcfS8sIGFyZ3NbaV0pO1xuXHRcdFx0fSBlbHNlIGlmIChhcmdzW2ldIGluc3RhbmNlb2YgRXJyb3IpIHtcblx0XHRcdFx0bG9nZ2luZ0V2ZW50LmVycm9yID0gYXJnc1tpXTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGxvZ2dpbmdFdmVudC5wcm9wZXJ0aWVzID0gYXJnc1tpXTtcblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdHJldHVybiBsb2dnaW5nRXZlbnQ7XG5cblx0fVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgc2NyaXB0IGlzIGluIHN0cmljdCBtb2RlXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBmdW5jdGlvblxuICAgICAqXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG5cdGxldCBfaXNTdHJpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAhdGhpcztcbiAgICB9O1xuXG5cdHJldHVybiB0aGlzO1xuXG59XG4iXX0=

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';

	exports.__esModule = true;
	exports.ConsoleAppender = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var /*istanbul ignore next*/_appender = __webpack_require__(7);

	var /*istanbul ignore next*/_logLevel = __webpack_require__(4);

	/*istanbul ignore next*/function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
	//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcGVuZGVyL2NvbnNvbGVBcHBlbmRlci5qcyJdLCJuYW1lcyI6WyJDb25zb2xlQXBwZW5kZXIiLCJhcHBlbmQiLCJsb2dFdmVudCIsImxldmVsIiwiZ2V0TG9nTGV2ZWwiLCJfYXBwZW5kVG9Db25zb2xlIiwibWVzc2FnZSIsImZvcm1hdCIsIkVSUk9SIiwiY29uc29sZSIsImVycm9yIiwiV0FSTiIsIndhcm4iLCJJTkZPIiwiaW5mbyIsIkRFQlVHIiwiVFJBQ0UiLCJpbmRleE9mIiwibG9nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBT0E7O0FBQ0E7Ozs7OzsrZUFSQTs7Ozs7OztJQVVhQSxlLFdBQUFBLGU7Ozs7Ozs7OztBQU1UOzs7OzJCQUlBQyxNLG1CQUFPQyxRLEVBQVU7QUFDYixNQUFJQSxTQUFTQyxLQUFULElBQWtCLEtBQUtDLFdBQUwsRUFBdEIsRUFBMEM7QUFDdEMsUUFBS0MsZ0JBQUwsQ0FBc0JILFFBQXRCO0FBQ0g7QUFDSixFOztBQUVKOzs7Ozs7OzsyQkFNQUcsZ0IsNkJBQWlCSCxRLEVBQVU7O0FBRTFCLE1BQUlJLFVBQVUsS0FBS0MsTUFBTCxDQUFZTCxRQUFaLENBQWQ7O0FBRUEsTUFBSUEsU0FBU0MsS0FBVCxJQUFrQiwyQ0FBU0ssS0FBL0IsRUFBc0M7QUFDckNDLFdBQVFDLEtBQVIsQ0FBY0osT0FBZDtBQUNBLEdBRkQsTUFFTyxJQUFJSixTQUFTQyxLQUFULElBQWtCLDJDQUFTUSxJQUEvQixFQUFxQztBQUMzQ0YsV0FBUUcsSUFBUixDQUFhTixPQUFiO0FBQ0EsR0FGTSxNQUVBLElBQUlKLFNBQVNDLEtBQVQsSUFBa0IsMkNBQVNVLElBQS9CLEVBQXFDO0FBQzNDSixXQUFRSyxJQUFSLENBQWFSLE9BQWI7QUFDQSxHQUZNLE1BRUEsSUFBSSxDQUFDLDJDQUFTUyxLQUFWLEVBQWlCLDJDQUFTQyxLQUExQixFQUFpQ0MsT0FBakMsQ0FBeUNmLFNBQVNDLEtBQWxELElBQTJELENBQUMsQ0FBaEUsRUFBbUU7QUFDekVNLFdBQVFTLEdBQVIsQ0FBWVosT0FBWjtBQUNBO0FBRUQsRTs7OztzQkFsQ29CO0FBQ2QsVUFBTyxTQUFQO0FBQ0giLCJmaWxlIjoiYXBwZW5kZXIvY29uc29sZUFwcGVuZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBsb2c0anMgPGh0dHBzOi8vZ2l0aHViLmNvbS9hbmlnZW5lcm8vbG9nNGpzPlxuICpcbiAqIENvcHlyaWdodCAyMDE2LXByZXNlbnQgUm9iaW4gU2NodWx0eiA8aHR0cDovL2FuaWdlbmVyby5jb20+XG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0xvZ0FwcGVuZGVyfSBmcm9tICcuL2FwcGVuZGVyJztcbmltcG9ydCB7TG9nTGV2ZWx9IGZyb20gJy4uL2NvbnN0L2xvZ0xldmVsJztcblxuZXhwb3J0IGNsYXNzIENvbnNvbGVBcHBlbmRlciBleHRlbmRzIExvZ0FwcGVuZGVyIHtcblxuICAgIHN0YXRpYyBnZXQgbmFtZSgpIHtcbiAgICAgICAgcmV0dXJuICdjb25zb2xlJztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBcHBlbmRzIHRoZSBsb2cgZXZlbnRcbiAgICAgKiBAcGFyYW0gbG9nRXZlbnRcbiAgICAgKi9cbiAgICBhcHBlbmQobG9nRXZlbnQpIHtcbiAgICAgICAgaWYgKGxvZ0V2ZW50LmxldmVsIDw9IHRoaXMuZ2V0TG9nTGV2ZWwoKSkge1xuICAgICAgICAgICAgdGhpcy5fYXBwZW5kVG9Db25zb2xlKGxvZ0V2ZW50KTtcbiAgICAgICAgfVxuICAgIH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogQGZ1bmN0aW9uXG5cdCAqXG5cdCAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dFdmVudFxuXHQgKi9cblx0X2FwcGVuZFRvQ29uc29sZShsb2dFdmVudCkge1xuXG5cdFx0bGV0IG1lc3NhZ2UgPSB0aGlzLmZvcm1hdChsb2dFdmVudCk7XG5cblx0XHRpZiAobG9nRXZlbnQubGV2ZWwgPT0gTG9nTGV2ZWwuRVJST1IpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IobWVzc2FnZSk7XG5cdFx0fSBlbHNlIGlmIChsb2dFdmVudC5sZXZlbCA9PSBMb2dMZXZlbC5XQVJOKSB7XG5cdFx0XHRjb25zb2xlLndhcm4obWVzc2FnZSk7XG5cdFx0fSBlbHNlIGlmIChsb2dFdmVudC5sZXZlbCA9PSBMb2dMZXZlbC5JTkZPKSB7XG5cdFx0XHRjb25zb2xlLmluZm8obWVzc2FnZSk7XG5cdFx0fSBlbHNlIGlmIChbTG9nTGV2ZWwuREVCVUcsIExvZ0xldmVsLlRSQUNFXS5pbmRleE9mKGxvZ0V2ZW50LmxldmVsKSA+IC0xKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhtZXNzYWdlKTtcblx0XHR9XG5cblx0fVxuXG59XG4iXX0=

/***/ })
/******/ ])
});
;