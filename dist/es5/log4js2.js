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
	exports.LogLevel = undefined;

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

	/** @const */
	var _MAIN_LOGGER = 'main';
	/** @const */
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
	var APPENDER_METHODS = ['append', 'getName', 'isActive', 'setLogLevel', 'setLayout'];

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

	        for (var logKey in _loggers) {

	            if (_loggers.hasOwnProperty(logKey)) {
	                for (var key in _loggers[logKey]) {
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
	var _configureAppenders = function _configureAppenders(appenders) {

	    if (appenders instanceof Array) {

	        var count = appenders.length;
	        for (var i = 0; i < count; i++) {

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
	var _getLoggers = function _getLoggers(logLevel, layout) {

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
	    APPENDER_METHODS.forEach(function (element) {
	        if (appenderObj[element] == undefined || !(appenderObj[element] instanceof Function)) {
	            throw new Error( /*istanbul ignore next*/'Invalid appender: missing/invalid method: ' + element);
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

	            for (var logKey in _loggers) {
	                if (_loggers.hasOwnProperty(logKey)) {
	                    for (var key in _loggers[logKey]) {
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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7UUE2RGdCO2dDQStJQTtnQ0F5RUE7Z0NBdUNBOztBQXZTaEI7OztJQUFZOztBQUNaOzs7SUFBWTs7QUFDWjs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBYkEsSUFBSSx5Q0FBSjs7Ozs7O0FBTUEsSUFBSSw4Q0FBSjs7O0FBVUEsSUFBTSxlQUFlLE1BQWY7O0FBRU4sSUFBTSxrQkFBa0I7QUFDcEIsOEJBQTJCLElBQTNCO0FBQ0EsaUJBQWMsQ0FBQztBQUNYLDRFQURXO0FBRVgsaUJBQVUsMkNBQVMsSUFBVDtLQUZBLENBQWQ7QUFJQSxlQUFZLENBQUM7QUFDVCxvQkFBYSxTQUFiO0FBQ0EsaUJBQVUsMkNBQVMsSUFBVDtLQUZGLENBQVo7QUFJQSxjQUFXLHlEQUFYO0NBVkU7QUFZTixJQUFNLG1CQUFtQixDQUFDLFFBQUQsRUFBVyxTQUFYLEVBQXNCLFVBQXRCLEVBQWtDLGFBQWxDLEVBQWlELFdBQWpELENBQW5COzs7QUFHTixJQUFJLGFBQWEsRUFBYjs7QUFFSixJQUFJLGlCQUFpQixJQUFqQjs7QUFFSixJQUFJLGFBQWEsS0FBYjs7QUFFSixJQUFJLFdBQVcsRUFBWDs7Ozs7Ozs7O0FBU0csU0FBUyxTQUFULENBQW1CLE1BQW5CLEVBQTJCOztBQUVqQyxRQUFJLFVBQUosRUFBZ0I7QUFDZixnQkFBUSxLQUFSLENBQWMsZ0RBQWQsRUFEZTtBQUVmLGVBRmU7S0FBaEI7O0FBS0EsUUFBSSxDQUFDLGNBQUQsRUFBaUI7QUFDZCx5QkFBaUIsRUFBakIsQ0FEYztLQUFyQjs7QUFJRyxRQUFJLENBQUMsT0FBTyxNQUFQLElBQWlCLENBQUMsZUFBZSxNQUFmLEVBQXVCO0FBQzFDLHVCQUFlLE1BQWYsR0FBd0IsZ0JBQWdCLE1BQWhCLENBRGtCO0tBQTlDLE1BRU8sSUFBSSxPQUFPLE1BQVAsRUFBZTtBQUN0Qix1QkFBZSxNQUFmLEdBQXdCLE9BQU8sTUFBUCxDQURGO0tBQW5COzs7QUFidUIsdUJBa0JqQyxDQUFvQixPQUFPLFNBQVAsQ0FBcEI7O0FBbEJpQyxxQkFvQjlCLENBQWtCLE9BQU8sT0FBUCxDQUFsQixDQXBCOEI7O0FBc0I5QixRQUFJLE9BQU8sTUFBUCxFQUFlOztBQUVmLGtCQUFVLFVBQVYsQ0FBcUIsT0FBTyxNQUFQLENBQXJCLENBRmU7O0FBSWYsYUFBSyxJQUFJLE1BQUosSUFBYyxRQUFuQixFQUE2Qjs7QUFFekIsZ0JBQUksU0FBUyxjQUFULENBQXdCLE1BQXhCLENBQUosRUFBcUM7QUFDakMscUJBQUssSUFBSSxHQUFKLElBQVcsU0FBUyxNQUFULENBQWhCLEVBQWtDO0FBQzlCLHdCQUFJLFNBQVMsTUFBVCxFQUFpQixjQUFqQixDQUFnQyxHQUFoQyxDQUFKLEVBQTBDO0FBQ3RDLGlDQUFTLE1BQVQsRUFBaUIsR0FBakIsRUFBc0IsU0FBdEIsQ0FBZ0MsT0FBTyxNQUFQLENBQWhDLENBRHNDO3FCQUExQztpQkFESjthQURKO1NBRko7S0FKSjs7QUFrQkEscUJBQWlCLE1BQWpCLENBeEM4QjtDQUEzQjs7Ozs7Ozs7QUFrRFAsSUFBSSxzQkFBc0IsU0FBdEIsbUJBQXNCLENBQVUsU0FBVixFQUFxQjs7QUFFM0MsUUFBSSxxQkFBcUIsS0FBckIsRUFBNEI7O0FBRTVCLFlBQUksUUFBUSxVQUFVLE1BQVYsQ0FGZ0I7QUFHNUIsYUFBSyxJQUFJLElBQUksQ0FBSixFQUFPLElBQUksS0FBSixFQUFXLEdBQTNCLEVBQWdDOztBQUU1QixnQkFBSSxPQUFPLFVBQVUsQ0FBVixDQUFQLEtBQXdCLFVBQXhCLEVBQW9DO0FBQ3BDLDRCQUFZLFVBQVUsQ0FBVixDQUFaLEVBRG9DO2FBQXhDOzs7Ozs7OztTQUZKO0FBQWdDLEtBSHBDLE1Ba0JPO0FBQ0gsb0JBQVEsS0FBUixDQUFjLGdDQUFkLEVBREc7U0FsQlA7Q0FGc0I7Ozs7Ozs7O0FBZ0MxQixJQUFJLG9CQUFvQixTQUFwQixpQkFBb0IsQ0FBVSxPQUFWLEVBQW1COztBQUUxQyxRQUFJLEVBQUUsbUJBQW1CLEtBQW5CLENBQUYsRUFBNkI7QUFDaEMsY0FBTSxJQUFJLEtBQUosQ0FBVSxpQkFBVixDQUFOLENBRGdDO0tBQWpDOztBQUlHLFlBQVEsT0FBUixDQUFnQixVQUFVLE1BQVYsRUFBa0I7O0FBRTlCLFlBQUksQ0FBQyxPQUFPLE1BQVAsSUFBaUIsT0FBTyxPQUFPLE1BQVAsS0FBa0IsUUFBekIsRUFBbUM7QUFDckQsbUJBQU8sTUFBUCxHQUFnQixlQUFlLE1BQWYsQ0FEcUM7U0FBekQ7O0FBSUEsZUFBTyxHQUFQLEdBQWEsT0FBTyxHQUFQLElBQWMsWUFBZCxDQU5pQjtBQU85QixlQUFPLFFBQVAsR0FBa0IsT0FBTyxRQUFQLElBQW1CLDJDQUFTLEtBQVQsQ0FQUDs7QUFTOUIsaUJBQVMsT0FBTyxHQUFQLENBQVQsR0FBdUIsWUFBWSxPQUFPLFFBQVAsRUFBaUIsT0FBTyxNQUFQLENBQXBELENBVDhCO0tBQWxCLENBQWhCLENBTnVDO0NBQW5COzs7Ozs7Ozs7Ozs7O0FBZ0N4QixJQUFJLGNBQWMsU0FBZCxXQUFjLENBQVUsUUFBVixFQUFvQixNQUFwQixFQUE0Qjs7QUFFMUMsUUFBSSx1Q0FBSixDQUYwQztBQUcxQyxRQUFJLGVBQWUsRUFBZixDQUhzQzs7QUFLMUMsV0FBTyxJQUFQLENBQVksVUFBWixFQUF3QixPQUF4QixDQUFnQyxVQUFVLEdBQVYsRUFBZTs7QUFFM0MsaUJBQVMsVUFBQyxDQUFXLEdBQVgsRUFBZ0IsU0FBaEIseURBQUQsR0FBcUQsSUFBSSxXQUFXLEdBQVgsQ0FBSixFQUFyRCxHQUE2RSxXQUFXLEdBQVgsR0FBN0UsQ0FGa0M7O0FBSTNDLGVBQU8sV0FBUCxDQUFtQixRQUFuQixFQUoyQztBQUszQyxlQUFPLFNBQVAsQ0FBaUIsTUFBakIsRUFMMkM7O0FBTzNDLHFCQUFhLElBQWIsQ0FBa0IsTUFBbEIsRUFQMkM7S0FBZixDQUFoQyxDQUwwQzs7QUFnQjdDLFdBQU8sWUFBUCxDQWhCNkM7Q0FBNUI7Ozs7Ozs7Ozs7O0FBNkJYLFNBQVMsV0FBVCxDQUFxQixRQUFyQixFQUErQjs7QUFFckMsUUFBSSxjQUFjLENBQUMsZUFBZSxzQkFBZixFQUF1QztBQUN6RCxnQkFBUSxLQUFSLENBQWMsa0RBQWQsRUFEeUQ7QUFFekQsZUFGeUQ7S0FBMUQ7O0FBS0csc0JBQWtCLFFBQWxCOzs7QUFQa0MsUUFVOUIsQ0FBQyxXQUFXLFNBQVMsSUFBVCxDQUFaLEVBQTRCO0FBQzVCLG1CQUFXLFNBQVMsSUFBVCxDQUFYLEdBQTRCLFFBQTVCLENBRDRCO0tBQWhDO0NBVkc7Ozs7Ozs7Ozs7O0FBeUJQLElBQUksb0JBQW9CLFNBQXBCLGlCQUFvQixDQUFVLFFBQVYsRUFBb0I7Ozs7QUFJeEMsUUFBSSxTQUFTLFNBQVQseURBQUosRUFBK0M7QUFDM0MsZUFEMkM7S0FBL0MsTUFFTyxJQUFJLEVBQUUsb0JBQW9CLFFBQXBCLENBQUYsRUFBaUM7QUFDOUMsY0FBTSxJQUFJLEtBQUosQ0FBVSx1REFBVixDQUFOLENBRDhDO0tBQXJDOzs7QUFOaUMsUUFXdkMsY0FBYyxVQUFkOzs7QUFYdUMsb0JBY3hDLENBQWlCLE9BQWpCLENBQXlCLFVBQVUsT0FBVixFQUFtQjtBQUN4QyxZQUFJLFlBQVksT0FBWixLQUF3QixTQUF4QixJQUFxQyxFQUFFLFlBQVksT0FBWixhQUFnQyxRQUFoQyxDQUFGLEVBQTZDO0FBQ2xGLGtCQUFNLElBQUksS0FBSix5RUFBdUQsT0FBdkQsQ0FBTixDQURrRjtTQUF0RjtLQURxQixDQUF6QixDQWR3QztDQUFwQjs7Ozs7Ozs7O0FBNkJ4QixTQUFTLE9BQVQsQ0FBaUIsWUFBakIsRUFBK0I7OztBQUc5QixpQkFBYSxJQUFiLENBSDhCOztBQUszQixLQUFDLFNBQVMsYUFBYSxNQUFiLENBQVQsSUFBaUMsU0FBUyxZQUFULENBQWpDLENBQUQsQ0FBMEQsT0FBMUQsQ0FBa0UsVUFBVSxNQUFWLEVBQWtCOzs7QUFHNUUsZUFBTyxNQUFQLENBQWMsWUFBZDs7QUFINEUsS0FBbEIsQ0FBbEUsQ0FMMkI7Q0FBL0I7Ozs7Ozs7QUFtQk8sU0FBUyxTQUFULENBQW1CLE9BQW5CLEVBQTRCOzs7QUFHbEMsUUFBSSxDQUFDLGNBQUQsRUFBaUI7QUFDcEIsa0JBQVUsZUFBVixFQURvQjtLQUFyQjs7O0FBSGtDLFFBUTNCLE9BQU8sT0FBUCxJQUFrQixRQUFsQixFQUE0Qjs7QUFFNUIsWUFBSSxPQUFPLE9BQVAsSUFBa0IsVUFBbEIsRUFBOEI7QUFDOUIsc0JBQVUsUUFBUSxlQUFSLENBQXdCLE9BQXhCLENBQVYsQ0FEOEI7U0FBbEMsTUFFTyxJQUFJLGlDQUFPLHlEQUFQLElBQWtCLFFBQWxCLEVBQTRCOztBQUVuQyxzQkFBVSxRQUFRLGVBQVIsQ0FBd0IsUUFBUSxXQUFSLENBQWxDLENBRm1DOztBQUluQyxnQkFBSSxXQUFXLFFBQVgsRUFBcUI7QUFDckIsMEJBQVUsV0FBVixDQURxQjthQUF6QjtTQUpHLE1BUUE7QUFDSCxzQkFBVSxXQUFWLENBREc7U0FSQTtLQUpYOztBQWtCSCxXQUFPLDJDQUFXLE9BQVgsRUFBb0I7QUFDMUIsa0JBQVcsT0FBWDtLQURNLENBQVAsQ0ExQmtDO0NBQTVCOzs7Ozs7O0FBdUNBLFNBQVMsV0FBVCxDQUFxQixRQUFyQixFQUErQixNQUEvQixFQUF1Qzs7QUFFMUMsUUFBSSxvQkFBb0IsTUFBcEIsRUFBNEI7O0FBRTVCLFlBQUksV0FBVyxTQUFYLEVBQXNCO0FBQ3RCLGdCQUFJLFNBQVMsTUFBVCxDQUFKLEVBQXNCO0FBQ2xCLHlCQUFTLE1BQVQsRUFBaUIsV0FBakIsQ0FBNkIsUUFBN0IsRUFEa0I7YUFBdEI7U0FESixNQUlPOztBQUVILGlCQUFLLElBQUksTUFBSixJQUFjLFFBQW5CLEVBQTZCO0FBQ3pCLG9CQUFJLFNBQVMsY0FBVCxDQUF3QixNQUF4QixDQUFKLEVBQXFDO0FBQ2pDLHlCQUFLLElBQUksR0FBSixJQUFXLFNBQVMsTUFBVCxDQUFoQixFQUFrQztBQUM5Qiw0QkFBSSxTQUFTLE1BQVQsRUFBaUIsY0FBakIsQ0FBZ0MsR0FBaEMsQ0FBSixFQUEwQztBQUN0QyxxQ0FBUyxNQUFULEVBQWlCLEdBQWpCLEVBQXNCLFdBQXRCLENBQWtDLFFBQWxDLEVBRHNDO3lCQUExQztxQkFESjtpQkFESjthQURKO1NBTko7S0FGSjtDQUZHOztBQTBCUDs7Z0NBRVMiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogbG9nNGpzIDxodHRwczovL2dpdGh1Yi5jb20vYW5pZ2VuZXJvL2xvZzRqcz5cclxuICpcclxuICogQ29weXJpZ2h0IDIwMTYgUm9iaW4gU2NodWx0eiA8aHR0cDovL2FuaWdlbmVyby5jb20+XHJcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZVxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBIb2xkcyB0aGUgZGVmaW5pdGlvbiBmb3IgdGhlIGFwcGVuZGVyIGNsb3N1cmVcclxuICpcclxuICogQHR5cGVkZWYge3sgYXBwZW5kIDogZnVuY3Rpb24gKG51bWJlciwgTE9HX0VWRU5UKSwgaXNBY3RpdmUgOiBmdW5jdGlvbigpLFxyXG4gKiAgICAgICAgICBzZXRMb2dMZXZlbCA6IGZ1bmN0aW9uKG51bWJlciksIHNldExheW91dCA6IGZ1bmN0aW9uKHN0cmluZykgfX1cclxuICovXHJcbmxldCBBUFBFTkRFUjtcclxuXHJcbi8qKlxyXG4gKiBAdHlwZWRlZiB7eyBhbGxvd0FwcGVuZGVySW5qZWN0aW9uIDogYm9vbGVhbiwgYXBwZW5kZXJzIDogQXJyYXkuPEFQUEVOREVSPixcclxuICogXHRcdFx0YXBwbGljYXRpb24gOiBPYmplY3QsIGxvZ2dlcnMgOiBBcnJheS48TG9nQXBwZW5kZXI+LCBsYXlvdXQgOiBzdHJpbmcgfX1cclxuICovXHJcbmxldCBDT05GSUdfUEFSQU1TO1xyXG5cclxuaW1wb3J0ICogYXMgZm9ybWF0dGVyIGZyb20gJy4vZm9ybWF0dGVyJztcclxuaW1wb3J0ICogYXMgdXRpbGl0eSBmcm9tICcuL3V0aWxpdHknO1xyXG5pbXBvcnQge0xvZ0FwcGVuZGVyfSBmcm9tICcuL2FwcGVuZGVyL2FwcGVuZGVyJztcclxuaW1wb3J0IHtMb2dnZXJ9IGZyb20gJy4vbG9nZ2VyL2xvZ2dlcic7XHJcbmltcG9ydCB7TG9nTGV2ZWx9IGZyb20gJy4vY29uc3QvbG9nTGV2ZWwnO1xyXG5pbXBvcnQge0NvbnNvbGVBcHBlbmRlcn0gZnJvbSAnLi9hcHBlbmRlci9jb25zb2xlQXBwZW5kZXInO1xyXG5cclxuLyoqIEBjb25zdCAqL1xyXG5jb25zdCBfTUFJTl9MT0dHRVIgPSAnbWFpbic7XHJcbi8qKiBAY29uc3QgKi9cclxuY29uc3QgX0RFRkFVTFRfQ09ORklHID0ge1xyXG4gICAgJ2FsbG93QXBwZW5kZXJJbmplY3Rpb24nIDogdHJ1ZSxcclxuICAgICdhcHBlbmRlcnMnIDogW3tcclxuICAgICAgICAnYXBwZW5kZXInIDogQ29uc29sZUFwcGVuZGVyLFxyXG4gICAgICAgICdsZXZlbCcgOiBMb2dMZXZlbC5JTkZPXHJcblx0fV0sXHJcbiAgICAnbG9nZ2VycycgOiBbe1xyXG4gICAgICAgICdhcHBlbmRlcicgOiAnY29uc29sZScsXHJcbiAgICAgICAgJ2xldmVsJyA6IExvZ0xldmVsLklORk9cclxuICAgIH1dLFxyXG4gICAgJ2xheW91dCcgOiAnJWR7eXl5eS1NTS1kZCBISDptbTpzcy5TU1N9IFslbGV2ZWxdICVsb2dnZXIgLSAlbWVzc2FnZSdcclxufTtcclxuY29uc3QgQVBQRU5ERVJfTUVUSE9EUyA9IFsnYXBwZW5kJywgJ2dldE5hbWUnLCAnaXNBY3RpdmUnLCAnc2V0TG9nTGV2ZWwnLCAnc2V0TGF5b3V0J107XHJcblxyXG4vKiogQHR5cGUge09iamVjdH0gKi9cclxubGV0IF9hcHBlbmRlcnMgPSB7fTtcclxuLyoqIEB0eXBlIHs/Q09ORklHX1BBUkFNU30gKi9cclxubGV0IF9jb25maWd1cmF0aW9uID0gbnVsbDtcclxuLyoqIEB0eXBlIHtib29sZWFufSAqL1xyXG5sZXQgX2ZpbmFsaXplZCA9IGZhbHNlO1xyXG4vKiogQHR5cGUge09iamVjdH0gKi9cclxubGV0IF9sb2dnZXJzID0ge307XHJcblxyXG4vKipcclxuICogQ29uZmlndXJlcyB0aGUgbG9nZ2VyXHJcbiAqXHJcbiAqIEBmdW5jdGlvblxyXG4gKlxyXG4gKiBAcGFyYW1zIHtDT05GSUdfUEFSQU1TfSBjb25maWdcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBjb25maWd1cmUoY29uZmlnKSB7XHJcblxyXG5cdGlmIChfZmluYWxpemVkKSB7XHJcblx0XHRjb25zb2xlLmVycm9yKCdDb3VsZCBub3QgY29uZmlndXJlLiBMb2dVdGlsaXR5IGFscmVhZHkgaW4gdXNlJyk7XHJcblx0XHRyZXR1cm47XHJcblx0fVxyXG5cclxuXHRpZiAoIV9jb25maWd1cmF0aW9uKSB7XHJcbiAgICAgICAgX2NvbmZpZ3VyYXRpb24gPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIWNvbmZpZy5sYXlvdXQgJiYgIV9jb25maWd1cmF0aW9uLmxheW91dCkge1xyXG4gICAgICAgIF9jb25maWd1cmF0aW9uLmxheW91dCA9IF9ERUZBVUxUX0NPTkZJRy5sYXlvdXQ7XHJcbiAgICB9IGVsc2UgaWYgKGNvbmZpZy5sYXlvdXQpIHtcclxuICAgICAgICBfY29uZmlndXJhdGlvbi5sYXlvdXQgPSBjb25maWcubGF5b3V0O1xyXG4gICAgfVxyXG5cclxuXHQvLyBjb25maWd1cmUgdGhlIGFwcGVuZGVyc1xyXG5cdF9jb25maWd1cmVBcHBlbmRlcnMoY29uZmlnLmFwcGVuZGVycyk7XHJcbiAgICAvLyBjb25maWd1cmUgdGhlIGxvZ2dlcnNcclxuICAgIF9jb25maWd1cmVMb2dnZXJzKGNvbmZpZy5sb2dnZXJzKTtcclxuXHJcbiAgICBpZiAoY29uZmlnLmxheW91dCkge1xyXG5cclxuICAgICAgICBmb3JtYXR0ZXIucHJlQ29tcGlsZShjb25maWcubGF5b3V0KTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgbG9nS2V5IGluIF9sb2dnZXJzKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoX2xvZ2dlcnMuaGFzT3duUHJvcGVydHkobG9nS2V5KSkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQga2V5IGluIF9sb2dnZXJzW2xvZ0tleV0pIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoX2xvZ2dlcnNbbG9nS2V5XS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9sb2dnZXJzW2xvZ0tleV1ba2V5XS5zZXRMYXlvdXQoY29uZmlnLmxheW91dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgX2NvbmZpZ3VyYXRpb24gPSBjb25maWc7XHJcblxyXG59XHJcblxyXG4vKipcclxuICogQHByaXZhdGVcclxuICogQGZ1bmN0aW9uXHJcbiAqXHJcbiAqIEBwYXJhbSBhcHBlbmRlcnNcclxuICovXHJcbmxldCBfY29uZmlndXJlQXBwZW5kZXJzID0gZnVuY3Rpb24gKGFwcGVuZGVycykge1xyXG5cclxuICAgIGlmIChhcHBlbmRlcnMgaW5zdGFuY2VvZiBBcnJheSkge1xyXG5cclxuICAgICAgICBsZXQgY291bnQgPSBhcHBlbmRlcnMubGVuZ3RoO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBhcHBlbmRlcnNbaV0gPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgIGFkZEFwcGVuZGVyKGFwcGVuZGVyc1tpXSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIFRPRE86IGZpeFxyXG4gICAgICAgICAgICAvLyBlbHNlIGlmICh0eXBlb2YgYXBwZW5kZXJzW2ldID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAvLyAgICAgLy8gZG8gc29tZXRoaW5nP1xyXG4gICAgICAgICAgICAvLyB9IGVsc2UgaWYgKHR5cGVvZiBhcHBlbmRlcnNbaV0gPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcignSW52YWxpZCBhcHBlbmRlciBjb25maWd1cmF0aW9uJyk7XHJcbiAgICB9XHJcblxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBmdW5jdGlvblxyXG4gKlxyXG4gKiBAcGFyYW0ge0FycmF5LjxPYmplY3Q+fSBsb2dnZXJzXHJcbiAqL1xyXG5sZXQgX2NvbmZpZ3VyZUxvZ2dlcnMgPSBmdW5jdGlvbiAobG9nZ2Vycykge1xyXG5cclxuXHRpZiAoIShsb2dnZXJzIGluc3RhbmNlb2YgQXJyYXkpKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgbG9nZ2VycycpO1xyXG5cdH1cclxuXHJcbiAgICBsb2dnZXJzLmZvckVhY2goZnVuY3Rpb24gKGxvZ2dlcikge1xyXG5cclxuICAgICAgICBpZiAoIWxvZ2dlci5sYXlvdXQgfHwgdHlwZW9mIGxvZ2dlci5sYXlvdXQgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIGxvZ2dlci5sYXlvdXQgPSBfY29uZmlndXJhdGlvbi5sYXlvdXQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsb2dnZXIudGFnID0gbG9nZ2VyLnRhZyB8fCBfTUFJTl9MT0dHRVI7XHJcbiAgICAgICAgbG9nZ2VyLmxvZ0xldmVsID0gbG9nZ2VyLmxvZ0xldmVsIHx8IExvZ0xldmVsLkVSUk9SO1xyXG5cclxuICAgICAgICBfbG9nZ2Vyc1tsb2dnZXIudGFnXSA9IF9nZXRMb2dnZXJzKGxvZ2dlci5sb2dMZXZlbCwgbG9nZ2VyLmxheW91dCk7XHJcblxyXG4gICAgfSk7XHJcblxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEdldHMgdGhlIGxvZ2dlcnMgdGhhdCBtYXRjaCB0aGUgZ2l2ZW4gcGF0dGVybiBhbmQgbG9nIGxldmVsXHJcbiAqXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBmdW5jdGlvblxyXG4gKlxyXG4gKiBAcGFyYW0ge251bWJlcn0gbG9nTGV2ZWxcclxuICogQHBhcmFtIHtzdHJpbmd9IGxheW91dFxyXG4gKlxyXG4gKiBAcmV0dXJucyB7QXJyYXl9XHJcbiAqL1xyXG5sZXQgX2dldExvZ2dlcnMgPSBmdW5jdGlvbiAobG9nTGV2ZWwsIGxheW91dCkge1xyXG5cclxuICAgIGxldCBsb2dnZXI7XHJcbiAgICBsZXQgYXBwZW5kZXJMaXN0ID0gW107XHJcblxyXG4gICAgT2JqZWN0LmtleXMoX2FwcGVuZGVycykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XHJcblxyXG4gICAgICAgIGxvZ2dlciA9IChfYXBwZW5kZXJzW2tleV0ucHJvdG90eXBlIGluc3RhbmNlb2YgTG9nQXBwZW5kZXIpID8gbmV3IF9hcHBlbmRlcnNba2V5XSgpIDogX2FwcGVuZGVyc1trZXldKCk7XHJcblxyXG4gICAgICAgIGxvZ2dlci5zZXRMb2dMZXZlbChsb2dMZXZlbCk7XHJcbiAgICAgICAgbG9nZ2VyLnNldExheW91dChsYXlvdXQpO1xyXG5cclxuICAgICAgICBhcHBlbmRlckxpc3QucHVzaChsb2dnZXIpO1xyXG5cclxuICAgIH0pO1xyXG5cclxuXHRyZXR1cm4gYXBwZW5kZXJMaXN0O1xyXG5cclxufTtcclxuXHJcbi8qKlxyXG4gKiBBZGRzIGFuIGFwcGVuZGVyIHRvIHRoZSBhcHBlbmRlciBxdWV1ZS4gSWYgdGhlIHN0YWNrIGlzIGZpbmFsaXplZCwgYW5kXHJcbiAqIHRoZSBhbGxvd0FwcGVuZGVySW5qZWN0aW9uIGlzIHNldCB0byBmYWxzZSwgdGhlbiB0aGUgZXZlbnQgd2lsbCBub3QgYmVcclxuICogYXBwZW5kZWRcclxuICpcclxuICogQGZ1bmN0aW9uXHJcbiAqXHJcbiAqIEBwYXJhbXMge0xvZ0FwcGVuZGVyfSBhcHBlbmRlclxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGFkZEFwcGVuZGVyKGFwcGVuZGVyKSB7XHJcblxyXG5cdGlmIChfZmluYWxpemVkICYmICFfY29uZmlndXJhdGlvbi5hbGxvd0FwcGVuZGVySW5qZWN0aW9uKSB7XHJcblx0XHRjb25zb2xlLmVycm9yKCdDYW5ub3QgYWRkIGFwcGVuZGVyIHdoZW4gY29uZmlndXJhdGlvbiBmaW5hbGl6ZWQnKTtcclxuXHRcdHJldHVybjtcclxuXHR9XHJcblxyXG4gICAgX3ZhbGlkYXRlQXBwZW5kZXIoYXBwZW5kZXIpO1xyXG5cclxuICAgIC8vIG9ubHkgcHV0IHRoZSBhcHBlbmRlciBpbnRvIHRoZSBzZXQgaWYgaXQgZG9lc24ndCBleGlzdCBhbHJlYWR5XHJcbiAgICBpZiAoIV9hcHBlbmRlcnNbYXBwZW5kZXIubmFtZV0pIHtcclxuICAgICAgICBfYXBwZW5kZXJzW2FwcGVuZGVyLm5hbWVdID0gYXBwZW5kZXI7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG4vKipcclxuICogVmFsaWRhdGVzIHRoYXQgdGhlIGFwcGVuZGVyXHJcbiAqXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBmdW5jdGlvblxyXG4gKlxyXG4gKiBAcGFyYW1zIHtBUFBFTkRFUn0gYXBwZW5kZXJcclxuICogQHRocm93cyB7RXJyb3J9IGlmIHRoZSBhcHBlbmRlciBpcyBpbnZhbGlkXHJcbiAqL1xyXG5sZXQgX3ZhbGlkYXRlQXBwZW5kZXIgPSBmdW5jdGlvbiAoYXBwZW5kZXIpIHtcclxuXHJcbiAgICAvLyBpZiB3ZSBhcmUgcnVubmluZyBFUzYsIHdlIGNhbiBtYWtlIHN1cmUgaXQgZXh0ZW5kcyBMb2dBcHBlbmRlclxyXG4gICAgLy8gb3RoZXJ3aXNlLCBpdCBtdXN0IGJlIGEgZnVuY3Rpb25cclxuICAgIGlmIChhcHBlbmRlci5wcm90b3R5cGUgaW5zdGFuY2VvZiBMb2dBcHBlbmRlcikge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH0gZWxzZSBpZiAoIShhcHBlbmRlciBpbnN0YW5jZW9mIEZ1bmN0aW9uKSkge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGFwcGVuZGVyOiBub3QgYSBmdW5jdGlvbiBvciBjbGFzcyBMb2dBcHBlbmRlcicpO1xyXG5cdH1cclxuXHJcblx0Ly8gaW5zdGFudGlhdGUgdGhlIGFwcGVuZGVyIGZ1bmN0aW9uXHJcblx0bGV0IGFwcGVuZGVyT2JqID0gYXBwZW5kZXIoKTtcclxuXHJcbiAgICAvLyBlbnN1cmUgdGhhdCB0aGUgYXBwZW5kZXIgbWV0aG9kcyBhcmUgcHJlc2VudCAoYW5kIGFyZSBmdW5jdGlvbnMpXHJcbiAgICBBUFBFTkRFUl9NRVRIT0RTLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICBpZiAoYXBwZW5kZXJPYmpbZWxlbWVudF0gPT0gdW5kZWZpbmVkIHx8ICEoYXBwZW5kZXJPYmpbZWxlbWVudF0gaW5zdGFuY2VvZiBGdW5jdGlvbikpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGFwcGVuZGVyOiBtaXNzaW5nL2ludmFsaWQgbWV0aG9kOiAke2VsZW1lbnR9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEFwcGVuZHMgdGhlIGxvZyBldmVudFxyXG4gKlxyXG4gKiBAZnVuY3Rpb25cclxuICpcclxuICogQHBhcmFtIHtPYmplY3R9IGxvZ2dpbmdFdmVudFxyXG4gKi9cclxuZnVuY3Rpb24gX2FwcGVuZChsb2dnaW5nRXZlbnQpIHtcclxuXHJcblx0Ly8gZmluYWxpemUgdGhlIGNvbmZpZ3VyYXRpb24gdG8gbWFrZSBzdXJlIG5vIG90aGVyIGFwcGVuZGVyIGNhbiBiZSBpbmplY3RlZCAoaWYgc2V0KVxyXG5cdF9maW5hbGl6ZWQgPSB0cnVlO1xyXG5cclxuICAgIChfbG9nZ2Vyc1tsb2dnaW5nRXZlbnQubG9nZ2VyXSB8fCBfbG9nZ2Vyc1tfTUFJTl9MT0dHRVJdKS5mb3JFYWNoKGZ1bmN0aW9uIChsb2dnZXIpIHtcclxuICAgICAgICAvLyBUT0RPOiBsb2dnZXIgYWN0aXZlP1xyXG4gICAgICAgIC8vIGlmIChsb2dnZXIuaXNBY3RpdmUobG9nZ2luZ0V2ZW50LmxldmVsKSkge1xyXG4gICAgICAgICAgICBsb2dnZXIuYXBwZW5kKGxvZ2dpbmdFdmVudCk7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgfSk7XHJcblxyXG59XHJcblxyXG4vKipcclxuICogSGFuZGxlcyBjcmVhdGluZyB0aGUgbG9nZ2VyIGFuZCByZXR1cm5pbmcgaXRcclxuICogQHBhcmFtIHtmdW5jdGlvbnxzdHJpbmd9IGNvbnRleHRcclxuICogQHJldHVybiB7TG9nZ2VyfVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGdldExvZ2dlcihjb250ZXh0KSB7XHJcblxyXG5cdC8vIHdlIG5lZWQgdG8gaW5pdGlhbGl6ZSBpZiB3ZSBoYXZlbid0XHJcblx0aWYgKCFfY29uZmlndXJhdGlvbikge1xyXG5cdFx0Y29uZmlndXJlKF9ERUZBVUxUX0NPTkZJRyk7XHJcblx0fVxyXG5cclxuICAgIC8vIGRldGVybWluZSB0aGUgY29udGV4dFxyXG4gICAgaWYgKHR5cGVvZiBjb250ZXh0ICE9ICdzdHJpbmcnKSB7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgY29udGV4dCA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIGNvbnRleHQgPSB1dGlsaXR5LmdldEZ1bmN0aW9uTmFtZShjb250ZXh0KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBjb250ZXh0ID09ICdvYmplY3QnKSB7XHJcblxyXG4gICAgICAgICAgICBjb250ZXh0ID0gdXRpbGl0eS5nZXRGdW5jdGlvbk5hbWUoY29udGV4dC5jb25zdHJ1Y3Rvcik7XHJcblxyXG4gICAgICAgICAgICBpZiAoY29udGV4dCA9PSAnT2JqZWN0Jykge1xyXG4gICAgICAgICAgICAgICAgY29udGV4dCA9ICdhbm9ueW1vdXMnO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnRleHQgPSAnYW5vbnltb3VzJztcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuXHRyZXR1cm4gbmV3IExvZ2dlcihjb250ZXh0LCB7XHJcblx0XHQnYXBwZW5kJyA6IF9hcHBlbmRcclxuXHR9KTtcclxuXHJcbn1cclxuXHJcblxyXG5cclxuLyoqXHJcbiAqIFNldHMgdGhlIGxvZyBsZXZlbCBmb3IgYWxsIGxvZ2dlcnMsIG9yIHNwZWNpZmllZCBsb2dnZXJcclxuICogQHBhcmFtIHtudW1iZXJ9IGxvZ0xldmVsXHJcbiAqIEBwYXJhbSB7c3RyaW5nPX0gbG9nZ2VyXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gc2V0TG9nTGV2ZWwobG9nTGV2ZWwsIGxvZ2dlcikge1xyXG5cclxuICAgIGlmIChsb2dMZXZlbCBpbnN0YW5jZW9mIE51bWJlcikge1xyXG5cclxuICAgICAgICBpZiAobG9nZ2VyICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgaWYgKF9sb2dnZXJzW2xvZ2dlcl0pIHtcclxuICAgICAgICAgICAgICAgIF9sb2dnZXJzW2xvZ2dlcl0uc2V0TG9nTGV2ZWwobG9nTGV2ZWwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGxvZ0tleSBpbiBfbG9nZ2Vycykge1xyXG4gICAgICAgICAgICAgICAgaWYgKF9sb2dnZXJzLmhhc093blByb3BlcnR5KGxvZ0tleSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gX2xvZ2dlcnNbbG9nS2V5XSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoX2xvZ2dlcnNbbG9nS2V5XS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfbG9nZ2Vyc1tsb2dLZXldW2tleV0uc2V0TG9nTGV2ZWwobG9nTGV2ZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5hZGRBcHBlbmRlcihDb25zb2xlQXBwZW5kZXIpO1xyXG5cclxuZXhwb3J0IHsgTG9nTGV2ZWwgfTtcclxuIl19

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
	var formatSequenceNumber_ = function formatSequenceNumber_(logEvent) {
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
	//# sourceMappingURL=data:application/json;base64,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VCxHQUFvQixVQUFVLElBQVYsQ0FBZSxHQUFmLENBQXBCLENBRE07S0FKUDtHQWJELE1BcUJPOztBQUVOLGFBQVMsTUFBVCxHQUFrQixHQUFsQixDQUZNO0FBR04sYUFBUyxRQUFULEdBQW9CLFdBQXBCLENBSE07QUFJTixhQUFTLFVBQVQsR0FBc0IsR0FBdEIsQ0FKTTtHQXJCUDtDQUZxQjs7Ozs7Ozs7OztBQXlDZixTQUFTLFVBQVQsQ0FBb0IsTUFBcEIsRUFBNEI7QUFDbEMscUJBQW1CLE1BQW5CLEVBRGtDO0NBQTVCOzs7Ozs7Ozs7OztBQWFBLFNBQVMsTUFBVCxDQUFnQixNQUFoQixFQUF3QixRQUF4QixFQUFrQztBQUN4QyxTQUFPLGdCQUFnQixtQkFBbUIsTUFBbkIsQ0FBaEIsRUFBNEMsUUFBNUMsQ0FBUCxDQUR3QztDQUFsQyIsImZpbGUiOiJmb3JtYXR0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogbG9nNGpzIDxodHRwczovL2dpdGh1Yi5jb20vYW5pZ2VuZXJvL2xvZzRqcz5cclxuICpcclxuICogQ29weXJpZ2h0IDIwMTYtcHJlc2VudCBSb2JpbiBTY2h1bHR6IDxodHRwOi8vYW5pZ2VuZXJvLmNvbT5cclxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlXHJcbiAqL1xyXG5cclxuaW1wb3J0IHtkYXRlRm9ybWF0fSBmcm9tICcuL2RhdGVGb3JtYXR0ZXInO1xyXG5pbXBvcnQgKiBhcyB1dGlsaXR5IGZyb20gJy4vdXRpbGl0eSc7XHJcbmltcG9ydCB7TG9nTGV2ZWx9IGZyb20gJy4vY29uc3QvbG9nTGV2ZWwnO1xyXG5cclxuLyoqIEBjb25zdCAqL1xyXG5jb25zdCBfQ09NTUFORF9SRUdFWCA9IC8lKFthLXosQS1aXSspKD89XFx7fCkvO1xyXG5cclxuLyoqIEB0eXBlIHtPYmplY3R9ICovXHJcbmxldCBfY29tcGlsZWRMYXlvdXRzID0ge307XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcclxuICpcclxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XHJcbiAqXHJcbiAqIEByZXR1cm4ge3N0cmluZ31cclxuICovXHJcbmxldCBfZm9ybWF0TG9nZ2VyID0gZnVuY3Rpb24gKGxvZ0V2ZW50KSB7XHJcblx0cmV0dXJuIGxvZ0V2ZW50LmxvZ2dlcjtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGZvcm1hdHRlclxyXG4gKlxyXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcclxuICogQHBhcmFtIHtBcnJheS48c3RyaW5nPn0gcGFyYW1zXHJcbiAqXHJcbiAqIEByZXR1cm4ge3N0cmluZ31cclxuICovXHJcbmxldCBfZm9ybWF0RGF0ZSA9IGZ1bmN0aW9uIChsb2dFdmVudCwgcGFyYW1zKSB7XHJcblx0cmV0dXJuIGRhdGVGb3JtYXQobG9nRXZlbnQuZGF0ZSwgcGFyYW1zWzBdKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGZvcm1hdHRlclxyXG4gKlxyXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcclxuICpcclxuICogQHJldHVybiB7c3RyaW5nfVxyXG4gKi9cclxubGV0IF9mb3JtYXRFeGNlcHRpb24gPSBmdW5jdGlvbiAobG9nRXZlbnQpIHtcclxuXHJcbiAgICBsZXQgbWVzc2FnZSA9ICcnO1xyXG5cclxuICAgIGlmIChsb2dFdmVudC5lcnJvciAhPSBudWxsKSB7XHJcblxyXG5cdFx0aWYgKGxvZ0V2ZW50LmVycm9yLnN0YWNrICE9IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRsZXQgc3RhY2tzID0gbG9nRXZlbnQuZXJyb3Iuc3RhY2suc3BsaXQoL1xcbi9nKTtcclxuICAgICAgICAgICAgc3RhY2tzLmZvckVhY2goZnVuY3Rpb24gKHN0YWNrKSB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlICs9IGBcXHQke3N0YWNrfVxcbmA7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cdFx0fSBlbHNlIGlmIChsb2dFdmVudC5lcnJvci5tZXNzYWdlICE9IG51bGwgJiYgbG9nRXZlbnQuZXJyb3IubWVzc2FnZSAhPSAnJykge1xyXG5cdFx0XHRtZXNzYWdlICs9IGBcXHQke2xvZ0V2ZW50LmVycm9yLm5hbWV9OiAke2xvZ0V2ZW50LmVycm9yLm1lc3NhZ2V9XFxuYDtcclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHRyZXR1cm4gbWVzc2FnZTtcclxuXHJcbn07XHJcblxyXG4vKipcclxuICogRm9ybWF0cyB0aGUgZmlsZSAoZS5nLiB0ZXN0LmpzKSB0byB0aGUgZmlsZVxyXG4gKlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGZvcm1hdHRlclxyXG4gKlxyXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcclxuICovXHJcbmxldCBfZm9ybWF0RmlsZSA9IGZ1bmN0aW9uIChsb2dFdmVudCkge1xyXG5cclxuICAgIGlmICghbG9nRXZlbnQuZmlsZSkge1xyXG5cdFx0X2dldEZpbGVEZXRhaWxzKGxvZ0V2ZW50KTtcclxuXHR9XHJcblxyXG5cdHJldHVybiBsb2dFdmVudC5maWxlO1xyXG5cclxufTtcclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGZvcm1hdHRlclxyXG4gKlxyXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcclxuICpcclxuICogQHJldHVybiB7c3RyaW5nfVxyXG4gKi9cclxubGV0IF9mb3JtYXRMaW5lTnVtYmVyID0gZnVuY3Rpb24gKGxvZ0V2ZW50KSB7XHJcblxyXG4gICAgaWYgKCFsb2dFdmVudC5saW5lTnVtYmVyKSB7XHJcblx0XHRfZ2V0RmlsZURldGFpbHMobG9nRXZlbnQpO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIGAke2xvZ0V2ZW50LmxpbmVOdW1iZXJ9YDtcclxuXHJcbn07XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcclxuICpcclxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XHJcbiAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz59IHBhcmFtc1xyXG4gKlxyXG4gKiBAcmV0dXJuIHtzdHJpbmd9XHJcbiAqL1xyXG5sZXQgX2Zvcm1hdE1hcE1lc3NhZ2UgPSBmdW5jdGlvbiAobG9nRXZlbnQsIHBhcmFtcykge1xyXG5cdGxldCBtZXNzYWdlID0gbnVsbDtcclxuXHRpZiAobG9nRXZlbnQucHJvcGVydGllcykge1xyXG5cclxuXHRcdG1lc3NhZ2UgPSBbXTtcclxuXHRcdGZvciAobGV0IGtleSBpbiBsb2dFdmVudC5wcm9wZXJ0aWVzKSB7XHJcblx0XHRcdGlmIChwYXJhbXNbMF0pIHtcclxuXHRcdFx0XHRpZiAocGFyYW1zWzBdID09IGtleSkge1xyXG5cdFx0XHRcdFx0bWVzc2FnZS5wdXNoKGxvZ0V2ZW50LnByb3BlcnRpZXNba2V5XSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdG1lc3NhZ2UucHVzaCgneycgKyBrZXkgKyAnLCcgKyBsb2dFdmVudC5wcm9wZXJ0aWVzW2tleV0gKyAnfScpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuICd7JyArIG1lc3NhZ2Uuam9pbignLCcpICsgJ30nO1xyXG5cclxuXHR9XHJcblx0cmV0dXJuIG1lc3NhZ2U7XHJcbn07XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcclxuICpcclxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XHJcbiAqXHJcbiAqIEByZXR1cm4ge3N0cmluZ31cclxuICovXHJcbmxldCBfZm9ybWF0TG9nTWVzc2FnZSA9IGZ1bmN0aW9uIChsb2dFdmVudCkge1xyXG5cdHJldHVybiBsb2dFdmVudC5tZXNzYWdlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXHJcbiAqXHJcbiAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dFdmVudFxyXG4gKlxyXG4gKiBAcmV0dXJuIHtzdHJpbmd9XHJcbiAqL1xyXG5sZXQgX2Zvcm1hdE1ldGhvZE5hbWUgPSBmdW5jdGlvbiAobG9nRXZlbnQpIHtcclxuXHRyZXR1cm4gdXRpbGl0eS5nZXRGdW5jdGlvbk5hbWUobG9nRXZlbnQubWV0aG9kKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGZvcm1hdHRlclxyXG4gKi9cclxubGV0IF9mb3JtYXRMaW5lU2VwYXJhdG9yID0gZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiAnXFxuJztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGZvcm1hdHRlclxyXG4gKlxyXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcclxuICpcclxuICogQHJldHVybiB7c3RyaW5nfVxyXG4gKi9cclxubGV0IF9mb3JtYXRMZXZlbCA9IGZ1bmN0aW9uIChsb2dFdmVudCkge1xyXG5cclxuICAgIHN3aXRjaCAobG9nRXZlbnQubGV2ZWwpIHtcclxuXHJcbiAgICAgICAgY2FzZSBMb2dMZXZlbC5GQVRBTDpcclxuICAgICAgICAgICAgcmV0dXJuICdGQVRBTCc7XHJcbiAgICAgICAgY2FzZSBMb2dMZXZlbC5FUlJPUjpcclxuICAgICAgICAgICAgcmV0dXJuICdFUlJPUic7XHJcbiAgICAgICAgY2FzZSBMb2dMZXZlbC5XQVJOOlxyXG4gICAgICAgICAgICByZXR1cm4gJ1dBUk4nO1xyXG4gICAgICAgIGNhc2UgTG9nTGV2ZWwuSU5GTzpcclxuICAgICAgICAgICAgcmV0dXJuICdJTkZPJztcclxuICAgICAgICBjYXNlIExvZ0xldmVsLkRFQlVHOlxyXG4gICAgICAgICAgICByZXR1cm4gJ0RFQlVHJztcclxuICAgICAgICBjYXNlIExvZ0xldmVsLlRSQUNFOlxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiAnVFJBQ0UnO1xyXG5cclxuICAgIH1cclxuXHJcbn07XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcclxuICpcclxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XHJcbiAqXHJcbiAqIEByZXR1cm4ge3N0cmluZ31cclxuICovXHJcbmxldCBfZm9ybWF0UmVsYXRpdmUgPSBmdW5jdGlvbiAobG9nRXZlbnQpIHtcclxuXHRyZXR1cm4gJycgKyBsb2dFdmVudC5yZWxhdGl2ZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGZvcm1hdHRlclxyXG4gKlxyXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcclxuICpcclxuICogQHJldHVybiB7c3RyaW5nfVxyXG4gKi9cclxubGV0IGZvcm1hdFNlcXVlbmNlTnVtYmVyXyA9IGZ1bmN0aW9uIChsb2dFdmVudCkge1xyXG5cdHJldHVybiAnJyArIGxvZ0V2ZW50LnNlcXVlbmNlO1xyXG59O1xyXG5cclxubGV0IF9mb3JtYXR0ZXJzID0ge1xyXG5cdCdjfGxvZ2dlcicgOiBfZm9ybWF0TG9nZ2VyLFxyXG5cdCdkfGRhdGUnIDogX2Zvcm1hdERhdGUsXHJcblx0J2V4fGV4Y2VwdGlvbnx0aHJvd2FibGUnIDogX2Zvcm1hdEV4Y2VwdGlvbixcclxuXHQnRnxmaWxlJyA6IF9mb3JtYXRGaWxlLFxyXG5cdCdLfG1hcHxNQVAnIDogX2Zvcm1hdE1hcE1lc3NhZ2UsXHJcblx0J0x8bGluZScgOiBfZm9ybWF0TGluZU51bWJlcixcclxuXHQnbXxtc2d8bWVzc2FnZScgOiBfZm9ybWF0TG9nTWVzc2FnZSxcclxuXHQnTXxtZXRob2QnIDogX2Zvcm1hdE1ldGhvZE5hbWUsXHJcblx0J24nIDogX2Zvcm1hdExpbmVTZXBhcmF0b3IsXHJcblx0J3B8bGV2ZWwnIDogX2Zvcm1hdExldmVsLFxyXG5cdCdyfHJlbGF0aXZlJyA6IF9mb3JtYXRSZWxhdGl2ZSxcclxuXHQnc258c2VxdWVuY2VOdW1iZXInIDogZm9ybWF0U2VxdWVuY2VOdW1iZXJfXHJcbn07XHJcblxyXG4vKipcclxuICogR2V0IHRoZSBjb21waWxlZCBsYXlvdXQgZm9yIHRoZSBzcGVjaWZpZWQgbGF5b3V0IHN0cmluZy4gSWYgdGhlIGNvbXBpbGVkIGxheW91dCBkb2VzIG5vdFxyXG4gKiBleGlzdCwgdGhlbiB3ZSB3YW50IHRvIGNyZWF0ZSBpdC5cclxuICpcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IGxheW91dFxyXG4gKlxyXG4gKiBAcmV0dXJuIHtBcnJheS48c3RyaW5nfGZ1bmN0aW9uPn1cclxuICovXHJcbmxldCBfZ2V0Q29tcGlsZWRMYXlvdXQgPSBmdW5jdGlvbiAobGF5b3V0KSB7XHJcblxyXG5cdGlmIChfY29tcGlsZWRMYXlvdXRzW2xheW91dF0pIHtcclxuXHRcdHJldHVybiBfY29tcGlsZWRMYXlvdXRzW2xheW91dF07XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gX2NvbXBpbGVMYXlvdXQobGF5b3V0KTtcclxuXHJcbn07XHJcblxyXG4vKipcclxuICogQ29tcGlsZXMgYSBsYXlvdXQgaW50byBhbiBhcnJheS4gVGhlIGFycmF5IGNvbnRhaW5zIGZ1bmN0aW9uc1xyXG4gKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGZvcm1hdHRlclxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gbGF5b3V0XHJcbiAqXHJcbiAqIEByZXR1cm4ge0FycmF5LjxzdHJpbmd8ZnVuY3Rpb24+fVxyXG4gKi9cclxubGV0IF9jb21waWxlTGF5b3V0ID0gZnVuY3Rpb24gKGxheW91dCkge1xyXG5cclxuXHRsZXQgaW5kZXggPSBsYXlvdXQuaW5kZXhPZignJScpO1xyXG5cdGxldCBjdXJyZW50Rm9ybWF0U3RyaW5nID0gJyc7XHJcblx0bGV0IGZvcm1hdEFycmF5ID0gW107XHJcblxyXG5cdGlmIChpbmRleCAhPSAwKSB7XHJcblx0XHRmb3JtYXRBcnJheS5wdXNoKGxheW91dC5zdWJzdHJpbmcoMCwgaW5kZXgpKTtcclxuXHR9XHJcblxyXG5cdGRvIHtcclxuXHJcblx0XHRsZXQgc3RhcnRJbmRleCA9IGluZGV4O1xyXG5cdFx0bGV0IGVuZEluZGV4ID0gaW5kZXggPSBsYXlvdXQuaW5kZXhPZignJScsIGluZGV4ICsgMSk7XHJcblxyXG5cdFx0aWYgKGVuZEluZGV4IDwgMCkge1xyXG5cdFx0XHRjdXJyZW50Rm9ybWF0U3RyaW5nID0gbGF5b3V0LnN1YnN0cmluZyhzdGFydEluZGV4KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGN1cnJlbnRGb3JtYXRTdHJpbmcgPSBsYXlvdXQuc3Vic3RyaW5nKHN0YXJ0SW5kZXgsIGVuZEluZGV4KTtcclxuXHRcdH1cclxuXHJcblx0XHRmb3JtYXRBcnJheS5wdXNoKF9nZXRGb3JtYXR0ZXJPYmplY3QoY3VycmVudEZvcm1hdFN0cmluZykpO1xyXG5cclxuXHR9IHdoaWxlIChpbmRleCA+IC0xKTtcclxuXHJcbiAgICAvLyBzZXQgdGhlIGZvcm1hdCBhcnJheSB0byB0aGUgc3BlY2lmaWVkIGNvbXBpbGVkIGxheW91dFxyXG5cdF9jb21waWxlZExheW91dHNbbGF5b3V0XSA9IGZvcm1hdEFycmF5O1xyXG5cclxuXHRyZXR1cm4gZm9ybWF0QXJyYXk7XHJcblxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBmb3JtYXRTdHJpbmdcclxuICpcclxuICogQHJldHVybiB7T2JqZWN0fHN0cmluZ31cclxuICovXHJcbmxldCBfZ2V0Rm9ybWF0dGVyT2JqZWN0ID0gZnVuY3Rpb24gKGZvcm1hdFN0cmluZykge1xyXG5cclxuXHRsZXQgcmVzdWx0ID0gX0NPTU1BTkRfUkVHRVguZXhlYyhmb3JtYXRTdHJpbmcpO1xyXG5cdGlmIChyZXN1bHQgIT0gbnVsbCAmJiByZXN1bHQubGVuZ3RoID09IDIpIHtcclxuXHJcblx0XHRsZXQgZm9ybWF0dGVyID0gX2dldEZvcm1hdHRlckZ1bmN0aW9uKHJlc3VsdFsxXSk7XHJcblx0XHRpZiAoIWZvcm1hdHRlcikge1xyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgcGFyYW1zID0gX2dldExheW91dFRhZ1BhcmFtcyhmb3JtYXRTdHJpbmcpO1xyXG5cclxuXHRcdGxldCBhZnRlciA9ICcnO1xyXG5cdFx0bGV0IGVuZEluZGV4ID0gZm9ybWF0U3RyaW5nLmxhc3RJbmRleE9mKCd9Jyk7XHJcblx0XHRpZiAoZW5kSW5kZXggIT0gLTEpIHtcclxuXHRcdFx0YWZ0ZXIgPSBmb3JtYXRTdHJpbmcuc3Vic3RyaW5nKGVuZEluZGV4ICsgMSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRhZnRlciA9IGZvcm1hdFN0cmluZy5zdWJzdHJpbmcocmVzdWx0LmluZGV4ICsgcmVzdWx0WzFdLmxlbmd0aCArIDEpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdCdmb3JtYXR0ZXInIDogZm9ybWF0dGVyLFxyXG5cdFx0XHQncGFyYW1zJyA6IHBhcmFtcyxcclxuXHRcdFx0J2FmdGVyJyA6IGFmdGVyXHJcblx0XHR9O1xyXG5cclxuXHR9XHJcblxyXG5cdHJldHVybiBmb3JtYXRTdHJpbmc7XHJcblxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb21tYW5kXHJcbiAqXHJcbiAqIEByZXR1cm4gez9zdHJpbmd9XHJcbiAqL1xyXG5sZXQgX2dldEZvcm1hdHRlckZ1bmN0aW9uID0gZnVuY3Rpb24gKGNvbW1hbmQpIHtcclxuXHJcblx0bGV0IHJlZ2V4O1xyXG5cdGZvciAobGV0IGtleSBpbiBfZm9ybWF0dGVycykge1xyXG5cdFx0cmVnZXggPSBuZXcgUmVnRXhwKCdeJyArIGtleSArICckJyk7XHJcblx0XHRpZiAocmVnZXguZXhlYyhjb21tYW5kKSkge1xyXG5cdFx0XHRyZXR1cm4gX2Zvcm1hdHRlcnNba2V5XTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJldHVybiBudWxsO1xyXG5cclxufTtcclxuXHJcbi8qKlxyXG4gKiBHZXRzIHRoZSBsYXlvdXQgdGFnIHBhcmFtcyBhc3NvY2lhdGVkIHdpdGggdGhlIGxheW91dCB0YWcuIFNvLCBmb3IgZXhhbXBsZSwgJyVke3l5eXktTU0tZGR9YFxyXG4gKiB3b3VsZCBvdXRwdXQgYW4gYXJyYXkgb2YgWyd5eXl5LU1NLWRkJ11cclxuICpcclxuICogQHByaXZhdGVcclxuICogQGZ1bmN0aW9uXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb21tYW5kXHJcbiAqXHJcbiAqIEByZXR1cm4ge0FycmF5LjxzdHJpbmc+fVxyXG4gKi9cclxubGV0IF9nZXRMYXlvdXRUYWdQYXJhbXMgPSBmdW5jdGlvbiAoY29tbWFuZCkge1xyXG5cclxuXHRsZXQgcGFyYW1zID0gW107XHJcblx0bGV0IHJlc3VsdCA9IGNvbW1hbmQubWF0Y2goL1xceyhbXn1dKikoPz19KS9nKTtcclxuXHRpZiAocmVzdWx0ICE9IG51bGwpIHtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcmVzdWx0Lmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHBhcmFtcy5wdXNoKHJlc3VsdFtpXS5zdWJzdHJpbmcoMSkpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIHBhcmFtcztcclxuXHJcbn07XHJcblxyXG4vKipcclxuICogSGFuZGxlcyBmb3JtYXR0aW5nIHRoZSBsb2cgZXZlbnQgdXNpbmcgdGhlIHNwZWNpZmllZCBmb3JtYXR0ZXIgYXJyYXlcclxuICpcclxuICogQHByaXZhdGVcclxuICogQGZ1bmN0aW9uXHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXkuPGZ1bmN0aW9ufHN0cmluZz59IGZvcm1hdHRlclxyXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcclxuICpcclxuICogQHJldHVybiB7c3RyaW5nfVxyXG4gKi9cclxubGV0IF9mb3JtYXRMb2dFdmVudCA9IGZ1bmN0aW9uIChmb3JtYXR0ZXIsIGxvZ0V2ZW50KSB7XHJcblxyXG5cdGxldCByZXNwb25zZTtcclxuXHRsZXQgbWVzc2FnZSA9ICcnO1xyXG5cdGxldCBjb3VudCA9IGZvcm1hdHRlci5sZW5ndGg7XHJcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XHJcblx0XHRpZiAoZm9ybWF0dGVyW2ldICE9PSBudWxsKSB7XHJcblxyXG5cdFx0XHRpZiAoZm9ybWF0dGVyW2ldIGluc3RhbmNlb2YgT2JqZWN0KSB7XHJcblxyXG5cdFx0XHRcdHJlc3BvbnNlID0gZm9ybWF0dGVyW2ldLmZvcm1hdHRlcihsb2dFdmVudCwgZm9ybWF0dGVyW2ldLnBhcmFtcyk7XHJcblx0XHRcdFx0aWYgKHJlc3BvbnNlICE9IG51bGwpIHtcclxuXHRcdFx0XHRcdG1lc3NhZ2UgKz0gcmVzcG9uc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG1lc3NhZ2UgKz0gZm9ybWF0dGVyW2ldLmFmdGVyO1xyXG5cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRtZXNzYWdlICs9IGZvcm1hdHRlcltpXTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJldHVybiBtZXNzYWdlLnRyaW0oKTtcclxuXHJcbn07XHJcblxyXG4vKipcclxuICpcclxuICogQHByaXZhdGVcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcclxuICpcclxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XHJcbiAqL1xyXG5sZXQgX2dldEZpbGVEZXRhaWxzID0gZnVuY3Rpb24gKGxvZ0V2ZW50KSB7XHJcblxyXG5cdGlmIChsb2dFdmVudC5sb2dFcnJvclN0YWNrKSB7XHJcblxyXG5cdFx0bGV0IHBhcnRzID0gbG9nRXZlbnQubG9nRXJyb3JTdGFjay5zdGFjay5zcGxpdCgvXFxuL2cpO1xyXG5cdFx0bGV0IGZpbGUgPSBwYXJ0c1szXTtcclxuXHRcdGZpbGUgPSBmaWxlLnJlcGxhY2UoL2F0ICguKlxcKHwpKGZpbGV8aHR0cHxodHRwc3wpKDp8KShcXC98KSovLCAnJyk7XHJcblx0XHRmaWxlID0gZmlsZS5yZXBsYWNlKCcpJywgJycpO1xyXG5cdFx0ZmlsZSA9IGZpbGUucmVwbGFjZSgodHlwZW9mIGxvY2F0aW9uICE9PSAndW5kZWZpbmVkJykgPyBsb2NhdGlvbi5ob3N0IDogJycsICcnKS50cmltKCk7XHJcblxyXG5cdFx0bGV0IGZpbGVQYXJ0cyA9IGZpbGUuc3BsaXQoL1xcOi9nKTtcclxuXHJcblx0XHRsb2dFdmVudC5jb2x1bW4gPSBmaWxlUGFydHMucG9wKCk7XHJcblx0XHRsb2dFdmVudC5saW5lTnVtYmVyID0gZmlsZVBhcnRzLnBvcCgpO1xyXG5cclxuXHRcdGlmICh0eXBlb2YgZGVmaW5lICE9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHRsZXQgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcclxuXHRcdFx0bGV0IGFwcERpciA9IHBhdGguZGlybmFtZShyZXF1aXJlLm1haW4uZmlsZW5hbWUpO1xyXG5cdFx0XHRsb2dFdmVudC5maWxlbmFtZSA9IGZpbGVQYXJ0cy5qb2luKCc6JykucmVwbGFjZShhcHBEaXIsICcnKS5yZXBsYWNlKC8oXFxcXHxcXC8pLywgJycpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0bG9nRXZlbnQuZmlsZW5hbWUgPSBmaWxlUGFydHMuam9pbignOicpO1xyXG5cdFx0fVxyXG5cclxuXHR9IGVsc2Uge1xyXG5cclxuXHRcdGxvZ0V2ZW50LmNvbHVtbiA9ICc/JztcclxuXHRcdGxvZ0V2ZW50LmZpbGVuYW1lID0gJ2Fub255bW91cyc7XHJcblx0XHRsb2dFdmVudC5saW5lTnVtYmVyID0gJz8nO1xyXG5cclxuXHR9XHJcblxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBsYXlvdXRcclxuICpcclxuICogQHJldHVybiB7c3RyaW5nfVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHByZUNvbXBpbGUobGF5b3V0KSB7XHJcblx0X2dldENvbXBpbGVkTGF5b3V0KGxheW91dCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGZvcm1hdHRlclxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gbGF5b3V0XHJcbiAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dFdmVudFxyXG4gKlxyXG4gKiBAcmV0dXJuIHtzdHJpbmd9XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0KGxheW91dCwgbG9nRXZlbnQpIHtcclxuXHRyZXR1cm4gX2Zvcm1hdExvZ0V2ZW50KF9nZXRDb21waWxlZExheW91dChsYXlvdXQpLCBsb2dFdmVudCk7XHJcbn1cclxuIl19

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
		'dayNames': ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
		'monthNames': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
	};

	var TOKEN = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|'[^']*'|'[^']*'/g;
	var TIMEZONE = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g;
	var TIMEZONE_CLIP = /[^-+\dA-Z]/g;

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

		var _ = utc ? 'getUTC' : 'get';
		var d = date[_ + 'Date']();
		var D = date[_ + 'Day']();
		var m = date[_ + 'Month']();
		var y = date[_ + 'FullYear']();
		var H = date[_ + 'Hours']();
		var M = date[_ + 'Minutes']();
		var s = date[_ + 'Seconds']();
		var L = date[_ + 'Milliseconds']();
		var o = utc ? 0 : date.getTimezoneOffset();
		var flags = {
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
	//# sourceMappingURL=data:application/json;base64,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LENBQUQsQ0FBeUMsR0FBekMsR0FBK0MsT0FBL0MsQ0FBdUQsYUFBdkQsRUFBc0UsRUFBdEUsQ0FBZDtBQUNOLE9BQU0sQ0FBQyxJQUFJLENBQUosR0FBUSxHQUFSLEdBQWMsR0FBZCxDQUFELEdBQXNCLElBQUksS0FBSyxLQUFMLENBQVcsS0FBSyxHQUFMLENBQVMsQ0FBVCxJQUFjLEVBQWQsQ0FBWCxHQUErQixHQUEvQixHQUFxQyxLQUFLLEdBQUwsQ0FBUyxDQUFULElBQWMsRUFBZCxFQUFrQixDQUEzRCxDQUF0QjtFQXpCSCxDQWhDdUM7O0FBNEQzQyxRQUFPLEtBQUssT0FBTCxDQUFhLEtBQWIsRUFBb0IsVUFBVSxFQUFWLEVBQWM7QUFDeEMsU0FBTyxNQUFNLEtBQU4sR0FBYyxNQUFNLEVBQU4sQ0FBZCxHQUEwQixHQUFHLEtBQUgsQ0FBUyxDQUFULEVBQVksR0FBRyxNQUFILEdBQVksQ0FBWixDQUF0QyxDQURpQztFQUFkLENBQTNCLENBNUQyQztDQUFyQyIsImZpbGUiOiJkYXRlRm9ybWF0dGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIGxvZzRqcyA8aHR0cHM6Ly9naXRodWIuY29tL2FuaWdlbmVyby9sb2c0anMyPlxyXG4gKlxyXG4gKiBDb3B5cmlnaHQgMjAxNi1wcmVzZW50IFJvYmluIFNjaHVsdHogPGh0dHA6Ly9hbmlnZW5lcm8uY29tPlxyXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2VcclxuICovXHJcblxyXG5sZXQgaTE4biA9IHtcclxuXHQnZGF5TmFtZXMnIDogWyAnU3VuJywgJ01vbicsICdUdWUnLCAnV2VkJywgJ1RodScsICdGcmknLCAnU2F0JywgJ1N1bmRheScsICdNb25kYXknLFxyXG5cdFx0J1R1ZXNkYXknLCAnV2VkbmVzZGF5JywgJ1RodXJzZGF5JywgJ0ZyaWRheScsICdTYXR1cmRheScgXSxcclxuXHQnbW9udGhOYW1lcycgOiBbICdKYW4nLCAnRmViJywgJ01hcicsICdBcHInLCAnTWF5JywgJ0p1bicsICdKdWwnLCAnQXVnJywgJ1NlcCcsXHJcblx0XHQnT2N0JywgJ05vdicsICdEZWMnLCAnSmFudWFyeScsICdGZWJydWFyeScsICdNYXJjaCcsICdBcHJpbCcsICdNYXknLCAnSnVuZScsXHJcblx0XHQnSnVseScsICdBdWd1c3QnLCAnU2VwdGVtYmVyJywgJ09jdG9iZXInLCAnTm92ZW1iZXInLCAnRGVjZW1iZXInIF1cclxufTtcclxuXHJcbmNvbnN0IFRPS0VOID0gL2R7MSw0fXxtezEsNH18eXkoPzp5eSk/fChbSGhNc1R0XSlcXDE/fFtMbG9TWl18J1teJ10qJ3wnW14nXSonL2c7XHJcbmNvbnN0IFRJTUVaT05FID0gL1xcYig/OltQTUNFQV1bU0RQXVR8KD86UGFjaWZpY3xNb3VudGFpbnxDZW50cmFsfEVhc3Rlcm58QXRsYW50aWMpICg/OlN0YW5kYXJkfERheWxpZ2h0fFByZXZhaWxpbmcpIFRpbWV8KD86R01UfFVUQykoPzpbLStdXFxkezR9KT8pXFxiL2c7XHJcbmNvbnN0IFRJTUVaT05FX0NMSVAgPSAvW14tK1xcZEEtWl0vZztcclxuXHJcbi8qKlxyXG4gKiBQYWRzIG51bWJlcnMgaW4gdGhlIGRhdGUgZm9ybWF0XHJcbiAqXHJcbiAqIEBwYXJhbSB2YWx1ZVxyXG4gKiBAcGFyYW0gbGVuZ3RoXHJcbiAqXHJcbiAqIEByZXR1cm5zIHs/c3RyaW5nfVxyXG4gKi9cclxuZnVuY3Rpb24gcGFkKHZhbHVlLCBsZW5ndGgpIHtcclxuXHR2YWx1ZSA9IFN0cmluZyh2YWx1ZSk7XHJcblx0bGVuZ3RoID0gbGVuZ3RoIHx8IDI7XHJcblx0d2hpbGUgKHZhbHVlLmxlbmd0aCA8IGxlbmd0aCkge1xyXG5cdFx0dmFsdWUgPSAnMCcgKyB2YWx1ZTtcclxuXHR9XHJcblx0cmV0dXJuIHZhbHVlO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZGF0ZUZvcm1hdChkYXRlLCBtYXNrLCB1dGMpIHtcclxuXHJcblx0Ly8gWW91IGNhbid0IHByb3ZpZGUgdXRjIGlmIHlvdSBza2lwIG90aGVyIGFyZ3MgKHVzZSB0aGUgJ1VUQzonIG1hc2sgcHJlZml4KVxyXG5cdGlmIChhcmd1bWVudHMubGVuZ3RoID09IDEgJiYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGRhdGUpID09ICdbb2JqZWN0IFN0cmluZ10nICYmICEoL1xcZC8pLnRlc3QoZGF0ZSkpIHtcclxuXHRcdG1hc2sgPSBkYXRlO1xyXG5cdFx0ZGF0ZSA9IHVuZGVmaW5lZDtcclxuXHR9XHJcblxyXG5cdC8vIFBhc3NpbmcgZGF0ZSB0aHJvdWdoIERhdGUgYXBwbGllcyBEYXRlLnBhcnNlLCBpZiBuZWNlc3NhcnlcclxuXHRkYXRlID0gZGF0ZSA/IG5ldyBEYXRlKGRhdGUpIDogbmV3IERhdGUoKTtcclxuXHRpZiAoaXNOYU4oZGF0ZSkpIHtcclxuXHRcdHRocm93IG5ldyBTeW50YXhFcnJvcignaW52YWxpZCBkYXRlJyk7XHJcblx0fVxyXG5cclxuXHRtYXNrID0gU3RyaW5nKG1hc2sgfHwgJ3l5eXktbW0tZGQgSEg6TU06c3MsUycpO1xyXG5cclxuXHQvLyBBbGxvdyBzZXR0aW5nIHRoZSB1dGMgYXJndW1lbnQgdmlhIHRoZSBtYXNrXHJcblx0aWYgKG1hc2suc2xpY2UoMCwgNCkgPT0gJ1VUQzonKSB7XHJcblx0XHRtYXNrID0gbWFzay5zbGljZSg0KTtcclxuXHRcdHV0YyA9IHRydWU7XHJcblx0fVxyXG5cclxuXHRsZXQgXyA9IHV0YyA/ICdnZXRVVEMnIDogJ2dldCc7XHJcblx0bGV0IGQgPSBkYXRlW18gKyAnRGF0ZSddKCk7XHJcblx0bGV0IEQgPSBkYXRlW18gKyAnRGF5J10oKTtcclxuXHRsZXQgbSA9IGRhdGVbXyArICdNb250aCddKCk7XHJcblx0bGV0IHkgPSBkYXRlW18gKyAnRnVsbFllYXInXSgpO1xyXG5cdGxldCBIID0gZGF0ZVtfICsgJ0hvdXJzJ10oKTtcclxuXHRsZXQgTSA9IGRhdGVbXyArICdNaW51dGVzJ10oKTtcclxuXHRsZXQgcyA9IGRhdGVbXyArICdTZWNvbmRzJ10oKTtcclxuXHRsZXQgTCA9IGRhdGVbXyArICdNaWxsaXNlY29uZHMnXSgpO1xyXG5cdGxldCBvID0gdXRjID8gMCA6IGRhdGUuZ2V0VGltZXpvbmVPZmZzZXQoKTtcclxuXHRsZXQgZmxhZ3MgPSB7XHJcblx0XHQnZCcgOiBkLFxyXG5cdFx0J2RkJyA6IHBhZChkKSxcclxuXHRcdCdkZGQnIDogaTE4bi5kYXlOYW1lc1tEXSxcclxuXHRcdCdkZGRkJyA6IGkxOG4uZGF5TmFtZXNbRCArIDddLFxyXG5cdFx0J00nIDogbSArIDEsXHJcblx0XHQnTU0nIDogcGFkKG0gKyAxKSxcclxuXHRcdCdNTU0nIDogaTE4bi5tb250aE5hbWVzW21dLFxyXG5cdFx0J01NTU0nIDogaTE4bi5tb250aE5hbWVzW20gKyAxMl0sXHJcblx0XHQneXknIDogU3RyaW5nKHkpLnNsaWNlKDIpLFxyXG5cdFx0J3l5eXknIDogeSxcclxuXHRcdCdoJyA6IEggJSAxMiB8fCAxMixcclxuXHRcdCdoaCcgOiBwYWQoSCAlIDEyIHx8IDEyKSxcclxuXHRcdCdIJyA6IEgsXHJcblx0XHQnSEgnIDogcGFkKEgpLFxyXG5cdFx0J20nIDogTSxcclxuXHRcdCdtbScgOiBwYWQoTSksXHJcblx0XHQncycgOiBzLFxyXG5cdFx0J3NzJyA6IHBhZChzKSxcclxuXHRcdCdTJyA6IHBhZChMLCAxKSxcclxuXHRcdCd0JyA6IEggPCAxMiA/ICdhJyA6ICdwJyxcclxuXHRcdCd0dCcgOiBIIDwgMTIgPyAnYW0nIDogJ3BtJyxcclxuXHRcdCdUJyA6IEggPCAxMiA/ICdBJyA6ICdQJyxcclxuXHRcdCdUVCcgOiBIIDwgMTIgPyAnQU0nIDogJ1BNJyxcclxuXHRcdCdaJyA6IHV0YyA/ICdVVEMnIDogKFN0cmluZyhkYXRlKS5tYXRjaChUSU1FWk9ORSkgfHwgWyAnJyBdKS5wb3AoKS5yZXBsYWNlKFRJTUVaT05FX0NMSVAsICcnKSxcclxuXHRcdCdvJyA6IChvID4gMCA/ICctJyA6ICcrJykgKyBwYWQoTWF0aC5mbG9vcihNYXRoLmFicyhvKSAvIDYwKSAqIDEwMCArIE1hdGguYWJzKG8pICUgNjAsIDQpXHJcblx0fTtcclxuXHJcblx0cmV0dXJuIG1hc2sucmVwbGFjZShUT0tFTiwgZnVuY3Rpb24gKCQwKSB7XHJcblx0XHRyZXR1cm4gJDAgaW4gZmxhZ3MgPyBmbGFnc1skMF0gOiAkMC5zbGljZSgxLCAkMC5sZW5ndGggLSAxKTtcclxuXHR9KTtcclxuXHJcbn1cclxuIl19

/***/ },
/* 3 */
/***/ function(module, exports) {

	/*istanbul ignore next*/'use strict';

	exports.__esModule = true;
	exports.getFunctionName = getFunctionName;
	function getFunctionName(func) {

	    if (typeof func !== 'function') {
	        return 'anonymous';
	    }

	    var functionName = func.toString();
	    functionName = functionName.substring('function '.length);
	    functionName = functionName.substring(0, functionName.indexOf('('));

	    return functionName !== '' ? functionName : 'anonymous';
	}
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxpdHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O1FBQWdCO0FBQVQsU0FBUyxlQUFULENBQXlCLElBQXpCLEVBQStCOztBQUVsQyxRQUFJLE9BQU8sSUFBUCxLQUFnQixVQUFoQixFQUE0QjtBQUM1QixlQUFPLFdBQVAsQ0FENEI7S0FBaEM7O0FBSUEsUUFBSSxlQUFlLEtBQUssUUFBTCxFQUFmLENBTjhCO0FBT2xDLG1CQUFlLGFBQWEsU0FBYixDQUF1QixZQUFZLE1BQVosQ0FBdEMsQ0FQa0M7QUFRbEMsbUJBQWUsYUFBYSxTQUFiLENBQXVCLENBQXZCLEVBQTBCLGFBQWEsT0FBYixDQUFxQixHQUFyQixDQUExQixDQUFmLENBUmtDOztBQVVsQyxXQUFPLFlBQUMsS0FBaUIsRUFBakIsR0FBdUIsWUFBeEIsR0FBdUMsV0FBdkMsQ0FWMkI7Q0FBL0IiLCJmaWxlIjoidXRpbGl0eS5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBnZXRGdW5jdGlvbk5hbWUoZnVuYykge1xyXG5cclxuICAgIGlmICh0eXBlb2YgZnVuYyAhPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIHJldHVybiAnYW5vbnltb3VzJztcclxuICAgIH1cclxuXHJcbiAgICBsZXQgZnVuY3Rpb25OYW1lID0gZnVuYy50b1N0cmluZygpO1xyXG4gICAgZnVuY3Rpb25OYW1lID0gZnVuY3Rpb25OYW1lLnN1YnN0cmluZygnZnVuY3Rpb24gJy5sZW5ndGgpO1xyXG4gICAgZnVuY3Rpb25OYW1lID0gZnVuY3Rpb25OYW1lLnN1YnN0cmluZygwLCBmdW5jdGlvbk5hbWUuaW5kZXhPZignKCcpKTtcclxuXHJcbiAgICByZXR1cm4gKGZ1bmN0aW9uTmFtZSAhPT0gJycpID8gZnVuY3Rpb25OYW1lIDogJ2Fub255bW91cyc7XHJcblxyXG59XHJcbiJdfQ==

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
	     *
	     * @param logEvent
	     */

	    LogAppender.prototype.append = function append(logEvent) {};

	    LogAppender.prototype.getLogLevel = function getLogLevel() {
	        return this.logLevel;
	    };

	    /**
	     *
	     * @param {number} logLevel
	     */


	    LogAppender.prototype.setLogLevel = function setLogLevel(logLevel) {
	        this.logLevel = logLevel;
	    };

	    /**
	     *
	     * @param layout
	     */


	    LogAppender.prototype.setLayout = function setLayout(layout) {
	        this.layout = layout;
	    };

	    LogAppender.prototype.getLayout = function getLayout() {
	        return this.layout;
	    };

	    /**
	     *
	     * @param logEvent
	     */


	    LogAppender.prototype.format = function format(logEvent) {
	        return (/*istanbul ignore next*/(0, _formatter.format)(this.getLayout(), logEvent)
	        );
	    };

	    _createClass(LogAppender, null, [{
	        key: 'name',


	        /**
	         *
	         * @returns {null}
	         */
	        get: function get() {
	            return null;
	        }
	    }]);

	    return LogAppender;
	}();
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcGVuZGVyXFxhcHBlbmRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7O0lBRWE7Ozs7Ozs7Ozs7MEJBY1QseUJBQU8sVUFBVTs7MEJBSWpCLHFDQUFjO0FBQ1YsZUFBTyxLQUFLLFFBQUwsQ0FERzs7Ozs7Ozs7OzBCQVFkLG1DQUFZLFVBQVU7QUFDbEIsYUFBSyxRQUFMLEdBQWdCLFFBQWhCLENBRGtCOzs7Ozs7Ozs7MEJBUXRCLCtCQUFVLFFBQVE7QUFDZCxhQUFLLE1BQUwsR0FBYyxNQUFkLENBRGM7OzswQkFJbEIsaUNBQVk7QUFDUixlQUFPLEtBQUssTUFBTCxDQURDOzs7Ozs7Ozs7MEJBUVoseUJBQU8sVUFBVTtBQUNiLGVBQU8sZ0RBQU8sS0FBSyxTQUFMLEVBQVAsRUFBeUIsUUFBekIsQ0FBUDtVQURhOzs7Ozs7Ozs7Ozs0QkF4Q0M7QUFDZCxtQkFBTyxJQUFQLENBRGMiLCJmaWxlIjoiYXBwZW5kZXJcXGFwcGVuZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtmb3JtYXR9IGZyb20gJy4uL2Zvcm1hdHRlcic7XHJcblxyXG5leHBvcnQgY2xhc3MgTG9nQXBwZW5kZXIge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtudWxsfVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZ2V0IG5hbWUoKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGxvZ0V2ZW50XHJcbiAgICAgKi9cclxuICAgIGFwcGVuZChsb2dFdmVudCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBnZXRMb2dMZXZlbCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5sb2dMZXZlbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbG9nTGV2ZWxcclxuICAgICAqL1xyXG4gICAgc2V0TG9nTGV2ZWwobG9nTGV2ZWwpIHtcclxuICAgICAgICB0aGlzLmxvZ0xldmVsID0gbG9nTGV2ZWw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGxheW91dFxyXG4gICAgICovXHJcbiAgICBzZXRMYXlvdXQobGF5b3V0KSB7XHJcbiAgICAgICAgdGhpcy5sYXlvdXQgPSBsYXlvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TGF5b3V0KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmxheW91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gbG9nRXZlbnRcclxuICAgICAqL1xyXG4gICAgZm9ybWF0KGxvZ0V2ZW50KSB7XHJcbiAgICAgICAgcmV0dXJuIGZvcm1hdCh0aGlzLmdldExheW91dCgpLCBsb2dFdmVudCk7XHJcbiAgICB9XHJcblxyXG59XHJcbiJdfQ==

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
	  *
	  * @returns {boolean}
	  * @private
	  */
		var _isStrict = function _isStrict() {
			return !this;
		};

		return this;
	}
	//# sourceMappingURL=data:application/json;base64,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S0FBSyxDQUFMLENBQTFCLENBRE07SUFGQTtHQVRSOztBQWlCQSxTQUFPLFlBQVAsQ0E3Q3dDO0VBQXpDOzs7Ozs7O0FBcEQ0QyxLQTBHeEMsWUFBWSxTQUFaLFNBQVksR0FBWTtBQUNyQixTQUFPLENBQUMsSUFBRCxDQURjO0VBQVosQ0ExRzRCOztBQThHNUMsUUFBTyxJQUFQLENBOUc0QztDQUF0QyIsImZpbGUiOiJsb2dnZXJcXGxvZ2dlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBsb2c0anMgPGh0dHBzOi8vZ2l0aHViLmNvbS9hbmlnZW5lcm8vbG9nNGpzPlxyXG4gKlxyXG4gKiBDb3B5cmlnaHQgMjAxNi1wcmVzZW50IFJvYmluIFNjaHVsdHogPGh0dHA6Ly9hbmlnZW5lcm8uY29tPlxyXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2VcclxuICovXHJcblxyXG5pbXBvcnQge0xvZ0xldmVsfSBmcm9tICcuLi9jb25zdC9sb2dMZXZlbCc7XHJcblxyXG4vKipcclxuICogSG9sZHMgdGhlIGRlZmluaXRpb24gZm9yIHRoZSBsb2cgZXZlbnQgb2JqZWN0XHJcbiAqXHJcbiAqIEB0eXBlZGVmIHt7IGRhdGUgOiBudW1iZXIsIGVycm9yIDogT2JqZWN0LCBmaWxlbmFtZTogc3RyaW5nLCBsaW5lTnVtYmVyOiA/c3RyaW5nLCBjb2x1bW46ID9zdHJpbmcsXHJcbiAqICAgICAgbG9nRXJyb3JTdGFjayA6IE9iamVjdCwgZmlsZSA6IFN0cmluZywgbGV2ZWwgOiBudW1iZXIsIGxvZ2dlciA6IHN0cmluZywgbWVzc2FnZSA6IHN0cmluZyxcclxuICogICAgICBtZXRob2QgOiBGdW5jdGlvbiwgcHJvcGVydGllcyA6IE9iamVjdD0sIHJlbGF0aXZlIDogbnVtYmVyLCBzZXF1ZW5jZSA6IG51bWJlciB9fVxyXG4gKi9cclxubGV0IExPR19FVkVOVDtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBMb2dnZXIoY29udGV4dCwgYXBwZW5kZXJPYmopIHtcclxuXHJcbiAgICAvKiogQHR5cGUge3N0cmluZ30gKi9cclxuICAgIGxldCBfbG9nQ29udGV4dCA9IGNvbnRleHQ7XHJcbiAgICAvKiogQHR5cGVvZiB7bnVtYmVyfSAqL1xyXG4gICAgbGV0IF9sb2dTZXF1ZW5jZSA9IDE7XHJcblx0LyoqIEB0eXBlb2Yge251bWJlcn0gKi9cclxuXHRsZXQgX3JlbGF0aXZlID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKTtcclxuXHJcblx0LyoqXHJcblx0ICogTG9ncyBhbiBlcnJvciBldmVudFxyXG5cdCAqL1xyXG5cdHRoaXMuZXJyb3IgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRhcHBlbmRlck9iai5hcHBlbmQoX2NvbnN0cnVjdExvZ0V2ZW50KExvZ0xldmVsLkVSUk9SLCBhcmd1bWVudHMpKTtcclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBMb2dzIGEgd2FybmluZ1xyXG5cdCAqL1xyXG5cdHRoaXMud2FybiA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdGFwcGVuZGVyT2JqLmFwcGVuZChfY29uc3RydWN0TG9nRXZlbnQoTG9nTGV2ZWwuV0FSTiwgYXJndW1lbnRzKSk7XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogTG9ncyBhbiBpbmZvIGxldmVsIGV2ZW50XHJcblx0ICovXHJcblx0dGhpcy5pbmZvID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0YXBwZW5kZXJPYmouYXBwZW5kKF9jb25zdHJ1Y3RMb2dFdmVudChMb2dMZXZlbC5JTkZPLCBhcmd1bWVudHMpKTtcclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBMb2dzIGEgZGVidWcgZXZlbnRcclxuXHQgKi9cclxuXHR0aGlzLmRlYnVnID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0YXBwZW5kZXJPYmouYXBwZW5kKF9jb25zdHJ1Y3RMb2dFdmVudChMb2dMZXZlbC5ERUJVRywgYXJndW1lbnRzKSk7XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogTG9ncyBhIHRyYWNlIGV2ZW50XHJcblx0ICovXHJcblx0dGhpcy50cmFjZSA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdGFwcGVuZGVyT2JqLmFwcGVuZChfY29uc3RydWN0TG9nRXZlbnQoTG9nTGV2ZWwuVFJBQ0UsIGFyZ3VtZW50cykpO1xyXG5cdH07XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBmdW5jdGlvblxyXG5cdCAqXHJcblx0ICogQHBhcmFtIHtudW1iZXJ9IGxldmVsXHJcblx0ICogQHBhcmFtIHtBcnJheX0gYXJndW1lbnRzXHJcblx0ICpcclxuXHQgKiBAcmV0dXJuIHtMT0dfRVZFTlR9XHJcblx0ICovXHJcblx0ZnVuY3Rpb24gX2NvbnN0cnVjdExvZ0V2ZW50KGxldmVsLCBhcmdzKSB7XHJcblxyXG5cdFx0bGV0IGxvZ1RpbWUgPSBuZXcgRGF0ZSgpO1xyXG5cdFx0bGV0IGVycm9yID0gbnVsbDtcclxuXHJcblx0XHQvLyB0aGlzIGxvb2tzIGhvcnJpYmxlLCBidXQgdGhpcyBpcyB0aGUgb25seSB3YXkgdG8gY2F0Y2ggdGhlIHN0YWNrIGZvciBJRSB0byBsYXRlciBwYXJzZSB0aGUgc3RhY2tcclxuXHRcdHRyeSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcigpO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRlcnJvciA9IGU7XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IGxvZ2dpbmdFdmVudCA9IHtcclxuXHRcdFx0J2RhdGUnIDogbG9nVGltZSxcclxuXHRcdFx0J2Vycm9yJyA6IG51bGwsXHJcblx0XHRcdCdsb2dFcnJvclN0YWNrJyA6IGVycm9yLFxyXG5cdFx0XHQnZmlsZScgOiBudWxsLFxyXG5cdFx0XHQnbGV2ZWwnIDogbGV2ZWwsXHJcblx0XHRcdCdsaW5lTnVtYmVyJyA6IG51bGwsXHJcblx0XHRcdCdsb2dnZXInIDogX2xvZ0NvbnRleHQsXHJcblx0XHRcdCdtZXNzYWdlJyA6ICcnLFxyXG5cdFx0XHQnbWV0aG9kJyA6ICFfaXNTdHJpY3QoKSA/IGFyZ3MuY2FsbGVlLmNhbGxlciA6IDAsXHJcblx0XHRcdCdwcm9wZXJ0aWVzJyA6IHVuZGVmaW5lZCxcclxuXHRcdFx0J3JlbGF0aXZlJyA6IGxvZ1RpbWUuZ2V0VGltZSgpIC0gX3JlbGF0aXZlLFxyXG5cdFx0XHQnc2VxdWVuY2UnIDogX2xvZ1NlcXVlbmNlKytcclxuXHRcdH07XHJcblxyXG5cdFx0bGV0IG1lc3NhZ2VTdHVicyA9IDA7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcclxuXHJcblx0XHRcdGlmIChpID09PSAwKSB7XHJcblx0XHRcdFx0bG9nZ2luZ0V2ZW50Lm1lc3NhZ2UgPSBhcmdzW2ldO1xyXG5cdFx0XHRcdGxldCBzdHVicyA9ICgvXFx7fS9nKS5leGVjKGxvZ2dpbmdFdmVudC5tZXNzYWdlKTtcclxuXHRcdFx0XHRtZXNzYWdlU3R1YnMgPSAoc3R1YnMgaW5zdGFuY2VvZiBBcnJheSkgPyBzdHVicy5sZW5ndGggOiAwO1xyXG5cdFx0XHR9IGVsc2UgaWYgKG1lc3NhZ2VTdHVicyA+IDApIHtcclxuXHRcdFx0XHRsb2dnaW5nRXZlbnQubWVzc2FnZSA9IGxvZ2dpbmdFdmVudC5tZXNzYWdlLnJlcGxhY2UoL1xce30vLCBhcmdzW2ldKTtcclxuXHRcdFx0XHRtZXNzYWdlU3R1YnMtLTtcclxuXHRcdFx0fSBlbHNlIGlmIChhcmdzW2ldIGluc3RhbmNlb2YgRXJyb3IpIHtcclxuXHRcdFx0XHRsb2dnaW5nRXZlbnQuZXJyb3IgPSBhcmdzW2ldO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGxvZ2dpbmdFdmVudC5wcm9wZXJ0aWVzID0gYXJnc1tpXTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gbG9nZ2luZ0V2ZW50O1xyXG5cclxuXHR9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcblx0bGV0IF9pc1N0cmljdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gIXRoaXM7XHJcbiAgICB9O1xyXG5cclxuXHRyZXR1cm4gdGhpcztcclxuXHJcbn1cclxuIl19

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
	  * @param {LOG_EVENT} loggingEvent
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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcGVuZGVyXFxjb25zb2xlQXBwZW5kZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQU9BOztBQUNBOzs7Ozs7Ozs7Ozs7OztJQUVhOzs7Ozs7Ozs7Ozs7OzsyQkFVVCx5QkFBTyxVQUFVO0FBQ2IsTUFBSSxTQUFTLEtBQVQsSUFBa0IsS0FBSyxXQUFMLEVBQWxCLEVBQXNDO0FBQ3RDLFFBQUssZ0JBQUwsQ0FBc0IsUUFBdEIsRUFEc0M7R0FBMUM7Ozs7Ozs7Ozs7OzJCQVdQLDZDQUFpQixVQUFVOztBQUUxQixNQUFJLFVBQVUsS0FBSyxNQUFMLENBQVksUUFBWixDQUFWLENBRnNCOztBQUkxQixNQUFJLFNBQVMsS0FBVCxJQUFrQiwyQ0FBUyxLQUFULEVBQWdCO0FBQ3JDLFdBQVEsS0FBUixDQUFjLE9BQWQsRUFEcUM7R0FBdEMsTUFFTyxJQUFJLFNBQVMsS0FBVCxJQUFrQiwyQ0FBUyxJQUFULEVBQWU7QUFDM0MsV0FBUSxJQUFSLENBQWEsT0FBYixFQUQyQztHQUFyQyxNQUVBLElBQUksU0FBUyxLQUFULElBQWtCLDJDQUFTLElBQVQsRUFBZTtBQUMzQyxXQUFRLElBQVIsQ0FBYSxPQUFiLEVBRDJDO0dBQXJDLE1BRUEsSUFBSSxDQUFDLDJDQUFTLEtBQVQsRUFBZ0IsMkNBQVMsS0FBVCxDQUFqQixDQUFpQyxPQUFqQyxDQUF5QyxTQUFTLEtBQVQsQ0FBekMsR0FBMkQsQ0FBQyxDQUFELEVBQUk7QUFDekUsV0FBUSxHQUFSLENBQVksT0FBWixFQUR5RTtHQUFuRTs7Ozs7c0JBOUJhO0FBQ2QsVUFBTyxTQUFQLENBRGMiLCJmaWxlIjoiYXBwZW5kZXJcXGNvbnNvbGVBcHBlbmRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBsb2c0anMgPGh0dHBzOi8vZ2l0aHViLmNvbS9hbmlnZW5lcm8vbG9nNGpzPlxyXG4gKlxyXG4gKiBDb3B5cmlnaHQgMjAxNi1wcmVzZW50IFJvYmluIFNjaHVsdHogPGh0dHA6Ly9hbmlnZW5lcm8uY29tPlxyXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2VcclxuICovXHJcblxyXG5pbXBvcnQge0xvZ0FwcGVuZGVyfSBmcm9tICcuL2FwcGVuZGVyJztcclxuaW1wb3J0IHtMb2dMZXZlbH0gZnJvbSAnLi4vY29uc3QvbG9nTGV2ZWwnO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbnNvbGVBcHBlbmRlciBleHRlbmRzIExvZ0FwcGVuZGVyIHtcclxuXHJcbiAgICBzdGF0aWMgZ2V0IG5hbWUoKSB7XHJcbiAgICAgICAgcmV0dXJuICdjb25zb2xlJztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFwcGVuZHMgdGhlIGxvZyBldmVudFxyXG4gICAgICogQHBhcmFtIGxvZ0V2ZW50XHJcbiAgICAgKi9cclxuICAgIGFwcGVuZChsb2dFdmVudCkge1xyXG4gICAgICAgIGlmIChsb2dFdmVudC5sZXZlbCA8PSB0aGlzLmdldExvZ0xldmVsKCkpIHtcclxuICAgICAgICAgICAgdGhpcy5fYXBwZW5kVG9Db25zb2xlKGxvZ0V2ZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBwcml2YXRlXHJcblx0ICogQGZ1bmN0aW9uXHJcblx0ICpcclxuXHQgKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nZ2luZ0V2ZW50XHJcblx0ICovXHJcblx0X2FwcGVuZFRvQ29uc29sZShsb2dFdmVudCkge1xyXG5cclxuXHRcdGxldCBtZXNzYWdlID0gdGhpcy5mb3JtYXQobG9nRXZlbnQpO1xyXG5cclxuXHRcdGlmIChsb2dFdmVudC5sZXZlbCA9PSBMb2dMZXZlbC5FUlJPUikge1xyXG5cdFx0XHRjb25zb2xlLmVycm9yKG1lc3NhZ2UpO1xyXG5cdFx0fSBlbHNlIGlmIChsb2dFdmVudC5sZXZlbCA9PSBMb2dMZXZlbC5XQVJOKSB7XHJcblx0XHRcdGNvbnNvbGUud2FybihtZXNzYWdlKTtcclxuXHRcdH0gZWxzZSBpZiAobG9nRXZlbnQubGV2ZWwgPT0gTG9nTGV2ZWwuSU5GTykge1xyXG5cdFx0XHRjb25zb2xlLmluZm8obWVzc2FnZSk7XHJcblx0XHR9IGVsc2UgaWYgKFtMb2dMZXZlbC5ERUJVRywgTG9nTGV2ZWwuVFJBQ0VdLmluZGV4T2YobG9nRXZlbnQubGV2ZWwpID4gLTEpIHtcclxuXHRcdFx0Y29uc29sZS5sb2cobWVzc2FnZSk7XHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcbn1cclxuIl19

/***/ }
/******/ ])
});
;