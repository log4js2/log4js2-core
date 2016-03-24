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

	exports.__esModule = true;
	exports.configure = configure;
	exports.addAppender = addAppender;
	exports.append = append;
	exports.getApplicationInfo = getApplicationInfo;
	exports.getLogger = getLogger;
	exports.setLogLevel = setLogLevel;
	// istanbul ignore next

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

	/**
	 * log4js <https://github.com/anigenero/log4js>
	 *
	 * Copyright 2016 Robin Schultz <http://cunae.com>
	 * Released under the MIT License
	 */

	var _formatter = __webpack_require__(1);

	var formatter = _interopRequireWildcard(_formatter);

	var _loggerLogger = __webpack_require__(4);

	var _constLogLevel = __webpack_require__(3);

	var LogLevel = _interopRequireWildcard(_constLogLevel);

	var _appendersConsoleAppender = __webpack_require__(7);

	var consoleAppender = _interopRequireWildcard(_appendersConsoleAppender);

	/**
	 * Holds the definition for the appender closure
	 *
	 * @typedef {{ append : function (number, LOG_EVENT), isActive : function(),
	 *          setLogLevel : function(number), setTagLayout : function(string) }}
	 */
	var APPENDER;

	/**
	 * @typedef {{ allowAppenderInjection : boolean, appenders : Array.<APPENDER>,
	 * 			application : Object, loggers : Array.<LOGGER>, tagLayout : string }}
	 */
	var CONFIG_PARAMS;

	/**
	 * Holds the definition for the log event object
	 *
	 * @typedef {{ error : Error, message : string, properties : Object,
	 *          timestamp : string }}
	 */
	var LOG_EVENT;

	/**
	 * @typedef {{ logLevel : number }}
	 */
	var LOGGER;

	/** @type {Array.<APPENDER>} */
	var appenders_ = [];
	/** @type {CONFIG_PARAMS} */
	var configuration_ = {};
	/** @type {boolean} */
	var finalized_ = false;
	/** @type {Object} */
	var loggers_ = {};

	exports.LogLevel = LogLevel;

	/**
	 * Configures the logger
	 *
	 * @function
	 *
	 * @params {CONFIG_PARAMS} config
	 */

	function configure(config) {

		if (finalized_) {
			append(LogLevel.ERROR, 'Could not configure. LogUtility already in use');
			return;
		}

		configureAppenders_(config.appenders, function () {

			configureLoggers_(config.loggers);

			if (config.tagLayout) {
				formatter.preCompile(config.tagLayout);
				for (var logKey in loggers_) {
					if (loggers_.hasOwnProperty(logKey)) {
						for (var key in loggers_[logKey]) {
							if (loggers_[logKey].hasOwnProperty(key)) {
								loggers_[logKey][key].setTagLayout(config.tagLayout);
							}
						}
					}
				}
			}

			configuration_ = config;
		});
	}

	var configureAppenders_ = function configureAppenders_(appenders, callback) {

		if (appenders instanceof Array) {
			var count = appenders.length;
			for (var i = 0; i < count; i++) {
				callback();
			}
		}
	};

	var configureLoggers_ = function configureLoggers_(loggers) {

		if (!(loggers instanceof Array)) {
			throw new Error("Invalid loggers");
		}

		var count = loggers.length;
		for (var i = 0; i < count; i++) {

			if (!loggers[i].tag) {
				loggers_['main'] = getLoggers_(loggers[i].logLevel);
			} else {
				loggers_[loggers[i].tag] = getLoggers_(loggers[i].logLevel);
			}
		}
	};

	var getLoggers_ = function getLoggers_(logLevel) {

		var logger;
		var loggers = [];
		var count = appenders_.length;
		while (count--) {
			logger = appenders_[count]();
			logger.setLogLevel(logLevel);
			loggers.push(logger);
		}

		return loggers;
	};

	/**
	 * Adds an appender to the appender queue. If the stack is finalized, and
	 * the allowAppenderInjection is set to false, then the event will not be
	 * appended
	 *
	 * @function
	 *
	 * @params {APPENDER} appender
	 */

	function addAppender(appender) {

		if (finalized_ && !configuration_.allowAppenderInjection) {
			console.error('Cannot add appender when configuration finalized');
			return;
		}

		validateAppender_(appender);
		appenders_.push(appender);
	}

	/**
	 * Validates that the appender
	 *
	 * @function
	 *
	 * @params {APPENDER} appender
	 */
	var validateAppender_ = function validateAppender_(appender) {

		if (appender == null || typeof appender !== 'function') {
			throw new Error('Invalid appender: not an function');
		}

		var appenderObj = appender();

		var appenderMethods = ['append', 'getName', 'isActive', 'setLogLevel', 'setTagLayout'];
		for (var key in appenderMethods) {
			if (appenderMethods.hasOwnProperty(key) && appenderObj[appenderMethods[key]] == undefined || typeof appenderObj[appenderMethods[key]] != 'function') {
				throw new Error('Invalid appender: missing method: ' + appenderMethods[key]);
			}
		}

		if (configuration_.tagLayout) {
			appenderObj.setTagLayout(configuration_.tagLayout);
		}
	};

	/**
	 * Appends the log event
	 *
	 * @function
	 *
	 * @param {Object} loggingEvent
	 * @param {Object|number|string} arguments
	 */

	function append(loggingEvent) {

		// finalize the configuration to make sure no other appenders are injected (if set)
		finalized_ = true;

		var loggers;
		if (loggers_[loggingEvent.logger]) {
			loggers = loggers_[loggingEvent.logger];
		} else {
			loggers = loggers_['main'];
		}

		var count = loggers.length;
		while (count--) {
			if (loggers[count].isActive(loggingEvent.level)) {
				loggers[count].append(loggingEvent);
			}
		}
	}

	/**
	 * @private
	 * @function
	 *
	 * @param {number} level
	 */
	var validateLevel_ = function validateLevel_(level) {

		for (var key in LogLevel) {
			if (level === LogLevel[key]) {
				return;
			}
		}

		throw new Error('Invalid log level: ' + level);
	};

	/**
	 * Gets the application information from the configuration
	 * @return {Object}
	 */

	function getApplicationInfo() {
		if (configuration_.application != null) {
			return configuration_.application;
		} else {
			return null;
		}
	}

	/**
	 * Handles creating the logger and returning it
	 * @param {string} context
	 * @return {Logger}
	 */

	function getLogger(context) {
		return new _loggerLogger.Logger(context, {
			append: append
		});
	}

	/**
	 * Sets the log level for all loggers
	 * @param {number} logLevel
	 */

	function setLogLevel(logLevel) {

		validateLevel_(logLevel);

		for (var logKey in loggers_) {
			if (loggers_.hasOwnProperty(logKey)) {
				for (var key in loggers_[logKey]) {
					if (loggers_[logKey].hasOwnProperty(key)) {
						loggers_[logKey][key].setLogLevel(logLevel);
					}
				}
			}
		}
	}

	addAppender(consoleAppender.ConsoleAppender);
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sb2dNYW5hZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt5QkFPMkIsYUFBYTs7SUFBNUIsU0FBUzs7NEJBQ0UsaUJBQWlCOzs2QkFDZCxrQkFBa0I7O0lBQWhDLFFBQVE7O3dDQUVhLDZCQUE2Qjs7SUFBbEQsZUFBZTs7Ozs7Ozs7QUFRM0IsSUFBSSxRQUFRLENBQUM7Ozs7OztBQU1iLElBQUksYUFBYSxDQUFDOzs7Ozs7OztBQVFsQixJQUFJLFNBQVMsQ0FBQzs7Ozs7QUFLZCxJQUFJLE1BQU0sQ0FBQzs7O0FBR1gsSUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFDOztBQUVwQixJQUFJLGNBQWMsR0FBRyxFQUFFLENBQUM7O0FBRXhCLElBQUksVUFBVSxHQUFHLEtBQUssQ0FBQzs7QUFFdkIsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDOztRQUVWLFFBQVEsR0FBUixRQUFROzs7Ozs7Ozs7O0FBU1QsU0FBUyxTQUFTLENBQUMsTUFBTSxFQUFFOztBQUVqQyxLQUFJLFVBQVUsRUFBRTtBQUNmLFFBQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLGdEQUFnRCxDQUFDLENBQUM7QUFDekUsU0FBTztFQUNQOztBQUVELG9CQUFtQixDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsWUFBWTs7QUFFakQsbUJBQWlCLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUVsQyxNQUFJLE1BQU0sQ0FBQyxTQUFTLEVBQUU7QUFDckIsWUFBUyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDdkMsUUFBSyxJQUFJLE1BQU0sSUFBSSxRQUFRLEVBQUU7QUFDNUIsUUFBSSxRQUFRLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxFQUFFO0FBQ3BDLFVBQUssSUFBSSxHQUFHLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFO0FBQ2pDLFVBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUN6QyxlQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztPQUNyRDtNQUNEO0tBQ0Q7SUFDRDtHQUNEOztBQUVELGdCQUFjLEdBQUcsTUFBTSxDQUFDO0VBRXhCLENBQUMsQ0FBQztDQUVIOztBQUVELElBQUksbUJBQW1CLEdBQUcsU0FBdEIsbUJBQW1CLENBQWEsU0FBUyxFQUFFLFFBQVEsRUFBRTs7QUFFeEQsS0FBSSxTQUFTLFlBQVksS0FBSyxFQUFFO0FBQy9CLE1BQUksS0FBSyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFDN0IsT0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUMvQixXQUFRLEVBQUUsQ0FBQztHQUNYO0VBQ0Q7Q0FFRCxDQUFDOztBQUVGLElBQUksaUJBQWlCLEdBQUcsU0FBcEIsaUJBQWlCLENBQWEsT0FBTyxFQUFFOztBQUUxQyxLQUFJLEVBQUUsT0FBTyxZQUFZLEtBQUssQ0FBQSxBQUFDLEVBQUU7QUFDaEMsUUFBTSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0VBQ25DOztBQUVELEtBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7QUFDM0IsTUFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTs7QUFFL0IsTUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUU7QUFDcEIsV0FBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7R0FDcEQsTUFBTTtBQUNOLFdBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQztHQUM1RDtFQUVEO0NBRUQsQ0FBQzs7QUFFRixJQUFJLFdBQVcsR0FBRyxTQUFkLFdBQVcsQ0FBYSxRQUFRLEVBQUU7O0FBRXJDLEtBQUksTUFBTSxDQUFDO0FBQ1gsS0FBSSxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ2pCLEtBQUksS0FBSyxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUM7QUFDOUIsUUFBTyxLQUFLLEVBQUUsRUFBRTtBQUNmLFFBQU0sR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztBQUM3QixRQUFNLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzdCLFNBQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7RUFDckI7O0FBRUQsUUFBTyxPQUFPLENBQUM7Q0FFZixDQUFDOzs7Ozs7Ozs7Ozs7QUFXSyxTQUFTLFdBQVcsQ0FBQyxRQUFRLEVBQUU7O0FBRXJDLEtBQUksVUFBVSxJQUFJLENBQUMsY0FBYyxDQUFDLHNCQUFzQixFQUFFO0FBQ3pELFNBQU8sQ0FBQyxLQUFLLENBQUMsa0RBQWtELENBQUMsQ0FBQztBQUNsRSxTQUFPO0VBQ1A7O0FBRUQsa0JBQWlCLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDNUIsV0FBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztDQUUxQjs7Ozs7Ozs7O0FBU0QsSUFBSSxpQkFBaUIsR0FBRyxTQUFwQixpQkFBaUIsQ0FBYSxRQUFRLEVBQUU7O0FBRTNDLEtBQUksUUFBUSxJQUFJLElBQUksSUFBSSxPQUFPLFFBQVEsS0FBSyxVQUFVLEVBQUU7QUFDdkQsUUFBTSxJQUFJLEtBQUssQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO0VBQ3JEOztBQUVELEtBQUksV0FBVyxHQUFHLFFBQVEsRUFBRSxDQUFDOztBQUU3QixLQUFJLGVBQWUsR0FBRyxDQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLGFBQWEsRUFBRSxjQUFjLENBQUMsQ0FBQztBQUN2RixNQUFLLElBQUksR0FBRyxJQUFJLGVBQWUsRUFBRTtBQUNoQyxNQUFJLGVBQWUsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLElBQUksV0FBVyxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLFNBQVMsSUFDeEYsT0FBTyxXQUFXLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksVUFBVSxFQUFFO0FBQ3hELFNBQU0sSUFBSSxLQUFLLENBQUMsb0NBQW9DLEdBQUcsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7R0FDN0U7RUFDRDs7QUFFRCxLQUFJLGNBQWMsQ0FBQyxTQUFTLEVBQUU7QUFDN0IsYUFBVyxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUM7RUFDbkQ7Q0FFRCxDQUFDOzs7Ozs7Ozs7OztBQVVLLFNBQVMsTUFBTSxDQUFDLFlBQVksRUFBRTs7O0FBR3BDLFdBQVUsR0FBRyxJQUFJLENBQUM7O0FBRWxCLEtBQUksT0FBTyxDQUFDO0FBQ1osS0FBSSxRQUFRLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxFQUFFO0FBQ2xDLFNBQU8sR0FBRyxRQUFRLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0VBQ3hDLE1BQU07QUFDTixTQUFPLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0VBQzNCOztBQUVELEtBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7QUFDM0IsUUFBTyxLQUFLLEVBQUUsRUFBRTtBQUNmLE1BQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDaEQsVUFBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztHQUNwQztFQUNEO0NBRUQ7Ozs7Ozs7O0FBUUQsSUFBSSxjQUFjLEdBQUcsU0FBakIsY0FBYyxDQUFhLEtBQUssRUFBRTs7QUFFckMsTUFBSyxJQUFJLEdBQUcsSUFBSSxRQUFRLEVBQUU7QUFDekIsTUFBSSxLQUFLLEtBQUssUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQzVCLFVBQU87R0FDUDtFQUNEOztBQUVELE9BQU0sSUFBSSxLQUFLLENBQUMscUJBQXFCLEdBQUcsS0FBSyxDQUFDLENBQUM7Q0FFL0MsQ0FBQzs7Ozs7OztBQU1LLFNBQVMsa0JBQWtCLEdBQUc7QUFDcEMsS0FBSSxjQUFjLENBQUMsV0FBVyxJQUFJLElBQUksRUFBRTtBQUN2QyxTQUFPLGNBQWMsQ0FBQyxXQUFXLENBQUM7RUFDbEMsTUFBTTtBQUNOLFNBQU8sSUFBSSxDQUFDO0VBQ1o7Q0FDRDs7Ozs7Ozs7QUFPTSxTQUFTLFNBQVMsQ0FBQyxPQUFPLEVBQUU7QUFDbEMsUUFBTyx5QkFBVyxPQUFPLEVBQUU7QUFDMUIsUUFBTSxFQUFFLE1BQU07RUFDZCxDQUFDLENBQUM7Q0FDSDs7Ozs7OztBQU1NLFNBQVMsV0FBVyxDQUFDLFFBQVEsRUFBRTs7QUFFckMsZUFBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUV6QixNQUFLLElBQUksTUFBTSxJQUFJLFFBQVEsRUFBRTtBQUM1QixNQUFJLFFBQVEsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLEVBQUU7QUFDcEMsUUFBSyxJQUFJLEdBQUcsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUU7QUFDakMsUUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQ3pDLGFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDNUM7SUFDRDtHQUNEO0VBQ0Q7Q0FFRDs7QUFFRCxXQUFXLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxDQUFDIiwiZmlsZSI6ImxvZ01hbmFnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogbG9nNGpzIDxodHRwczovL2dpdGh1Yi5jb20vYW5pZ2VuZXJvL2xvZzRqcz5cclxuICpcclxuICogQ29weXJpZ2h0IDIwMTYgUm9iaW4gU2NodWx0eiA8aHR0cDovL2N1bmFlLmNvbT5cclxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlXHJcbiAqL1xyXG5cclxuaW1wb3J0ICogYXMgZm9ybWF0dGVyIGZyb20gJy4vZm9ybWF0dGVyJztcclxuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSAnLi9sb2dnZXIvbG9nZ2VyJztcclxuaW1wb3J0ICogYXMgTG9nTGV2ZWwgZnJvbSAnLi9jb25zdC9sb2dMZXZlbCc7XHJcblxyXG5pbXBvcnQgKiBhcyBjb25zb2xlQXBwZW5kZXIgZnJvbSAnLi9hcHBlbmRlcnMvY29uc29sZUFwcGVuZGVyJztcclxuXHJcbi8qKlxyXG4gKiBIb2xkcyB0aGUgZGVmaW5pdGlvbiBmb3IgdGhlIGFwcGVuZGVyIGNsb3N1cmVcclxuICpcclxuICogQHR5cGVkZWYge3sgYXBwZW5kIDogZnVuY3Rpb24gKG51bWJlciwgTE9HX0VWRU5UKSwgaXNBY3RpdmUgOiBmdW5jdGlvbigpLFxyXG4gKiAgICAgICAgICBzZXRMb2dMZXZlbCA6IGZ1bmN0aW9uKG51bWJlciksIHNldFRhZ0xheW91dCA6IGZ1bmN0aW9uKHN0cmluZykgfX1cclxuICovXHJcbnZhciBBUFBFTkRFUjtcclxuXHJcbi8qKlxyXG4gKiBAdHlwZWRlZiB7eyBhbGxvd0FwcGVuZGVySW5qZWN0aW9uIDogYm9vbGVhbiwgYXBwZW5kZXJzIDogQXJyYXkuPEFQUEVOREVSPixcclxuICogXHRcdFx0YXBwbGljYXRpb24gOiBPYmplY3QsIGxvZ2dlcnMgOiBBcnJheS48TE9HR0VSPiwgdGFnTGF5b3V0IDogc3RyaW5nIH19XHJcbiAqL1xyXG52YXIgQ09ORklHX1BBUkFNUztcclxuXHJcbi8qKlxyXG4gKiBIb2xkcyB0aGUgZGVmaW5pdGlvbiBmb3IgdGhlIGxvZyBldmVudCBvYmplY3RcclxuICpcclxuICogQHR5cGVkZWYge3sgZXJyb3IgOiBFcnJvciwgbWVzc2FnZSA6IHN0cmluZywgcHJvcGVydGllcyA6IE9iamVjdCxcclxuICogICAgICAgICAgdGltZXN0YW1wIDogc3RyaW5nIH19XHJcbiAqL1xyXG52YXIgTE9HX0VWRU5UO1xyXG5cclxuLyoqXHJcbiAqIEB0eXBlZGVmIHt7IGxvZ0xldmVsIDogbnVtYmVyIH19XHJcbiAqL1xyXG52YXIgTE9HR0VSO1xyXG5cclxuLyoqIEB0eXBlIHtBcnJheS48QVBQRU5ERVI+fSAqL1xyXG52YXIgYXBwZW5kZXJzXyA9IFtdO1xyXG4vKiogQHR5cGUge0NPTkZJR19QQVJBTVN9ICovXHJcbnZhciBjb25maWd1cmF0aW9uXyA9IHt9O1xyXG4vKiogQHR5cGUge2Jvb2xlYW59ICovXHJcbnZhciBmaW5hbGl6ZWRfID0gZmFsc2U7XHJcbi8qKiBAdHlwZSB7T2JqZWN0fSAqL1xyXG52YXIgbG9nZ2Vyc18gPSB7fTtcclxuXHJcbmV4cG9ydCB7TG9nTGV2ZWx9O1xyXG5cclxuLyoqXHJcbiAqIENvbmZpZ3VyZXMgdGhlIGxvZ2dlclxyXG4gKlxyXG4gKiBAZnVuY3Rpb25cclxuICpcclxuICogQHBhcmFtcyB7Q09ORklHX1BBUkFNU30gY29uZmlnXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gY29uZmlndXJlKGNvbmZpZykge1xyXG5cclxuXHRpZiAoZmluYWxpemVkXykge1xyXG5cdFx0YXBwZW5kKExvZ0xldmVsLkVSUk9SLCAnQ291bGQgbm90IGNvbmZpZ3VyZS4gTG9nVXRpbGl0eSBhbHJlYWR5IGluIHVzZScpO1xyXG5cdFx0cmV0dXJuO1xyXG5cdH1cclxuXHJcblx0Y29uZmlndXJlQXBwZW5kZXJzXyhjb25maWcuYXBwZW5kZXJzLCBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0Y29uZmlndXJlTG9nZ2Vyc18oY29uZmlnLmxvZ2dlcnMpO1xyXG5cclxuXHRcdGlmIChjb25maWcudGFnTGF5b3V0KSB7XHJcblx0XHRcdGZvcm1hdHRlci5wcmVDb21waWxlKGNvbmZpZy50YWdMYXlvdXQpO1xyXG5cdFx0XHRmb3IgKHZhciBsb2dLZXkgaW4gbG9nZ2Vyc18pIHtcclxuXHRcdFx0XHRpZiAobG9nZ2Vyc18uaGFzT3duUHJvcGVydHkobG9nS2V5KSkge1xyXG5cdFx0XHRcdFx0Zm9yICh2YXIga2V5IGluIGxvZ2dlcnNfW2xvZ0tleV0pIHtcclxuXHRcdFx0XHRcdFx0aWYgKGxvZ2dlcnNfW2xvZ0tleV0uaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG5cdFx0XHRcdFx0XHRcdGxvZ2dlcnNfW2xvZ0tleV1ba2V5XS5zZXRUYWdMYXlvdXQoY29uZmlnLnRhZ0xheW91dCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRjb25maWd1cmF0aW9uXyA9IGNvbmZpZztcclxuXHJcblx0fSk7XHJcblxyXG59XHJcblxyXG52YXIgY29uZmlndXJlQXBwZW5kZXJzXyA9IGZ1bmN0aW9uIChhcHBlbmRlcnMsIGNhbGxiYWNrKSB7XHJcblxyXG5cdGlmIChhcHBlbmRlcnMgaW5zdGFuY2VvZiBBcnJheSkge1xyXG5cdFx0dmFyIGNvdW50ID0gYXBwZW5kZXJzLmxlbmd0aDtcclxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xyXG5cdFx0XHRjYWxsYmFjaygpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcbn07XHJcblxyXG52YXIgY29uZmlndXJlTG9nZ2Vyc18gPSBmdW5jdGlvbiAobG9nZ2Vycykge1xyXG5cclxuXHRpZiAoIShsb2dnZXJzIGluc3RhbmNlb2YgQXJyYXkpKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGxvZ2dlcnNcIik7XHJcblx0fVxyXG5cclxuXHR2YXIgY291bnQgPSBsb2dnZXJzLmxlbmd0aDtcclxuXHRmb3IgKHZhciBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcclxuXHJcblx0XHRpZiAoIWxvZ2dlcnNbaV0udGFnKSB7XHJcblx0XHRcdGxvZ2dlcnNfWydtYWluJ10gPSBnZXRMb2dnZXJzXyhsb2dnZXJzW2ldLmxvZ0xldmVsKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGxvZ2dlcnNfW2xvZ2dlcnNbaV0udGFnXSA9IGdldExvZ2dlcnNfKGxvZ2dlcnNbaV0ubG9nTGV2ZWwpO1xyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG59O1xyXG5cclxudmFyIGdldExvZ2dlcnNfID0gZnVuY3Rpb24gKGxvZ0xldmVsKSB7XHJcblxyXG5cdHZhciBsb2dnZXI7XHJcblx0dmFyIGxvZ2dlcnMgPSBbXTtcclxuXHR2YXIgY291bnQgPSBhcHBlbmRlcnNfLmxlbmd0aDtcclxuXHR3aGlsZSAoY291bnQtLSkge1xyXG5cdFx0bG9nZ2VyID0gYXBwZW5kZXJzX1tjb3VudF0oKTtcclxuXHRcdGxvZ2dlci5zZXRMb2dMZXZlbChsb2dMZXZlbCk7XHJcblx0XHRsb2dnZXJzLnB1c2gobG9nZ2VyKTtcclxuXHR9XHJcblxyXG5cdHJldHVybiBsb2dnZXJzO1xyXG5cclxufTtcclxuXHJcbi8qKlxyXG4gKiBBZGRzIGFuIGFwcGVuZGVyIHRvIHRoZSBhcHBlbmRlciBxdWV1ZS4gSWYgdGhlIHN0YWNrIGlzIGZpbmFsaXplZCwgYW5kXHJcbiAqIHRoZSBhbGxvd0FwcGVuZGVySW5qZWN0aW9uIGlzIHNldCB0byBmYWxzZSwgdGhlbiB0aGUgZXZlbnQgd2lsbCBub3QgYmVcclxuICogYXBwZW5kZWRcclxuICpcclxuICogQGZ1bmN0aW9uXHJcbiAqXHJcbiAqIEBwYXJhbXMge0FQUEVOREVSfSBhcHBlbmRlclxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGFkZEFwcGVuZGVyKGFwcGVuZGVyKSB7XHJcblxyXG5cdGlmIChmaW5hbGl6ZWRfICYmICFjb25maWd1cmF0aW9uXy5hbGxvd0FwcGVuZGVySW5qZWN0aW9uKSB7XHJcblx0XHRjb25zb2xlLmVycm9yKCdDYW5ub3QgYWRkIGFwcGVuZGVyIHdoZW4gY29uZmlndXJhdGlvbiBmaW5hbGl6ZWQnKTtcclxuXHRcdHJldHVybjtcclxuXHR9XHJcblxyXG5cdHZhbGlkYXRlQXBwZW5kZXJfKGFwcGVuZGVyKTtcclxuXHRhcHBlbmRlcnNfLnB1c2goYXBwZW5kZXIpO1xyXG5cclxufVxyXG5cclxuLyoqXHJcbiAqIFZhbGlkYXRlcyB0aGF0IHRoZSBhcHBlbmRlclxyXG4gKlxyXG4gKiBAZnVuY3Rpb25cclxuICpcclxuICogQHBhcmFtcyB7QVBQRU5ERVJ9IGFwcGVuZGVyXHJcbiAqL1xyXG52YXIgdmFsaWRhdGVBcHBlbmRlcl8gPSBmdW5jdGlvbiAoYXBwZW5kZXIpIHtcclxuXHJcblx0aWYgKGFwcGVuZGVyID09IG51bGwgfHwgdHlwZW9mIGFwcGVuZGVyICE9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgYXBwZW5kZXI6IG5vdCBhbiBmdW5jdGlvbicpO1xyXG5cdH1cclxuXHJcblx0dmFyIGFwcGVuZGVyT2JqID0gYXBwZW5kZXIoKTtcclxuXHJcblx0dmFyIGFwcGVuZGVyTWV0aG9kcyA9IFsnYXBwZW5kJywgJ2dldE5hbWUnLCAnaXNBY3RpdmUnLCAnc2V0TG9nTGV2ZWwnLCAnc2V0VGFnTGF5b3V0J107XHJcblx0Zm9yICh2YXIga2V5IGluIGFwcGVuZGVyTWV0aG9kcykge1xyXG5cdFx0aWYgKGFwcGVuZGVyTWV0aG9kcy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIGFwcGVuZGVyT2JqW2FwcGVuZGVyTWV0aG9kc1trZXldXSA9PSB1bmRlZmluZWQgfHxcclxuXHRcdFx0dHlwZW9mIGFwcGVuZGVyT2JqW2FwcGVuZGVyTWV0aG9kc1trZXldXSAhPSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcignSW52YWxpZCBhcHBlbmRlcjogbWlzc2luZyBtZXRob2Q6ICcgKyBhcHBlbmRlck1ldGhvZHNba2V5XSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRpZiAoY29uZmlndXJhdGlvbl8udGFnTGF5b3V0KSB7XHJcblx0XHRhcHBlbmRlck9iai5zZXRUYWdMYXlvdXQoY29uZmlndXJhdGlvbl8udGFnTGF5b3V0KTtcclxuXHR9XHJcblxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEFwcGVuZHMgdGhlIGxvZyBldmVudFxyXG4gKlxyXG4gKiBAZnVuY3Rpb25cclxuICpcclxuICogQHBhcmFtIHtPYmplY3R9IGxvZ2dpbmdFdmVudFxyXG4gKiBAcGFyYW0ge09iamVjdHxudW1iZXJ8c3RyaW5nfSBhcmd1bWVudHNcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBhcHBlbmQobG9nZ2luZ0V2ZW50KSB7XHJcblxyXG5cdC8vIGZpbmFsaXplIHRoZSBjb25maWd1cmF0aW9uIHRvIG1ha2Ugc3VyZSBubyBvdGhlciBhcHBlbmRlcnMgYXJlIGluamVjdGVkIChpZiBzZXQpXHJcblx0ZmluYWxpemVkXyA9IHRydWU7XHJcblxyXG5cdHZhciBsb2dnZXJzO1xyXG5cdGlmIChsb2dnZXJzX1tsb2dnaW5nRXZlbnQubG9nZ2VyXSkge1xyXG5cdFx0bG9nZ2VycyA9IGxvZ2dlcnNfW2xvZ2dpbmdFdmVudC5sb2dnZXJdO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRsb2dnZXJzID0gbG9nZ2Vyc19bJ21haW4nXTtcclxuXHR9XHJcblxyXG5cdHZhciBjb3VudCA9IGxvZ2dlcnMubGVuZ3RoO1xyXG5cdHdoaWxlIChjb3VudC0tKSB7XHJcblx0XHRpZiAobG9nZ2Vyc1tjb3VudF0uaXNBY3RpdmUobG9nZ2luZ0V2ZW50LmxldmVsKSkge1xyXG5cdFx0XHRsb2dnZXJzW2NvdW50XS5hcHBlbmQobG9nZ2luZ0V2ZW50KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG59XHJcblxyXG4vKipcclxuICogQHByaXZhdGVcclxuICogQGZ1bmN0aW9uXHJcbiAqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBsZXZlbFxyXG4gKi9cclxudmFyIHZhbGlkYXRlTGV2ZWxfID0gZnVuY3Rpb24gKGxldmVsKSB7XHJcblxyXG5cdGZvciAodmFyIGtleSBpbiBMb2dMZXZlbCkge1xyXG5cdFx0aWYgKGxldmVsID09PSBMb2dMZXZlbFtrZXldKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHRocm93IG5ldyBFcnJvcignSW52YWxpZCBsb2cgbGV2ZWw6ICcgKyBsZXZlbCk7XHJcblxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEdldHMgdGhlIGFwcGxpY2F0aW9uIGluZm9ybWF0aW9uIGZyb20gdGhlIGNvbmZpZ3VyYXRpb25cclxuICogQHJldHVybiB7T2JqZWN0fVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEFwcGxpY2F0aW9uSW5mbygpIHtcclxuXHRpZiAoY29uZmlndXJhdGlvbl8uYXBwbGljYXRpb24gIT0gbnVsbCkge1xyXG5cdFx0cmV0dXJuIGNvbmZpZ3VyYXRpb25fLmFwcGxpY2F0aW9uO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRyZXR1cm4gbnVsbDtcclxuXHR9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBIYW5kbGVzIGNyZWF0aW5nIHRoZSBsb2dnZXIgYW5kIHJldHVybmluZyBpdFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gY29udGV4dFxyXG4gKiBAcmV0dXJuIHtMb2dnZXJ9XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZ2V0TG9nZ2VyKGNvbnRleHQpIHtcclxuXHRyZXR1cm4gbmV3IExvZ2dlcihjb250ZXh0LCB7XHJcblx0XHRhcHBlbmQ6IGFwcGVuZFxyXG5cdH0pO1xyXG59XHJcblxyXG4vKipcclxuICogU2V0cyB0aGUgbG9nIGxldmVsIGZvciBhbGwgbG9nZ2Vyc1xyXG4gKiBAcGFyYW0ge251bWJlcn0gbG9nTGV2ZWxcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRMb2dMZXZlbChsb2dMZXZlbCkge1xyXG5cclxuXHR2YWxpZGF0ZUxldmVsXyhsb2dMZXZlbCk7XHJcblxyXG5cdGZvciAodmFyIGxvZ0tleSBpbiBsb2dnZXJzXykge1xyXG5cdFx0aWYgKGxvZ2dlcnNfLmhhc093blByb3BlcnR5KGxvZ0tleSkpIHtcclxuXHRcdFx0Zm9yICh2YXIga2V5IGluIGxvZ2dlcnNfW2xvZ0tleV0pIHtcclxuXHRcdFx0XHRpZiAobG9nZ2Vyc19bbG9nS2V5XS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcblx0XHRcdFx0XHRsb2dnZXJzX1tsb2dLZXldW2tleV0uc2V0TG9nTGV2ZWwobG9nTGV2ZWwpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcbn1cclxuXHJcbmFkZEFwcGVuZGVyKGNvbnNvbGVBcHBlbmRlci5Db25zb2xlQXBwZW5kZXIpOyJdfQ==


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	exports.__esModule = true;
	exports.preCompile = preCompile;
	exports.format = format;
	// istanbul ignore next

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

	/**
	 * log4js <https://github.com/anigenero/log4js>
	 *
	 * Copyright 2016-present Robin Schultz <http://cunae.com>
	 * Released under the MIT License
	 */

	var _dateFormatter = __webpack_require__(2);

	var _constLogLevel = __webpack_require__(3);

	var logLevel = _interopRequireWildcard(_constLogLevel);

	/** @type {Object} */
	var compiledLayouts_ = {};

	/**
	 * @function
	 * @memberOf formatter
	 *
	 * @param {LOG_EVENT} logEvent
	 * @param {Array.<string>} params
	 *
	 * @return {string}
	 */
	var formatLogger_ = function formatLogger_(logEvent, params) {
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
	var formatDate_ = function formatDate_(logEvent, params) {
	  return _dateFormatter.dateFormat(new Date(), params[0]);
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
	var formatException_ = function formatException_(logEvent, params) {
	  var message = '';
	  if (logEvent.error != null) {

	    if (logEvent.error.stack != undefined) {
	      var stacks = logEvent.error.stack.split(/\n/g);
	      for (var key in stacks) {
	        message += '\t' + stacks[key] + '\n';
	      }
	    } else if (logEvent.error.message != null && logEvent.error.message != '') {
	      message += '\t';
	      message += logEvent.error.name + ': ' + logEvent.error.message;
	      message += '\n';
	    }
	  }
	  return message;
	};

	/**
	 *
	 */
	var formatFile_ = function formatFile_(logEvent, params) {
	  return logEvent.file;
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
	var formatLineNumber_ = function formatLineNumber_(logEvent, params) {
	  return '' + logEvent.lineNumber;
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
	var formatMapMessage_ = function formatMapMessage_(logEvent, params) {
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
	 * @param {Array.<string>} params
	 *
	 * @return {string}
	 */
	var formatLogMessage_ = function formatLogMessage_(logEvent, params) {
	  return logEvent.message;
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
	var formatMethodName_ = function formatMethodName_(logEvent, params) {
	  return logEvent.method;
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
	var formatLineSeparator_ = function formatLineSeparator_(logEvent, params) {
	  return '\n';
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
	var formatLevel_ = function formatLevel_(logEvent, params) {
	  if (logEvent.level == logLevel.FATAL) {
	    return 'FATAL';
	  } else if (logEvent.level == logLevel.ERROR) {
	    return 'ERROR';
	  } else if (logEvent.level == logLevel.WARN) {
	    return 'WARN';
	  } else if (logEvent.level == logLevel.INFO) {
	    return 'INFO';
	  } else if (logEvent.level == logLevel.DEBUG) {
	    return 'DEBUG';
	  } else if (logEvent.level == logLevel.TRACE) {
	    return 'TRACE';
	  }
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
	var formatRelative_ = function formatRelative_(logEvent, params) {
	  return '' + logEvent.relative;
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
	var formatSequenceNumber_ = function formatSequenceNumber_(logEvent, params) {
	  return '' + logEvent.sequence;
	};

	var formatters_ = {
	  'c|logger': formatLogger_,
	  'd|date': formatDate_,
	  'ex|exception|throwable': formatException_,
	  'F|file': formatFile_,
	  'K|map|MAP': formatMapMessage_,
	  'L|line': formatLineNumber_,
	  'm|msg|message': formatLogMessage_,
	  'M|method': formatMethodName_,
	  'n': formatLineSeparator_,
	  'p|level': formatLevel_,
	  'r|relative': formatRelative_,
	  'sn|sequenceNumber': formatSequenceNumber_
	};

	/**
	 * @function
	 * @memberOf formatter
	 *
	 * @param {string} layout
	 *
	 * @return {string}
	 */
	var getCompiledLayout_ = function getCompiledLayout_(layout) {

	  if (compiledLayouts_[layout] != undefined) {
	    return compiledLayouts_[layout];
	  }

	  return compileLayout_(layout);
	};

	/**
	 * @function
	 * @memberOf formatter
	 *
	 * @param {string} layout
	 *
	 * @return {string}
	 */
	var compileLayout_ = function compileLayout_(layout) {

	  var index = layout.indexOf('%');
	  var currentFormatString = '';
	  var formatter = [];

	  if (index != 0) {
	    formatter.push(layout.substring(0, index));
	  }

	  do {

	    var startIndex = index;
	    var endIndex = index = layout.indexOf('%', index + 1);

	    if (endIndex < 0) {
	      currentFormatString = layout.substring(startIndex);
	    } else {
	      currentFormatString = layout.substring(startIndex, endIndex);
	    }

	    formatter.push(getFormatterObject_(currentFormatString));
	  } while (index > -1);

	  compiledLayouts_[layout] = formatter;

	  return formatter;
	};

	/**
	 * @function
	 * @memberOf formatter
	 *
	 * @param {string} formatString
	 *
	 * @return {?string}
	 */
	var getFormatterObject_ = function getFormatterObject_(formatString) {

	  var commandRegex = /%([a-z,A-Z]+)(?=\{|)/;
	  var result = commandRegex.exec(formatString);
	  if (result != null && result.length == 2) {

	    var formatter = getFormatterFunction_(result[1]);
	    if (formatter == null) {
	      return null;
	    }

	    var params = getFormatterParams_(formatString);

	    var after = '';
	    var endIndex = formatString.lastIndexOf('}');
	    if (endIndex != -1) {
	      after = formatString.substring(endIndex + 1);
	    } else {
	      after = formatString.substring(result.index + result[1].length + 1);
	    }

	    return {
	      formatter: formatter,
	      params: params,
	      after: after
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
	var getFormatterFunction_ = function getFormatterFunction_(command) {

	  var regex;
	  for (var key in formatters_) {
	    regex = new RegExp('^' + key + '$');
	    if (regex.exec(command) != null) {
	      return formatters_[key];
	    }
	  }

	  return null;
	};

	/**
	 * @private
	 * @function
	 *
	 * @param {string} command
	 *
	 * @return {string}
	 */
	var getFormatterParams_ = function getFormatterParams_(command) {

	  var params = [];
	  var result = command.match(/\{([^\}]*)(?=\})/g);
	  if (result != null) {
	    for (var i = 0; i < result.length; i++) {
	      params.push(result[i].substring(1));
	    }
	  }

	  return params;
	};

	/**
	 * @private
	 * @function
	 *
	 * @param {Array.<function|string>} formatter
	 * @param {LOG_EVENT} logEvent
	 *
	 * @return {string}
	 */
	var formatLogEvent_ = function formatLogEvent_(formatter, logEvent) {

	  var response;
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
	 * @function
	 * @memberOf formatter
	 *
	 * @param {string} layout
	 *
	 * @return {string}
	 */

	function preCompile(layout) {
	  getCompiledLayout_(layout);
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
	  return formatLogEvent_(getCompiledLayout_(layout), logEvent);
	}
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mb3JtYXR0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7NkJBTzJCLGlCQUFpQjs7NkJBQ2xCLGtCQUFrQjs7SUFBaEMsUUFBUTs7O0FBR3BCLElBQUksZ0JBQWdCLEdBQUcsRUFBRSxDQUFDOzs7Ozs7Ozs7OztBQVcxQixJQUFJLGFBQWEsR0FBRyxTQUFoQixhQUFhLENBQVksUUFBUSxFQUFFLE1BQU0sRUFBRTtBQUM5QyxTQUFPLFFBQVEsQ0FBQyxNQUFNLENBQUM7Q0FDdkIsQ0FBQzs7Ozs7Ozs7Ozs7QUFXRixJQUFJLFdBQVcsR0FBRyxTQUFkLFdBQVcsQ0FBWSxRQUFRLEVBQUUsTUFBTSxFQUFFO0FBQzVDLFNBQU8sMEJBQVcsSUFBSSxJQUFJLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztDQUN6QyxDQUFDOzs7Ozs7Ozs7OztBQVdGLElBQUksZ0JBQWdCLEdBQUcsU0FBbkIsZ0JBQWdCLENBQVksUUFBUSxFQUFFLE1BQU0sRUFBRTtBQUNqRCxNQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDakIsTUFBSSxRQUFRLENBQUMsS0FBSyxJQUFJLElBQUksRUFBRTs7QUFFM0IsUUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssSUFBSSxTQUFTLEVBQUU7QUFDdEMsVUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQy9DLFdBQU0sSUFBSSxHQUFHLElBQUksTUFBTSxFQUFFO0FBQ3hCLGVBQU8sSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztPQUNyQztLQUNELE1BQU0sSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sSUFBSSxJQUFJLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLElBQUksRUFBRSxFQUFFO0FBQzFFLGFBQU8sSUFBSSxJ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QUFDLENBQUMsQ0FBQyxDQUFDO09BQ3hCO0tBRUQ7R0FDRDs7QUFFRCxTQUFPLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztDQUV0QixDQUFDOzs7Ozs7Ozs7OztBQVVLLFNBQVMsVUFBVSxDQUFDLE1BQU0sRUFBRTtBQUNsQyxvQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztDQUMzQjs7Ozs7Ozs7Ozs7O0FBV00sU0FBUyxNQUFNLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRTtBQUN4QyxTQUFPLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztDQUM3RCIsImZpbGUiOiJmb3JtYXR0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogbG9nNGpzIDxodHRwczovL2dpdGh1Yi5jb20vYW5pZ2VuZXJvL2xvZzRqcz5cclxuICpcclxuICogQ29weXJpZ2h0IDIwMTYtcHJlc2VudCBSb2JpbiBTY2h1bHR6IDxodHRwOi8vY3VuYWUuY29tPlxyXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2VcclxuICovXHJcblxyXG5pbXBvcnQgeyBkYXRlRm9ybWF0IH0gZnJvbSAnLi9kYXRlRm9ybWF0dGVyJztcclxuaW1wb3J0ICogYXMgbG9nTGV2ZWwgZnJvbSAnLi9jb25zdC9sb2dMZXZlbCc7XHJcblxyXG4vKiogQHR5cGUge09iamVjdH0gKi9cclxudmFyIGNvbXBpbGVkTGF5b3V0c18gPSB7fTtcclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGZvcm1hdHRlclxyXG4gKlxyXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcclxuICogQHBhcmFtIHtBcnJheS48c3RyaW5nPn0gcGFyYW1zXHJcbiAqXHJcbiAqIEByZXR1cm4ge3N0cmluZ31cclxuICovXHJcbnZhciBmb3JtYXRMb2dnZXJfID0gZnVuY3Rpb24obG9nRXZlbnQsIHBhcmFtcykge1xyXG5cdHJldHVybiBsb2dFdmVudC5sb2dnZXI7XHJcbn07XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcclxuICpcclxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XHJcbiAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz59IHBhcmFtc1xyXG4gKlxyXG4gKiBAcmV0dXJuIHtzdHJpbmd9XHJcbiAqL1xyXG52YXIgZm9ybWF0RGF0ZV8gPSBmdW5jdGlvbihsb2dFdmVudCwgcGFyYW1zKSB7XHJcblx0cmV0dXJuIGRhdGVGb3JtYXQobmV3IERhdGUoKSwgcGFyYW1zWzBdKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGZvcm1hdHRlclxyXG4gKlxyXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcclxuICogQHBhcmFtIHtBcnJheS48c3RyaW5nPn0gcGFyYW1zXHJcbiAqXHJcbiAqIEByZXR1cm4ge3N0cmluZ31cclxuICovXHJcbnZhciBmb3JtYXRFeGNlcHRpb25fID0gZnVuY3Rpb24obG9nRXZlbnQsIHBhcmFtcykge1xyXG5cdHZhciBtZXNzYWdlID0gJyc7XHJcblx0aWYgKGxvZ0V2ZW50LmVycm9yICE9IG51bGwpIHtcclxuXHJcblx0XHRpZiAobG9nRXZlbnQuZXJyb3Iuc3RhY2sgIT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdHZhciBzdGFja3MgPSBsb2dFdmVudC5lcnJvci5zdGFjay5zcGxpdCgvXFxuL2cpO1xyXG5cdFx0XHRmb3IgKCB2YXIga2V5IGluIHN0YWNrcykge1xyXG5cdFx0XHRcdG1lc3NhZ2UgKz0gJ1xcdCcgKyBzdGFja3Nba2V5XSArICdcXG4nO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2UgaWYgKGxvZ0V2ZW50LmVycm9yLm1lc3NhZ2UgIT0gbnVsbCAmJiBsb2dFdmVudC5lcnJvci5tZXNzYWdlICE9ICcnKSB7XHJcblx0XHRcdG1lc3NhZ2UgKz0gJ1xcdCc7XHJcblx0XHRcdG1lc3NhZ2UgKz0gbG9nRXZlbnQuZXJyb3IubmFtZSArICc6ICcgKyBsb2dFdmVudC5lcnJvci5tZXNzYWdlO1xyXG5cdFx0XHRtZXNzYWdlICs9ICdcXG4nO1xyXG5cdFx0fVxyXG5cclxuXHR9XHJcblx0cmV0dXJuIG1lc3NhZ2U7XHJcbn07XHJcblxyXG4vKipcclxuICpcclxuICovXHJcbnZhciBmb3JtYXRGaWxlXyA9IGZ1bmN0aW9uKGxvZ0V2ZW50LCBwYXJhbXMpIHtcclxuXHRyZXR1cm4gbG9nRXZlbnQuZmlsZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGZvcm1hdHRlclxyXG4gKlxyXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcclxuICogQHBhcmFtIHtBcnJheS48c3RyaW5nPn0gcGFyYW1zXHJcbiAqXHJcbiAqIEByZXR1cm4ge3N0cmluZ31cclxuICovXHJcbnZhciBmb3JtYXRMaW5lTnVtYmVyXyA9IGZ1bmN0aW9uKGxvZ0V2ZW50LCBwYXJhbXMpIHtcclxuXHRyZXR1cm4gJycgKyBsb2dFdmVudC5saW5lTnVtYmVyO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXHJcbiAqXHJcbiAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dFdmVudFxyXG4gKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSBwYXJhbXNcclxuICpcclxuICogQHJldHVybiB7c3RyaW5nfVxyXG4gKi9cclxudmFyIGZvcm1hdE1hcE1lc3NhZ2VfID0gZnVuY3Rpb24obG9nRXZlbnQsIHBhcmFtcykge1xyXG5cdHZhciBtZXNzYWdlID0gbnVsbDtcclxuXHRpZiAobG9nRXZlbnQucHJvcGVydGllcykge1xyXG5cclxuXHRcdG1lc3NhZ2UgPSBbXTtcclxuXHRcdGZvciAoIHZhciBrZXkgaW4gbG9nRXZlbnQucHJvcGVydGllcykge1xyXG5cdFx0XHRpZiAocGFyYW1zWzBdKSB7XHJcblx0XHRcdFx0aWYgKHBhcmFtc1swXSA9PSBrZXkpIHtcclxuXHRcdFx0XHRcdG1lc3NhZ2UucHVzaChsb2dFdmVudC5wcm9wZXJ0aWVzW2tleV0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRtZXNzYWdlLnB1c2goJ3snICsga2V5ICsgJywnICsgbG9nRXZlbnQucHJvcGVydGllc1trZXldICsgJ30nKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiAneycgKyBtZXNzYWdlLmpvaW4oJywnKSArICd9JztcclxuXHJcblx0fVxyXG5cdHJldHVybiBtZXNzYWdlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXHJcbiAqXHJcbiAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dFdmVudFxyXG4gKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSBwYXJhbXNcclxuICpcclxuICogQHJldHVybiB7c3RyaW5nfVxyXG4gKi9cclxudmFyIGZvcm1hdExvZ01lc3NhZ2VfID0gZnVuY3Rpb24obG9nRXZlbnQsIHBhcmFtcykge1xyXG5cdHJldHVybiBsb2dFdmVudC5tZXNzYWdlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXHJcbiAqXHJcbiAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dFdmVudFxyXG4gKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSBwYXJhbXNcclxuICpcclxuICogQHJldHVybiB7c3RyaW5nfVxyXG4gKi9cclxudmFyIGZvcm1hdE1ldGhvZE5hbWVfID0gZnVuY3Rpb24obG9nRXZlbnQsIHBhcmFtcykge1xyXG5cdHJldHVybiBsb2dFdmVudC5tZXRob2Q7XHJcbn07XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcclxuICpcclxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XHJcbiAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz59IHBhcmFtc1xyXG4gKlxyXG4gKiBAcmV0dXJuIHtzdHJpbmd9XHJcbiAqL1xyXG52YXIgZm9ybWF0TGluZVNlcGFyYXRvcl8gPSBmdW5jdGlvbihsb2dFdmVudCwgcGFyYW1zKSB7XHJcblx0cmV0dXJuICdcXG4nO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXHJcbiAqXHJcbiAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dFdmVudFxyXG4gKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSBwYXJhbXNcclxuICpcclxuICogQHJldHVybiB7c3RyaW5nfVxyXG4gKi9cclxudmFyIGZvcm1hdExldmVsXyA9IGZ1bmN0aW9uKGxvZ0V2ZW50LCBwYXJhbXMpIHtcclxuXHRpZiAobG9nRXZlbnQubGV2ZWwgPT0gbG9nTGV2ZWwuRkFUQUwpIHtcclxuXHRcdHJldHVybiAnRkFUQUwnO1xyXG5cdH0gZWxzZSBpZiAobG9nRXZlbnQubGV2ZWwgPT0gbG9nTGV2ZWwuRVJST1IpIHtcclxuXHRcdHJldHVybiAnRVJST1InO1xyXG5cdH0gZWxzZSBpZiAobG9nRXZlbnQubGV2ZWwgPT0gbG9nTGV2ZWwuV0FSTikge1xyXG5cdFx0cmV0dXJuICdXQVJOJztcclxuXHR9IGVsc2UgaWYgKGxvZ0V2ZW50LmxldmVsID09IGxvZ0xldmVsLklORk8pIHtcclxuXHRcdHJldHVybiAnSU5GTyc7XHJcblx0fSBlbHNlIGlmIChsb2dFdmVudC5sZXZlbCA9PSBsb2dMZXZlbC5ERUJVRykge1xyXG5cdFx0cmV0dXJuICdERUJVRyc7XHJcblx0fSBlbHNlIGlmIChsb2dFdmVudC5sZXZlbCA9PSBsb2dMZXZlbC5UUkFDRSkge1xyXG5cdFx0cmV0dXJuICdUUkFDRSc7XHJcblx0fVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXHJcbiAqXHJcbiAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dFdmVudFxyXG4gKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSBwYXJhbXNcclxuICpcclxuICogQHJldHVybiB7c3RyaW5nfVxyXG4gKi9cclxudmFyIGZvcm1hdFJlbGF0aXZlXyA9IGZ1bmN0aW9uKGxvZ0V2ZW50LCBwYXJhbXMpIHtcclxuXHRyZXR1cm4gJycgKyBsb2dFdmVudC5yZWxhdGl2ZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGZvcm1hdHRlclxyXG4gKlxyXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcclxuICogQHBhcmFtIHtBcnJheS48c3RyaW5nPn0gcGFyYW1zXHJcbiAqXHJcbiAqIEByZXR1cm4ge3N0cmluZ31cclxuICovXHJcbnZhciBmb3JtYXRTZXF1ZW5jZU51bWJlcl8gPSBmdW5jdGlvbihsb2dFdmVudCwgcGFyYW1zKSB7XHJcblx0cmV0dXJuICcnICsgbG9nRXZlbnQuc2VxdWVuY2U7XHJcbn07XHJcblxyXG52YXIgZm9ybWF0dGVyc18gPSB7XHJcblx0J2N8bG9nZ2VyJyA6IGZvcm1hdExvZ2dlcl8sXHJcblx0J2R8ZGF0ZScgOiBmb3JtYXREYXRlXyxcclxuXHQnZXh8ZXhjZXB0aW9ufHRocm93YWJsZScgOiBmb3JtYXRFeGNlcHRpb25fLFxyXG5cdCdGfGZpbGUnIDogZm9ybWF0RmlsZV8sXHJcblx0J0t8bWFwfE1BUCcgOiBmb3JtYXRNYXBNZXNzYWdlXyxcclxuXHQnTHxsaW5lJyA6IGZvcm1hdExpbmVOdW1iZXJfLFxyXG5cdCdtfG1zZ3xtZXNzYWdlJyA6IGZvcm1hdExvZ01lc3NhZ2VfLFxyXG5cdCdNfG1ldGhvZCcgOiBmb3JtYXRNZXRob2ROYW1lXyxcclxuXHQnbicgOiBmb3JtYXRMaW5lU2VwYXJhdG9yXyxcclxuXHQncHxsZXZlbCcgOiBmb3JtYXRMZXZlbF8sXHJcblx0J3J8cmVsYXRpdmUnIDogZm9ybWF0UmVsYXRpdmVfLFxyXG5cdCdzbnxzZXF1ZW5jZU51bWJlcicgOiBmb3JtYXRTZXF1ZW5jZU51bWJlcl9cclxufTtcclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGZvcm1hdHRlclxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gbGF5b3V0XHJcbiAqXHJcbiAqIEByZXR1cm4ge3N0cmluZ31cclxuICovXHJcbnZhciBnZXRDb21waWxlZExheW91dF8gPSBmdW5jdGlvbihsYXlvdXQpIHtcclxuXHJcblx0aWYgKGNvbXBpbGVkTGF5b3V0c19bbGF5b3V0XSAhPSB1bmRlZmluZWQpIHtcclxuXHRcdHJldHVybiBjb21waWxlZExheW91dHNfW2xheW91dF07XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gY29tcGlsZUxheW91dF8obGF5b3V0KTtcclxuXHJcbn07XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IGxheW91dFxyXG4gKlxyXG4gKiBAcmV0dXJuIHtzdHJpbmd9XHJcbiAqL1xyXG52YXIgY29tcGlsZUxheW91dF8gPSBmdW5jdGlvbihsYXlvdXQpIHtcclxuXHJcblx0dmFyIGluZGV4ID0gbGF5b3V0LmluZGV4T2YoJyUnKTtcclxuXHR2YXIgY3VycmVudEZvcm1hdFN0cmluZyA9ICcnO1xyXG5cdHZhciBmb3JtYXR0ZXIgPSBbXTtcclxuXHJcblx0aWYgKGluZGV4ICE9IDApIHtcclxuXHRcdGZvcm1hdHRlci5wdXNoKGxheW91dC5zdWJzdHJpbmcoMCwgaW5kZXgpKTtcclxuXHR9XHJcblxyXG5cdGRvIHtcclxuXHJcblx0XHR2YXIgc3RhcnRJbmRleCA9IGluZGV4O1xyXG5cdFx0dmFyIGVuZEluZGV4ID0gaW5kZXggPSBsYXlvdXQuaW5kZXhPZignJScsIGluZGV4ICsgMSk7XHJcblxyXG5cdFx0aWYgKGVuZEluZGV4IDwgMCkge1xyXG5cdFx0XHRjdXJyZW50Rm9ybWF0U3RyaW5nID0gbGF5b3V0LnN1YnN0cmluZyhzdGFydEluZGV4KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGN1cnJlbnRGb3JtYXRTdHJpbmcgPSBsYXlvdXQuc3Vic3RyaW5nKHN0YXJ0SW5kZXgsIGVuZEluZGV4KTtcclxuXHRcdH1cclxuXHJcblx0XHRmb3JtYXR0ZXIucHVzaChnZXRGb3JtYXR0ZXJPYmplY3RfKGN1cnJlbnRGb3JtYXRTdHJpbmcpKTtcclxuXHJcblx0fSB3aGlsZSAoaW5kZXggPiAtMSk7XHJcblxyXG5cdGNvbXBpbGVkTGF5b3V0c19bbGF5b3V0XSA9IGZvcm1hdHRlcjtcclxuXHJcblx0cmV0dXJuIGZvcm1hdHRlcjtcclxuXHJcbn07XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IGZvcm1hdFN0cmluZ1xyXG4gKlxyXG4gKiBAcmV0dXJuIHs/c3RyaW5nfVxyXG4gKi9cclxudmFyIGdldEZvcm1hdHRlck9iamVjdF8gPSBmdW5jdGlvbihmb3JtYXRTdHJpbmcpIHtcclxuXHJcblx0dmFyIGNvbW1hbmRSZWdleCA9IC8lKFthLXosQS1aXSspKD89XFx7fCkvO1xyXG5cdHZhciByZXN1bHQgPSBjb21tYW5kUmVnZXguZXhlYyhmb3JtYXRTdHJpbmcpO1xyXG5cdGlmIChyZXN1bHQgIT0gbnVsbCAmJiByZXN1bHQubGVuZ3RoID09IDIpIHtcclxuXHJcblx0XHR2YXIgZm9ybWF0dGVyID0gZ2V0Rm9ybWF0dGVyRnVuY3Rpb25fKHJlc3VsdFsxXSk7XHJcblx0XHRpZiAoZm9ybWF0dGVyID09IG51bGwpIHtcclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIHBhcmFtcyA9IGdldEZvcm1hdHRlclBhcmFtc18oZm9ybWF0U3RyaW5nKTtcclxuXHJcblx0XHR2YXIgYWZ0ZXIgPSAnJztcclxuXHRcdHZhciBlbmRJbmRleCA9IGZvcm1hdFN0cmluZy5sYXN0SW5kZXhPZignfScpO1xyXG5cdFx0aWYgKGVuZEluZGV4ICE9IC0xKSB7XHJcblx0XHRcdGFmdGVyID0gZm9ybWF0U3RyaW5nLnN1YnN0cmluZyhlbmRJbmRleCArIDEpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0YWZ0ZXIgPSBmb3JtYXRTdHJpbmcuc3Vic3RyaW5nKHJlc3VsdC5pbmRleCArIHJlc3VsdFsxXS5sZW5ndGggKyAxKTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRmb3JtYXR0ZXIgOiBmb3JtYXR0ZXIsXHJcblx0XHRcdHBhcmFtcyA6IHBhcmFtcyxcclxuXHRcdFx0YWZ0ZXIgOiBhZnRlclxyXG5cdFx0fTtcclxuXHJcblx0fVxyXG5cclxuXHRyZXR1cm4gZm9ybWF0U3RyaW5nO1xyXG5cclxufTtcclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGZvcm1hdHRlclxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gY29tbWFuZFxyXG4gKlxyXG4gKiBAcmV0dXJuIHs/c3RyaW5nfVxyXG4gKi9cclxudmFyIGdldEZvcm1hdHRlckZ1bmN0aW9uXyA9IGZ1bmN0aW9uKGNvbW1hbmQpIHtcclxuXHJcblx0dmFyIHJlZ2V4O1xyXG5cdGZvciAoIHZhciBrZXkgaW4gZm9ybWF0dGVyc18pIHtcclxuXHRcdHJlZ2V4ID0gbmV3IFJlZ0V4cCgnXicgKyBrZXkgKyAnJCcpO1xyXG5cdFx0aWYgKHJlZ2V4LmV4ZWMoY29tbWFuZCkgIT0gbnVsbCkge1xyXG5cdFx0XHRyZXR1cm4gZm9ybWF0dGVyc19ba2V5XTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJldHVybiBudWxsO1xyXG5cclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAZnVuY3Rpb25cclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IGNvbW1hbmRcclxuICpcclxuICogQHJldHVybiB7c3RyaW5nfVxyXG4gKi9cclxudmFyIGdldEZvcm1hdHRlclBhcmFtc18gPSBmdW5jdGlvbihjb21tYW5kKSB7XHJcblxyXG5cdHZhciBwYXJhbXMgPSBbXTtcclxuXHR2YXIgcmVzdWx0ID0gY29tbWFuZC5tYXRjaCgvXFx7KFteXFx9XSopKD89XFx9KS9nKTtcclxuXHRpZiAocmVzdWx0ICE9IG51bGwpIHtcclxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgcmVzdWx0Lmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHBhcmFtcy5wdXNoKHJlc3VsdFtpXS5zdWJzdHJpbmcoMSkpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIHBhcmFtcztcclxuXHJcbn07XHJcblxyXG4vKipcclxuICogQHByaXZhdGVcclxuICogQGZ1bmN0aW9uXHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXkuPGZ1bmN0aW9ufHN0cmluZz59IGZvcm1hdHRlclxyXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcclxuICpcclxuICogQHJldHVybiB7c3RyaW5nfVxyXG4gKi9cclxudmFyIGZvcm1hdExvZ0V2ZW50XyA9IGZ1bmN0aW9uKGZvcm1hdHRlciwgbG9nRXZlbnQpIHtcclxuXHJcblx0dmFyIHJlc3BvbnNlO1xyXG5cdHZhciBtZXNzYWdlID0gJyc7XHJcblx0dmFyIGNvdW50ID0gZm9ybWF0dGVyLmxlbmd0aDtcclxuXHRmb3IgKHZhciBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcclxuXHRcdGlmIChmb3JtYXR0ZXJbaV0gIT09IG51bGwpIHtcclxuXHJcblx0XHRcdGlmIChmb3JtYXR0ZXJbaV0gaW5zdGFuY2VvZiBPYmplY3QpIHtcclxuXHJcblx0XHRcdFx0cmVzcG9uc2UgPSBmb3JtYXR0ZXJbaV0uZm9ybWF0dGVyKGxvZ0V2ZW50LCBmb3JtYXR0ZXJbaV0ucGFyYW1zKTtcclxuXHRcdFx0XHRpZiAocmVzcG9uc2UgIT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0bWVzc2FnZSArPSByZXNwb25zZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bWVzc2FnZSArPSBmb3JtYXR0ZXJbaV0uYWZ0ZXI7XHJcblxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdG1lc3NhZ2UgKz0gZm9ybWF0dGVyW2ldO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIG1lc3NhZ2UudHJpbSgpO1xyXG5cclxufTtcclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGZvcm1hdHRlclxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gbGF5b3V0XHJcbiAqXHJcbiAqIEByZXR1cm4ge3N0cmluZ31cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBwcmVDb21waWxlKGxheW91dCkge1xyXG5cdGdldENvbXBpbGVkTGF5b3V0XyhsYXlvdXQpO1xyXG59XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IGxheW91dFxyXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcclxuICpcclxuICogQHJldHVybiB7c3RyaW5nfVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdChsYXlvdXQsIGxvZ0V2ZW50KSB7XHJcblx0cmV0dXJuIGZvcm1hdExvZ0V2ZW50XyhnZXRDb21waWxlZExheW91dF8obGF5b3V0KSwgbG9nRXZlbnQpO1xyXG59Il19


/***/ },
/* 2 */
/***/ function(module, exports) {

	exports.__esModule = true;
	exports.dateFormat = dateFormat;
	/**
	 * log4js <https://github.com/anigenero/log4js>
	 *
	 * Copyright 2016-present Robin Schultz <http://cunae.com>
	 * Released under the MIT License
	 */

	var i18n = {
		dayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
	};

	var TOKEN = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g;
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
			value = "0" + value;
		}
		return value;
	}

	function dateFormat(date, mask, utc) {

		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date();
		if (isNaN(date)) {
			throw SyntaxError("invalid date");
		}

		mask = String(mask || 'yyyy-mm-dd HH:MM:ss,S');

		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var _ = utc ? "getUTC" : "get";
		var d = date[_ + "Date"]();
		var D = date[_ + "Day"]();
		var m = date[_ + "Month"]();
		var y = date[_ + "FullYear"]();
		var H = date[_ + "Hours"]();
		var M = date[_ + "Minutes"]();
		var s = date[_ + "Seconds"]();
		var L = date[_ + "Milliseconds"]();
		var o = utc ? 0 : date.getTimezoneOffset();
		var flags = {
			d: d,
			dd: pad(d),
			ddd: i18n.dayNames[D],
			dddd: i18n.dayNames[D + 7],
			M: m + 1,
			MM: pad(m + 1),
			MMM: i18n.monthNames[m],
			MMMM: i18n.monthNames[m + 12],
			yy: String(y).slice(2),
			yyyy: y,
			h: H % 12 || 12,
			hh: pad(H % 12 || 12),
			H: H,
			HH: pad(H),
			m: M,
			mm: pad(M),
			s: s,
			ss: pad(s),
			S: pad(L, 1),
			t: H < 12 ? "a" : "p",
			tt: H < 12 ? "am" : "pm",
			T: H < 12 ? "A" : "P",
			TT: H < 12 ? "AM" : "PM",
			Z: utc ? "UTC" : (String(date).match(TIMEZONE) || [""]).pop().replace(TIMEZONE_CLIP, ""),
			o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4)
		};

		return mask.replace(TOKEN, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	}
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kYXRlRm9ybWF0dGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQU9BLElBQUksSUFBSSxHQUFHO0FBQ1YsU0FBUSxFQUFHLENBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQy9FLFNBQVMsRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxVQUFVLENBQUU7QUFDM0QsV0FBVSxFQUFHLENBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQzNFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUMzRSxNQUFNLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFVBQVUsQ0FBRTtDQUNuRSxDQUFDOztBQUVGLElBQU0sS0FBSyxHQUFHLGdFQUFnRSxDQUFDO0FBQy9FLElBQU0sUUFBUSxHQUFHLHNJQUFzSSxDQUFDO0FBQ3hKLElBQU0sYUFBYSxHQUFHLGFBQWEsQ0FBQzs7Ozs7Ozs7OztBQVVwQyxTQUFTLEdBQUcsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFO0FBQzNCLE1BQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdEIsT0FBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLENBQUM7QUFDckIsUUFBTyxLQUFLLENBQUMsTUFBTSxHQUFHLE1BQU0sRUFBRTtBQUM3QixPQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQztFQUNwQjtBQUNELFFBQU8sS0FBSyxDQUFDO0NBQ2I7O0FBRU0sU0FBUyxVQUFVLENBQUUsSUFBSSxF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QztFQUM1RCxDQUFDLENBQUM7Q0FFSCIsImZpbGUiOiJkYXRlRm9ybWF0dGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIGxvZzRqcyA8aHR0cHM6Ly9naXRodWIuY29tL2FuaWdlbmVyby9sb2c0anM+XHJcbiAqXHJcbiAqIENvcHlyaWdodCAyMDE2LXByZXNlbnQgUm9iaW4gU2NodWx0eiA8aHR0cDovL2N1bmFlLmNvbT5cclxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlXHJcbiAqL1xyXG5cclxubGV0IGkxOG4gPSB7XHJcblx0ZGF5TmFtZXMgOiBbIFwiU3VuXCIsIFwiTW9uXCIsIFwiVHVlXCIsIFwiV2VkXCIsIFwiVGh1XCIsIFwiRnJpXCIsIFwiU2F0XCIsIFwiU3VuZGF5XCIsIFwiTW9uZGF5XCIsXHJcblx0XHRcIlR1ZXNkYXlcIiwgXCJXZWRuZXNkYXlcIiwgXCJUaHVyc2RheVwiLCBcIkZyaWRheVwiLCBcIlNhdHVyZGF5XCIgXSxcclxuXHRtb250aE5hbWVzIDogWyBcIkphblwiLCBcIkZlYlwiLCBcIk1hclwiLCBcIkFwclwiLCBcIk1heVwiLCBcIkp1blwiLCBcIkp1bFwiLCBcIkF1Z1wiLCBcIlNlcFwiLFxyXG5cdFx0XCJPY3RcIiwgXCJOb3ZcIiwgXCJEZWNcIiwgXCJKYW51YXJ5XCIsIFwiRmVicnVhcnlcIiwgXCJNYXJjaFwiLCBcIkFwcmlsXCIsIFwiTWF5XCIsIFwiSnVuZVwiLFxyXG5cdFx0XCJKdWx5XCIsIFwiQXVndXN0XCIsIFwiU2VwdGVtYmVyXCIsIFwiT2N0b2JlclwiLCBcIk5vdmVtYmVyXCIsIFwiRGVjZW1iZXJcIiBdXHJcbn07XHJcblxyXG5jb25zdCBUT0tFTiA9IC9kezEsNH18bXsxLDR9fHl5KD86eXkpP3woW0hoTXNUdF0pXFwxP3xbTGxvU1pdfFwiW15cIl0qXCJ8J1teJ10qJy9nO1xyXG5jb25zdCBUSU1FWk9ORSA9IC9cXGIoPzpbUE1DRUFdW1NEUF1UfCg/OlBhY2lmaWN8TW91bnRhaW58Q2VudHJhbHxFYXN0ZXJufEF0bGFudGljKSAoPzpTdGFuZGFyZHxEYXlsaWdodHxQcmV2YWlsaW5nKSBUaW1lfCg/OkdNVHxVVEMpKD86Wy0rXVxcZHs0fSk/KVxcYi9nO1xyXG5jb25zdCBUSU1FWk9ORV9DTElQID0gL1teLStcXGRBLVpdL2c7XHJcblxyXG4vKipcclxuICogUGFkcyBudW1iZXJzIGluIHRoZSBkYXRlIGZvcm1hdFxyXG4gKlxyXG4gKiBAcGFyYW0gdmFsdWVcclxuICogQHBhcmFtIGxlbmd0aFxyXG4gKlxyXG4gKiBAcmV0dXJucyB7P3N0cmluZ31cclxuICovXHJcbmZ1bmN0aW9uIHBhZCh2YWx1ZSwgbGVuZ3RoKSB7XHJcblx0dmFsdWUgPSBTdHJpbmcodmFsdWUpO1xyXG5cdGxlbmd0aCA9IGxlbmd0aCB8fCAyO1xyXG5cdHdoaWxlICh2YWx1ZS5sZW5ndGggPCBsZW5ndGgpIHtcclxuXHRcdHZhbHVlID0gXCIwXCIgKyB2YWx1ZTtcclxuXHR9XHJcblx0cmV0dXJuIHZhbHVlO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZGF0ZUZvcm1hdCAoZGF0ZSwgbWFzaywgdXRjKSB7XHJcblxyXG5cdC8vIFlvdSBjYW4ndCBwcm92aWRlIHV0YyBpZiB5b3Ugc2tpcCBvdGhlciBhcmdzICh1c2UgdGhlIFwiVVRDOlwiIG1hc2sgcHJlZml4KVxyXG5cdGlmIChhcmd1bWVudHMubGVuZ3RoID09IDEgJiYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGRhdGUpID09IFwiW29iamVjdCBTdHJpbmddXCIgJiYgIS9cXGQvLnRlc3QoZGF0ZSkpIHtcclxuXHRcdG1hc2sgPSBkYXRlO1xyXG5cdFx0ZGF0ZSA9IHVuZGVmaW5lZDtcclxuXHR9XHJcblxyXG5cdC8vIFBhc3NpbmcgZGF0ZSB0aHJvdWdoIERhdGUgYXBwbGllcyBEYXRlLnBhcnNlLCBpZiBuZWNlc3NhcnlcclxuXHRkYXRlID0gZGF0ZSA/IG5ldyBEYXRlKGRhdGUpIDogbmV3IERhdGU7XHJcblx0aWYgKGlzTmFOKGRhdGUpKSB7XHJcblx0XHR0aHJvdyBTeW50YXhFcnJvcihcImludmFsaWQgZGF0ZVwiKTtcclxuXHR9XHJcblxyXG5cdG1hc2sgPSBTdHJpbmcobWFzayB8fCAneXl5eS1tbS1kZCBISDpNTTpzcyxTJyk7XHJcblxyXG5cdC8vIEFsbG93IHNldHRpbmcgdGhlIHV0YyBhcmd1bWVudCB2aWEgdGhlIG1hc2tcclxuXHRpZiAobWFzay5zbGljZSgwLCA0KSA9PSBcIlVUQzpcIikge1xyXG5cdFx0bWFzayA9IG1hc2suc2xpY2UoNCk7XHJcblx0XHR1dGMgPSB0cnVlO1xyXG5cdH1cclxuXHJcblx0bGV0IF8gPSB1dGMgPyBcImdldFVUQ1wiIDogXCJnZXRcIjtcclxuXHRsZXQgZCA9IGRhdGVbXyArIFwiRGF0ZVwiXSgpO1xyXG5cdGxldCBEID0gZGF0ZVtfICsgXCJEYXlcIl0oKTtcclxuXHRsZXQgbSA9IGRhdGVbXyArIFwiTW9udGhcIl0oKTtcclxuXHRsZXQgeSA9IGRhdGVbXyArIFwiRnVsbFllYXJcIl0oKTtcclxuXHRsZXQgSCA9IGRhdGVbXyArIFwiSG91cnNcIl0oKTtcclxuXHRsZXQgTSA9IGRhdGVbXyArIFwiTWludXRlc1wiXSgpO1xyXG5cdGxldCBzID0gZGF0ZVtfICsgXCJTZWNvbmRzXCJdKCk7XHJcblx0bGV0IEwgPSBkYXRlW18gKyBcIk1pbGxpc2Vjb25kc1wiXSgpO1xyXG5cdGxldCBvID0gdXRjID8gMCA6IGRhdGUuZ2V0VGltZXpvbmVPZmZzZXQoKTtcclxuXHRsZXQgZmxhZ3MgPSB7XHJcblx0XHRkIDogZCxcclxuXHRcdGRkIDogcGFkKGQpLFxyXG5cdFx0ZGRkIDogaTE4bi5kYXlOYW1lc1tEXSxcclxuXHRcdGRkZGQgOiBpMThuLmRheU5hbWVzW0QgKyA3XSxcclxuXHRcdE0gOiBtICsgMSxcclxuXHRcdE1NIDogcGFkKG0gKyAxKSxcclxuXHRcdE1NTSA6IGkxOG4ubW9udGhOYW1lc1ttXSxcclxuXHRcdE1NTU0gOiBpMThuLm1vbnRoTmFtZXNbbSArIDEyXSxcclxuXHRcdHl5IDogU3RyaW5nKHkpLnNsaWNlKDIpLFxyXG5cdFx0eXl5eSA6IHksXHJcblx0XHRoIDogSCAlIDEyIHx8IDEyLFxyXG5cdFx0aGggOiBwYWQoSCAlIDEyIHx8IDEyKSxcclxuXHRcdEggOiBILFxyXG5cdFx0SEggOiBwYWQoSCksXHJcblx0XHRtIDogTSxcclxuXHRcdG1tIDogcGFkKE0pLFxyXG5cdFx0cyA6IHMsXHJcblx0XHRzcyA6IHBhZChzKSxcclxuXHRcdFMgOiBwYWQoTCwgMSksXHJcblx0XHR0IDogSCA8IDEyID8gXCJhXCIgOiBcInBcIixcclxuXHRcdHR0IDogSCA8IDEyID8gXCJhbVwiIDogXCJwbVwiLFxyXG5cdFx0VCA6IEggPCAxMiA/IFwiQVwiIDogXCJQXCIsXHJcblx0XHRUVCA6IEggPCAxMiA/IFwiQU1cIiA6IFwiUE1cIixcclxuXHRcdFogOiB1dGMgPyBcIlVUQ1wiIDogKFN0cmluZyhkYXRlKS5tYXRjaChUSU1FWk9ORSkgfHwgWyBcIlwiIF0pLnBvcCgpLnJlcGxhY2UoVElNRVpPTkVfQ0xJUCwgXCJcIiksXHJcblx0XHRvIDogKG8gPiAwID8gXCItXCIgOiBcIitcIikgKyBwYWQoTWF0aC5mbG9vcihNYXRoLmFicyhvKSAvIDYwKSAqIDEwMCArIE1hdGguYWJzKG8pICUgNjAsIDQpXHJcblx0fTtcclxuXHJcblx0cmV0dXJuIG1hc2sucmVwbGFjZShUT0tFTiwgZnVuY3Rpb24oJDApIHtcclxuXHRcdHJldHVybiAkMCBpbiBmbGFncyA/IGZsYWdzWyQwXSA6ICQwLnNsaWNlKDEsICQwLmxlbmd0aCAtIDEpO1xyXG5cdH0pO1xyXG5cclxufVxyXG4iXX0=


/***/ },
/* 3 */
/***/ function(module, exports) {

	exports.__esModule = true;
	/**
	 * log4js <https://github.com/anigenero/log4js>
	 *
	 * Copyright 2016-present Robin Schultz <http://cunae.com>
	 * Released under the MIT License
	 */

	var OFF = 0;
	exports.OFF = OFF;
	var FATAL = 100;
	exports.FATAL = FATAL;
	var ERROR = 200;
	exports.ERROR = ERROR;
	var WARN = 300;
	exports.WARN = WARN;
	var INFO = 400;
	exports.INFO = INFO;
	var DEBUG = 500;
	exports.DEBUG = DEBUG;
	var TRACE = 600;
	exports.TRACE = TRACE;
	var ALL = 2147483647;
	exports.ALL = ALL;
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb25zdC9sb2dMZXZlbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQU9PLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQzs7QUFDZCxJQUFNLEtBQUssR0FBRyxHQUFHLENBQUM7O0FBQ2xCLElBQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQzs7QUFDbEIsSUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDOztBQUNqQixJQUFNLElBQUksR0FBRyxHQUFHLENBQUM7O0FBQ2pCLElBQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQzs7QUFDbEIsSUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDOztBQUNsQixJQUFNLEdBQUcsR0FBRyxVQUFVLENBQUMiLCJmaWxlIjoibG9nTGV2ZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogbG9nNGpzIDxodHRwczovL2dpdGh1Yi5jb20vYW5pZ2VuZXJvL2xvZzRqcz5cclxuICpcclxuICogQ29weXJpZ2h0IDIwMTYtcHJlc2VudCBSb2JpbiBTY2h1bHR6IDxodHRwOi8vY3VuYWUuY29tPlxyXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2VcclxuICovXHJcblxyXG5leHBvcnQgY29uc3QgT0ZGID0gMDtcclxuZXhwb3J0IGNvbnN0IEZBVEFMID0gMTAwO1xyXG5leHBvcnQgY29uc3QgRVJST1IgPSAyMDA7XHJcbmV4cG9ydCBjb25zdCBXQVJOID0gMzAwO1xyXG5leHBvcnQgY29uc3QgSU5GTyA9IDQwMDtcclxuZXhwb3J0IGNvbnN0IERFQlVHID0gNTAwO1xyXG5leHBvcnQgY29uc3QgVFJBQ0UgPSA2MDA7XHJcbmV4cG9ydCBjb25zdCBBTEwgPSAyMTQ3NDgzNjQ3O1xyXG4iXX0=


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	exports.__esModule = true;
	exports.Logger = Logger;
	// istanbul ignore next

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

	/**
	 * log4js <https://github.com/anigenero/log4js>
	 *
	 * Copyright 2016-present Robin Schultz <http://cunae.com>
	 * Released under the MIT License
	 */

	var _constLogLevel = __webpack_require__(3);

	var logLevel = _interopRequireWildcard(_constLogLevel);

	function Logger(context, appenderObj) {

		/** @typeof {number} */
		var relative_ = new Date().getTime();
		/** @typeof {number} */
		var logSequence_ = 1;

		/**
	  * @functionlog.
	  *
	  * @param {function} func
	  *
	  * @return {string}
	  */
		function getFunctionName_(func) {

			if (typeof func !== 'function') {
				return 'anonymous';
			}

			var functionName = func.toString();
			functionName = functionName.substring('function '.length);
			functionName = functionName.substring(0, functionName.indexOf('('));

			return functionName !== '' ? functionName : 'anonymous';
		}

		// Get the context
		if (typeof context != 'string') {

			if (typeof context == 'function') {
				context = getFunctionName_(context);
			} else if (typeof context == 'object') {
				context = getFunctionName_(context.constructor);
				if (context == 'Object') {
					context = 'anonymous';
				}
			} else {
				context = 'anonymous';
			}
		}

		/** @type {string} */
		var logContext_ = context;

		/**
	  * Logs an error event
	  */
		this.error = function () {
			appenderObj.append(constructLogEvent_(logLevel.ERROR, arguments));
		};

		/**
	  * Logs a warning
	  */
		this.warn = function () {
			appenderObj.append(constructLogEvent_(logLevel.WARN, arguments));
		};

		/**
	  * Logs an info level event
	  */
		this.info = function () {
			appenderObj.append(constructLogEvent_(logLevel.INFO, arguments));
		};

		/**
	  * Logs a debug event
	  */
		this.debug = function () {
			appenderObj.append(constructLogEvent_(logLevel.DEBUG, arguments));
		};

		/**
	  * Logs a trace event
	  */
		this.trace = function () {
			appenderObj.append(constructLogEvent_(logLevel.TRACE, arguments));
		};

		/**
	  * @function
	  *
	  * @param {number} level
	  * @param {Array} arguments
	  *
	  * @return {LOG_EVENT}
	  */
		function constructLogEvent_(level, args) {

			var error = new Error();

			var details = getFileDetails_(error);
			var loggingEvent = {
				error: null,
				file: details.filename,
				level: level,
				lineNumber: details.line,
				logger: logContext_,
				message: '',
				method: getFunctionName_(args.callee.caller),
				properties: undefined,
				relative: new Date().getTime() - relative_,
				sequence: logSequence_++
			};

			var messageStubs = 0;
			for (var i = 0; i < args.length; i++) {

				if (i === 0) {
					loggingEvent.message = args[i];
					var stubs = /\{\}/g.exec(loggingEvent.message);
					messageStubs = stubs instanceof Array ? stubs.length : 0;
				} else if (messageStubs > 0) {
					loggingEvent.message = loggingEvent.message.replace(/\{\}/, args[i]);
					messageStubs--;
				} else if (args[i] instanceof Error) {
					loggingEvent.error = args[i];
				} else {
					loggingEvent.properties = args[i];
				}
			}

			return loggingEvent;
		}

		function getFileDetails_(error) {

			var details = {
				column: '?',
				filename: 'anonymous',
				line: '?'
			};
			if (error.stack != undefined) {

				var parts = error.stack.split(/\n/g);
				var file = parts[3];
				file = file.replace(/at (.*\(|)(file|http|https|)(\:|)(\/|)*/, '');
				file = file.replace(')', '');
				file = file.replace(typeof location !== 'undefined' ? location.host : '', '').trim();

				var fileParts = file.split(/\:/g);

				details.column = fileParts.pop();
				details.line = fileParts.pop();

				if (true) {
					var path = __webpack_require__(5);
					var appDir = path.dirname(__webpack_require__.c[0].filename);
					details.filename = fileParts.join(':').replace(appDir, '').replace(/(\\|\/)/, '');
				} else {
					details.filename = fileParts.join(':');
				}

				return details;
			}
			return 'unknown';
		}

		return this;
	}
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sb2dnZXIvbG9nZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7NkJBTzBCLG1CQUFtQjs7SUFBakMsUUFBUTs7QUFFYixTQUFTLE1BQU0sQ0FBQyxPQUFPLEVBQUUsV0FBVyxFQUFFOzs7QUFHNUMsS0FBSSxTQUFTLEdBQUcsQUFBQyxJQUFJLElBQUksRUFBRSxDQUFFLE9BQU8sRUFBRSxDQUFDOztBQUV2QyxLQUFJLFlBQVksR0FBRyxDQUFDLENBQUM7Ozs7Ozs7OztBQVNyQixVQUFTLGdCQUFnQixDQUFDLElBQUksRUFBRTs7QUFFL0IsTUFBSSxPQUFPLElBQUksS0FBSyxVQUFVLEVBQUU7QUFDL0IsVUFBTyxXQUFXLENBQUM7R0FDbkI7O0FBRUQsTUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQ25DLGNBQVksR0FBRyxZQUFZLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMxRCxjQUFZLEdBQUcsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsWUFBWSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDOztBQUVwRSxTQUFPLEFBQUMsWUFBWSxLQUFLLEVBQUUsR0FBSSxZQUFZLEdBQUcsV0FBVyxDQUFDO0VBRTFEOzs7QUFHRCxLQUFJLE9BQU8sT0FBTyxJQUFJLFFBQVEsRUFBRTs7QUFFL0IsTUFBSSxPQUFPLE9BQU8sSUFBSSxVQUFVLEVBQUU7QUFDakMsVUFBTyxHQUFHLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0dBQ3BDLE1BQU0sSUFBSSxPQUFPLE9BQU8sSUFBSSxRQUFRLEVBQUU7QUFDdEMsVUFBTyxHQUFHLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNoRCxPQUFJLE9BQU8sSUFBSSxRQUFRLEVBQUU7QUFDeEIsV0FBTyxHQUFHLFdBQVcsQ0FBQztJQUN0QjtHQUNELE1BQU07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LENBQUM7QUFDakQsV0FBTyxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNsRixNQUFNO0FBQ04sV0FBTyxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3ZDOztBQUVELFVBQU8sT0FBTyxDQUFDO0dBRWY7QUFDRCxTQUFPLFNBQVMsQ0FBQztFQUNqQjs7QUFFRCxRQUFPLElBQUksQ0FBQztDQUVaIiwiZmlsZSI6ImxvZ2dlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBsb2c0anMgPGh0dHBzOi8vZ2l0aHViLmNvbS9hbmlnZW5lcm8vbG9nNGpzPlxyXG4gKlxyXG4gKiBDb3B5cmlnaHQgMjAxNi1wcmVzZW50IFJvYmluIFNjaHVsdHogPGh0dHA6Ly9jdW5hZS5jb20+XHJcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZVxyXG4gKi9cclxuXHJcbmltcG9ydCAqIGFzIGxvZ0xldmVsIGZyb20gJy4uL2NvbnN0L2xvZ0xldmVsJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBMb2dnZXIoY29udGV4dCwgYXBwZW5kZXJPYmopIHtcclxuXHJcblx0LyoqIEB0eXBlb2Yge251bWJlcn0gKi9cclxuXHRsZXQgcmVsYXRpdmVfID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKTtcclxuXHQvKiogQHR5cGVvZiB7bnVtYmVyfSAqL1xyXG5cdGxldCBsb2dTZXF1ZW5jZV8gPSAxO1xyXG5cclxuXHQvKipcclxuXHQgKiBAZnVuY3Rpb25sb2cuXHJcblx0ICpcclxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9ufSBmdW5jXHJcblx0ICpcclxuXHQgKiBAcmV0dXJuIHtzdHJpbmd9XHJcblx0ICovXHJcblx0ZnVuY3Rpb24gZ2V0RnVuY3Rpb25OYW1lXyhmdW5jKSB7XHJcblxyXG5cdFx0aWYgKHR5cGVvZiBmdW5jICE9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdHJldHVybiAnYW5vbnltb3VzJztcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgZnVuY3Rpb25OYW1lID0gZnVuYy50b1N0cmluZygpO1xyXG5cdFx0ZnVuY3Rpb25OYW1lID0gZnVuY3Rpb25OYW1lLnN1YnN0cmluZygnZnVuY3Rpb24gJy5sZW5ndGgpO1xyXG5cdFx0ZnVuY3Rpb25OYW1lID0gZnVuY3Rpb25OYW1lLnN1YnN0cmluZygwLCBmdW5jdGlvbk5hbWUuaW5kZXhPZignKCcpKTtcclxuXHJcblx0XHRyZXR1cm4gKGZ1bmN0aW9uTmFtZSAhPT0gJycpID8gZnVuY3Rpb25OYW1lIDogJ2Fub255bW91cyc7XHJcblxyXG5cdH1cclxuXHJcblx0Ly8gR2V0IHRoZSBjb250ZXh0XHJcblx0aWYgKHR5cGVvZiBjb250ZXh0ICE9ICdzdHJpbmcnKSB7XHJcblxyXG5cdFx0aWYgKHR5cGVvZiBjb250ZXh0ID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0Y29udGV4dCA9IGdldEZ1bmN0aW9uTmFtZV8oY29udGV4dCk7XHJcblx0XHR9IGVsc2UgaWYgKHR5cGVvZiBjb250ZXh0ID09ICdvYmplY3QnKSB7XHJcblx0XHRcdGNvbnRleHQgPSBnZXRGdW5jdGlvbk5hbWVfKGNvbnRleHQuY29uc3RydWN0b3IpO1xyXG5cdFx0XHRpZiAoY29udGV4dCA9PSAnT2JqZWN0Jykge1xyXG5cdFx0XHRcdGNvbnRleHQgPSAnYW5vbnltb3VzJztcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Y29udGV4dCA9ICdhbm9ueW1vdXMnO1xyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG5cdC8qKiBAdHlwZSB7c3RyaW5nfSAqL1xyXG5cdGxldCBsb2dDb250ZXh0XyA9IGNvbnRleHQ7XHJcblxyXG5cdC8qKlxyXG5cdCAqIExvZ3MgYW4gZXJyb3IgZXZlbnRcclxuXHQgKi9cclxuXHR0aGlzLmVycm9yID0gZnVuY3Rpb24oKSB7XHJcblx0XHRhcHBlbmRlck9iai5hcHBlbmQoY29uc3RydWN0TG9nRXZlbnRfKGxvZ0xldmVsLkVSUk9SLCBhcmd1bWVudHMpKTtcclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBMb2dzIGEgd2FybmluZ1xyXG5cdCAqL1xyXG5cdHRoaXMud2FybiA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0YXBwZW5kZXJPYmouYXBwZW5kKGNvbnN0cnVjdExvZ0V2ZW50Xyhsb2dMZXZlbC5XQVJOLCBhcmd1bWVudHMpKTtcclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBMb2dzIGFuIGluZm8gbGV2ZWwgZXZlbnRcclxuXHQgKi9cclxuXHR0aGlzLmluZm8gPSBmdW5jdGlvbigpIHtcclxuXHRcdGFwcGVuZGVyT2JqLmFwcGVuZChjb25zdHJ1Y3RMb2dFdmVudF8obG9nTGV2ZWwuSU5GTywgYXJndW1lbnRzKSk7XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogTG9ncyBhIGRlYnVnIGV2ZW50XHJcblx0ICovXHJcblx0dGhpcy5kZWJ1ZyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0YXBwZW5kZXJPYmouYXBwZW5kKGNvbnN0cnVjdExvZ0V2ZW50Xyhsb2dMZXZlbC5ERUJVRywgYXJndW1lbnRzKSk7XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogTG9ncyBhIHRyYWNlIGV2ZW50XHJcblx0ICovXHJcblx0dGhpcy50cmFjZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0YXBwZW5kZXJPYmouYXBwZW5kKGNvbnN0cnVjdExvZ0V2ZW50Xyhsb2dMZXZlbC5UUkFDRSwgYXJndW1lbnRzKSk7XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogQGZ1bmN0aW9uXHJcblx0ICpcclxuXHQgKiBAcGFyYW0ge251bWJlcn0gbGV2ZWxcclxuXHQgKiBAcGFyYW0ge0FycmF5fSBhcmd1bWVudHNcclxuXHQgKlxyXG5cdCAqIEByZXR1cm4ge0xPR19FVkVOVH1cclxuXHQgKi9cclxuXHRmdW5jdGlvbiBjb25zdHJ1Y3RMb2dFdmVudF8obGV2ZWwsIGFyZ3MpIHtcclxuXHJcblx0XHRsZXQgZXJyb3IgPSBuZXcgRXJyb3IoKTtcclxuXHJcblx0XHRsZXQgZGV0YWlscyA9IGdldEZpbGVEZXRhaWxzXyhlcnJvcik7XHJcblx0XHRsZXQgbG9nZ2luZ0V2ZW50ID0ge1xyXG5cdFx0XHRlcnJvciA6IG51bGwsXHJcblx0XHRcdGZpbGUgOiBkZXRhaWxzLmZpbGVuYW1lLFxyXG5cdFx0XHRsZXZlbCA6IGxldmVsLFxyXG5cdFx0XHRsaW5lTnVtYmVyIDogZGV0YWlscy5saW5lLFxyXG5cdFx0XHRsb2dnZXIgOiBsb2dDb250ZXh0XyxcclxuXHRcdFx0bWVzc2FnZSA6ICcnLFxyXG5cdFx0XHRtZXRob2QgOiBnZXRGdW5jdGlvbk5hbWVfKGFyZ3MuY2FsbGVlLmNhbGxlciksXHJcblx0XHRcdHByb3BlcnRpZXMgOiB1bmRlZmluZWQsXHJcblx0XHRcdHJlbGF0aXZlIDogKG5ldyBEYXRlKCkpLmdldFRpbWUoKSAtIHJlbGF0aXZlXyxcclxuXHRcdFx0c2VxdWVuY2UgOiBsb2dTZXF1ZW5jZV8rK1xyXG5cdFx0fTtcclxuXHJcblx0XHRsZXQgbWVzc2FnZVN0dWJzID0gMDtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xyXG5cclxuXHRcdFx0aWYgKGkgPT09IDApIHtcclxuXHRcdFx0XHRsb2dnaW5nRXZlbnQubWVzc2FnZSA9IGFyZ3NbaV07XHJcblx0XHRcdFx0dmFyIHN0dWJzID0gKC9cXHtcXH0vZykuZXhlYyhsb2dnaW5nRXZlbnQubWVzc2FnZSk7XHJcblx0XHRcdFx0bWVzc2FnZVN0dWJzID0gKHN0dWJzIGluc3RhbmNlb2YgQXJyYXkpID8gc3R1YnMubGVuZ3RoIDogMDtcclxuXHRcdFx0fSBlbHNlIGlmIChtZXNzYWdlU3R1YnMgPiAwKSB7XHJcblx0XHRcdFx0bG9nZ2luZ0V2ZW50Lm1lc3NhZ2UgPSBsb2dnaW5nRXZlbnQubWVzc2FnZS5yZXBsYWNlKC9cXHtcXH0vLCBhcmdzW2ldKTtcclxuXHRcdFx0XHRtZXNzYWdlU3R1YnMtLTtcclxuXHRcdFx0fSBlbHNlIGlmIChhcmdzW2ldIGluc3RhbmNlb2YgRXJyb3IpIHtcclxuXHRcdFx0XHRsb2dnaW5nRXZlbnQuZXJyb3IgPSBhcmdzW2ldO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGxvZ2dpbmdFdmVudC5wcm9wZXJ0aWVzID0gYXJnc1tpXTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gbG9nZ2luZ0V2ZW50O1xyXG5cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldEZpbGVEZXRhaWxzXyhlcnJvcikge1xyXG5cclxuXHRcdGxldCBkZXRhaWxzID0ge1xyXG5cdFx0XHRjb2x1bW4gOiAnPycsXHJcblx0XHRcdGZpbGVuYW1lIDogJ2Fub255bW91cycsXHJcblx0XHRcdGxpbmUgOiAnPydcclxuXHRcdH07XHJcblx0XHRpZiAoZXJyb3Iuc3RhY2sgIT0gdW5kZWZpbmVkKSB7XHJcblxyXG5cdFx0XHRsZXQgcGFydHMgPSBlcnJvci5zdGFjay5zcGxpdCgvXFxuL2cpO1xyXG5cdFx0XHRsZXQgZmlsZSA9IHBhcnRzWzNdO1xyXG5cdFx0XHRmaWxlID0gZmlsZS5yZXBsYWNlKC9hdCAoLipcXCh8KShmaWxlfGh0dHB8aHR0cHN8KShcXDp8KShcXC98KSovLCAnJyk7XHJcblx0XHRcdGZpbGUgPSBmaWxlLnJlcGxhY2UoJyknLCAnJyk7XHJcblx0XHRcdGZpbGUgPSBmaWxlLnJlcGxhY2UoKHR5cGVvZiBsb2NhdGlvbiAhPT0gJ3VuZGVmaW5lZCcpID8gbG9jYXRpb24uaG9zdCA6ICcnLCAnJykudHJpbSgpO1xyXG5cclxuXHRcdFx0bGV0IGZpbGVQYXJ0cyA9IGZpbGUuc3BsaXQoL1xcOi9nKTtcclxuXHJcblx0XHRcdGRldGFpbHMuY29sdW1uID0gZmlsZVBhcnRzLnBvcCgpO1xyXG5cdFx0XHRkZXRhaWxzLmxpbmUgPSBmaWxlUGFydHMucG9wKCk7XHJcblxyXG5cdFx0XHRpZiAodHlwZW9mIGRlZmluZSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0XHRsZXQgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcclxuXHRcdFx0XHRsZXQgYXBwRGlyID0gcGF0aC5kaXJuYW1lKHJlcXVpcmUubWFpbi5maWxlbmFtZSk7XHJcblx0XHRcdFx0ZGV0YWlscy5maWxlbmFtZSA9IGZpbGVQYXJ0cy5qb2luKCc6JykucmVwbGFjZShhcHBEaXIsICcnKS5yZXBsYWNlKC8oXFxcXHxcXC8pLywgJycpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGRldGFpbHMuZmlsZW5hbWUgPSBmaWxlUGFydHMuam9pbignOicpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gZGV0YWlscztcclxuXHJcblx0XHR9XHJcblx0XHRyZXR1cm4gJ3Vua25vd24nO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHRoaXM7XHJcblxyXG59XHJcbiJdfQ==


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

	exports.__esModule = true;
	exports.ConsoleAppender = ConsoleAppender;
	// istanbul ignore next

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

	/**
	 * log4js <https://github.com/anigenero/log4js>
	 *
	 * Copyright 2016-present Robin Schultz <http://cunae.com>
	 * Released under the MIT License
	 */

	var _constLogLevel = __webpack_require__(3);

	var LogLevel = _interopRequireWildcard(_constLogLevel);

	var _formatter = __webpack_require__(1);

	var formatter = _interopRequireWildcard(_formatter);

	function ConsoleAppender() {

		/** @type {string} */
		var tagLayout_ = '%m';
		/** @type {number} */
		var logLevel_ = LogLevel.INFO;

		/**
	  * @function
	  *
	  * @param {LOG_EVENT} loggingEvent
	  */
		function append(loggingEvent) {
			if (loggingEvent.level <= logLevel_) {
				appendToConsole_(loggingEvent);
			}
		}

		/**
	  * @private
	  * @function
	  *
	  * @param {LOG_EVENT} loggingEvent
	  */
		function appendToConsole_(loggingEvent) {

			var message = formatter.format(tagLayout_, loggingEvent);

			if (loggingEvent.level == LogLevel.ERROR) {
				console.error(message, loggingEvent.error || null);
			} else if (loggingEvent.level == LogLevel.WARN) {
				console.warn(message);
			} else if (loggingEvent.level == LogLevel.INFO) {
				console.info(message);
			} else if (loggingEvent.level == LogLevel.DEBUG || loggingEvent.level == LogLevel.TRACE) {
				console.log(message);
			}
		}

		/**
	  * Gets the name of the logger
	  *
	  * @function
	  *
	  * @return {string}
	  */
		function getName() {
			return 'ConsoleAppender';
		}

		/**
	  * Returns true if the appender is active, else false
	  *
	  * @function
	  *
	  * @param {number} level
	  *
	  * @return {boolean}
	  */
		function isActive(level) {
			return level <= logLevel_;
		}

		/**
	  * @function
	  *
	  * @return {number}
	  */
		function getLogLevel() {
			return logLevel_;
		}

		/**
	  * @function
	  *
	  * @param {number} logLevel
	  */
		function setLogLevel(logLevel) {
			logLevel_ = logLevel;
		}

		/**
	  * @function
	  *
	  * @param {string} tagLayout
	  */
		function setTagLayout(tagLayout) {
			tagLayout_ = tagLayout;
		}

		return {
			append: append,
			getName: getName,
			isActive: isActive,
			getLogLevel: getLogLevel,
			setLogLevel: setLogLevel,
			setTagLayout: setTagLayout
		};
	}
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHBlbmRlcnMvY29uc29sZUFwcGVuZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7NkJBTzBCLG1CQUFtQjs7SUFBakMsUUFBUTs7eUJBQ08sY0FBYzs7SUFBN0IsU0FBUzs7QUFFZCxTQUFTLGVBQWUsR0FBRzs7O0FBR2pDLEtBQUksVUFBVSxHQUFHLElBQUksQ0FBQzs7QUFFdEIsS0FBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQzs7Ozs7OztBQU85QixVQUFTLE1BQU0sQ0FBQyxZQUFZLEVBQUU7QUFDN0IsTUFBSSxZQUFZLENBQUMsS0FBSyxJQUFJLFNBQVMsRUFBRTtBQUNwQyxtQkFBZ0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztHQUMvQjtFQUNEOzs7Ozs7OztBQVFELFVBQVMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFOztBQUV2QyxNQUFJLE9BQU8sR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxZQUFZLENBQUMsQ0FBQzs7QUFFekQsTUFBSSxZQUFZLENBQUMsS0FBSyxJQUFJLFFBQVEsQ0FBQyxLQUFLLEVBQUU7QUFDekMsVUFBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUcsWUFBWSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUUsQ0FBQztHQUNyRCxNQUFNLElBQUksWUFBWSxDQUFDLEtBQUssSUFBSSxRQUFRLENBQUMsSUFBSSxFQUFFO0FBQy9DLFVBQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7R0FDdEIsTUFBTSxJQUFJLFlBQVksQ0FBQyxLQUFLLElBQUksUUFBUSxDQUFDLElBQUksRUFBRTtBQUMvQyxVQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0dBQ3RCLE1BQU0sSUFBSSxZQUFZLENBQUMsS0FBSyxJQUFJLFFBQVEsQ0FBQyxLQUFLLElBQzlDLFlBQVksQ0FBQyxLQUFLLElBQUksUUFBUSxDQUFDLEtBQUssRUFBRTtBQUN0QyxVQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0dBQ3JCO0VBRUQ7Ozs7Ozs7OztBQVNELFVBQVMsT0FBTyxHQUFHO0FBQ2xCLFNBQU8saUJBQWlCLENBQUM7RUFDekI7Ozs7Ozs7Ozs7O0FBV0QsVUFBUyxRQUFRLENBQUMsS0FBSyxFQUFFO0FBQ3hCLFNBQVEsS0FBSyxJQUFJLFNBQVMsQ0FBRTtFQUM1Qjs7Ozs7OztBQU9ELFVBQVMsV0FBVyxHQUFHO0FBQ3RCLFNBQU8sU0FBUyxDQUFDO0VBQ2pCOzs7Ozs7O0FBT0QsVUFBUyxXQUFXLENBQUMsUUFBUSxFQUFFO0FBQzlCLFdBQVMsR0FBRyxRQUFRLENBQUM7RUFDckI7Ozs7Ozs7QUFPRCxVQUFTLFlBQVksQ0FBQyxTQUFTLEVBQUU7QUFDaEMsWUFBVSxHQUFHLFNBQVMsQ0FBQztFQUN2Qjs7QUFFRCxRQUFPO0FBQ04sUUFBTSxFQUFHLE1BQU07QUFDZixTQUFPLEVBQUcsT0FBTztBQUNqQixVQUFRLEVBQUcsUUFBUTtBQUNuQixhQUFXLEVBQUcsV0FBVztBQUN6QixhQUFXLEVBQUcsV0FBVztBQUN6QixjQUFZLEVBQUcsWUFBWTtFQUMzQixDQUFDO0NBRUYiLCJmaWxlIjoiY29uc29sZUFwcGVuZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIGxvZzRqcyA8aHR0cHM6Ly9naXRodWIuY29tL2FuaWdlbmVyby9sb2c0anM+XHJcbiAqXHJcbiAqIENvcHlyaWdodCAyMDE2LXByZXNlbnQgUm9iaW4gU2NodWx0eiA8aHR0cDovL2N1bmFlLmNvbT5cclxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlXHJcbiAqL1xyXG5cclxuaW1wb3J0ICogYXMgTG9nTGV2ZWwgZnJvbSAnLi4vY29uc3QvbG9nTGV2ZWwnO1xyXG5pbXBvcnQgKiBhcyBmb3JtYXR0ZXIgZnJvbSAnLi4vZm9ybWF0dGVyJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBDb25zb2xlQXBwZW5kZXIoKSB7XHJcblxyXG5cdC8qKiBAdHlwZSB7c3RyaW5nfSAqL1xyXG5cdGxldCB0YWdMYXlvdXRfID0gJyVtJztcclxuXHQvKiogQHR5cGUge251bWJlcn0gKi9cclxuXHRsZXQgbG9nTGV2ZWxfID0gTG9nTGV2ZWwuSU5GTztcclxuXHJcblx0LyoqXHJcblx0ICogQGZ1bmN0aW9uXHJcblx0ICpcclxuXHQgKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nZ2luZ0V2ZW50XHJcblx0ICovXHJcblx0ZnVuY3Rpb24gYXBwZW5kKGxvZ2dpbmdFdmVudCkge1xyXG5cdFx0aWYgKGxvZ2dpbmdFdmVudC5sZXZlbCA8PSBsb2dMZXZlbF8pIHtcclxuXHRcdFx0YXBwZW5kVG9Db25zb2xlXyhsb2dnaW5nRXZlbnQpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQHByaXZhdGVcclxuXHQgKiBAZnVuY3Rpb25cclxuXHQgKlxyXG5cdCAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dnaW5nRXZlbnRcclxuXHQgKi9cclxuXHRmdW5jdGlvbiBhcHBlbmRUb0NvbnNvbGVfKGxvZ2dpbmdFdmVudCkge1xyXG5cclxuXHRcdGxldCBtZXNzYWdlID0gZm9ybWF0dGVyLmZvcm1hdCh0YWdMYXlvdXRfLCBsb2dnaW5nRXZlbnQpO1xyXG5cclxuXHRcdGlmIChsb2dnaW5nRXZlbnQubGV2ZWwgPT0gTG9nTGV2ZWwuRVJST1IpIHtcclxuXHRcdFx0Y29uc29sZS5lcnJvcihtZXNzYWdlLCAobG9nZ2luZ0V2ZW50LmVycm9yIHx8IG51bGwpKTtcclxuXHRcdH0gZWxzZSBpZiAobG9nZ2luZ0V2ZW50LmxldmVsID09IExvZ0xldmVsLldBUk4pIHtcclxuXHRcdFx0Y29uc29sZS53YXJuKG1lc3NhZ2UpO1xyXG5cdFx0fSBlbHNlIGlmIChsb2dnaW5nRXZlbnQubGV2ZWwgPT0gTG9nTGV2ZWwuSU5GTykge1xyXG5cdFx0XHRjb25zb2xlLmluZm8obWVzc2FnZSk7XHJcblx0XHR9IGVsc2UgaWYgKGxvZ2dpbmdFdmVudC5sZXZlbCA9PSBMb2dMZXZlbC5ERUJVRyB8fFxyXG5cdFx0XHRsb2dnaW5nRXZlbnQubGV2ZWwgPT0gTG9nTGV2ZWwuVFJBQ0UpIHtcclxuXHRcdFx0Y29uc29sZS5sb2cobWVzc2FnZSk7XHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogR2V0cyB0aGUgbmFtZSBvZiB0aGUgbG9nZ2VyXHJcblx0ICpcclxuXHQgKiBAZnVuY3Rpb25cclxuXHQgKlxyXG5cdCAqIEByZXR1cm4ge3N0cmluZ31cclxuXHQgKi9cclxuXHRmdW5jdGlvbiBnZXROYW1lKCkge1xyXG5cdFx0cmV0dXJuICdDb25zb2xlQXBwZW5kZXInO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogUmV0dXJucyB0cnVlIGlmIHRoZSBhcHBlbmRlciBpcyBhY3RpdmUsIGVsc2UgZmFsc2VcclxuXHQgKlxyXG5cdCAqIEBmdW5jdGlvblxyXG5cdCAqXHJcblx0ICogQHBhcmFtIHtudW1iZXJ9IGxldmVsXHJcblx0ICpcclxuXHQgKiBAcmV0dXJuIHtib29sZWFufVxyXG5cdCAqL1xyXG5cdGZ1bmN0aW9uIGlzQWN0aXZlKGxldmVsKSB7XHJcblx0XHRyZXR1cm4gKGxldmVsIDw9IGxvZ0xldmVsXyk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBAZnVuY3Rpb25cclxuXHQgKlxyXG5cdCAqIEByZXR1cm4ge251bWJlcn1cclxuXHQgKi9cclxuXHRmdW5jdGlvbiBnZXRMb2dMZXZlbCgpIHtcclxuXHRcdHJldHVybiBsb2dMZXZlbF87XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBAZnVuY3Rpb25cclxuXHQgKlxyXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBsb2dMZXZlbFxyXG5cdCAqL1xyXG5cdGZ1bmN0aW9uIHNldExvZ0xldmVsKGxvZ0xldmVsKSB7XHJcblx0XHRsb2dMZXZlbF8gPSBsb2dMZXZlbDtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBmdW5jdGlvblxyXG5cdCAqXHJcblx0ICogQHBhcmFtIHtzdHJpbmd9IHRhZ0xheW91dFxyXG5cdCAqL1xyXG5cdGZ1bmN0aW9uIHNldFRhZ0xheW91dCh0YWdMYXlvdXQpIHtcclxuXHRcdHRhZ0xheW91dF8gPSB0YWdMYXlvdXQ7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0YXBwZW5kIDogYXBwZW5kLFxyXG5cdFx0Z2V0TmFtZSA6IGdldE5hbWUsXHJcblx0XHRpc0FjdGl2ZSA6IGlzQWN0aXZlLFxyXG5cdFx0Z2V0TG9nTGV2ZWwgOiBnZXRMb2dMZXZlbCxcclxuXHRcdHNldExvZ0xldmVsIDogc2V0TG9nTGV2ZWwsXHJcblx0XHRzZXRUYWdMYXlvdXQgOiBzZXRUYWdMYXlvdXRcclxuXHR9O1xyXG5cclxufVxyXG4iXX0=


/***/ }
/******/ ])
});
;