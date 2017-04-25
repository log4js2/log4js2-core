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

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.LogAppender = exports.LogLevel = undefined;
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

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.preCompile = preCompile;
	/*istanbul ignore next*/exports.format = format;

	var /*istanbul ignore next*/_dateFormatter = __webpack_require__(2);

	var /*istanbul ignore next*/_utility = __webpack_require__(3);

	/*istanbul ignore next*/var utility = _interopRequireWildcard(_utility);

	var /*istanbul ignore next*/_logLevel = __webpack_require__(4);

	/*istanbul ignore next*/function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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
	        message += `\t${stack}\n`;
	      });
	    } else if (logEvent.error.message != null && logEvent.error.message != '') {
	      message += `\t${logEvent.error.name}: ${logEvent.error.message}\n`;
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

	  return `${logEvent.lineNumber}`;
	};

	/**
	 * @function
	 * @memberOf formatter
	 *
	 * @param {LOG_EVENT} logEvent
	 *
	 * @return {string}
	 */
	let _formatColumn = function (logEvent) {

	  if (!logEvent.column) {
	    _getFileDetails(logEvent);
	  }

	  return `${logEvent.column}`;
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
	let _formatSequenceNumber = function (logEvent) {
	  return '' + logEvent.sequence;
	};

	let _formatters = {
	  'c|logger': _formatLogger,
	  'd|date': _formatDate,
	  'ex|exception|throwable': _formatException,
	  'F|file': _formatFile,
	  'K|map|MAP': _formatMapMessage,
	  'L|line': _formatLineNumber,
	  'column': _formatColumn,
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
	 * Determines what formatter function has been configured
	 *
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
	      if (!fileParts[0].startsWith(appDir)) {
	        appDir = '';
	      }
	      logEvent.filename = fileParts.join(':').replace(appDir, '').replace(/^(\\|\/)/, '');
	    } else {
	      logEvent.filename = fileParts.join(':');
	    }
	  } else {

	    logEvent.column = '?';
	    logEvent.filename = 'anonymous';
	    logEvent.lineNumber = '?';
	  }
	  logEvent.file = logEvent.filename;
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
	//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZvcm1hdHRlci5qcyJdLCJuYW1lcyI6WyJwcmVDb21waWxlIiwiZm9ybWF0IiwidXRpbGl0eSIsIl9DT01NQU5EX1JFR0VYIiwiX2NvbXBpbGVkTGF5b3V0cyIsIl9mb3JtYXRMb2dnZXIiLCJsb2dFdmVudCIsImxvZ2dlciIsIl9mb3JtYXREYXRlIiwicGFyYW1zIiwiZGF0ZSIsIl9mb3JtYXRFeGNlcHRpb24iLCJtZXNzYWdlIiwiZXJyb3IiLCJzdGFjayIsInVuZGVmaW5lZCIsInN0YWNrcyIsInNwbGl0IiwiZm9yRWFjaCIsIm5hbWUiLCJfZm9ybWF0RmlsZSIsImZpbGUiLCJfZ2V0RmlsZURldGFpbHMiLCJfZm9ybWF0TGluZU51bWJlciIsImxpbmVOdW1iZXIiLCJfZm9ybWF0Q29sdW1uIiwiY29sdW1uIiwiX2Zvcm1hdE1hcE1lc3NhZ2UiLCJwcm9wZXJ0aWVzIiwia2V5IiwicHVzaCIsImpvaW4iLCJfZm9ybWF0TG9nTWVzc2FnZSIsIl9mb3JtYXRNZXRob2ROYW1lIiwiZ2V0RnVuY3Rpb25OYW1lIiwibWV0aG9kIiwiX2Zvcm1hdExpbmVTZXBhcmF0b3IiLCJfZm9ybWF0TGV2ZWwiLCJsZXZlbCIsIkZBVEFMIiwiRVJST1IiLCJXQVJOIiwiSU5GTyIsIkRFQlVHIiwiVFJBQ0UiLCJfZm9ybWF0UmVsYXRpdmUiLCJyZWxhdGl2ZSIsIl9mb3JtYXRTZXF1ZW5jZU51bWJlciIsInNlcXVlbmNlIiwiX2Zvcm1hdHRlcnMiLCJfZ2V0Q29tcGlsZWRMYXlvdXQiLCJsYXlvdXQiLCJfY29tcGlsZUxheW91dCIsImluZGV4IiwiaW5kZXhPZiIsImN1cnJlbnRGb3JtYXRTdHJpbmciLCJmb3JtYXRBcnJheSIsInN1YnN0cmluZyIsInN0YXJ0SW5kZXgiLCJlbmRJbmRleCIsIl9nZXRGb3JtYXR0ZXJPYmplY3QiLCJmb3JtYXRTdHJpbmciLCJyZXN1bHQiLCJleGVjIiwibGVuZ3RoIiwiZm9ybWF0dGVyIiwiX2dldEZvcm1hdHRlckZ1bmN0aW9uIiwiX2dldExheW91dFRhZ1BhcmFtcyIsImFmdGVyIiwibGFzdEluZGV4T2YiLCJjb21tYW5kIiwicmVnZXgiLCJoYXNPd25Qcm9wZXJ0eSIsIlJlZ0V4cCIsIm1hdGNoIiwiaSIsIl9mb3JtYXRMb2dFdmVudCIsInJlc3BvbnNlIiwiY291bnQiLCJPYmplY3QiLCJ0cmltIiwibG9nRXJyb3JTdGFjayIsInBhcnRzIiwicmVwbGFjZSIsImxvY2F0aW9uIiwiaG9zdCIsImZpbGVQYXJ0cyIsInBvcCIsImRlZmluZSIsInBhdGgiLCJyZXF1aXJlIiwiYXBwRGlyIiwiZGlybmFtZSIsIm1haW4iLCJmaWxlbmFtZSIsInN0YXJ0c1dpdGgiXSwibWFwcGluZ3MiOiI7Ozs7O1FBdWZnQkEsVSxHQUFBQSxVO2dDQWFBQyxNLEdBQUFBLE07O0FBN2ZoQjs7QUFDQTs7NEJBQVlDLE87O0FBQ1o7Ozs7QUFFQTtBQUNBLE1BQU1DLGlCQUFpQixzQkFBdkI7O0FBRUE7QUFkQTs7Ozs7OztBQWVBLElBQUlDLG1CQUFtQixFQUF2Qjs7QUFFQTs7Ozs7Ozs7QUFRQSxJQUFJQyxnQkFBZ0IsVUFBVUMsUUFBVixFQUFvQjtBQUN2QyxTQUFPQSxTQUFTQyxNQUFoQjtBQUNBLENBRkQ7O0FBSUE7Ozs7Ozs7OztBQVNBLElBQUlDLGNBQWMsVUFBVUYsUUFBVixFQUFvQkcsTUFBcEIsRUFBNEI7QUFDN0MsU0FBTyx3REFBV0gsU0FBU0ksSUFBcEIsRUFBMEJELE9BQU8sQ0FBUCxDQUExQjtBQUFQO0FBQ0EsQ0FGRDs7QUFJQTs7Ozs7Ozs7QUFRQSxJQUFJRSxtQkFBbUIsVUFBVUwsUUFBVixFQUFvQjs7QUFFdkMsTUFBSU0sVUFBVSxFQUFkOztBQUVBLE1BQUlOLFNBQVNPLEtBQVQsSUFBa0IsSUFBdEIsRUFBNEI7O0FBRTlCLFFBQUlQLFNBQVNPLEtBQVQsQ0FBZUMsS0FBZixJQUF3QkMsU0FBNUIsRUFBdUM7QUFDdEMsVUFBSUMsU0FBU1YsU0FBU08sS0FBVCxDQUFlQyxLQUFmLENBQXFCRyxLQUFyQixDQUEyQixLQUEzQixDQUFiO0FB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QUE1QyxDQUFQO0FBQ0EiLCJmaWxlIjoiZm9ybWF0dGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBsb2c0anMgPGh0dHBzOi8vZ2l0aHViLmNvbS9hbmlnZW5lcm8vbG9nNGpzPlxuICpcbiAqIENvcHlyaWdodCAyMDE2LXByZXNlbnQgUm9iaW4gU2NodWx0eiA8aHR0cDovL2FuaWdlbmVyby5jb20+XG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2RhdGVGb3JtYXR9IGZyb20gJy4vZGF0ZUZvcm1hdHRlcic7XG5pbXBvcnQgKiBhcyB1dGlsaXR5IGZyb20gJy4vdXRpbGl0eSc7XG5pbXBvcnQge0xvZ0xldmVsfSBmcm9tICcuL2NvbnN0L2xvZ0xldmVsJztcblxuLyoqIEBjb25zdCAqL1xuY29uc3QgX0NPTU1BTkRfUkVHRVggPSAvJShbYS16LEEtWl0rKSg/PVxce3wpLztcblxuLyoqIEB0eXBlIHtPYmplY3R9ICovXG5sZXQgX2NvbXBpbGVkTGF5b3V0cyA9IHt9O1xuXG4vKipcbiAqIEBmdW5jdGlvblxuICogQG1lbWJlck9mIGZvcm1hdHRlclxuICpcbiAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dFdmVudFxuICpcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xubGV0IF9mb3JtYXRMb2dnZXIgPSBmdW5jdGlvbiAobG9nRXZlbnQpIHtcblx0cmV0dXJuIGxvZ0V2ZW50LmxvZ2dlcjtcbn07XG5cbi8qKlxuICogQGZ1bmN0aW9uXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXG4gKlxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XG4gKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSBwYXJhbXNcbiAqXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmxldCBfZm9ybWF0RGF0ZSA9IGZ1bmN0aW9uIChsb2dFdmVudCwgcGFyYW1zKSB7XG5cdHJldHVybiBkYXRlRm9ybWF0KGxvZ0V2ZW50LmRhdGUsIHBhcmFtc1swXSk7XG59O1xuXG4vKipcbiAqIEBmdW5jdGlvblxuICogQG1lbWJlck9mIGZvcm1hdHRlclxuICpcbiAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dFdmVudFxuICpcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xubGV0IF9mb3JtYXRFeGNlcHRpb24gPSBmdW5jdGlvbiAobG9nRXZlbnQpIHtcblxuICAgIGxldCBtZXNzYWdlID0gJyc7XG5cbiAgICBpZiAobG9nRXZlbnQuZXJyb3IgIT0gbnVsbCkge1xuXG5cdFx0aWYgKGxvZ0V2ZW50LmVycm9yLnN0YWNrICE9IHVuZGVmaW5lZCkge1xuXHRcdFx0bGV0IHN0YWNrcyA9IGxvZ0V2ZW50LmVycm9yLnN0YWNrLnNwbGl0KC9cXG4vZyk7XG4gICAgICAgICAgICBzdGFja3MuZm9yRWFjaChmdW5jdGlvbiAoc3RhY2spIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlICs9IGBcXHQke3N0YWNrfVxcbmA7XG4gICAgICAgICAgICB9KTtcblx0XHR9IGVsc2UgaWYgKGxvZ0V2ZW50LmVycm9yLm1lc3NhZ2UgIT0gbnVsbCAmJiBsb2dFdmVudC5lcnJvci5tZXNzYWdlICE9ICcnKSB7XG5cdFx0XHRtZXNzYWdlICs9IGBcXHQke2xvZ0V2ZW50LmVycm9yLm5hbWV9OiAke2xvZ0V2ZW50LmVycm9yLm1lc3NhZ2V9XFxuYDtcblx0XHR9XG5cblx0fVxuXG5cdHJldHVybiBtZXNzYWdlO1xuXG59O1xuXG4vKipcbiAqIEZvcm1hdHMgdGhlIGZpbGUgKGUuZy4gdGVzdC5qcykgdG8gdGhlIGZpbGVcbiAqXG4gKiBAcHJpdmF0ZVxuICogQGZ1bmN0aW9uXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXG4gKlxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XG4gKi9cbmxldCBfZm9ybWF0RmlsZSA9IGZ1bmN0aW9uIChsb2dFdmVudCkge1xuXG4gICAgaWYgKCFsb2dFdmVudC5maWxlKSB7XG5cdFx0X2dldEZpbGVEZXRhaWxzKGxvZ0V2ZW50KTtcblx0fVxuXG5cdHJldHVybiBsb2dFdmVudC5maWxlO1xuXG59O1xuXG4vKipcbiAqIEBmdW5jdGlvblxuICogQG1lbWJlck9mIGZvcm1hdHRlclxuICpcbiAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dFdmVudFxuICpcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xubGV0IF9mb3JtYXRMaW5lTnVtYmVyID0gZnVuY3Rpb24gKGxvZ0V2ZW50KSB7XG5cbiAgICBpZiAoIWxvZ0V2ZW50LmxpbmVOdW1iZXIpIHtcblx0XHRfZ2V0RmlsZURldGFpbHMobG9nRXZlbnQpO1xuXHR9XG5cblx0cmV0dXJuIGAke2xvZ0V2ZW50LmxpbmVOdW1iZXJ9YDtcblxufTtcblxuLyoqXG4gKiBAZnVuY3Rpb25cbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcbiAqXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcbiAqXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmxldCBfZm9ybWF0Q29sdW1uID0gZnVuY3Rpb24gKGxvZ0V2ZW50KSB7XG5cbiAgICBpZiAoIWxvZ0V2ZW50LmNvbHVtbikge1xuXHRcdF9nZXRGaWxlRGV0YWlscyhsb2dFdmVudCk7XG5cdH1cblxuXHRyZXR1cm4gYCR7bG9nRXZlbnQuY29sdW1ufWA7XG5cbn07XG5cbi8qKlxuICogQGZ1bmN0aW9uXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXG4gKlxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XG4gKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSBwYXJhbXNcbiAqXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmxldCBfZm9ybWF0TWFwTWVzc2FnZSA9IGZ1bmN0aW9uIChsb2dFdmVudCwgcGFyYW1zKSB7XG5cdGxldCBtZXNzYWdlID0gbnVsbDtcblx0aWYgKGxvZ0V2ZW50LnByb3BlcnRpZXMpIHtcblxuXHRcdG1lc3NhZ2UgPSBbXTtcblx0XHRmb3IgKGxldCBrZXkgaW4gbG9nRXZlbnQucHJvcGVydGllcykge1xuXHRcdFx0aWYgKHBhcmFtc1swXSkge1xuXHRcdFx0XHRpZiAocGFyYW1zWzBdID09IGtleSkge1xuXHRcdFx0XHRcdG1lc3NhZ2UucHVzaChsb2dFdmVudC5wcm9wZXJ0aWVzW2tleV0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRtZXNzYWdlLnB1c2goJ3snICsga2V5ICsgJywnICsgbG9nRXZlbnQucHJvcGVydGllc1trZXldICsgJ30nKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gJ3snICsgbWVzc2FnZS5qb2luKCcsJykgKyAnfSc7XG5cblx0fVxuXHRyZXR1cm4gbWVzc2FnZTtcbn07XG5cbi8qKlxuICogQGZ1bmN0aW9uXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXG4gKlxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XG4gKlxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5sZXQgX2Zvcm1hdExvZ01lc3NhZ2UgPSBmdW5jdGlvbiAobG9nRXZlbnQpIHtcblx0cmV0dXJuIGxvZ0V2ZW50Lm1lc3NhZ2U7XG59O1xuXG4vKipcbiAqIEBmdW5jdGlvblxuICogQG1lbWJlck9mIGZvcm1hdHRlclxuICpcbiAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dFdmVudFxuICpcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xubGV0IF9mb3JtYXRNZXRob2ROYW1lID0gZnVuY3Rpb24gKGxvZ0V2ZW50KSB7XG5cdHJldHVybiB1dGlsaXR5LmdldEZ1bmN0aW9uTmFtZShsb2dFdmVudC5tZXRob2QpO1xufTtcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogQGZ1bmN0aW9uXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXG4gKi9cbmxldCBfZm9ybWF0TGluZVNlcGFyYXRvciA9IGZ1bmN0aW9uICgpIHtcblx0cmV0dXJuICdcXG4nO1xufTtcblxuLyoqXG4gKiBAZnVuY3Rpb25cbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcbiAqXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcbiAqXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmxldCBfZm9ybWF0TGV2ZWwgPSBmdW5jdGlvbiAobG9nRXZlbnQpIHtcblxuICAgIHN3aXRjaCAobG9nRXZlbnQubGV2ZWwpIHtcblxuICAgICAgICBjYXNlIExvZ0xldmVsLkZBVEFMOlxuICAgICAgICAgICAgcmV0dXJuICdGQVRBTCc7XG4gICAgICAgIGNhc2UgTG9nTGV2ZWwuRVJST1I6XG4gICAgICAgICAgICByZXR1cm4gJ0VSUk9SJztcbiAgICAgICAgY2FzZSBMb2dMZXZlbC5XQVJOOlxuICAgICAgICAgICAgcmV0dXJuICdXQVJOJztcbiAgICAgICAgY2FzZSBMb2dMZXZlbC5JTkZPOlxuICAgICAgICAgICAgcmV0dXJuICdJTkZPJztcbiAgICAgICAgY2FzZSBMb2dMZXZlbC5ERUJVRzpcbiAgICAgICAgICAgIHJldHVybiAnREVCVUcnO1xuICAgICAgICBjYXNlIExvZ0xldmVsLlRSQUNFOlxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuICdUUkFDRSc7XG5cbiAgICB9XG5cbn07XG5cbi8qKlxuICogQGZ1bmN0aW9uXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXG4gKlxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XG4gKlxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5sZXQgX2Zvcm1hdFJlbGF0aXZlID0gZnVuY3Rpb24gKGxvZ0V2ZW50KSB7XG5cdHJldHVybiAnJyArIGxvZ0V2ZW50LnJlbGF0aXZlO1xufTtcblxuLyoqXG4gKiBAZnVuY3Rpb25cbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcbiAqXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcbiAqXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmxldCBfZm9ybWF0U2VxdWVuY2VOdW1iZXIgPSBmdW5jdGlvbiAobG9nRXZlbnQpIHtcblx0cmV0dXJuICcnICsgbG9nRXZlbnQuc2VxdWVuY2U7XG59O1xuXG5sZXQgX2Zvcm1hdHRlcnMgPSB7XG5cdCdjfGxvZ2dlcicgOiBfZm9ybWF0TG9nZ2VyLFxuXHQnZHxkYXRlJyA6IF9mb3JtYXREYXRlLFxuXHQnZXh8ZXhjZXB0aW9ufHRocm93YWJsZScgOiBfZm9ybWF0RXhjZXB0aW9uLFxuXHQnRnxmaWxlJyA6IF9mb3JtYXRGaWxlLFxuXHQnS3xtYXB8TUFQJyA6IF9mb3JtYXRNYXBNZXNzYWdlLFxuXHQnTHxsaW5lJyA6IF9mb3JtYXRMaW5lTnVtYmVyLFxuXHQnY29sdW1uJyA6IF9mb3JtYXRDb2x1bW4sXG5cdCdtfG1zZ3xtZXNzYWdlJyA6IF9mb3JtYXRMb2dNZXNzYWdlLFxuXHQnTXxtZXRob2QnIDogX2Zvcm1hdE1ldGhvZE5hbWUsXG5cdCduJyA6IF9mb3JtYXRMaW5lU2VwYXJhdG9yLFxuXHQncHxsZXZlbCcgOiBfZm9ybWF0TGV2ZWwsXG5cdCdyfHJlbGF0aXZlJyA6IF9mb3JtYXRSZWxhdGl2ZSxcblx0J3NufHNlcXVlbmNlTnVtYmVyJyA6IF9mb3JtYXRTZXF1ZW5jZU51bWJlclxufTtcblxuLyoqXG4gKiBHZXQgdGhlIGNvbXBpbGVkIGxheW91dCBmb3IgdGhlIHNwZWNpZmllZCBsYXlvdXQgc3RyaW5nLiBJZiB0aGUgY29tcGlsZWQgbGF5b3V0IGRvZXMgbm90XG4gKiBleGlzdCwgdGhlbiB3ZSB3YW50IHRvIGNyZWF0ZSBpdC5cbiAqXG4gKiBAZnVuY3Rpb25cbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbGF5b3V0XG4gKlxuICogQHJldHVybiB7QXJyYXkuPHN0cmluZ3xmdW5jdGlvbj59XG4gKi9cbmxldCBfZ2V0Q29tcGlsZWRMYXlvdXQgPSBmdW5jdGlvbiAobGF5b3V0KSB7XG5cblx0aWYgKF9jb21waWxlZExheW91dHNbbGF5b3V0XSkge1xuXHRcdHJldHVybiBfY29tcGlsZWRMYXlvdXRzW2xheW91dF07XG5cdH1cblxuXHRyZXR1cm4gX2NvbXBpbGVMYXlvdXQobGF5b3V0KTtcblxufTtcblxuLyoqXG4gKiBDb21waWxlcyBhIGxheW91dCBpbnRvIGFuIGFycmF5LiBUaGUgYXJyYXkgY29udGFpbnMgZnVuY3Rpb25zXG4gKlxuICogQGZ1bmN0aW9uXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGxheW91dFxuICpcbiAqIEByZXR1cm4ge0FycmF5LjxzdHJpbmd8ZnVuY3Rpb24+fVxuICovXG5sZXQgX2NvbXBpbGVMYXlvdXQgPSBmdW5jdGlvbiAobGF5b3V0KSB7XG5cblx0bGV0IGluZGV4ID0gbGF5b3V0LmluZGV4T2YoJyUnKTtcblx0bGV0IGN1cnJlbnRGb3JtYXRTdHJpbmcgPSAnJztcblx0bGV0IGZvcm1hdEFycmF5ID0gW107XG5cblx0aWYgKGluZGV4ICE9IDApIHtcblx0XHRmb3JtYXRBcnJheS5wdXNoKGxheW91dC5zdWJzdHJpbmcoMCwgaW5kZXgpKTtcblx0fVxuXG5cdGRvIHtcblxuXHRcdGxldCBzdGFydEluZGV4ID0gaW5kZXg7XG5cdFx0bGV0IGVuZEluZGV4ID0gaW5kZXggPSBsYXlvdXQuaW5kZXhPZignJScsIGluZGV4ICsgMSk7XG5cblx0XHRpZiAoZW5kSW5kZXggPCAwKSB7XG5cdFx0XHRjdXJyZW50Rm9ybWF0U3RyaW5nID0gbGF5b3V0LnN1YnN0cmluZyhzdGFydEluZGV4KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y3VycmVudEZvcm1hdFN0cmluZyA9IGxheW91dC5zdWJzdHJpbmcoc3RhcnRJbmRleCwgZW5kSW5kZXgpO1xuXHRcdH1cblxuXHRcdGZvcm1hdEFycmF5LnB1c2goX2dldEZvcm1hdHRlck9iamVjdChjdXJyZW50Rm9ybWF0U3RyaW5nKSk7XG5cblx0fSB3aGlsZSAoaW5kZXggPiAtMSk7XG5cbiAgICAvLyBzZXQgdGhlIGZvcm1hdCBhcnJheSB0byB0aGUgc3BlY2lmaWVkIGNvbXBpbGVkIGxheW91dFxuXHRfY29tcGlsZWRMYXlvdXRzW2xheW91dF0gPSBmb3JtYXRBcnJheTtcblxuXHRyZXR1cm4gZm9ybWF0QXJyYXk7XG5cbn07XG5cbi8qKlxuICogQGZ1bmN0aW9uXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGZvcm1hdFN0cmluZ1xuICpcbiAqIEByZXR1cm4ge09iamVjdHxzdHJpbmd9XG4gKi9cbmxldCBfZ2V0Rm9ybWF0dGVyT2JqZWN0ID0gZnVuY3Rpb24gKGZvcm1hdFN0cmluZykge1xuXG5cdGxldCByZXN1bHQgPSBfQ09NTUFORF9SRUdFWC5leGVjKGZvcm1hdFN0cmluZyk7XG5cdGlmIChyZXN1bHQgIT0gbnVsbCAmJiByZXN1bHQubGVuZ3RoID09IDIpIHtcblxuXHRcdGxldCBmb3JtYXR0ZXIgPSBfZ2V0Rm9ybWF0dGVyRnVuY3Rpb24ocmVzdWx0WzFdKTtcblx0XHRpZiAoIWZvcm1hdHRlcikge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXG5cdFx0bGV0IHBhcmFtcyA9IF9nZXRMYXlvdXRUYWdQYXJhbXMoZm9ybWF0U3RyaW5nKTtcblxuXHRcdGxldCBhZnRlciA9ICcnO1xuXHRcdGxldCBlbmRJbmRleCA9IGZvcm1hdFN0cmluZy5sYXN0SW5kZXhPZignfScpO1xuXHRcdGlmIChlbmRJbmRleCAhPSAtMSkge1xuXHRcdFx0YWZ0ZXIgPSBmb3JtYXRTdHJpbmcuc3Vic3RyaW5nKGVuZEluZGV4ICsgMSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGFmdGVyID0gZm9ybWF0U3RyaW5nLnN1YnN0cmluZyhyZXN1bHQuaW5kZXggKyByZXN1bHRbMV0ubGVuZ3RoICsgMSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdCdmb3JtYXR0ZXInIDogZm9ybWF0dGVyLFxuXHRcdFx0J3BhcmFtcycgOiBwYXJhbXMsXG5cdFx0XHQnYWZ0ZXInIDogYWZ0ZXJcblx0XHR9O1xuXG5cdH1cblxuXHRyZXR1cm4gZm9ybWF0U3RyaW5nO1xuXG59O1xuXG4vKipcbiAqIERldGVybWluZXMgd2hhdCBmb3JtYXR0ZXIgZnVuY3Rpb24gaGFzIGJlZW4gY29uZmlndXJlZFxuICpcbiAqIEBmdW5jdGlvblxuICogQG1lbWJlck9mIGZvcm1hdHRlclxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb21tYW5kXG4gKlxuICogQHJldHVybiB7P3N0cmluZ31cbiAqL1xubGV0IF9nZXRGb3JtYXR0ZXJGdW5jdGlvbiA9IGZ1bmN0aW9uIChjb21tYW5kKSB7XG5cblx0bGV0IHJlZ2V4O1xuXHRmb3IgKGxldCBrZXkgaW4gX2Zvcm1hdHRlcnMpIHtcbiAgICAgICAgaWYgKF9mb3JtYXR0ZXJzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIHJlZ2V4ID0gbmV3IFJlZ0V4cCgnXignICsga2V5ICsgJykkJyk7XG4gICAgICAgICAgICBpZiAocmVnZXguZXhlYyhjb21tYW5kKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfZm9ybWF0dGVyc1trZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cdH1cblxuXHRyZXR1cm4gbnVsbDtcblxufTtcblxuLyoqXG4gKiBHZXRzIHRoZSBsYXlvdXQgdGFnIHBhcmFtcyBhc3NvY2lhdGVkIHdpdGggdGhlIGxheW91dCB0YWcuIFNvLCBmb3IgZXhhbXBsZSwgJyVke3l5eXktTU0tZGR9YFxuICogd291bGQgb3V0cHV0IGFuIGFycmF5IG9mIFsneXl5eS1NTS1kZCddXG4gKlxuICogQHByaXZhdGVcbiAqIEBmdW5jdGlvblxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb21tYW5kXG4gKlxuICogQHJldHVybiB7QXJyYXkuPHN0cmluZz59XG4gKi9cbmxldCBfZ2V0TGF5b3V0VGFnUGFyYW1zID0gZnVuY3Rpb24gKGNvbW1hbmQpIHtcblxuXHRsZXQgcGFyYW1zID0gW107XG5cdGxldCByZXN1bHQgPSBjb21tYW5kLm1hdGNoKC9cXHsoW159XSopKD89fSkvZyk7XG5cdGlmIChyZXN1bHQgIT0gbnVsbCkge1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcmVzdWx0Lmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRwYXJhbXMucHVzaChyZXN1bHRbaV0uc3Vic3RyaW5nKDEpKTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gcGFyYW1zO1xuXG59O1xuXG4vKipcbiAqIEhhbmRsZXMgZm9ybWF0dGluZyB0aGUgbG9nIGV2ZW50IHVzaW5nIHRoZSBzcGVjaWZpZWQgZm9ybWF0dGVyIGFycmF5XG4gKlxuICogQHByaXZhdGVcbiAqIEBmdW5jdGlvblxuICpcbiAqIEBwYXJhbSB7QXJyYXkuPGZ1bmN0aW9ufHN0cmluZz59IGZvcm1hdHRlclxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XG4gKlxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5sZXQgX2Zvcm1hdExvZ0V2ZW50ID0gZnVuY3Rpb24gKGZvcm1hdHRlciwgbG9nRXZlbnQpIHtcblxuXHRsZXQgcmVzcG9uc2U7XG5cdGxldCBtZXNzYWdlID0gJyc7XG5cdGxldCBjb3VudCA9IGZvcm1hdHRlci5sZW5ndGg7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuXHRcdGlmIChmb3JtYXR0ZXJbaV0gIT09IG51bGwpIHtcblxuXHRcdFx0aWYgKGZvcm1hdHRlcltpXSBpbnN0YW5jZW9mIE9iamVjdCkge1xuXG5cdFx0XHRcdHJlc3BvbnNlID0gZm9ybWF0dGVyW2ldLmZvcm1hdHRlcihsb2dFdmVudCwgZm9ybWF0dGVyW2ldLnBhcmFtcyk7XG5cdFx0XHRcdGlmIChyZXNwb25zZSAhPSBudWxsKSB7XG5cdFx0XHRcdFx0bWVzc2FnZSArPSByZXNwb25zZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRtZXNzYWdlICs9IGZvcm1hdHRlcltpXS5hZnRlcjtcblxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bWVzc2FnZSArPSBmb3JtYXR0ZXJbaV07XG5cdFx0XHR9XG5cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gbWVzc2FnZS50cmltKCk7XG5cbn07XG5cbi8qKlxuICpcbiAqIEBwcml2YXRlXG4gKiBAZnVuY3Rpb25cbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcbiAqXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcbiAqL1xubGV0IF9nZXRGaWxlRGV0YWlscyA9IGZ1bmN0aW9uIChsb2dFdmVudCkge1xuXG5cdGlmIChsb2dFdmVudC5sb2dFcnJvclN0YWNrKSB7XG5cblx0XHRsZXQgcGFydHMgPSBsb2dFdmVudC5sb2dFcnJvclN0YWNrLnN0YWNrLnNwbGl0KC9cXG4vZyk7XG5cdFx0bGV0IGZpbGUgPSBwYXJ0c1szXTtcblx0XHRmaWxlID0gZmlsZS5yZXBsYWNlKC9hdCAoLipcXCh8KShmaWxlfGh0dHB8aHR0cHN8KSg6fCkoXFwvfCkqLywgJycpO1xuXHRcdGZpbGUgPSBmaWxlLnJlcGxhY2UoJyknLCAnJyk7XG5cdFx0ZmlsZSA9IGZpbGUucmVwbGFjZSgodHlwZW9mIGxvY2F0aW9uICE9PSAndW5kZWZpbmVkJykgPyBsb2NhdGlvbi5ob3N0IDogJycsICcnKS50cmltKCk7XG5cblx0XHRsZXQgZmlsZVBhcnRzID0gZmlsZS5zcGxpdCgvXFw6L2cpO1xuXG5cdFx0bG9nRXZlbnQuY29sdW1uID0gZmlsZVBhcnRzLnBvcCgpO1xuXHRcdGxvZ0V2ZW50LmxpbmVOdW1iZXIgPSBmaWxlUGFydHMucG9wKCk7XG5cblx0XHRpZiAodHlwZW9mIGRlZmluZSAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdGxldCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuXHRcdFx0bGV0IGFwcERpciA9IHBhdGguZGlybmFtZShyZXF1aXJlLm1haW4uZmlsZW5hbWUpO1xuXHRcdFx0aWYgKCFmaWxlUGFydHNbMF0uc3RhcnRzV2l0aChhcHBEaXIpKSB7XG5cdFx0XHRcdGFwcERpciA9ICcnO1xuXHRcdFx0fVxuXHRcdFx0bG9nRXZlbnQuZmlsZW5hbWUgPSBmaWxlUGFydHMuam9pbignOicpLnJlcGxhY2UoYXBwRGlyLCAnJykucmVwbGFjZSgvXihcXFxcfFxcLykvLCAnJyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGxvZ0V2ZW50LmZpbGVuYW1lID0gZmlsZVBhcnRzLmpvaW4oJzonKTtcblx0XHR9XG5cblx0fSBlbHNlIHtcblxuXHRcdGxvZ0V2ZW50LmNvbHVtbiA9ICc/Jztcblx0XHRsb2dFdmVudC5maWxlbmFtZSA9ICdhbm9ueW1vdXMnO1xuXHRcdGxvZ0V2ZW50LmxpbmVOdW1iZXIgPSAnPyc7XG5cblx0fVxuXHRsb2dFdmVudC5maWxlID0gbG9nRXZlbnQuZmlsZW5hbWU7XG59O1xuXG4vKipcbiAqIEBmdW5jdGlvblxuICogQG1lbWJlck9mIGZvcm1hdHRlclxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBsYXlvdXRcbiAqXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwcmVDb21waWxlKGxheW91dCkge1xuXHRfZ2V0Q29tcGlsZWRMYXlvdXQobGF5b3V0KTtcbn1cblxuLyoqXG4gKiBAZnVuY3Rpb25cbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbGF5b3V0XG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcbiAqXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXQobGF5b3V0LCBsb2dFdmVudCkge1xuXHRyZXR1cm4gX2Zvcm1hdExvZ0V2ZW50KF9nZXRDb21waWxlZExheW91dChsYXlvdXQpLCBsb2dFdmVudCk7XG59XG4iXX0=

/***/ }),
/* 2 */
/***/ (function(module, exports) {

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
		'd': ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
		'm': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
	};

	const TOKEN = /d{1,4}|M{1,4}|yy(?:yy)?|([HhmsAa])\1?|[LloSZ]|'[^']*'|'[^']*'/g;
	const TIMEZONE = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g;
	const TIMEZONE_CLIP = /[^-+\dA-Z]/g;

	/**
	 * Predefined DATE formats (specified by logj2)
	 * @private
	 * @type {{DEFAULT: string, ABSOLUTE: string, COMPACT: string, DATE: string, ISO8601: string, ISO8601_BASIC: string}}
	 */
	const _PREDEFINED = {
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
		let isUTC = mask.slice(0, 4) == 'UTC:';
		if (isUTC) {
			mask = mask.slice(4);
		}

		let prefix = isUTC ? 'getUTC' : 'get';
		let day = date[prefix + 'Day']();
		let month = date[prefix + 'Month']();
		let fullYear = date[prefix + 'FullYear']();
		let hours = date[prefix + 'Hours']();
		let minutes = date[prefix + 'Minutes']();
		let seconds = date[prefix + 'Seconds']();
		let milliseconds = date[prefix + 'Milliseconds']();
		let offset = isUTC ? 0 : date.getTimezoneOffset();

		let flags = {
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
	//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRhdGVGb3JtYXR0ZXIuanMiXSwibmFtZXMiOlsiZGF0ZUZvcm1hdCIsImkxOG4iLCJUT0tFTiIsIlRJTUVaT05FIiwiVElNRVpPTkVfQ0xJUCIsIl9QUkVERUZJTkVEIiwicGFkIiwidmFsdWUiLCJsZW5ndGgiLCJTdHJpbmciLCJkYXRlIiwibWFzayIsIkRFRkFVTFQiLCJpc1VUQyIsInNsaWNlIiwicHJlZml4IiwiZGF5IiwibW9udGgiLCJmdWxsWWVhciIsImhvdXJzIiwibWludXRlcyIsInNlY29uZHMiLCJtaWxsaXNlY29uZHMiLCJvZmZzZXQiLCJnZXRUaW1lem9uZU9mZnNldCIsImZsYWdzIiwiZ2V0RGF0ZSIsImQiLCJtIiwibWF0Y2giLCJwb3AiLCJyZXBsYWNlIiwiTWF0aCIsImZsb29yIiwiYWJzIiwiJDAiXSwibWFwcGluZ3MiOiI7Ozs7O1FBNERnQkEsVSxHQUFBQSxVO0FBNURoQjs7Ozs7OztBQU9BLElBQUlDLE9BQU87QUFDVixNQUFNLENBQUUsS0FBRixFQUFTLEtBQVQsRUFBZ0IsS0FBaEIsRUFBdUIsS0FBdkIsRUFBOEIsS0FBOUIsRUFBcUMsS0FBckMsRUFBNEMsS0FBNUMsRUFBbUQsUUFBbkQsRUFBNkQsUUFBN0QsRUFDTCxTQURLLEVBQ00sV0FETixFQUNtQixVQURuQixFQUMrQixRQUQvQixFQUN5QyxVQUR6QyxDQURJO0FBR1YsTUFBTSxDQUFFLEtBQUYsRUFBUyxLQUFULEVBQWdCLEtBQWhCLEVBQXVCLEtBQXZCLEVBQThCLEtBQTlCLEVBQXFDLEtBQXJDLEVBQTRDLEtBQTVDLEVBQW1ELEtBQW5ELEVBQTBELEtBQTFELEVBQ0wsS0FESyxFQUNFLEtBREYsRUFDUyxLQURULEVBQ2dCLFNBRGhCLEVBQzJCLFVBRDNCLEVBQ3VDLE9BRHZDLEVBQ2dELE9BRGhELEVBQ3lELEtBRHpELEVBQ2dFLE1BRGhFLEVBRUwsTUFGSyxFQUVHLFFBRkgsRUFFYSxXQUZiLEVBRTBCLFNBRjFCLEVBRXFDLFVBRnJDLEVBRWlELFVBRmpEO0FB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QjtBQXNCWCxPQUFNQSxRQUFRLEVBQVIsR0FBYSxHQUFiLEdBQW1CLEdBdEJkO0FBdUJYLFFBQU9BLFFBQVEsRUFBUixHQUFhLElBQWIsR0FBb0IsSUF2QmhCO0FBd0JYLE9BQU1OLFFBQVEsS0FBUixHQUFnQixDQUFDSixPQUFPQyxJQUFQLEVBQWFtQixLQUFiLENBQW1CMUIsUUFBbkIsS0FBZ0MsQ0FBRSxFQUFGLENBQWpDLEVBQXlDMkIsR0FBekMsR0FBK0NDLE9BQS9DLENBQXVEM0IsYUFBdkQsRUFBc0UsRUFBdEUsQ0F4Qlg7QUF5QlgsT0FBTSxDQUFDbUIsU0FBUyxDQUFULEdBQWEsR0FBYixHQUFtQixHQUFwQixJQUEyQmpCLElBQUkwQixLQUFLQyxLQUFMLENBQVdELEtBQUtFLEdBQUwsQ0FBU1gsTUFBVCxJQUFtQixFQUE5QixJQUFvQyxHQUFwQyxHQUEwQ1MsS0FBS0UsR0FBTCxDQUFTWCxNQUFULElBQW1CLEVBQWpFLEVBQXFFLENBQXJFO0FBekJ0QixFQUFaOztBQTRCQSxRQUFPWixLQUFLb0IsT0FBTCxDQUFhN0IsS0FBYixFQUFvQixVQUFVaUMsRUFBVixFQUFjO0FBQ3hDLFNBQU9BLE1BQU1WLEtBQU4sR0FBY0EsTUFBTVUsRUFBTixDQUFkLEdBQTBCQSxFQUFqQztBQUNBLEVBRk0sQ0FBUDtBQUlBIiwiZmlsZSI6ImRhdGVGb3JtYXR0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIGxvZzRqcyA8aHR0cHM6Ly9naXRodWIuY29tL2FuaWdlbmVyby9sb2c0anMyPlxuICpcbiAqIENvcHlyaWdodCAyMDE2LXByZXNlbnQgUm9iaW4gU2NodWx0eiA8aHR0cDovL2FuaWdlbmVyby5jb20+XG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2VcbiAqL1xuXG5sZXQgaTE4biA9IHtcblx0J2QnIDogWyAnU3VuJywgJ01vbicsICdUdWUnLCAnV2VkJywgJ1RodScsICdGcmknLCAnU2F0JywgJ1N1bmRheScsICdNb25kYXknLFxuXHRcdCdUdWVzZGF5JywgJ1dlZG5lc2RheScsICdUaHVyc2RheScsICdGcmlkYXknLCAnU2F0dXJkYXknIF0sXG5cdCdtJyA6IFsgJ0phbicsICdGZWInLCAnTWFyJywgJ0FwcicsICdNYXknLCAnSnVuJywgJ0p1bCcsICdBdWcnLCAnU2VwJyxcblx0XHQnT2N0JywgJ05vdicsICdEZWMnLCAnSmFudWFyeScsICdGZWJydWFyeScsICdNYXJjaCcsICdBcHJpbCcsICdNYXknLCAnSnVuZScsXG5cdFx0J0p1bHknLCAnQXVndXN0JywgJ1NlcHRlbWJlcicsICdPY3RvYmVyJywgJ05vdmVtYmVyJywgJ0RlY2VtYmVyJyBdXG59O1xuXG5jb25zdCBUT0tFTiA9IC9kezEsNH18TXsxLDR9fHl5KD86eXkpP3woW0hobXNBYV0pXFwxP3xbTGxvU1pdfCdbXiddKid8J1teJ10qJy9nO1xuY29uc3QgVElNRVpPTkUgPSAvXFxiKD86W1BNQ0VBXVtTRFBdVHwoPzpQYWNpZmljfE1vdW50YWlufENlbnRyYWx8RWFzdGVybnxBdGxhbnRpYykgKD86U3RhbmRhcmR8RGF5bGlnaHR8UHJldmFpbGluZykgVGltZXwoPzpHTVR8VVRDKSg/OlstK11cXGR7NH0pPylcXGIvZztcbmNvbnN0IFRJTUVaT05FX0NMSVAgPSAvW14tK1xcZEEtWl0vZztcblxuLyoqXG4gKiBQcmVkZWZpbmVkIERBVEUgZm9ybWF0cyAoc3BlY2lmaWVkIGJ5IGxvZ2oyKVxuICogQHByaXZhdGVcbiAqIEB0eXBlIHt7REVGQVVMVDogc3RyaW5nLCBBQlNPTFVURTogc3RyaW5nLCBDT01QQUNUOiBzdHJpbmcsIERBVEU6IHN0cmluZywgSVNPODYwMTogc3RyaW5nLCBJU084NjAxX0JBU0lDOiBzdHJpbmd9fVxuICovXG5jb25zdCBfUFJFREVGSU5FRCA9IHtcbiAgICAnREVGQVVMVCcgOiAneXl5eS1NTS1kZCBISDptbTpzcyxTJyxcbiAgICAnQUJTT0xVVEUnIDogJ0hIOk1NOnNzLFMnLFxuICAgICdDT01QQUNUJyA6ICd5eXl5TU1kZEhIbW1zc1MnLFxuICAgICdEQVRFJyA6ICdkZCBNTU0geXl5eSBISDptbTpzcyxTJyxcbiAgICAnSVNPODYwMScgOiAneXl5eS1NTS1kZFRISDptbTpzcyxTJyxcbiAgICAnSVNPODYwMV9CQVNJQycgOiAneXl5eU1NZGRUSEhtbXNzLFMnXG59O1xuXG4vKipcbiAqIFBhZHMgbnVtYmVycyBpbiB0aGUgZGF0ZSBmb3JtYXRcbiAqXG4gKiBAcGFyYW0gdmFsdWVcbiAqIEBwYXJhbSBsZW5ndGhcbiAqXG4gKiBAcmV0dXJucyB7P3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gcGFkKHZhbHVlLCBsZW5ndGgpIHtcblxuICAgIHZhbHVlID0gU3RyaW5nKHZhbHVlKTtcblx0bGVuZ3RoID0gbGVuZ3RoIHx8IDI7XG5cbiAgICB3aGlsZSAodmFsdWUubGVuZ3RoIDwgbGVuZ3RoKSB7XG5cdFx0dmFsdWUgPSAnMCcgKyB2YWx1ZTtcblx0fVxuXG5cdHJldHVybiB2YWx1ZTtcblxufVxuXG4vKipcbiAqIEZvcm1hdHMgdGhlIGRhdGVcbiAqIEBwYXJhbSBkYXRlXG4gKiBAcGFyYW0gbWFza1xuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRhdGVGb3JtYXQoZGF0ZSwgbWFzaykge1xuXG4gICAgaWYgKF9QUkVERUZJTkVEW21hc2tdKSB7XG4gICAgICAgIG1hc2sgPSBfUFJFREVGSU5FRFttYXNrXTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBtYXNrID0gU3RyaW5nKG1hc2sgfHwgX1BSRURFRklORUQuREVGQVVMVCk7XG4gICAgfVxuXG4gICAgLy8gY2hlY2sgaWYgdGhlIGRhdGUgZm9ybWF0IGlzIHNldCBmb3IgVVRDXG4gICAgbGV0IGlzVVRDID0gKG1hc2suc2xpY2UoMCwgNCkgPT0gJ1VUQzonKTtcblx0aWYgKGlzVVRDKSB7XG5cdFx0bWFzayA9IG1hc2suc2xpY2UoNCk7XG5cdH1cblxuXHRsZXQgcHJlZml4ID0gaXNVVEMgPyAnZ2V0VVRDJyA6ICdnZXQnO1xuXHRsZXQgZGF5ID0gZGF0ZVtwcmVmaXggKyAnRGF5J10oKTtcblx0bGV0IG1vbnRoID0gZGF0ZVtwcmVmaXggKyAnTW9udGgnXSgpO1xuXHRsZXQgZnVsbFllYXIgPSBkYXRlW3ByZWZpeCArICdGdWxsWWVhciddKCk7XG5cdGxldCBob3VycyA9IGRhdGVbcHJlZml4ICsgJ0hvdXJzJ10oKTtcblx0bGV0IG1pbnV0ZXMgPSBkYXRlW3ByZWZpeCArICdNaW51dGVzJ10oKTtcblx0bGV0IHNlY29uZHMgPSBkYXRlW3ByZWZpeCArICdTZWNvbmRzJ10oKTtcblx0bGV0IG1pbGxpc2Vjb25kcyA9IGRhdGVbcHJlZml4ICsgJ01pbGxpc2Vjb25kcyddKCk7XG5cdGxldCBvZmZzZXQgPSBpc1VUQyA/IDAgOiBkYXRlLmdldFRpbWV6b25lT2Zmc2V0KCk7XG5cblx0bGV0IGZsYWdzID0ge1xuXHRcdCdkJyA6IGRhdGUuZ2V0RGF0ZSgpLFxuXHRcdCdkZCcgOiBwYWQoZGF0ZS5nZXREYXRlKCkpLFxuXHRcdCdkZGQnIDogaTE4bi5kW2RheV0sXG5cdFx0J2RkZGQnIDogaTE4bi5kW2RheSArIDddLFxuXHRcdCdNJyA6IG1vbnRoICsgMSxcblx0XHQnTU0nIDogcGFkKG1vbnRoICsgMSksXG5cdFx0J01NTScgOiBpMThuLm1bbW9udGhdLFxuXHRcdCdNTU1NJyA6IGkxOG4ubVttb250aCArIDEyXSxcblx0XHQneXknIDogU3RyaW5nKGZ1bGxZZWFyKS5zbGljZSgyKSxcblx0XHQneXl5eScgOiBmdWxsWWVhcixcblx0XHQnaCcgOiBob3VycyAlIDEyIHx8IDEyLFxuXHRcdCdoaCcgOiBwYWQoaG91cnMgJSAxMiB8fCAxMiksXG5cdFx0J0gnIDogaG91cnMsXG5cdFx0J0hIJyA6IHBhZChob3VycyksXG5cdFx0J20nIDogbWludXRlcyxcblx0XHQnbW0nIDogcGFkKG1pbnV0ZXMpLFxuXHRcdCdzJyA6IHNlY29uZHMsXG5cdFx0J3NzJyA6IHBhZChzZWNvbmRzKSxcblx0XHQnUycgOiBwYWQobWlsbGlzZWNvbmRzLCAxKSxcblx0XHQnYScgOiBob3VycyA8IDEyID8gJ2EnIDogJ3AnLFxuXHRcdCdhYScgOiBob3VycyA8IDEyID8gJ2FtJyA6ICdwbScsXG5cdFx0J0EnIDogaG91cnMgPCAxMiA/ICdBJyA6ICdQJyxcblx0XHQnQUEnIDogaG91cnMgPCAxMiA/ICdBTScgOiAnUE0nLFxuXHRcdCdaJyA6IGlzVVRDID8gJ1VUQycgOiAoU3RyaW5nKGRhdGUpLm1hdGNoKFRJTUVaT05FKSB8fCBbICcnIF0pLnBvcCgpLnJlcGxhY2UoVElNRVpPTkVfQ0xJUCwgJycpLFxuXHRcdCdvJyA6IChvZmZzZXQgPiAwID8gJy0nIDogJysnKSArIHBhZChNYXRoLmZsb29yKE1hdGguYWJzKG9mZnNldCkgLyA2MCkgKiAxMDAgKyBNYXRoLmFicyhvZmZzZXQpICUgNjAsIDQpXG5cdH07XG5cblx0cmV0dXJuIG1hc2sucmVwbGFjZShUT0tFTiwgZnVuY3Rpb24gKCQwKSB7XG5cdFx0cmV0dXJuICQwIGluIGZsYWdzID8gZmxhZ3NbJDBdIDogJDA7XG5cdH0pO1xuXG59XG4iXX0=

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	/*istanbul ignore next*/'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
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
	  let name = func.toString().substring('function '.length);
	  name = name.substring(0, name.indexOf('('));

	  // if the string is not empty
	  return name && name.trim() ? name : 'anonymous';
	}
	//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxpdHkuanMiXSwibmFtZXMiOlsiZ2V0RnVuY3Rpb25OYW1lIiwiZnVuYyIsIm5hbWUiLCJ0b1N0cmluZyIsInN1YnN0cmluZyIsImxlbmd0aCIsImluZGV4T2YiLCJ0cmltIl0sIm1hcHBpbmdzIjoiOzs7OztRQVNnQkEsZSxHQUFBQSxlO0FBVGhCOzs7Ozs7Ozs7QUFTTyxTQUFTQSxlQUFULENBQXlCQyxJQUF6QixFQUErQjs7QUFFbEM7QUFDQSxNQUFJQyxPQUFPRCxLQUFLRSxRQUFMLEdBQWdCQyxTQUFoQixDQUEwQixZQUFZQyxNQUF0QyxDQUFYO0FBQ0FILFNBQU9BLEtBQUtFLFNBQUwsQ0FBZSxDQUFmLEVBQWtCRixLQUFLSSxPQUFMLENBQWEsR0FBYixDQUFsQixDQUFQOztBQUVBO0FBQ0EsU0FBUUosUUFBUUEsS0FBS0ssSUFBTCxFQUFULEdBQXdCTCxJQUF4QixHQUErQixXQUF0QztBQUVIIiwiZmlsZSI6InV0aWxpdHkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEdldHMgdGhlIGZ1bmN0aW9uIG5hbWUgb2YgdGhlIHNwZWNpZmllZCBmdW5jdGlvblxuICpcbiAqIEBmdW5jdGlvblxuICpcbiAqIEBwYXJhbSBmdW5jXG4gKlxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEZ1bmN0aW9uTmFtZShmdW5jKSB7XG5cbiAgICAvLyBnZXQgdGhlIG5hbWUgb2YgdGhlIGZ1bmN0aW9uXG4gICAgbGV0IG5hbWUgPSBmdW5jLnRvU3RyaW5nKCkuc3Vic3RyaW5nKCdmdW5jdGlvbiAnLmxlbmd0aCk7XG4gICAgbmFtZSA9IG5hbWUuc3Vic3RyaW5nKDAsIG5hbWUuaW5kZXhPZignKCcpKTtcblxuICAgIC8vIGlmIHRoZSBzdHJpbmcgaXMgbm90IGVtcHR5XG4gICAgcmV0dXJuIChuYW1lICYmIG5hbWUudHJpbSgpKSA/IG5hbWUgOiAnYW5vbnltb3VzJztcblxufVxuIl19

/***/ }),
/* 4 */
/***/ (function(module, exports) {

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
	//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnN0L2xvZ0xldmVsLmpzIl0sIm5hbWVzIjpbIkxvZ0xldmVsIl0sIm1hcHBpbmdzIjoiOzs7OztBQUFBOzs7Ozs7O0FBT0E7OztBQUdPLE1BQU1BLHNEQUFXO0FBQ3BCLFNBQVEsQ0FEWTtBQUVwQixXQUFVLEdBRlU7QUFHcEIsV0FBVSxHQUhVO0FBSXBCLFVBQVMsR0FKVztBQUtwQixVQUFTLEdBTFc7QUFNcEIsV0FBVSxHQU5VO0FBT3BCLFdBQVUsR0FQVTtBQVFwQixTQUFRO0FBUlksQ0FBakIiLCJmaWxlIjoiY29uc3QvbG9nTGV2ZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIGxvZzRqcyA8aHR0cHM6Ly9naXRodWIuY29tL2FuaWdlbmVyby9sb2c0anM+XG4gKlxuICogQ29weXJpZ2h0IDIwMTYtcHJlc2VudCBSb2JpbiBTY2h1bHR6IDxodHRwOi8vYW5pZ2VuZXJvLmNvbT5cbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZVxuICovXG5cbi8qKlxuICogQHR5cGUge3tPRkY6IG51bWJlciwgRkFUQUw6IG51bWJlciwgRVJST1I6IG51bWJlciwgV0FSTjogbnVtYmVyLCBJTkZPOiBudW1iZXIsIERFQlVHOiBudW1iZXIsIFRSQUNFOiBudW1iZXIsIEFMTDogbnVtYmVyfX1cbiAqL1xuZXhwb3J0IGNvbnN0IExvZ0xldmVsID0ge1xuICAgICdPRkYnIDogMCxcbiAgICAnRkFUQUwnIDogMTAwLFxuICAgICdFUlJPUicgOiAyMDAsXG4gICAgJ1dBUk4nIDogMzAwLFxuICAgICdJTkZPJyA6IDQwMCxcbiAgICAnREVCVUcnIDogNTAwLFxuICAgICdUUkFDRScgOiA2MDAsXG4gICAgJ0FMTCcgOiAyMTQ3NDgzNjQ3XG59O1xuIl19

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

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.LogAppender = undefined;

	var /*istanbul ignore next*/_formatter = __webpack_require__(1);

	class LogAppender {

	    /**
	     * Gets the name of the appender (e.g. 'console')
	     * @returns {null}
	     */
	    static get name() {
	        return null;
	    }

	    /**
	     * Returns whether or not the appender is active
	     * @returns {boolean}
	     */
	    isActive() {
	        return true;
	    }

	    /**
	     * Appends the log
	     * @param {Object} logEvent
	     */
	    append(logEvent) {}
	    // stub


	    /**
	     * Gets the current log level
	     * @returns {number}
	     */
	    getLogLevel() {
	        return this.logLevel;
	    }

	    /**
	     * Sets the log level of the appender
	     * @param {number} logLevel
	     */
	    setLogLevel(logLevel) {
	        this.logLevel = logLevel;
	    }

	    /**
	     * Sets the layout of the appender
	     * @param {string} layout
	     */
	    setLayout(layout) {
	        this.layout = layout;
	    }

	    /**
	     * Gets the layout associated with the appender
	     * @returns {string}
	     */
	    getLayout() {
	        return this.layout;
	    }

	    /**
	     * Formats the log event using the layout provided
	     * @param {Object} logEvent
	     */
	    format(logEvent) {
	        return (/*istanbul ignore next*/(0, _formatter.format)(this.getLayout(), logEvent)
	        );
	    }

	}
	/*istanbul ignore next*/exports.LogAppender = LogAppender;
	//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcGVuZGVyL2FwcGVuZGVyLmpzIl0sIm5hbWVzIjpbIkxvZ0FwcGVuZGVyIiwibmFtZSIsImlzQWN0aXZlIiwiYXBwZW5kIiwibG9nRXZlbnQiLCJnZXRMb2dMZXZlbCIsImxvZ0xldmVsIiwic2V0TG9nTGV2ZWwiLCJzZXRMYXlvdXQiLCJsYXlvdXQiLCJnZXRMYXlvdXQiLCJmb3JtYXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFFTyxNQUFNQSxXQUFOLENBQWtCOztBQUVyQjs7OztBQUlBLGVBQVdDLElBQVgsR0FBa0I7QUFDZCxlQUFPLElBQVA7QUFDSDs7QUFFRDs7OztBQUlBQyxlQUFXO0FBQ1AsZUFBTyxJQUFQO0FBQ0g7O0FBRUQ7Ozs7QUFJQUMsV0FBT0MsUUFBUCxFQUFpQixDQUVoQjtBQURHOzs7QUFHSjs7OztBQUlBQyxrQkFBYztBQUNWLGVBQU8sS0FBS0MsUUFBWjtBQUNIOztBQUVEOzs7O0FBSUFDLGdCQUFZRCxRQUFaLEVBQXNCO0FBQ2xCLGFBQUtBLFFBQUwsR0FBZ0JBLFFBQWhCO0FBQ0g7O0FBRUQ7Ozs7QUFJQUUsY0FBVUMsTUFBVixFQUFrQjtBQUNkLGFBQUtBLE1BQUwsR0FBY0EsTUFBZDtBQUNIOztBQUVEOzs7O0FBSUFDLGdCQUFZO0FBQ1IsZUFBTyxLQUFLRCxNQUFaO0FBQ0g7O0FBRUQ7Ozs7QUFJQUUsV0FBT1AsUUFBUCxFQUFpQjtBQUNiLGVBQU8sZ0RBQU8sS0FBS00sU0FBTCxFQUFQLEVBQXlCTixRQUF6QjtBQUFQO0FBQ0g7O0FBaEVvQjtnQ0FBWkosVyxHQUFBQSxXIiwiZmlsZSI6ImFwcGVuZGVyL2FwcGVuZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtmb3JtYXR9IGZyb20gJy4uL2Zvcm1hdHRlcic7XG5cbmV4cG9ydCBjbGFzcyBMb2dBcHBlbmRlciB7XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBuYW1lIG9mIHRoZSBhcHBlbmRlciAoZS5nLiAnY29uc29sZScpXG4gICAgICogQHJldHVybnMge251bGx9XG4gICAgICovXG4gICAgc3RhdGljIGdldCBuYW1lKCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IHRoZSBhcHBlbmRlciBpcyBhY3RpdmVcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBpc0FjdGl2ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXBwZW5kcyB0aGUgbG9nXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGxvZ0V2ZW50XG4gICAgICovXG4gICAgYXBwZW5kKGxvZ0V2ZW50KSB7XG4gICAgICAgIC8vIHN0dWJcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBjdXJyZW50IGxvZyBsZXZlbFxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG4gICAgZ2V0TG9nTGV2ZWwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvZ0xldmVsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIGxvZyBsZXZlbCBvZiB0aGUgYXBwZW5kZXJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbG9nTGV2ZWxcbiAgICAgKi9cbiAgICBzZXRMb2dMZXZlbChsb2dMZXZlbCkge1xuICAgICAgICB0aGlzLmxvZ0xldmVsID0gbG9nTGV2ZWw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgbGF5b3V0IG9mIHRoZSBhcHBlbmRlclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBsYXlvdXRcbiAgICAgKi9cbiAgICBzZXRMYXlvdXQobGF5b3V0KSB7XG4gICAgICAgIHRoaXMubGF5b3V0ID0gbGF5b3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIGxheW91dCBhc3NvY2lhdGVkIHdpdGggdGhlIGFwcGVuZGVyXG4gICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgKi9cbiAgICBnZXRMYXlvdXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxheW91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGb3JtYXRzIHRoZSBsb2cgZXZlbnQgdXNpbmcgdGhlIGxheW91dCBwcm92aWRlZFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBsb2dFdmVudFxuICAgICAqL1xuICAgIGZvcm1hdChsb2dFdmVudCkge1xuICAgICAgICByZXR1cm4gZm9ybWF0KHRoaXMuZ2V0TGF5b3V0KCksIGxvZ0V2ZW50KTtcbiAgICB9XG5cbn1cbiJdfQ==

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

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

			let regex = /\{\}/g;
			for (let i = 0; i < args.length; i++) {

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
		let _isStrict = function () {
			return !this;
		};

		return this;
	}
	//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxvZ2dlci9sb2dnZXIuanMiXSwibmFtZXMiOlsiTG9nZ2VyIiwiTE9HX0VWRU5UIiwiY29udGV4dCIsImFwcGVuZGVyT2JqIiwiX2xvZ0NvbnRleHQiLCJfbG9nU2VxdWVuY2UiLCJfcmVsYXRpdmUiLCJEYXRlIiwiZ2V0VGltZSIsImVycm9yIiwiYXBwZW5kIiwiX2NvbnN0cnVjdExvZ0V2ZW50IiwiRVJST1IiLCJhcmd1bWVudHMiLCJ3YXJuIiwiV0FSTiIsImluZm8iLCJJTkZPIiwiZGVidWciLCJERUJVRyIsInRyYWNlIiwiVFJBQ0UiLCJsZXZlbCIsImFyZ3MiLCJsb2dUaW1lIiwiRXJyb3IiLCJlIiwibG9nZ2luZ0V2ZW50IiwiX2lzU3RyaWN0IiwiY2FsbGVlIiwiY2FsbGVyIiwidW5kZWZpbmVkIiwicmVnZXgiLCJpIiwibGVuZ3RoIiwibWVzc2FnZSIsImV4ZWMiLCJyZXBsYWNlIiwicHJvcGVydGllcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFrQmdCQSxNLEdBQUFBLE07O0FBWGhCOztBQUVBOzs7Ozs7O0FBT0EsSUFBSUMsU0FBSixDLENBaEJBOzs7Ozs7O0FBa0JPLFNBQVNELE1BQVQsQ0FBZ0JFLE9BQWhCLEVBQXlCQyxXQUF6QixFQUFzQzs7QUFFekM7QUFDQSxLQUFJQyxjQUFjRixPQUFsQjtBQUNBO0FBQ0EsS0FBSUcsZUFBZSxDQUFuQjtBQUNIO0FBQ0EsS0FBSUMsWUFBYSxJQUFJQyxJQUFKLEVBQUQsQ0FBYUMsT0FBYixFQUFoQjs7QUFFQTs7Ozs7O0FBTUEsTUFBS0MsS0FBTCxHQUFhLFlBQVk7QUFDeEJOLGNBQVlPLE1BQVosQ0FBbUJDLG1CQUFtQiw0Q0FBU0MsS0FBNUIsRUFBbUNDLFNBQW5DLENBQW5CO0FBQ0EsRUFGRDs7QUFJQTs7Ozs7O0FBTUEsTUFBS0MsSUFBTCxHQUFZLFlBQVk7QUFDdkJYLGNBQVlPLE1BQVosQ0FBbUJDLG1CQUFtQiw0Q0FBU0ksSUFBNUIsRUFBa0NGLFNBQWxDLENBQW5CO0FBQ0EsRUFGRDs7QUFJQTs7Ozs7O0FBTUEsTUFBS0csSUFBTCxHQUFZLFlBQVk7QUFDdkJiLGNBQVlPLE1BQVosQ0FBbUJDLG1CQUFtQiw0Q0FBU00sSUFBNUIsRUFBa0NKLFNBQWxDLENBQW5CO0FBQ0EsRUFGRDs7QUFJQTs7Ozs7O0FBTUEsTUFBS0ssS0FBTCxHQUFhLFlBQVk7QUFDeEJmLGNBQVlPLE1BQVosQ0FBbUJDLG1CQUFtQiw0Q0FBU1EsS0FBNUIsRUFBbUNOLFNBQW5DLENBQW5CO0FBQ0EsRUFGRDs7QUFJQTs7Ozs7O0FBTUEsTUFBS08sS0FBTCxHQUFhLFlBQVk7QUFDeEJqQixjQUFZTyxNQUFaLENBQW1CQyxtQkFBbUIsNENBQVNVLEtBQTVCLEVBQW1DUixTQUFuQyxDQUFuQjtBQUNBLEVBRkQ7O0FBSUE7Ozs7Ozs7O0FBUUEsVUFBU0Ysa0JBQVQsQ0FBNEJXLEtBQTVCLEVBQW1DQyxJQUFuQyxFQUF5Qzs7QUFFeEMsTUFBSUMsVUFBVSxJQUFJakIsSUFBSixFQUFkO0FBQ0EsTUFBSUUsUUFBUSxJQUFaOztBQUVBO0FBQ0EsTUFBSTtBQUNILFNBQU0sSUFBSWdCLEtBQUosRUFBTjtBQUNBLEdBRkQsQ0FFRSxPQUFPQyxDQUFQLEVBQVU7QUFDWGpCLFdBQVFpQixDQUFSO0FBQ0E7O0FBRUQsTUFBSUMsZUFBZTtBQUNsQixXQUFTSCxPQURTO0FBRWxCLFlBQVUsSUFGUTtBQUdsQixvQkFBa0JmLEtBSEE7QUFJbEIsV0FBUyxJQUpTO0FBS2xCLFlBQVVhLEtBTFE7QUFNbEIsaUJBQWUsSUFORztBQU9sQixhQUFXbEIsV0FQTztBQVFsQixjQUFZLEVBUk07QUFTbEIsYUFBVyxDQUFDd0IsV0FBRCxHQUFlTCxLQUFLTSxNQUFMLENBQVlDLE1BQTNCLEdBQW9DLENBVDdCO0FBVWxCLGlCQUFlQyxTQVZHO0FBV2xCLGVBQWFQLFFBQVFoQixPQUFSLEtBQW9CRixTQVhmO0FBWWxCLGVBQWFEO0FBWkssR0FBbkI7O0FBZUEsTUFBSTJCLFFBQVEsT0FBWjtBQUNBLE9BQUssSUFBSUMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJVixLQUFLVyxNQUF6QixFQUFpQ0QsR0FBakMsRUFBc0M7O0FBRXJDLE9BQUlBLE1BQU0sQ0FBVixFQUFhO0FBQ1pOLGlCQUFhUSxPQUFiLEdBQXVCWixLQUFLVSxDQUFMLENBQXZCO0FBQ0EsSUFGRCxNQUVPLElBQUlELE1BQU1JLElBQU4sQ0FBV1QsYUFBYVEsT0FBeEIsQ0FBSixFQUFzQztBQUM1Q1IsaUJBQWFRLE9BQWIsR0FBdUJSLGFBQWFRLE9BQWIsQ0FBcUJFLE9BQXJCLENBQTZCLE1BQTdCLEVBQXFDZCxLQUFLVSxDQUFMLENBQXJDLENBQXZCO0FBQ0EsSUFGTSxNQUVBLElBQUlWLEtBQUtVLENBQUwsYUFBbUJSLEtBQXZCLEVBQThCO0FBQ3BDRSxpQkFBYWxCLEtBQWIsR0FBcUJjLEtBQUtVLENBQUwsQ0FBckI7QUFDQSxJQUZNLE1BRUE7QUFDTk4saUJBQWFXLFVBQWIsR0FBMEJmLEtBQUtVLENBQUwsQ0FBMUI7QUFDQTtBQUVEOztBQUVELFNBQU9OLFlBQVA7QUFFQTs7QUFFRTs7Ozs7Ozs7QUFRSCxLQUFJQyxZQUFZLFlBQVk7QUFDckIsU0FBTyxDQUFDLElBQVI7QUFDSCxFQUZKOztBQUlBLFFBQU8sSUFBUDtBQUVBIiwiZmlsZSI6ImxvZ2dlci9sb2dnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIGxvZzRqcyA8aHR0cHM6Ly9naXRodWIuY29tL2FuaWdlbmVyby9sb2c0anM+XG4gKlxuICogQ29weXJpZ2h0IDIwMTYtcHJlc2VudCBSb2JpbiBTY2h1bHR6IDxodHRwOi8vYW5pZ2VuZXJvLmNvbT5cbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZVxuICovXG5cbmltcG9ydCB7TG9nTGV2ZWx9IGZyb20gJy4uL2NvbnN0L2xvZ0xldmVsJztcblxuLyoqXG4gKiBIb2xkcyB0aGUgZGVmaW5pdGlvbiBmb3IgdGhlIGxvZyBldmVudCBvYmplY3RcbiAqXG4gKiBAdHlwZWRlZiB7eyBkYXRlIDogbnVtYmVyLCBlcnJvciA6IE9iamVjdCwgZmlsZW5hbWU6IHN0cmluZywgbGluZU51bWJlcjogP3N0cmluZywgY29sdW1uOiA/c3RyaW5nLFxuICogICAgICBsb2dFcnJvclN0YWNrIDogT2JqZWN0LCBmaWxlIDogU3RyaW5nLCBsZXZlbCA6IG51bWJlciwgbG9nZ2VyIDogc3RyaW5nLCBtZXNzYWdlIDogc3RyaW5nLFxuICogICAgICBtZXRob2QgOiBGdW5jdGlvbiwgcHJvcGVydGllcyA6IE9iamVjdD0sIHJlbGF0aXZlIDogbnVtYmVyLCBzZXF1ZW5jZSA6IG51bWJlciB9fVxuICovXG5sZXQgTE9HX0VWRU5UO1xuXG5leHBvcnQgZnVuY3Rpb24gTG9nZ2VyKGNvbnRleHQsIGFwcGVuZGVyT2JqKSB7XG5cbiAgICAvKiogQHR5cGUge3N0cmluZ30gKi9cbiAgICBsZXQgX2xvZ0NvbnRleHQgPSBjb250ZXh0O1xuICAgIC8qKiBAdHlwZW9mIHtudW1iZXJ9ICovXG4gICAgbGV0IF9sb2dTZXF1ZW5jZSA9IDE7XG5cdC8qKiBAdHlwZW9mIHtudW1iZXJ9ICovXG5cdGxldCBfcmVsYXRpdmUgPSAobmV3IERhdGUoKSkuZ2V0VGltZSgpO1xuXG5cdC8qKlxuXHQgKiBMb2dzIGFuIGVycm9yIGV2ZW50XG4gICAgICpcbiAgICAgKiBAZnVuY3Rpb25cbiAgICAgKiBAbWVtYmVyT2YgTG9nZ2VyXG5cdCAqL1xuXHR0aGlzLmVycm9yID0gZnVuY3Rpb24gKCkge1xuXHRcdGFwcGVuZGVyT2JqLmFwcGVuZChfY29uc3RydWN0TG9nRXZlbnQoTG9nTGV2ZWwuRVJST1IsIGFyZ3VtZW50cykpO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBMb2dzIGEgd2FybmluZ1xuICAgICAqXG4gICAgICogQGZ1bmN0aW9uXG4gICAgICogQG1lbWJlck9mIExvZ2dlclxuXHQgKi9cblx0dGhpcy53YXJuID0gZnVuY3Rpb24gKCkge1xuXHRcdGFwcGVuZGVyT2JqLmFwcGVuZChfY29uc3RydWN0TG9nRXZlbnQoTG9nTGV2ZWwuV0FSTiwgYXJndW1lbnRzKSk7XG5cdH07XG5cblx0LyoqXG5cdCAqIExvZ3MgYW4gaW5mbyBsZXZlbCBldmVudFxuICAgICAqXG4gICAgICogQGZ1bmN0aW9uXG4gICAgICogQG1lbWJlck9mIExvZ2dlclxuXHQgKi9cblx0dGhpcy5pbmZvID0gZnVuY3Rpb24gKCkge1xuXHRcdGFwcGVuZGVyT2JqLmFwcGVuZChfY29uc3RydWN0TG9nRXZlbnQoTG9nTGV2ZWwuSU5GTywgYXJndW1lbnRzKSk7XG5cdH07XG5cblx0LyoqXG5cdCAqIExvZ3MgYSBkZWJ1ZyBldmVudFxuICAgICAqXG4gICAgICogQGZ1bmN0aW9uXG4gICAgICogQG1lbWJlck9mIExvZ2dlclxuXHQgKi9cblx0dGhpcy5kZWJ1ZyA9IGZ1bmN0aW9uICgpIHtcblx0XHRhcHBlbmRlck9iai5hcHBlbmQoX2NvbnN0cnVjdExvZ0V2ZW50KExvZ0xldmVsLkRFQlVHLCBhcmd1bWVudHMpKTtcblx0fTtcblxuXHQvKipcblx0ICogTG9ncyBhIHRyYWNlIGV2ZW50XG4gICAgICpcbiAgICAgKiBAZnVuY3Rpb25cbiAgICAgKiBAbWVtYmVyT2YgTG9nZ2VyXG5cdCAqL1xuXHR0aGlzLnRyYWNlID0gZnVuY3Rpb24gKCkge1xuXHRcdGFwcGVuZGVyT2JqLmFwcGVuZChfY29uc3RydWN0TG9nRXZlbnQoTG9nTGV2ZWwuVFJBQ0UsIGFyZ3VtZW50cykpO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBAZnVuY3Rpb25cblx0ICpcblx0ICogQHBhcmFtIHtudW1iZXJ9IGxldmVsXG5cdCAqIEBwYXJhbSB7QXJyYXkuPE9iamVjdD59IGFyZ3Ncblx0ICpcblx0ICogQHJldHVybiB7TE9HX0VWRU5UfVxuXHQgKi9cblx0ZnVuY3Rpb24gX2NvbnN0cnVjdExvZ0V2ZW50KGxldmVsLCBhcmdzKSB7XG5cblx0XHRsZXQgbG9nVGltZSA9IG5ldyBEYXRlKCk7XG5cdFx0bGV0IGVycm9yID0gbnVsbDtcblxuXHRcdC8vIHRoaXMgbG9va3MgaG9ycmlibGUsIGJ1dCB0aGlzIGlzIHRoZSBvbmx5IHdheSB0byBjYXRjaCB0aGUgc3RhY2sgZm9yIElFIHRvIGxhdGVyIHBhcnNlIHRoZSBzdGFja1xuXHRcdHRyeSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoKTtcblx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRlcnJvciA9IGU7XG5cdFx0fVxuXG5cdFx0bGV0IGxvZ2dpbmdFdmVudCA9IHtcblx0XHRcdCdkYXRlJyA6IGxvZ1RpbWUsXG5cdFx0XHQnZXJyb3InIDogbnVsbCxcblx0XHRcdCdsb2dFcnJvclN0YWNrJyA6IGVycm9yLFxuXHRcdFx0J2ZpbGUnIDogbnVsbCxcblx0XHRcdCdsZXZlbCcgOiBsZXZlbCxcblx0XHRcdCdsaW5lTnVtYmVyJyA6IG51bGwsXG5cdFx0XHQnbG9nZ2VyJyA6IF9sb2dDb250ZXh0LFxuXHRcdFx0J21lc3NhZ2UnIDogJycsXG5cdFx0XHQnbWV0aG9kJyA6ICFfaXNTdHJpY3QoKSA/IGFyZ3MuY2FsbGVlLmNhbGxlciA6IDAsXG5cdFx0XHQncHJvcGVydGllcycgOiB1bmRlZmluZWQsXG5cdFx0XHQncmVsYXRpdmUnIDogbG9nVGltZS5nZXRUaW1lKCkgLSBfcmVsYXRpdmUsXG5cdFx0XHQnc2VxdWVuY2UnIDogX2xvZ1NlcXVlbmNlKytcblx0XHR9O1xuXG5cdFx0bGV0IHJlZ2V4ID0gL1xce1xcfS9nO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuXG5cdFx0XHRpZiAoaSA9PT0gMCkge1xuXHRcdFx0XHRsb2dnaW5nRXZlbnQubWVzc2FnZSA9IGFyZ3NbaV07XG5cdFx0XHR9IGVsc2UgaWYgKHJlZ2V4LmV4ZWMobG9nZ2luZ0V2ZW50Lm1lc3NhZ2UpKSB7XG5cdFx0XHRcdGxvZ2dpbmdFdmVudC5tZXNzYWdlID0gbG9nZ2luZ0V2ZW50Lm1lc3NhZ2UucmVwbGFjZSgvXFx7XFx9LywgYXJnc1tpXSk7XG5cdFx0XHR9IGVsc2UgaWYgKGFyZ3NbaV0gaW5zdGFuY2VvZiBFcnJvcikge1xuXHRcdFx0XHRsb2dnaW5nRXZlbnQuZXJyb3IgPSBhcmdzW2ldO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bG9nZ2luZ0V2ZW50LnByb3BlcnRpZXMgPSBhcmdzW2ldO1xuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0cmV0dXJuIGxvZ2dpbmdFdmVudDtcblxuXHR9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IHRoZSBzY3JpcHQgaXMgaW4gc3RyaWN0IG1vZGVcbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQGZ1bmN0aW9uXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cblx0bGV0IF9pc1N0cmljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzO1xuICAgIH07XG5cblx0cmV0dXJuIHRoaXM7XG5cbn1cbiJdfQ==

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

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
	  * @param {LOG_EVENT} logEvent
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
	//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcGVuZGVyL2NvbnNvbGVBcHBlbmRlci5qcyJdLCJuYW1lcyI6WyJDb25zb2xlQXBwZW5kZXIiLCJuYW1lIiwiYXBwZW5kIiwibG9nRXZlbnQiLCJsZXZlbCIsImdldExvZ0xldmVsIiwiX2FwcGVuZFRvQ29uc29sZSIsIm1lc3NhZ2UiLCJmb3JtYXQiLCJFUlJPUiIsImNvbnNvbGUiLCJlcnJvciIsIldBUk4iLCJ3YXJuIiwiSU5GTyIsImluZm8iLCJERUJVRyIsIlRSQUNFIiwiaW5kZXhPZiIsImxvZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQU9BOztBQUNBOztBQVJBOzs7Ozs7O0FBVU8sTUFBTUEsZUFBTix1REFBMEM7O0FBRTdDLFlBQVdDLElBQVgsR0FBa0I7QUFDZCxTQUFPLFNBQVA7QUFDSDs7QUFFRDs7OztBQUlBQyxRQUFPQyxRQUFQLEVBQWlCO0FBQ2IsTUFBSUEsU0FBU0MsS0FBVCxJQUFrQixLQUFLQyxXQUFMLEVBQXRCLEVBQTBDO0FBQ3RDLFFBQUtDLGdCQUFMLENBQXNCSCxRQUF0QjtBQUNIO0FBQ0o7O0FBRUo7Ozs7OztBQU1BRyxrQkFBaUJILFFBQWpCLEVBQTJCOztBQUUxQixNQUFJSSxVQUFVLEtBQUtDLE1BQUwsQ0FBWUwsUUFBWixDQUFkOztBQUVBLE1BQUlBLFNBQVNDLEtBQVQsSUFBa0IsMkNBQVNLLEtBQS9CLEVBQXNDO0FBQ3JDQyxXQUFRQyxLQUFSLENBQWNKLE9BQWQ7QUFDQSxHQUZELE1BRU8sSUFBSUosU0FBU0MsS0FBVCxJQUFrQiwyQ0FBU1EsSUFBL0IsRUFBcUM7QUFDM0NGLFdBQVFHLElBQVIsQ0FBYU4sT0FBYjtBQUNBLEdBRk0sTUFFQSxJQUFJSixTQUFTQyxLQUFULElBQWtCLDJDQUFTVSxJQUEvQixFQUFxQztBQUMzQ0osV0FBUUssSUFBUixDQUFhUixPQUFiO0FBQ0EsR0FGTSxNQUVBLElBQUksQ0FBQywyQ0FBU1MsS0FBVixFQUFpQiwyQ0FBU0MsS0FBMUIsRUFBaUNDLE9BQWpDLENBQXlDZixTQUFTQyxLQUFsRCxJQUEyRCxDQUFDLENBQWhFLEVBQW1FO0FBQ3pFTSxXQUFRUyxHQUFSLENBQVlaLE9BQVo7QUFDQTtBQUVEOztBQXBDK0M7Z0NBQXBDUCxlLEdBQUFBLGUiLCJmaWxlIjoiYXBwZW5kZXIvY29uc29sZUFwcGVuZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBsb2c0anMgPGh0dHBzOi8vZ2l0aHViLmNvbS9hbmlnZW5lcm8vbG9nNGpzPlxuICpcbiAqIENvcHlyaWdodCAyMDE2LXByZXNlbnQgUm9iaW4gU2NodWx0eiA8aHR0cDovL2FuaWdlbmVyby5jb20+XG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0xvZ0FwcGVuZGVyfSBmcm9tICcuL2FwcGVuZGVyJztcbmltcG9ydCB7TG9nTGV2ZWx9IGZyb20gJy4uL2NvbnN0L2xvZ0xldmVsJztcblxuZXhwb3J0IGNsYXNzIENvbnNvbGVBcHBlbmRlciBleHRlbmRzIExvZ0FwcGVuZGVyIHtcblxuICAgIHN0YXRpYyBnZXQgbmFtZSgpIHtcbiAgICAgICAgcmV0dXJuICdjb25zb2xlJztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBcHBlbmRzIHRoZSBsb2cgZXZlbnRcbiAgICAgKiBAcGFyYW0gbG9nRXZlbnRcbiAgICAgKi9cbiAgICBhcHBlbmQobG9nRXZlbnQpIHtcbiAgICAgICAgaWYgKGxvZ0V2ZW50LmxldmVsIDw9IHRoaXMuZ2V0TG9nTGV2ZWwoKSkge1xuICAgICAgICAgICAgdGhpcy5fYXBwZW5kVG9Db25zb2xlKGxvZ0V2ZW50KTtcbiAgICAgICAgfVxuICAgIH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogQGZ1bmN0aW9uXG5cdCAqXG5cdCAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dFdmVudFxuXHQgKi9cblx0X2FwcGVuZFRvQ29uc29sZShsb2dFdmVudCkge1xuXG5cdFx0bGV0IG1lc3NhZ2UgPSB0aGlzLmZvcm1hdChsb2dFdmVudCk7XG5cblx0XHRpZiAobG9nRXZlbnQubGV2ZWwgPT0gTG9nTGV2ZWwuRVJST1IpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IobWVzc2FnZSk7XG5cdFx0fSBlbHNlIGlmIChsb2dFdmVudC5sZXZlbCA9PSBMb2dMZXZlbC5XQVJOKSB7XG5cdFx0XHRjb25zb2xlLndhcm4obWVzc2FnZSk7XG5cdFx0fSBlbHNlIGlmIChsb2dFdmVudC5sZXZlbCA9PSBMb2dMZXZlbC5JTkZPKSB7XG5cdFx0XHRjb25zb2xlLmluZm8obWVzc2FnZSk7XG5cdFx0fSBlbHNlIGlmIChbTG9nTGV2ZWwuREVCVUcsIExvZ0xldmVsLlRSQUNFXS5pbmRleE9mKGxvZ0V2ZW50LmxldmVsKSA+IC0xKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhtZXNzYWdlKTtcblx0XHR9XG5cblx0fVxuXG59XG4iXX0=

/***/ })
/******/ ])
});
;