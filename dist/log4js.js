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
	 * Holds the definition for the log event object
	 *
	 * @typedef {{ error : Error, message : string, properties : Object,
	 *          timestamp : string }}
	 */
	var LOG_EVENT;

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
			append(LogLevel.ERROR, {
				message: 'Could not configure. LogUtility already in use'
			});
			return;
		}

		configureAppenders_(config.appenders, function () {

			configureLoggers_(config.loggers);

			if (config.tagLayout) {
				formatter.preCompile(config.tagLayout);
				for (var logKey in loggers_) {
					for (var key in loggers_[logKey]) {
						loggers_[logKey][key].setTagLayout(config.tagLayout);
					}
				}
			}

			configuration_ = config;
		});
	}

	var configureAppenders_ = function configureAppenders_(appenders, callback) {

		if (!("function" != 'undefined' && __webpack_require__(8) != undefined) && !(typeof module != 'undefined' && module.exports)) {
			return;
		}

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
			if (appenderObj[appenderMethods[key]] == undefined || typeof appenderObj[appenderMethods[key]] != 'function') {
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
	 */

	function append(loggingEvent) {

		finalizeConfiguration_();
		validateLevel_(loggingEvent.level);

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
	 * Finalizes the configuration so that it can't be modified
	 * @private
	 * @function
	 */
	var finalizeConfiguration_ = function finalizeConfiguration_() {
		finalized_ = true;
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
	 * @return {logger}
	 */

	function getLogger(context) {
		return _loggerLogger.Logger(context, {
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
			for (var key in loggers_[logKey]) {
				loggers_[logKey][key].setLogLevel(logLevel);
			}
		}
	}

	addAppender(consoleAppender.ConsoleAppender);
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sb2dNYW5hZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O3lCQUEyQixhQUFhOztJQUE1QixTQUFTOzs0QkFDRSxpQkFBaUI7OzZCQUNkLGtCQUFrQjs7SUFBaEMsUUFBUTs7d0NBRWEsNkJBQTZCOztJQUFsRCxlQUFlOzs7Ozs7OztBQVEzQixJQUFJLFFBQVEsQ0FBQzs7Ozs7Ozs7QUFRYixJQUFJLFNBQVMsQ0FBQzs7O0FBR2QsSUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFDOztBQUVwQixJQUFJLGNBQWMsR0FBRyxFQUFFLENBQUM7O0FBRXhCLElBQUksVUFBVSxHQUFHLEtBQUssQ0FBQzs7QUFFdkIsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDOztRQUVWLFFBQVEsR0FBUixRQUFROzs7Ozs7Ozs7O0FBU1QsU0FBUyxTQUFTLENBQUMsTUFBTSxFQUFFOztBQUVqQyxLQUFJLFVBQVUsRUFBRTtBQUNmLFFBQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFO0FBQ3RCLFVBQU8sRUFBRSxnREFBZ0Q7R0FDekQsQ0FBQyxDQUFDO0FBQ0gsU0FBTztFQUNQOztBQUVELG9CQUFtQixDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsWUFBWTs7QUFFakQsbUJBQWlCLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUVsQyxNQUFJLE1BQU0sQ0FBQyxTQUFTLEVBQUU7QUFDckIsWUFBUyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDdkMsUUFBSyxJQUFJLE1BQU0sSUFBSSxRQUFRLEVBQUU7QUFDNUIsU0FBSyxJQUFJLEdBQUcsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUU7QUFDakMsYUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDckQ7SUFDRDtHQUNEOztBQUVELGdCQUFjLEdBQUcs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UUFBUSxFQUFFO0FBQ3pCLE1BQUksS0FBSyxLQUFLLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUM1QixVQUFPO0dBQ1A7RUFDRDtBQUNELE9BQU0sSUFBSSxLQUFLLENBQUMscUJBQXFCLEdBQUcsS0FBSyxDQUFDLENBQUM7Q0FDL0MsQ0FBQzs7Ozs7OztBQU9GLElBQUksc0JBQXNCLEdBQUcsU0FBekIsc0JBQXNCLEdBQWU7QUFDeEMsV0FBVSxHQUFHLElBQUksQ0FBQztDQUNsQixDQUFDOzs7Ozs7O0FBTUssU0FBUyxrQkFBa0IsR0FBRztBQUNwQyxLQUFJLGNBQWMsQ0FBQyxXQUFXLElBQUksSUFBSSxFQUFFO0FBQ3ZDLFNBQU8sY0FBYyxDQUFDLFdBQVcsQ0FBQztFQUNsQyxNQUFNO0FBQ04sU0FBTyxJQUFJLENBQUM7RUFDWjtDQUNEOzs7Ozs7OztBQU9NLFNBQVMsU0FBUyxDQUFDLE9BQU8sRUFBRTtBQUNsQyxRQUFPLHFCQUFPLE9BQU8sRUFBRTtBQUN0QixRQUFNLEVBQUUsTUFBTTtFQUNkLENBQUMsQ0FBQztDQUNIOzs7Ozs7O0FBTU0sU0FBUyxXQUFXLENBQUMsUUFBUSxFQUFFO0FBQ3JDLGVBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN6QixNQUFLLElBQUksTUFBTSxJQUFJLFFBQVEsRUFBRTtBQUM1QixPQUFLLElBQUksR0FBRyxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUNqQyxXQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0dBQzVDO0VBQ0Q7Q0FDRDs7QUFFRCxXQUFXLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxDQUFDIiwiZmlsZSI6ImxvZ01hbmFnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBmb3JtYXR0ZXIgZnJvbSAnLi9mb3JtYXR0ZXInO1xyXG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tICcuL2xvZ2dlci9sb2dnZXInO1xyXG5pbXBvcnQgKiBhcyBMb2dMZXZlbCBmcm9tICcuL2NvbnN0L2xvZ0xldmVsJztcclxuXHJcbmltcG9ydCAqIGFzIGNvbnNvbGVBcHBlbmRlciBmcm9tICcuL2FwcGVuZGVycy9jb25zb2xlQXBwZW5kZXInO1xyXG5cclxuLyoqXHJcbiAqIEhvbGRzIHRoZSBkZWZpbml0aW9uIGZvciB0aGUgYXBwZW5kZXIgY2xvc3VyZVxyXG4gKlxyXG4gKiBAdHlwZWRlZiB7eyBhcHBlbmQgOiBmdW5jdGlvbiAobnVtYmVyLCBMT0dfRVZFTlQpLCBpc0FjdGl2ZSA6IGZ1bmN0aW9uKCksXHJcbiAqICAgICAgICAgIHNldExvZ0xldmVsIDogZnVuY3Rpb24obnVtYmVyKSwgc2V0VGFnTGF5b3V0IDogZnVuY3Rpb24oc3RyaW5nKSB9fVxyXG4gKi9cclxudmFyIEFQUEVOREVSO1xyXG5cclxuLyoqXHJcbiAqIEhvbGRzIHRoZSBkZWZpbml0aW9uIGZvciB0aGUgbG9nIGV2ZW50IG9iamVjdFxyXG4gKlxyXG4gKiBAdHlwZWRlZiB7eyBlcnJvciA6IEVycm9yLCBtZXNzYWdlIDogc3RyaW5nLCBwcm9wZXJ0aWVzIDogT2JqZWN0LFxyXG4gKiAgICAgICAgICB0aW1lc3RhbXAgOiBzdHJpbmcgfX1cclxuICovXHJcbnZhciBMT0dfRVZFTlQ7XHJcblxyXG4vKiogQHR5cGUge0FycmF5LjxBUFBFTkRFUj59ICovXHJcbnZhciBhcHBlbmRlcnNfID0gW107XHJcbi8qKiBAdHlwZSB7Q09ORklHX1BBUkFNU30gKi9cclxudmFyIGNvbmZpZ3VyYXRpb25fID0ge307XHJcbi8qKiBAdHlwZSB7Ym9vbGVhbn0gKi9cclxudmFyIGZpbmFsaXplZF8gPSBmYWxzZTtcclxuLyoqIEB0eXBlIHtPYmplY3R9ICovXHJcbnZhciBsb2dnZXJzXyA9IHt9O1xyXG5cclxuZXhwb3J0IHtMb2dMZXZlbH07XHJcblxyXG4vKipcclxuICogQ29uZmlndXJlcyB0aGUgbG9nZ2VyXHJcbiAqXHJcbiAqIEBmdW5jdGlvblxyXG4gKlxyXG4gKiBAcGFyYW1zIHtDT05GSUdfUEFSQU1TfSBjb25maWdcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBjb25maWd1cmUoY29uZmlnKSB7XHJcblxyXG5cdGlmIChmaW5hbGl6ZWRfKSB7XHJcblx0XHRhcHBlbmQoTG9nTGV2ZWwuRVJST1IsIHtcclxuXHRcdFx0bWVzc2FnZTogJ0NvdWxkIG5vdCBjb25maWd1cmUuIExvZ1V0aWxpdHkgYWxyZWFkeSBpbiB1c2UnXHJcblx0XHR9KTtcclxuXHRcdHJldHVybjtcclxuXHR9XHJcblxyXG5cdGNvbmZpZ3VyZUFwcGVuZGVyc18oY29uZmlnLmFwcGVuZGVycywgZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdGNvbmZpZ3VyZUxvZ2dlcnNfKGNvbmZpZy5sb2dnZXJzKTtcclxuXHJcblx0XHRpZiAoY29uZmlnLnRhZ0xheW91dCkge1xyXG5cdFx0XHRmb3JtYXR0ZXIucHJlQ29tcGlsZShjb25maWcudGFnTGF5b3V0KTtcclxuXHRcdFx0Zm9yICh2YXIgbG9nS2V5IGluIGxvZ2dlcnNfKSB7XHJcblx0XHRcdFx0Zm9yICh2YXIga2V5IGluIGxvZ2dlcnNfW2xvZ0tleV0pIHtcclxuXHRcdFx0XHRcdGxvZ2dlcnNfW2xvZ0tleV1ba2V5XS5zZXRUYWdMYXlvdXQoY29uZmlnLnRhZ0xheW91dCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uZmlndXJhdGlvbl8gPSBjb25maWc7XHJcblxyXG5cdH0pO1xyXG5cclxufVxyXG5cclxudmFyIGNvbmZpZ3VyZUFwcGVuZGVyc18gPSBmdW5jdGlvbiAoYXBwZW5kZXJzLCBjYWxsYmFjaykge1xyXG5cclxuXHRpZiAoISh0eXBlb2YgZGVmaW5lICE9ICd1bmRlZmluZWQnICYmIGRlZmluZS5hbWQgIT0gdW5kZWZpbmVkKSAmJiAhKHR5cGVvZiBtb2R1bGUgIT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpKSB7XHJcblx0XHRyZXR1cm47XHJcblx0fVxyXG5cclxuXHRpZiAoYXBwZW5kZXJzIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuXHRcdHZhciBjb3VudCA9IGFwcGVuZGVycy5sZW5ndGg7XHJcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcclxuXHRcdFx0Y2FsbGJhY2soKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG59O1xyXG5cclxudmFyIGNvbmZpZ3VyZUxvZ2dlcnNfID0gZnVuY3Rpb24gKGxvZ2dlcnMpIHtcclxuXHJcblx0aWYgKCEobG9nZ2VycyBpbnN0YW5jZW9mIEFycmF5KSkge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBsb2dnZXJzXCIpO1xyXG5cdH1cclxuXHJcblx0dmFyIGNvdW50ID0gbG9nZ2Vycy5sZW5ndGg7XHJcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XHJcblxyXG5cdFx0aWYgKCFsb2dnZXJzW2ldLnRhZykge1xyXG5cdFx0XHRsb2dnZXJzX1snbWFpbiddID0gZ2V0TG9nZ2Vyc18obG9nZ2Vyc1tpXS5sb2dMZXZlbCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRsb2dnZXJzX1tsb2dnZXJzW2ldLnRhZ10gPSBnZXRMb2dnZXJzXyhsb2dnZXJzW2ldLmxvZ0xldmVsKTtcclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxufTtcclxuXHJcbnZhciBnZXRMb2dnZXJzXyA9IGZ1bmN0aW9uIChsb2dMZXZlbCkge1xyXG5cclxuXHR2YXIgbG9nZ2VyO1xyXG5cdHZhciBsb2dnZXJzID0gW107XHJcblx0dmFyIGNvdW50ID0gYXBwZW5kZXJzXy5sZW5ndGg7XHJcblx0d2hpbGUgKGNvdW50LS0pIHtcclxuXHRcdGxvZ2dlciA9IGFwcGVuZGVyc19bY291bnRdKCk7XHJcblx0XHRsb2dnZXIuc2V0TG9nTGV2ZWwobG9nTGV2ZWwpO1xyXG5cdFx0bG9nZ2Vycy5wdXNoKGxvZ2dlcik7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gbG9nZ2VycztcclxuXHJcbn07XHJcblxyXG4vKipcclxuICogQWRkcyBhbiBhcHBlbmRlciB0byB0aGUgYXBwZW5kZXIgcXVldWUuIElmIHRoZSBzdGFjayBpcyBmaW5hbGl6ZWQsIGFuZFxyXG4gKiB0aGUgYWxsb3dBcHBlbmRlckluamVjdGlvbiBpcyBzZXQgdG8gZmFsc2UsIHRoZW4gdGhlIGV2ZW50IHdpbGwgbm90IGJlXHJcbiAqIGFwcGVuZGVkXHJcbiAqXHJcbiAqIEBmdW5jdGlvblxyXG4gKlxyXG4gKiBAcGFyYW1zIHtBUFBFTkRFUn0gYXBwZW5kZXJcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBhZGRBcHBlbmRlcihhcHBlbmRlcikge1xyXG5cclxuXHRpZiAoZmluYWxpemVkXyAmJiAhY29uZmlndXJhdGlvbl8uYWxsb3dBcHBlbmRlckluamVjdGlvbikge1xyXG5cdFx0Y29uc29sZS5lcnJvcignQ2Fubm90IGFkZCBhcHBlbmRlciB3aGVuIGNvbmZpZ3VyYXRpb24gZmluYWxpemVkJyk7XHJcblx0XHRyZXR1cm47XHJcblx0fVxyXG5cclxuXHR2YWxpZGF0ZUFwcGVuZGVyXyhhcHBlbmRlcik7XHJcblx0YXBwZW5kZXJzXy5wdXNoKGFwcGVuZGVyKTtcclxuXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBWYWxpZGF0ZXMgdGhhdCB0aGUgYXBwZW5kZXJcclxuICpcclxuICogQGZ1bmN0aW9uXHJcbiAqXHJcbiAqIEBwYXJhbXMge0FQUEVOREVSfSBhcHBlbmRlclxyXG4gKi9cclxudmFyIHZhbGlkYXRlQXBwZW5kZXJfID0gZnVuY3Rpb24gKGFwcGVuZGVyKSB7XHJcblxyXG5cdGlmIChhcHBlbmRlciA9PSBudWxsIHx8IHR5cGVvZiBhcHBlbmRlciAhPT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGFwcGVuZGVyOiBub3QgYW4gZnVuY3Rpb24nKTtcclxuXHR9XHJcblxyXG5cdHZhciBhcHBlbmRlck9iaiA9IGFwcGVuZGVyKCk7XHJcblxyXG5cdHZhciBhcHBlbmRlck1ldGhvZHMgPSBbJ2FwcGVuZCcsICdnZXROYW1lJywgJ2lzQWN0aXZlJywgJ3NldExvZ0xldmVsJywgJ3NldFRhZ0xheW91dCddO1xyXG5cdGZvciAodmFyIGtleSBpbiBhcHBlbmRlck1ldGhvZHMpIHtcclxuXHRcdGlmIChhcHBlbmRlck9ialthcHBlbmRlck1ldGhvZHNba2V5XV0gPT0gdW5kZWZpbmVkIHx8XHJcblx0XHRcdHR5cGVvZiBhcHBlbmRlck9ialthcHBlbmRlck1ldGhvZHNba2V5XV0gIT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgYXBwZW5kZXI6IG1pc3NpbmcgbWV0aG9kOiAnICsgYXBwZW5kZXJNZXRob2RzW2tleV0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0aWYgKGNvbmZpZ3VyYXRpb25fLnRhZ0xheW91dCkge1xyXG5cdFx0YXBwZW5kZXJPYmouc2V0VGFnTGF5b3V0KGNvbmZpZ3VyYXRpb25fLnRhZ0xheW91dCk7XHJcblx0fVxyXG5cclxufTtcclxuXHJcbi8qKlxyXG4gKiBBcHBlbmRzIHRoZSBsb2cgZXZlbnRcclxuICpcclxuICogQGZ1bmN0aW9uXHJcbiAqXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBsb2dnaW5nRXZlbnRcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBhcHBlbmQobG9nZ2luZ0V2ZW50KSB7XHJcblxyXG5cdGZpbmFsaXplQ29uZmlndXJhdGlvbl8oKTtcclxuXHR2YWxpZGF0ZUxldmVsXyhsb2dnaW5nRXZlbnQubGV2ZWwpO1xyXG5cclxuXHR2YXIgbG9nZ2VycztcclxuXHRpZiAobG9nZ2Vyc19bbG9nZ2luZ0V2ZW50LmxvZ2dlcl0pIHtcclxuXHRcdGxvZ2dlcnMgPSBsb2dnZXJzX1tsb2dnaW5nRXZlbnQubG9nZ2VyXTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0bG9nZ2VycyA9IGxvZ2dlcnNfWydtYWluJ107XHJcblx0fVxyXG5cclxuXHR2YXIgY291bnQgPSBsb2dnZXJzLmxlbmd0aDtcclxuXHR3aGlsZSAoY291bnQtLSkge1xyXG5cdFx0aWYgKGxvZ2dlcnNbY291bnRdLmlzQWN0aXZlKGxvZ2dpbmdFdmVudC5sZXZlbCkpIHtcclxuXHRcdFx0bG9nZ2Vyc1tjb3VudF0uYXBwZW5kKGxvZ2dpbmdFdmVudCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxufVxyXG5cclxuLyoqXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBmdW5jdGlvblxyXG4gKlxyXG4gKiBAcGFyYW0ge251bWJlcn0gbGV2ZWxcclxuICovXHJcbnZhciB2YWxpZGF0ZUxldmVsXyA9IGZ1bmN0aW9uIChsZXZlbCkge1xyXG5cdGZvciAodmFyIGtleSBpbiBMb2dMZXZlbCkge1xyXG5cdFx0aWYgKGxldmVsID09PSBMb2dMZXZlbFtrZXldKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHR9XHJcblx0dGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGxvZyBsZXZlbDogJyArIGxldmVsKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBGaW5hbGl6ZXMgdGhlIGNvbmZpZ3VyYXRpb24gc28gdGhhdCBpdCBjYW4ndCBiZSBtb2RpZmllZFxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAZnVuY3Rpb25cclxuICovXHJcbnZhciBmaW5hbGl6ZUNvbmZpZ3VyYXRpb25fID0gZnVuY3Rpb24gKCkge1xyXG5cdGZpbmFsaXplZF8gPSB0cnVlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEdldHMgdGhlIGFwcGxpY2F0aW9uIGluZm9ybWF0aW9uIGZyb20gdGhlIGNvbmZpZ3VyYXRpb25cclxuICogQHJldHVybiB7T2JqZWN0fVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEFwcGxpY2F0aW9uSW5mbygpIHtcclxuXHRpZiAoY29uZmlndXJhdGlvbl8uYXBwbGljYXRpb24gIT0gbnVsbCkge1xyXG5cdFx0cmV0dXJuIGNvbmZpZ3VyYXRpb25fLmFwcGxpY2F0aW9uO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRyZXR1cm4gbnVsbDtcclxuXHR9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBIYW5kbGVzIGNyZWF0aW5nIHRoZSBsb2dnZXIgYW5kIHJldHVybmluZyBpdFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gY29udGV4dFxyXG4gKiBAcmV0dXJuIHtsb2dnZXJ9XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZ2V0TG9nZ2VyKGNvbnRleHQpIHtcclxuXHRyZXR1cm4gTG9nZ2VyKGNvbnRleHQsIHtcclxuXHRcdGFwcGVuZDogYXBwZW5kXHJcblx0fSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXRzIHRoZSBsb2cgbGV2ZWwgZm9yIGFsbCBsb2dnZXJzXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBsb2dMZXZlbFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHNldExvZ0xldmVsKGxvZ0xldmVsKSB7XHJcblx0dmFsaWRhdGVMZXZlbF8obG9nTGV2ZWwpO1xyXG5cdGZvciAodmFyIGxvZ0tleSBpbiBsb2dnZXJzXykge1xyXG5cdFx0Zm9yICh2YXIga2V5IGluIGxvZ2dlcnNfW2xvZ0tleV0pIHtcclxuXHRcdFx0bG9nZ2Vyc19bbG9nS2V5XVtrZXldLnNldExvZ0xldmVsKGxvZ0xldmVsKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmFkZEFwcGVuZGVyKGNvbnNvbGVBcHBlbmRlci5Db25zb2xlQXBwZW5kZXIpOyJdfQ==


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	exports.__esModule = true;
	exports.preCompile = preCompile;
	exports.format = format;
	// istanbul ignore next

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mb3JtYXR0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs2QkFBMkIsaUJBQWlCOzs2QkFDbEIsa0JBQWtCOztJQUFoQyxRQUFROzs7QUFHcEIsSUFBSSxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7Ozs7Ozs7Ozs7O0FBVzFCLElBQUksYUFBYSxHQUFHLFNBQWhCLGFBQWEsQ0FBWSxRQUFRLEVBQUUsTUFBTSxFQUFFO0FBQzlDLFNBQU8sUUFBUSxDQUFDLE1BQU0sQ0FBQztDQUN2QixDQUFDOzs7Ozs7Ozs7OztBQVdGLElBQUksV0FBVyxHQUFHLFNBQWQsV0FBVyxDQUFZLFFBQVEsRUFBRSxNQUFNLEVBQUU7QUFDNUMsU0FBTywwQkFBVyxJQUFJLElBQUksRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQ3pDLENBQUM7Ozs7Ozs7Ozs7O0FBV0YsSUFBSSxnQkFBZ0IsR0FBRyxTQUFuQixnQkFBZ0IsQ0FBWSxRQUFRLEVBQUUsTUFBTSxFQUFFO0FBQ2pELE1BQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztBQUNqQixNQUFJLFFBQVEsQ0FBQyxLQUFLLElBQUksSUFBSSxFQUFFOztBQUUzQixRQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxJQUFJLFNBQVMsRUFBRTtBQUN0QyxVQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDL0MsV0FBTSxJQUFJLEdBQUcsSUFBSSxNQUFNLEVBQUU7QUFDeEIsZUFBTyxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO09BQ3JDO0tBQ0QsTUFBTSxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsT0FBTyxJQUFJLElBQUksSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sSUFBSSxFQUFFLEVBQUU7QUFDMUUsYUFBTyxJQUFJLElBQUksQ0FB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QyxDQUFDLENBQUM7T0FDeEI7S0FFRDtHQUNEOztBQUVELFNBQU8sT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO0NBRXRCLENBQUM7Ozs7Ozs7Ozs7O0FBVUssU0FBUyxVQUFVLENBQUMsTUFBTSxFQUFFO0FBQ2xDLG9CQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0NBQzNCOzs7Ozs7Ozs7Ozs7QUFXTSxTQUFTLE1BQU0sQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFO0FBQ3hDLFNBQU8sZUFBZSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0NBQzdEIiwiZmlsZSI6ImZvcm1hdHRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGRhdGVGb3JtYXQgfSBmcm9tICcuL2RhdGVGb3JtYXR0ZXInO1xyXG5pbXBvcnQgKiBhcyBsb2dMZXZlbCBmcm9tICcuL2NvbnN0L2xvZ0xldmVsJztcclxuXHJcbi8qKiBAdHlwZSB7T2JqZWN0fSAqL1xyXG52YXIgY29tcGlsZWRMYXlvdXRzXyA9IHt9O1xyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXHJcbiAqXHJcbiAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dFdmVudFxyXG4gKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSBwYXJhbXNcclxuICpcclxuICogQHJldHVybiB7c3RyaW5nfVxyXG4gKi9cclxudmFyIGZvcm1hdExvZ2dlcl8gPSBmdW5jdGlvbihsb2dFdmVudCwgcGFyYW1zKSB7XHJcblx0cmV0dXJuIGxvZ0V2ZW50LmxvZ2dlcjtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGZvcm1hdHRlclxyXG4gKlxyXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcclxuICogQHBhcmFtIHtBcnJheS48c3RyaW5nPn0gcGFyYW1zXHJcbiAqXHJcbiAqIEByZXR1cm4ge3N0cmluZ31cclxuICovXHJcbnZhciBmb3JtYXREYXRlXyA9IGZ1bmN0aW9uKGxvZ0V2ZW50LCBwYXJhbXMpIHtcclxuXHRyZXR1cm4gZGF0ZUZvcm1hdChuZXcgRGF0ZSgpLCBwYXJhbXNbMF0pO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXHJcbiAqXHJcbiAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dFdmVudFxyXG4gKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSBwYXJhbXNcclxuICpcclxuICogQHJldHVybiB7c3RyaW5nfVxyXG4gKi9cclxudmFyIGZvcm1hdEV4Y2VwdGlvbl8gPSBmdW5jdGlvbihsb2dFdmVudCwgcGFyYW1zKSB7XHJcblx0dmFyIG1lc3NhZ2UgPSAnJztcclxuXHRpZiAobG9nRXZlbnQuZXJyb3IgIT0gbnVsbCkge1xyXG5cclxuXHRcdGlmIChsb2dFdmVudC5lcnJvci5zdGFjayAhPSB1bmRlZmluZWQpIHtcclxuXHRcdFx0dmFyIHN0YWNrcyA9IGxvZ0V2ZW50LmVycm9yLnN0YWNrLnNwbGl0KC9cXG4vZyk7XHJcblx0XHRcdGZvciAoIHZhciBrZXkgaW4gc3RhY2tzKSB7XHJcblx0XHRcdFx0bWVzc2FnZSArPSAnXFx0JyArIHN0YWNrc1trZXldICsgJ1xcbic7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSBpZiAobG9nRXZlbnQuZXJyb3IubWVzc2FnZSAhPSBudWxsICYmIGxvZ0V2ZW50LmVycm9yLm1lc3NhZ2UgIT0gJycpIHtcclxuXHRcdFx0bWVzc2FnZSArPSAnXFx0JztcclxuXHRcdFx0bWVzc2FnZSArPSBsb2dFdmVudC5lcnJvci5uYW1lICsgJzogJyArIGxvZ0V2ZW50LmVycm9yLm1lc3NhZ2U7XHJcblx0XHRcdG1lc3NhZ2UgKz0gJ1xcbic7XHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHRyZXR1cm4gbWVzc2FnZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKlxyXG4gKi9cclxudmFyIGZvcm1hdEZpbGVfID0gZnVuY3Rpb24obG9nRXZlbnQsIHBhcmFtcykge1xyXG5cdHJldHVybiBsb2dFdmVudC5maWxlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXHJcbiAqXHJcbiAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dFdmVudFxyXG4gKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSBwYXJhbXNcclxuICpcclxuICogQHJldHVybiB7c3RyaW5nfVxyXG4gKi9cclxudmFyIGZvcm1hdExpbmVOdW1iZXJfID0gZnVuY3Rpb24obG9nRXZlbnQsIHBhcmFtcykge1xyXG5cdHJldHVybiAnJyArIGxvZ0V2ZW50LmxpbmVOdW1iZXI7XHJcbn07XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcclxuICpcclxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XHJcbiAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz59IHBhcmFtc1xyXG4gKlxyXG4gKiBAcmV0dXJuIHtzdHJpbmd9XHJcbiAqL1xyXG52YXIgZm9ybWF0TWFwTWVzc2FnZV8gPSBmdW5jdGlvbihsb2dFdmVudCwgcGFyYW1zKSB7XHJcblx0dmFyIG1lc3NhZ2UgPSBudWxsO1xyXG5cdGlmIChsb2dFdmVudC5wcm9wZXJ0aWVzKSB7XHJcblxyXG5cdFx0bWVzc2FnZSA9IFtdO1xyXG5cdFx0Zm9yICggdmFyIGtleSBpbiBsb2dFdmVudC5wcm9wZXJ0aWVzKSB7XHJcblx0XHRcdGlmIChwYXJhbXNbMF0pIHtcclxuXHRcdFx0XHRpZiAocGFyYW1zWzBdID09IGtleSkge1xyXG5cdFx0XHRcdFx0bWVzc2FnZS5wdXNoKGxvZ0V2ZW50LnByb3BlcnRpZXNba2V5XSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdG1lc3NhZ2UucHVzaCgneycgKyBrZXkgKyAnLCcgKyBsb2dFdmVudC5wcm9wZXJ0aWVzW2tleV0gKyAnfScpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuICd7JyArIG1lc3NhZ2Uuam9pbignLCcpICsgJ30nO1xyXG5cclxuXHR9XHJcblx0cmV0dXJuIG1lc3NhZ2U7XHJcbn07XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcclxuICpcclxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XHJcbiAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz59IHBhcmFtc1xyXG4gKlxyXG4gKiBAcmV0dXJuIHtzdHJpbmd9XHJcbiAqL1xyXG52YXIgZm9ybWF0TG9nTWVzc2FnZV8gPSBmdW5jdGlvbihsb2dFdmVudCwgcGFyYW1zKSB7XHJcblx0cmV0dXJuIGxvZ0V2ZW50Lm1lc3NhZ2U7XHJcbn07XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcclxuICpcclxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XHJcbiAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz59IHBhcmFtc1xyXG4gKlxyXG4gKiBAcmV0dXJuIHtzdHJpbmd9XHJcbiAqL1xyXG52YXIgZm9ybWF0TWV0aG9kTmFtZV8gPSBmdW5jdGlvbihsb2dFdmVudCwgcGFyYW1zKSB7XHJcblx0cmV0dXJuIGxvZ0V2ZW50Lm1ldGhvZDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGZvcm1hdHRlclxyXG4gKlxyXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcclxuICogQHBhcmFtIHtBcnJheS48c3RyaW5nPn0gcGFyYW1zXHJcbiAqXHJcbiAqIEByZXR1cm4ge3N0cmluZ31cclxuICovXHJcbnZhciBmb3JtYXRMaW5lU2VwYXJhdG9yXyA9IGZ1bmN0aW9uKGxvZ0V2ZW50LCBwYXJhbXMpIHtcclxuXHRyZXR1cm4gJ1xcbic7XHJcbn07XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcclxuICpcclxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XHJcbiAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz59IHBhcmFtc1xyXG4gKlxyXG4gKiBAcmV0dXJuIHtzdHJpbmd9XHJcbiAqL1xyXG52YXIgZm9ybWF0TGV2ZWxfID0gZnVuY3Rpb24obG9nRXZlbnQsIHBhcmFtcykge1xyXG5cdGlmIChsb2dFdmVudC5sZXZlbCA9PSBsb2dMZXZlbC5GQVRBTCkge1xyXG5cdFx0cmV0dXJuICdGQVRBTCc7XHJcblx0fSBlbHNlIGlmIChsb2dFdmVudC5sZXZlbCA9PSBsb2dMZXZlbC5FUlJPUikge1xyXG5cdFx0cmV0dXJuICdFUlJPUic7XHJcblx0fSBlbHNlIGlmIChsb2dFdmVudC5sZXZlbCA9PSBsb2dMZXZlbC5XQVJOKSB7XHJcblx0XHRyZXR1cm4gJ1dBUk4nO1xyXG5cdH0gZWxzZSBpZiAobG9nRXZlbnQubGV2ZWwgPT0gbG9nTGV2ZWwuSU5GTykge1xyXG5cdFx0cmV0dXJuICdJTkZPJztcclxuXHR9IGVsc2UgaWYgKGxvZ0V2ZW50LmxldmVsID09IGxvZ0xldmVsLkRFQlVHKSB7XHJcblx0XHRyZXR1cm4gJ0RFQlVHJztcclxuXHR9IGVsc2UgaWYgKGxvZ0V2ZW50LmxldmVsID09IGxvZ0xldmVsLlRSQUNFKSB7XHJcblx0XHRyZXR1cm4gJ1RSQUNFJztcclxuXHR9XHJcbn07XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcclxuICpcclxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XHJcbiAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz59IHBhcmFtc1xyXG4gKlxyXG4gKiBAcmV0dXJuIHtzdHJpbmd9XHJcbiAqL1xyXG52YXIgZm9ybWF0UmVsYXRpdmVfID0gZnVuY3Rpb24obG9nRXZlbnQsIHBhcmFtcykge1xyXG5cdHJldHVybiAnJyArIGxvZ0V2ZW50LnJlbGF0aXZlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXHJcbiAqXHJcbiAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dFdmVudFxyXG4gKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSBwYXJhbXNcclxuICpcclxuICogQHJldHVybiB7c3RyaW5nfVxyXG4gKi9cclxudmFyIGZvcm1hdFNlcXVlbmNlTnVtYmVyXyA9IGZ1bmN0aW9uKGxvZ0V2ZW50LCBwYXJhbXMpIHtcclxuXHRyZXR1cm4gJycgKyBsb2dFdmVudC5zZXF1ZW5jZTtcclxufTtcclxuXHJcbnZhciBmb3JtYXR0ZXJzXyA9IHtcclxuXHQnY3xsb2dnZXInIDogZm9ybWF0TG9nZ2VyXyxcclxuXHQnZHxkYXRlJyA6IGZvcm1hdERhdGVfLFxyXG5cdCdleHxleGNlcHRpb258dGhyb3dhYmxlJyA6IGZvcm1hdEV4Y2VwdGlvbl8sXHJcblx0J0Z8ZmlsZScgOiBmb3JtYXRGaWxlXyxcclxuXHQnS3xtYXB8TUFQJyA6IGZvcm1hdE1hcE1lc3NhZ2VfLFxyXG5cdCdMfGxpbmUnIDogZm9ybWF0TGluZU51bWJlcl8sXHJcblx0J218bXNnfG1lc3NhZ2UnIDogZm9ybWF0TG9nTWVzc2FnZV8sXHJcblx0J018bWV0aG9kJyA6IGZvcm1hdE1ldGhvZE5hbWVfLFxyXG5cdCduJyA6IGZvcm1hdExpbmVTZXBhcmF0b3JfLFxyXG5cdCdwfGxldmVsJyA6IGZvcm1hdExldmVsXyxcclxuXHQncnxyZWxhdGl2ZScgOiBmb3JtYXRSZWxhdGl2ZV8sXHJcblx0J3NufHNlcXVlbmNlTnVtYmVyJyA6IGZvcm1hdFNlcXVlbmNlTnVtYmVyX1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBsYXlvdXRcclxuICpcclxuICogQHJldHVybiB7c3RyaW5nfVxyXG4gKi9cclxudmFyIGdldENvbXBpbGVkTGF5b3V0XyA9IGZ1bmN0aW9uKGxheW91dCkge1xyXG5cclxuXHRpZiAoY29tcGlsZWRMYXlvdXRzX1tsYXlvdXRdICE9IHVuZGVmaW5lZCkge1xyXG5cdFx0cmV0dXJuIGNvbXBpbGVkTGF5b3V0c19bbGF5b3V0XTtcclxuXHR9XHJcblxyXG5cdHJldHVybiBjb21waWxlTGF5b3V0XyhsYXlvdXQpO1xyXG5cclxufTtcclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGZvcm1hdHRlclxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gbGF5b3V0XHJcbiAqXHJcbiAqIEByZXR1cm4ge3N0cmluZ31cclxuICovXHJcbnZhciBjb21waWxlTGF5b3V0XyA9IGZ1bmN0aW9uKGxheW91dCkge1xyXG5cclxuXHR2YXIgaW5kZXggPSBsYXlvdXQuaW5kZXhPZignJScpO1xyXG5cdHZhciBjdXJyZW50Rm9ybWF0U3RyaW5nID0gJyc7XHJcblx0dmFyIGZvcm1hdHRlciA9IFtdO1xyXG5cclxuXHRpZiAoaW5kZXggIT0gMCkge1xyXG5cdFx0Zm9ybWF0dGVyLnB1c2gobGF5b3V0LnN1YnN0cmluZygwLCBpbmRleCkpO1xyXG5cdH1cclxuXHJcblx0ZG8ge1xyXG5cclxuXHRcdHZhciBzdGFydEluZGV4ID0gaW5kZXg7XHJcblx0XHR2YXIgZW5kSW5kZXggPSBpbmRleCA9IGxheW91dC5pbmRleE9mKCclJywgaW5kZXggKyAxKTtcclxuXHJcblx0XHRpZiAoZW5kSW5kZXggPCAwKSB7XHJcblx0XHRcdGN1cnJlbnRGb3JtYXRTdHJpbmcgPSBsYXlvdXQuc3Vic3RyaW5nKHN0YXJ0SW5kZXgpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Y3VycmVudEZvcm1hdFN0cmluZyA9IGxheW91dC5zdWJzdHJpbmcoc3RhcnRJbmRleCwgZW5kSW5kZXgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZvcm1hdHRlci5wdXNoKGdldEZvcm1hdHRlck9iamVjdF8oY3VycmVudEZvcm1hdFN0cmluZykpO1xyXG5cclxuXHR9IHdoaWxlIChpbmRleCA+IC0xKTtcclxuXHJcblx0Y29tcGlsZWRMYXlvdXRzX1tsYXlvdXRdID0gZm9ybWF0dGVyO1xyXG5cclxuXHRyZXR1cm4gZm9ybWF0dGVyO1xyXG5cclxufTtcclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGZvcm1hdHRlclxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gZm9ybWF0U3RyaW5nXHJcbiAqXHJcbiAqIEByZXR1cm4gez9zdHJpbmd9XHJcbiAqL1xyXG52YXIgZ2V0Rm9ybWF0dGVyT2JqZWN0XyA9IGZ1bmN0aW9uKGZvcm1hdFN0cmluZykge1xyXG5cclxuXHR2YXIgY29tbWFuZFJlZ2V4ID0gLyUoW2EteixBLVpdKykoPz1cXHt8KS87XHJcblx0dmFyIHJlc3VsdCA9IGNvbW1hbmRSZWdleC5leGVjKGZvcm1hdFN0cmluZyk7XHJcblx0aWYgKHJlc3VsdCAhPSBudWxsICYmIHJlc3VsdC5sZW5ndGggPT0gMikge1xyXG5cclxuXHRcdHZhciBmb3JtYXR0ZXIgPSBnZXRGb3JtYXR0ZXJGdW5jdGlvbl8ocmVzdWx0WzFdKTtcclxuXHRcdGlmIChmb3JtYXR0ZXIgPT0gbnVsbCkge1xyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgcGFyYW1zID0gZ2V0Rm9ybWF0dGVyUGFyYW1zXyhmb3JtYXRTdHJpbmcpO1xyXG5cclxuXHRcdHZhciBhZnRlciA9ICcnO1xyXG5cdFx0dmFyIGVuZEluZGV4ID0gZm9ybWF0U3RyaW5nLmxhc3RJbmRleE9mKCd9Jyk7XHJcblx0XHRpZiAoZW5kSW5kZXggIT0gLTEpIHtcclxuXHRcdFx0YWZ0ZXIgPSBmb3JtYXRTdHJpbmcuc3Vic3RyaW5nKGVuZEluZGV4ICsgMSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRhZnRlciA9IGZvcm1hdFN0cmluZy5zdWJzdHJpbmcocmVzdWx0LmluZGV4ICsgcmVzdWx0WzFdLmxlbmd0aCArIDEpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGZvcm1hdHRlciA6IGZvcm1hdHRlcixcclxuXHRcdFx0cGFyYW1zIDogcGFyYW1zLFxyXG5cdFx0XHRhZnRlciA6IGFmdGVyXHJcblx0XHR9O1xyXG5cclxuXHR9XHJcblxyXG5cdHJldHVybiBmb3JtYXRTdHJpbmc7XHJcblxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb21tYW5kXHJcbiAqXHJcbiAqIEByZXR1cm4gez9zdHJpbmd9XHJcbiAqL1xyXG52YXIgZ2V0Rm9ybWF0dGVyRnVuY3Rpb25fID0gZnVuY3Rpb24oY29tbWFuZCkge1xyXG5cclxuXHR2YXIgcmVnZXg7XHJcblx0Zm9yICggdmFyIGtleSBpbiBmb3JtYXR0ZXJzXykge1xyXG5cdFx0cmVnZXggPSBuZXcgUmVnRXhwKCdeJyArIGtleSArICckJyk7XHJcblx0XHRpZiAocmVnZXguZXhlYyhjb21tYW5kKSAhPSBudWxsKSB7XHJcblx0XHRcdHJldHVybiBmb3JtYXR0ZXJzX1trZXldO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIG51bGw7XHJcblxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBmdW5jdGlvblxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gY29tbWFuZFxyXG4gKlxyXG4gKiBAcmV0dXJuIHtzdHJpbmd9XHJcbiAqL1xyXG52YXIgZ2V0Rm9ybWF0dGVyUGFyYW1zXyA9IGZ1bmN0aW9uKGNvbW1hbmQpIHtcclxuXHJcblx0dmFyIHBhcmFtcyA9IFtdO1xyXG5cdHZhciByZXN1bHQgPSBjb21tYW5kLm1hdGNoKC9cXHsoW15cXH1dKikoPz1cXH0pL2cpO1xyXG5cdGlmIChyZXN1bHQgIT0gbnVsbCkge1xyXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCByZXN1bHQubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0cGFyYW1zLnB1c2gocmVzdWx0W2ldLnN1YnN0cmluZygxKSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gcGFyYW1zO1xyXG5cclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAZnVuY3Rpb25cclxuICpcclxuICogQHBhcmFtIHtBcnJheS48ZnVuY3Rpb258c3RyaW5nPn0gZm9ybWF0dGVyXHJcbiAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dFdmVudFxyXG4gKlxyXG4gKiBAcmV0dXJuIHtzdHJpbmd9XHJcbiAqL1xyXG52YXIgZm9ybWF0TG9nRXZlbnRfID0gZnVuY3Rpb24oZm9ybWF0dGVyLCBsb2dFdmVudCkge1xyXG5cclxuXHR2YXIgcmVzcG9uc2U7XHJcblx0dmFyIG1lc3NhZ2UgPSAnJztcclxuXHR2YXIgY291bnQgPSBmb3JtYXR0ZXIubGVuZ3RoO1xyXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xyXG5cdFx0aWYgKGZvcm1hdHRlcltpXSAhPT0gbnVsbCkge1xyXG5cclxuXHRcdFx0aWYgKGZvcm1hdHRlcltpXSBpbnN0YW5jZW9mIE9iamVjdCkge1xyXG5cclxuXHRcdFx0XHRyZXNwb25zZSA9IGZvcm1hdHRlcltpXS5mb3JtYXR0ZXIobG9nRXZlbnQsIGZvcm1hdHRlcltpXS5wYXJhbXMpO1xyXG5cdFx0XHRcdGlmIChyZXNwb25zZSAhPSBudWxsKSB7XHJcblx0XHRcdFx0XHRtZXNzYWdlICs9IHJlc3BvbnNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRtZXNzYWdlICs9IGZvcm1hdHRlcltpXS5hZnRlcjtcclxuXHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0bWVzc2FnZSArPSBmb3JtYXR0ZXJbaV07XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gbWVzc2FnZS50cmltKCk7XHJcblxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBsYXlvdXRcclxuICpcclxuICogQHJldHVybiB7c3RyaW5nfVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHByZUNvbXBpbGUobGF5b3V0KSB7XHJcblx0Z2V0Q29tcGlsZWRMYXlvdXRfKGxheW91dCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGZvcm1hdHRlclxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gbGF5b3V0XHJcbiAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dFdmVudFxyXG4gKlxyXG4gKiBAcmV0dXJuIHtzdHJpbmd9XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0KGxheW91dCwgbG9nRXZlbnQpIHtcclxuXHRyZXR1cm4gZm9ybWF0TG9nRXZlbnRfKGdldENvbXBpbGVkTGF5b3V0XyhsYXlvdXQpLCBsb2dFdmVudCk7XHJcbn0iXX0=


/***/ },
/* 2 */
/***/ function(module, exports) {

	exports.__esModule = true;
	exports.dateFormat = dateFormat;
	var i18n = {
		dayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
	};

	var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g;
	var timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g;
	var timezoneClip = /[^-+\dA-Z]/g;

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
		if (isNaN(date)) throw SyntaxError("invalid date");

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
			Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
			o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4)
		};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	}
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kYXRlRm9ybWF0dGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxJQUFJLEdBQUc7QUFDVixTQUFRLEVBQUcsQ0FBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFDL0UsU0FBUyxFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLFVBQVUsQ0FBRTtBQUMzRCxXQUFVLEVBQUcsQ0FBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFDM0UsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQzNFLE1BQU0sRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsVUFBVSxDQUFFO0NBQ25FLENBQUM7O0FBRUYsSUFBSSxLQUFLLEdBQUcsZ0VBQWdFLENBQUM7QUFDN0UsSUFBSSxRQUFRLEdBQUcsc0lBQXNJLENBQUM7QUFDdEosSUFBSSxZQUFZLEdBQUcsYUFBYSxDQUFDOzs7Ozs7Ozs7O0FBVWpDLFNBQVMsR0FBRyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7QUFDM0IsTUFBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN0QixPQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsQ0FBQztBQUNyQixRQUFPLEtBQUssQ0FBQyxNQUFNLEdBQUcsTUFBTSxFQUFFO0FBQzdCLE9BQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDO0VBQ3BCO0FBQ0QsUUFBTyxLQUFLLENBQUM7Q0FDYjs7QUFFTSxTQUFTLFVBQVUsQ0FBRSxJQUFJLEVBQUUsSUFB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LEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDWCxHQUFDLEVBQUcsQ0FBQztBQUNMLElBQUUsRUFBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ1gsR0FBQyxFQUFHLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2IsR0FBQyxFQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsR0FBRyxHQUFHLEdBQUc7QUFDdEIsSUFBRSxFQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxHQUFHLElBQUk7QUFDekIsR0FBQyxFQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsR0FBRyxHQUFHLEdBQUc7QUFDdEIsSUFBRSxFQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxHQUFHLElBQUk7QUFDekIsR0FBQyxFQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUUsRUFBRSxDQUFFLENBQUEsQ0FBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLEVBQUUsQ0FBQztBQUMxRixHQUFDLEVBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUEsR0FBSSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7RUFDdkYsQ0FBQzs7QUFFRixRQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFVBQVMsRUFBRSxFQUFFO0FBQ3ZDLFNBQU8sRUFBRSxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztFQUM1RCxDQUFDLENBQUM7Q0FFSCIsImZpbGUiOiJkYXRlRm9ybWF0dGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsibGV0IGkxOG4gPSB7XHJcblx0ZGF5TmFtZXMgOiBbIFwiU3VuXCIsIFwiTW9uXCIsIFwiVHVlXCIsIFwiV2VkXCIsIFwiVGh1XCIsIFwiRnJpXCIsIFwiU2F0XCIsIFwiU3VuZGF5XCIsIFwiTW9uZGF5XCIsXHJcblx0XHRcIlR1ZXNkYXlcIiwgXCJXZWRuZXNkYXlcIiwgXCJUaHVyc2RheVwiLCBcIkZyaWRheVwiLCBcIlNhdHVyZGF5XCIgXSxcclxuXHRtb250aE5hbWVzIDogWyBcIkphblwiLCBcIkZlYlwiLCBcIk1hclwiLCBcIkFwclwiLCBcIk1heVwiLCBcIkp1blwiLCBcIkp1bFwiLCBcIkF1Z1wiLCBcIlNlcFwiLFxyXG5cdFx0XCJPY3RcIiwgXCJOb3ZcIiwgXCJEZWNcIiwgXCJKYW51YXJ5XCIsIFwiRmVicnVhcnlcIiwgXCJNYXJjaFwiLCBcIkFwcmlsXCIsIFwiTWF5XCIsIFwiSnVuZVwiLFxyXG5cdFx0XCJKdWx5XCIsIFwiQXVndXN0XCIsIFwiU2VwdGVtYmVyXCIsIFwiT2N0b2JlclwiLCBcIk5vdmVtYmVyXCIsIFwiRGVjZW1iZXJcIiBdXHJcbn07XHJcblxyXG5sZXQgdG9rZW4gPSAvZHsxLDR9fG17MSw0fXx5eSg/Onl5KT98KFtIaE1zVHRdKVxcMT98W0xsb1NaXXxcIlteXCJdKlwifCdbXiddKicvZztcclxubGV0IHRpbWV6b25lID0gL1xcYig/OltQTUNFQV1bU0RQXVR8KD86UGFjaWZpY3xNb3VudGFpbnxDZW50cmFsfEVhc3Rlcm58QXRsYW50aWMpICg/OlN0YW5kYXJkfERheWxpZ2h0fFByZXZhaWxpbmcpIFRpbWV8KD86R01UfFVUQykoPzpbLStdXFxkezR9KT8pXFxiL2c7XHJcbmxldCB0aW1lem9uZUNsaXAgPSAvW14tK1xcZEEtWl0vZztcclxuXHJcbi8qKlxyXG4gKiBQYWRzIG51bWJlcnMgaW4gdGhlIGRhdGUgZm9ybWF0XHJcbiAqXHJcbiAqIEBwYXJhbSB2YWx1ZVxyXG4gKiBAcGFyYW0gbGVuZ3RoXHJcbiAqXHJcbiAqIEByZXR1cm5zIHs/c3RyaW5nfVxyXG4gKi9cclxuZnVuY3Rpb24gcGFkKHZhbHVlLCBsZW5ndGgpIHtcclxuXHR2YWx1ZSA9IFN0cmluZyh2YWx1ZSk7XHJcblx0bGVuZ3RoID0gbGVuZ3RoIHx8IDI7XHJcblx0d2hpbGUgKHZhbHVlLmxlbmd0aCA8IGxlbmd0aCkge1xyXG5cdFx0dmFsdWUgPSBcIjBcIiArIHZhbHVlO1xyXG5cdH1cclxuXHRyZXR1cm4gdmFsdWU7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkYXRlRm9ybWF0IChkYXRlLCBtYXNrLCB1dGMpIHtcclxuXHJcblx0Ly8gWW91IGNhbid0IHByb3ZpZGUgdXRjIGlmIHlvdSBza2lwIG90aGVyIGFyZ3MgKHVzZSB0aGUgXCJVVEM6XCIgbWFzayBwcmVmaXgpXHJcblx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMSAmJiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZGF0ZSkgPT0gXCJbb2JqZWN0IFN0cmluZ11cIiAmJiAhL1xcZC8udGVzdChkYXRlKSkge1xyXG5cdFx0bWFzayA9IGRhdGU7XHJcblx0XHRkYXRlID0gdW5kZWZpbmVkO1xyXG5cdH1cclxuXHJcblx0Ly8gUGFzc2luZyBkYXRlIHRocm91Z2ggRGF0ZSBhcHBsaWVzIERhdGUucGFyc2UsIGlmIG5lY2Vzc2FyeVxyXG5cdGRhdGUgPSBkYXRlID8gbmV3IERhdGUoZGF0ZSkgOiBuZXcgRGF0ZTtcclxuXHRpZiAoaXNOYU4oZGF0ZSkpXHJcblx0XHR0aHJvdyBTeW50YXhFcnJvcihcImludmFsaWQgZGF0ZVwiKTtcclxuXHJcblx0bWFzayA9IFN0cmluZyhtYXNrIHx8ICd5eXl5LW1tLWRkIEhIOk1NOnNzLFMnKTtcclxuXHJcblx0Ly8gQWxsb3cgc2V0dGluZyB0aGUgdXRjIGFyZ3VtZW50IHZpYSB0aGUgbWFza1xyXG5cdGlmIChtYXNrLnNsaWNlKDAsIDQpID09IFwiVVRDOlwiKSB7XHJcblx0XHRtYXNrID0gbWFzay5zbGljZSg0KTtcclxuXHRcdHV0YyA9IHRydWU7XHJcblx0fVxyXG5cclxuXHRsZXQgXyA9IHV0YyA/IFwiZ2V0VVRDXCIgOiBcImdldFwiO1xyXG5cdGxldCBkID0gZGF0ZVtfICsgXCJEYXRlXCJdKCk7XHJcblx0bGV0IEQgPSBkYXRlW18gKyBcIkRheVwiXSgpO1xyXG5cdGxldCBtID0gZGF0ZVtfICsgXCJNb250aFwiXSgpO1xyXG5cdGxldCB5ID0gZGF0ZVtfICsgXCJGdWxsWWVhclwiXSgpO1xyXG5cdGxldCBIID0gZGF0ZVtfICsgXCJIb3Vyc1wiXSgpO1xyXG5cdGxldCBNID0gZGF0ZVtfICsgXCJNaW51dGVzXCJdKCk7XHJcblx0bGV0IHMgPSBkYXRlW18gKyBcIlNlY29uZHNcIl0oKTtcclxuXHRsZXQgTCA9IGRhdGVbXyArIFwiTWlsbGlzZWNvbmRzXCJdKCk7XHJcblx0bGV0IG8gPSB1dGMgPyAwIDogZGF0ZS5nZXRUaW1lem9uZU9mZnNldCgpO1xyXG5cdGxldCBmbGFncyA9IHtcclxuXHRcdGQgOiBkLFxyXG5cdFx0ZGQgOiBwYWQoZCksXHJcblx0XHRkZGQgOiBpMThuLmRheU5hbWVzW0RdLFxyXG5cdFx0ZGRkZCA6IGkxOG4uZGF5TmFtZXNbRCArIDddLFxyXG5cdFx0TSA6IG0gKyAxLFxyXG5cdFx0TU0gOiBwYWQobSArIDEpLFxyXG5cdFx0TU1NIDogaTE4bi5tb250aE5hbWVzW21dLFxyXG5cdFx0TU1NTSA6IGkxOG4ubW9udGhOYW1lc1ttICsgMTJdLFxyXG5cdFx0eXkgOiBTdHJpbmcoeSkuc2xpY2UoMiksXHJcblx0XHR5eXl5IDogeSxcclxuXHRcdGggOiBIICUgMTIgfHwgMTIsXHJcblx0XHRoaCA6IHBhZChIICUgMTIgfHwgMTIpLFxyXG5cdFx0SCA6IEgsXHJcblx0XHRISCA6IHBhZChIKSxcclxuXHRcdG0gOiBNLFxyXG5cdFx0bW0gOiBwYWQoTSksXHJcblx0XHRzIDogcyxcclxuXHRcdHNzIDogcGFkKHMpLFxyXG5cdFx0UyA6IHBhZChMLCAxKSxcclxuXHRcdHQgOiBIIDwgMTIgPyBcImFcIiA6IFwicFwiLFxyXG5cdFx0dHQgOiBIIDwgMTIgPyBcImFtXCIgOiBcInBtXCIsXHJcblx0XHRUIDogSCA8IDEyID8gXCJBXCIgOiBcIlBcIixcclxuXHRcdFRUIDogSCA8IDEyID8gXCJBTVwiIDogXCJQTVwiLFxyXG5cdFx0WiA6IHV0YyA/IFwiVVRDXCIgOiAoU3RyaW5nKGRhdGUpLm1hdGNoKHRpbWV6b25lKSB8fCBbIFwiXCIgXSkucG9wKCkucmVwbGFjZSh0aW1lem9uZUNsaXAsIFwiXCIpLFxyXG5cdFx0byA6IChvID4gMCA/IFwiLVwiIDogXCIrXCIpICsgcGFkKE1hdGguZmxvb3IoTWF0aC5hYnMobykgLyA2MCkgKiAxMDAgKyBNYXRoLmFicyhvKSAlIDYwLCA0KVxyXG5cdH07XHJcblxyXG5cdHJldHVybiBtYXNrLnJlcGxhY2UodG9rZW4sIGZ1bmN0aW9uKCQwKSB7XHJcblx0XHRyZXR1cm4gJDAgaW4gZmxhZ3MgPyBmbGFnc1skMF0gOiAkMC5zbGljZSgxLCAkMC5sZW5ndGggLSAxKTtcclxuXHR9KTtcclxuXHJcbn1cclxuIl19


/***/ },
/* 3 */
/***/ function(module, exports) {

	exports.__esModule = true;
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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb25zdC9sb2dMZXZlbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQU8sSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDOztBQUNkLElBQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQzs7QUFDbEIsSUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDOztBQUNsQixJQUFNLElBQUksR0FBRyxHQUFHLENBQUM7O0FBQ2pCLElBQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQzs7QUFDakIsSUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDOztBQUNsQixJQUFNLEtBQUssR0FBRyxHQUFHLENBQUM7O0FBQ2xCLElBQU0sR0FBRyxHQUFHLFVBQVUsQ0FBQyIsImZpbGUiOiJsb2dMZXZlbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBPRkYgPSAwO1xyXG5leHBvcnQgY29uc3QgRkFUQUwgPSAxMDA7XHJcbmV4cG9ydCBjb25zdCBFUlJPUiA9IDIwMDtcclxuZXhwb3J0IGNvbnN0IFdBUk4gPSAzMDA7XHJcbmV4cG9ydCBjb25zdCBJTkZPID0gNDAwO1xyXG5leHBvcnQgY29uc3QgREVCVUcgPSA1MDA7XHJcbmV4cG9ydCBjb25zdCBUUkFDRSA9IDYwMDtcclxuZXhwb3J0IGNvbnN0IEFMTCA9IDIxNDc0ODM2NDc7XHJcbiJdfQ==


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	exports.__esModule = true;
	exports.Logger = Logger;
	// istanbul ignore next

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

	var _constLogLevel = __webpack_require__(3);

	var logLevel = _interopRequireWildcard(_constLogLevel);

	function Logger(context, appenderObj) {

		var relative_ = new Date().getTime();

		/** @typeof {number} */
		var logSequence_ = 1;

		/**
	  * @function
	  * @memberOf logUtility
	  *
	  * @param {function} func
	  *
	  * @return {string}
	  */
		function getFunctionName_(func) {

			if (typeof func !== 'function') {
				return 'unknown';
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
		function error() {
			appenderObj.append(constructLogEvent_(logLevel.ERROR, arguments));
		}

		/**
	  * Logs a warning
	  */
		function warn() {
			appenderObj.append(constructLogEvent_(logLevel.WARN, arguments));
		}

		/**
	  * Logs an info level event
	  */
		function info() {
			appenderObj.append(constructLogEvent_(logLevel.INFO, arguments));
		}

		/**
	  * Logs a debug event
	  */
		function debug() {
			appenderObj.append(constructLogEvent_(logLevel.DEBUG, arguments));
		}

		/**
	  * Logs a trace event
	  */
		function trace() {
			appenderObj.append(constructLogEvent_(logLevel.TRACE, arguments));
		}

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

			for (var i = 0; i < args.length; i++) {
				if (typeof args[i] == 'string') {
					loggingEvent.message += args[i];
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
				filename: 'unknown',
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

		return {
			'error': error,
			'debug': debug,
			'warn': warn,
			'info': info,
			'trace': trace
		};
	}
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sb2dnZXIvbG9nZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs2QkFBMEIsbUJBQW1COztJQUFqQyxRQUFROztBQUViLFNBQVMsTUFBTSxDQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUU7O0FBRTVDLEtBQUksU0FBUyxHQUFHLEFBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBRSxPQUFPLEVBQUUsQ0FBQzs7O0FBR3ZDLEtBQUksWUFBWSxHQUFHLENBQUMsQ0FBQzs7Ozs7Ozs7OztBQVVyQixVQUFTLGdCQUFnQixDQUFDLElBQUksRUFBRTs7QUFFL0IsTUFBSSxPQUFPLElBQUksS0FBSyxVQUFVLEVBQUU7QUFDL0IsVUFBTyxTQUFTLENBQUM7R0FDakI7O0FBRUQsTUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQ25DLGNBQVksR0FBRyxZQUFZLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMxRCxjQUFZLEdBQUcsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsWUFBWSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDOztBQUVwRSxTQUFPLEFBQUMsWUFBWSxLQUFLLEVBQUUsR0FBSSxZQUFZLEdBQUcsV0FBVyxDQUFDO0VBRTFEOzs7QUFHRCxLQUFJLE9BQU8sT0FBTyxJQUFJLFFBQVEsRUFBRTs7QUFFL0IsTUFBSSxPQUFPLE9BQU8sSUFBSSxVQUFVLEVBQUU7QUFDakMsVUFBTyxHQUFHLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0dBQ3BDLE1BQU0sSUFBSSxPQUFPLE9BQU8sSUFBSSxRQUFRLEVBQUU7QUFDdEMsVUFBTyxHQUFHLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNoRCxPQUFJLE9BQU8sSUFBSSxRQUFRLEVBQUU7QUFDeEIsV0FBTyxHQUFHLFdBQVcsQ0FBQztJQUN0QjtHQUNELE1BQU07QUFDTixV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IiwiZmlsZSI6ImxvZ2dlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGxvZ0xldmVsIGZyb20gJy4uL2NvbnN0L2xvZ0xldmVsJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBMb2dnZXIoY29udGV4dCwgYXBwZW5kZXJPYmopIHtcclxuXHJcblx0bGV0IHJlbGF0aXZlXyA9IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7XHJcblxyXG5cdC8qKiBAdHlwZW9mIHtudW1iZXJ9ICovXHJcblx0bGV0IGxvZ1NlcXVlbmNlXyA9IDE7XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBmdW5jdGlvblxyXG5cdCAqIEBtZW1iZXJPZiBsb2dVdGlsaXR5XHJcblx0ICpcclxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9ufSBmdW5jXHJcblx0ICpcclxuXHQgKiBAcmV0dXJuIHtzdHJpbmd9XHJcblx0ICovXHJcblx0ZnVuY3Rpb24gZ2V0RnVuY3Rpb25OYW1lXyhmdW5jKSB7XHJcblxyXG5cdFx0aWYgKHR5cGVvZiBmdW5jICE9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdHJldHVybiAndW5rbm93bic7XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IGZ1bmN0aW9uTmFtZSA9IGZ1bmMudG9TdHJpbmcoKTtcclxuXHRcdGZ1bmN0aW9uTmFtZSA9IGZ1bmN0aW9uTmFtZS5zdWJzdHJpbmcoJ2Z1bmN0aW9uICcubGVuZ3RoKTtcclxuXHRcdGZ1bmN0aW9uTmFtZSA9IGZ1bmN0aW9uTmFtZS5zdWJzdHJpbmcoMCwgZnVuY3Rpb25OYW1lLmluZGV4T2YoJygnKSk7XHJcblxyXG5cdFx0cmV0dXJuIChmdW5jdGlvbk5hbWUgIT09ICcnKSA/IGZ1bmN0aW9uTmFtZSA6ICdhbm9ueW1vdXMnO1xyXG5cclxuXHR9XHJcblxyXG5cdC8vIEdldCB0aGUgY29udGV4dFxyXG5cdGlmICh0eXBlb2YgY29udGV4dCAhPSAnc3RyaW5nJykge1xyXG5cclxuXHRcdGlmICh0eXBlb2YgY29udGV4dCA9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdGNvbnRleHQgPSBnZXRGdW5jdGlvbk5hbWVfKGNvbnRleHQpO1xyXG5cdFx0fSBlbHNlIGlmICh0eXBlb2YgY29udGV4dCA9PSAnb2JqZWN0Jykge1xyXG5cdFx0XHRjb250ZXh0ID0gZ2V0RnVuY3Rpb25OYW1lXyhjb250ZXh0LmNvbnN0cnVjdG9yKTtcclxuXHRcdFx0aWYgKGNvbnRleHQgPT0gJ09iamVjdCcpIHtcclxuXHRcdFx0XHRjb250ZXh0ID0gJ2Fub255bW91cyc7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGNvbnRleHQgPSAnYW5vbnltb3VzJztcclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHQvKiogQHR5cGUge3N0cmluZ30gKi9cclxuXHRsZXQgbG9nQ29udGV4dF8gPSBjb250ZXh0O1xyXG5cclxuXHQvKipcclxuXHQgKiBMb2dzIGFuIGVycm9yIGV2ZW50XHJcblx0ICovXHJcblx0ZnVuY3Rpb24gZXJyb3IoKSB7XHJcblx0XHRhcHBlbmRlck9iai5hcHBlbmQoY29uc3RydWN0TG9nRXZlbnRfKGxvZ0xldmVsLkVSUk9SLCBhcmd1bWVudHMpKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIExvZ3MgYSB3YXJuaW5nXHJcblx0ICovXHJcblx0ZnVuY3Rpb24gd2FybigpIHtcclxuXHRcdGFwcGVuZGVyT2JqLmFwcGVuZChjb25zdHJ1Y3RMb2dFdmVudF8obG9nTGV2ZWwuV0FSTiwgYXJndW1lbnRzKSk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBMb2dzIGFuIGluZm8gbGV2ZWwgZXZlbnRcclxuXHQgKi9cclxuXHRmdW5jdGlvbiBpbmZvKCkge1xyXG5cdFx0YXBwZW5kZXJPYmouYXBwZW5kKGNvbnN0cnVjdExvZ0V2ZW50Xyhsb2dMZXZlbC5JTkZPLCBhcmd1bWVudHMpKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIExvZ3MgYSBkZWJ1ZyBldmVudFxyXG5cdCAqL1xyXG5cdGZ1bmN0aW9uIGRlYnVnKCkge1xyXG5cdFx0YXBwZW5kZXJPYmouYXBwZW5kKGNvbnN0cnVjdExvZ0V2ZW50Xyhsb2dMZXZlbC5ERUJVRywgYXJndW1lbnRzKSk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBMb2dzIGEgdHJhY2UgZXZlbnRcclxuXHQgKi9cclxuXHRmdW5jdGlvbiB0cmFjZSgpIHtcclxuXHRcdGFwcGVuZGVyT2JqLmFwcGVuZChjb25zdHJ1Y3RMb2dFdmVudF8obG9nTGV2ZWwuVFJBQ0UsIGFyZ3VtZW50cykpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQGZ1bmN0aW9uXHJcblx0ICpcclxuXHQgKiBAcGFyYW0ge251bWJlcn0gbGV2ZWxcclxuXHQgKiBAcGFyYW0ge0FycmF5fSBhcmd1bWVudHNcclxuXHQgKlxyXG5cdCAqIEByZXR1cm4ge0xPR19FVkVOVH1cclxuXHQgKi9cclxuXHRmdW5jdGlvbiBjb25zdHJ1Y3RMb2dFdmVudF8obGV2ZWwsIGFyZ3MpIHtcclxuXHJcblx0XHRsZXQgZXJyb3IgPSBuZXcgRXJyb3IoKTtcclxuXHJcblx0XHRsZXQgZGV0YWlscyA9IGdldEZpbGVEZXRhaWxzXyhlcnJvcik7XHJcblx0XHRsZXQgbG9nZ2luZ0V2ZW50ID0ge1xyXG5cdFx0XHRlcnJvciA6IG51bGwsXHJcblx0XHRcdGZpbGUgOiBkZXRhaWxzLmZpbGVuYW1lLFxyXG5cdFx0XHRsZXZlbCA6IGxldmVsLFxyXG5cdFx0XHRsaW5lTnVtYmVyIDogZGV0YWlscy5saW5lLFxyXG5cdFx0XHRsb2dnZXIgOiBsb2dDb250ZXh0XyxcclxuXHRcdFx0bWVzc2FnZSA6ICcnLFxyXG5cdFx0XHRtZXRob2QgOiBnZXRGdW5jdGlvbk5hbWVfKGFyZ3MuY2FsbGVlLmNhbGxlciksXHJcblx0XHRcdHByb3BlcnRpZXMgOiB1bmRlZmluZWQsXHJcblx0XHRcdHJlbGF0aXZlIDogKG5ldyBEYXRlKCkpLmdldFRpbWUoKSAtIHJlbGF0aXZlXyxcclxuXHRcdFx0c2VxdWVuY2UgOiBsb2dTZXF1ZW5jZV8rK1xyXG5cdFx0fTtcclxuXHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0aWYgKHR5cGVvZiBhcmdzW2ldID09ICdzdHJpbmcnKSB7XHJcblx0XHRcdFx0bG9nZ2luZ0V2ZW50Lm1lc3NhZ2UgKz0gYXJnc1tpXTtcclxuXHRcdFx0fSBlbHNlIGlmIChhcmdzW2ldIGluc3RhbmNlb2YgRXJyb3IpIHtcclxuXHRcdFx0XHRsb2dnaW5nRXZlbnQuZXJyb3IgPSBhcmdzW2ldO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGxvZ2dpbmdFdmVudC5wcm9wZXJ0aWVzID0gYXJnc1tpXTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBsb2dnaW5nRXZlbnQ7XHJcblxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0RmlsZURldGFpbHNfKGVycm9yKSB7XHJcblxyXG5cdFx0bGV0IGRldGFpbHMgPSB7XHJcblx0XHRcdGNvbHVtbiA6ICc/JyxcclxuXHRcdFx0ZmlsZW5hbWUgOiAndW5rbm93bicsXHJcblx0XHRcdGxpbmUgOiAnPydcclxuXHRcdH07XHJcblx0XHRpZiAoZXJyb3Iuc3RhY2sgIT0gdW5kZWZpbmVkKSB7XHJcblxyXG5cdFx0XHRsZXQgcGFydHMgPSBlcnJvci5zdGFjay5zcGxpdCgvXFxuL2cpO1xyXG5cdFx0XHRsZXQgZmlsZSA9IHBhcnRzWzNdO1xyXG5cdFx0XHRmaWxlID0gZmlsZS5yZXBsYWNlKC9hdCAoLipcXCh8KShmaWxlfGh0dHB8aHR0cHN8KShcXDp8KShcXC98KSovLCAnJyk7XHJcblx0XHRcdGZpbGUgPSBmaWxlLnJlcGxhY2UoJyknLCAnJyk7XHJcblx0XHRcdGZpbGUgPSBmaWxlLnJlcGxhY2UoKHR5cGVvZiBsb2NhdGlvbiAhPT0gJ3VuZGVmaW5lZCcpID8gbG9jYXRpb24uaG9zdCA6ICcnLCAnJykudHJpbSgpO1xyXG5cclxuXHRcdFx0bGV0IGZpbGVQYXJ0cyA9IGZpbGUuc3BsaXQoL1xcOi9nKTtcclxuXHJcblx0XHRcdGRldGFpbHMuY29sdW1uID0gZmlsZVBhcnRzLnBvcCgpO1xyXG5cdFx0XHRkZXRhaWxzLmxpbmUgPSBmaWxlUGFydHMucG9wKCk7XHJcblxyXG5cdFx0XHRpZiAodHlwZW9mIGRlZmluZSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0XHRsZXQgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcclxuXHRcdFx0XHRsZXQgYXBwRGlyID0gcGF0aC5kaXJuYW1lKHJlcXVpcmUubWFpbi5maWxlbmFtZSk7XHJcblx0XHRcdFx0ZGV0YWlscy5maWxlbmFtZSA9IGZpbGVQYXJ0cy5qb2luKCc6JykucmVwbGFjZShhcHBEaXIsICcnKS5yZXBsYWNlKC8oXFxcXHxcXC8pLywgJycpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGRldGFpbHMuZmlsZW5hbWUgPSBmaWxlUGFydHMuam9pbignOicpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gZGV0YWlscztcclxuXHJcblx0XHR9XHJcblx0XHRyZXR1cm4gJ3Vua25vd24nO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdCdlcnJvcicgOiBlcnJvcixcclxuXHRcdCdkZWJ1ZycgOiBkZWJ1ZyxcclxuXHRcdCd3YXJuJyA6IHdhcm4sXHJcblx0XHQnaW5mbycgOiBpbmZvLFxyXG5cdFx0J3RyYWNlJyA6IHRyYWNlXHJcblx0fTtcclxuXHJcbn1cclxuIl19


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
	  * @memberOf consoleAppender
	  *
	  * @param {LOG_EVENT} loggingEvent
	  */
		function append(loggingEvent) {

			if (loggingEvent.level <= logLevel_) {
				appendToConsole_(loggingEvent);
			}
		}

		/**
	  * @function
	  * @memberOf consoleAppender
	  *
	  * @param {number} logLevel
	  * @param {LOG_EVENT} loggingEvent
	  */
		function appendToConsole_(loggingEvent) {

			var message = formatter.format(tagLayout_, loggingEvent);

			if (loggingEvent.level == LogLevel.ERROR) {
				console.error(message);
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
	  * @memberOf consoleAppender
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
	  * @memberOf consoleAppender
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
	  * @memberOf consoleAppender
	  *
	  * @param {number} logLevel
	  */
		function setLogLevel(logLevel) {
			logLevel_ = logLevel;
		}

		/**
	  * @function
	  * @memberOf consoleAppender
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
			setLogLevel: setLogLevel,
			setTagLayout: setTagLayout
		};
	}
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHBlbmRlcnMvY29uc29sZUFwcGVuZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs2QkFBMEIsbUJBQW1COztJQUFqQyxRQUFROzt5QkFDTyxjQUFjOztJQUE3QixTQUFTOztBQUVkLFNBQVMsZUFBZSxHQUFHOzs7QUFHakMsS0FBSSxVQUFVLEdBQUcsSUFBSSxDQUFDOzs7QUFHdEIsS0FBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQzs7Ozs7Ozs7QUFROUIsVUFBUyxNQUFNLENBQUMsWUFBWSxFQUFFOztBQUU3QixNQUFJLFlBQVksQ0FBQyxLQUFLLElBQUksU0FBUyxFQUFFO0FBQ3BDLG1CQUFnQixDQUFDLFlBQVksQ0FBQyxDQUFDO0dBQy9CO0VBRUQ7Ozs7Ozs7OztBQVNELFVBQVMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFOztBQUV2QyxNQUFJLE9BQU8sR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxZQUFZLENBQUMsQ0FBQzs7QUFFekQsTUFBSSxZQUFZLENBQUMsS0FBSyxJQUFJLFFBQVEsQ0FBQyxLQUFLLEVBQUU7QUFDekMsVUFBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztHQUN2QixNQUFNLElBQUksWUFBWSxDQUFDLEtBQUssSUFBSSxRQUFRLENBQUMsSUFBSSxFQUFFO0FBQy9DLFVBQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7R0FDdEIsTUFBTSxJQUFJLFlBQVksQ0FBQyxLQUFLLElBQUksUUFBUSxDQUFDLElBQUksRUFBRTtBQUMvQyxVQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0dBQ3RCLE1BQU0sSUFBSSxZQUFZLENBQUMsS0FBSyxJQUFJLFFBQVEsQ0FBQyxLQUFLLElBQzlDLFlBQVksQ0FBQyxLQUFLLElBQUksUUFBUSxDQUFDLEtBQUssRUFBRTtBQUN0QyxVQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0dBQ3JCO0VBRUQ7Ozs7Ozs7Ozs7QUFVRCxVQUFTLE9BQU8sR0FBRztBQUNsQixTQUFPLGlCQUFpQixDQUFDO0VBQ3pCOzs7Ozs7Ozs7Ozs7QUFZRCxVQUFTLFFBQVEsQ0FBQyxLQUFLLEVBQUU7QUFDeEIsU0FBUSxLQUFLLElBQUksU0FBUyxDQUFFO0VBQzVCOzs7Ozs7OztBQVFELFVBQVMsV0FBVyxDQUFDLFFBQVEsRUFBRTtBQUM5QixXQUFTLEdBQUcsUUFBUSxDQUFDO0VBQ3JCOzs7Ozs7OztBQVFELFVBQVMsWUFBWSxDQUFDLFNBQVMsRUFBRTtBQUNoQyxZQUFVLEdBQUcsU0FBUyxDQUFDO0VBQ3ZCOztBQUVELFFBQU87QUFDTixRQUFNLEVBQUcsTUFBTTtBQUNmLFNBQU8sRUFBRyxPQUFPO0FBQ2pCLFVBQVEsRUFBRyxRQUFRO0FBQ25CLGFBQVcsRUFBRyxXQUFXO0FBQ3pCLGNBQVksRUFBRyxZQUFZO0VBQzNCLENBQUM7Q0FFRiIsImZpbGUiOiJjb25zb2xlQXBwZW5kZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBMb2dMZXZlbCBmcm9tICcuLi9jb25zdC9sb2dMZXZlbCc7XHJcbmltcG9ydCAqIGFzIGZvcm1hdHRlciBmcm9tICcuLi9mb3JtYXR0ZXInO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIENvbnNvbGVBcHBlbmRlcigpIHtcclxuXHJcblx0LyoqIEB0eXBlIHtzdHJpbmd9ICovXHJcblx0bGV0IHRhZ0xheW91dF8gPSAnJW0nO1xyXG5cclxuXHQvKiogQHR5cGUge251bWJlcn0gKi9cclxuXHRsZXQgbG9nTGV2ZWxfID0gTG9nTGV2ZWwuSU5GTztcclxuXHJcblx0LyoqXHJcblx0ICogQGZ1bmN0aW9uXHJcblx0ICogQG1lbWJlck9mIGNvbnNvbGVBcHBlbmRlclxyXG5cdCAqXHJcblx0ICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ2dpbmdFdmVudFxyXG5cdCAqL1xyXG5cdGZ1bmN0aW9uIGFwcGVuZChsb2dnaW5nRXZlbnQpIHtcclxuXHJcblx0XHRpZiAobG9nZ2luZ0V2ZW50LmxldmVsIDw9IGxvZ0xldmVsXykge1xyXG5cdFx0XHRhcHBlbmRUb0NvbnNvbGVfKGxvZ2dpbmdFdmVudCk7XHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQGZ1bmN0aW9uXHJcblx0ICogQG1lbWJlck9mIGNvbnNvbGVBcHBlbmRlclxyXG5cdCAqXHJcblx0ICogQHBhcmFtIHtudW1iZXJ9IGxvZ0xldmVsXHJcblx0ICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ2dpbmdFdmVudFxyXG5cdCAqL1xyXG5cdGZ1bmN0aW9uIGFwcGVuZFRvQ29uc29sZV8obG9nZ2luZ0V2ZW50KSB7XHJcblxyXG5cdFx0bGV0IG1lc3NhZ2UgPSBmb3JtYXR0ZXIuZm9ybWF0KHRhZ0xheW91dF8sIGxvZ2dpbmdFdmVudCk7XHJcblxyXG5cdFx0aWYgKGxvZ2dpbmdFdmVudC5sZXZlbCA9PSBMb2dMZXZlbC5FUlJPUikge1xyXG5cdFx0XHRjb25zb2xlLmVycm9yKG1lc3NhZ2UpO1xyXG5cdFx0fSBlbHNlIGlmIChsb2dnaW5nRXZlbnQubGV2ZWwgPT0gTG9nTGV2ZWwuV0FSTikge1xyXG5cdFx0XHRjb25zb2xlLndhcm4obWVzc2FnZSk7XHJcblx0XHR9IGVsc2UgaWYgKGxvZ2dpbmdFdmVudC5sZXZlbCA9PSBMb2dMZXZlbC5JTkZPKSB7XHJcblx0XHRcdGNvbnNvbGUuaW5mbyhtZXNzYWdlKTtcclxuXHRcdH0gZWxzZSBpZiAobG9nZ2luZ0V2ZW50LmxldmVsID09IExvZ0xldmVsLkRFQlVHIHx8XHJcblx0XHRcdGxvZ2dpbmdFdmVudC5sZXZlbCA9PSBMb2dMZXZlbC5UUkFDRSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhtZXNzYWdlKTtcclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBHZXRzIHRoZSBuYW1lIG9mIHRoZSBsb2dnZXJcclxuXHQgKlxyXG5cdCAqIEBmdW5jdGlvblxyXG5cdCAqIEBtZW1iZXJPZiBjb25zb2xlQXBwZW5kZXJcclxuXHQgKlxyXG5cdCAqIEByZXR1cm4ge3N0cmluZ31cclxuXHQgKi9cclxuXHRmdW5jdGlvbiBnZXROYW1lKCkge1xyXG5cdFx0cmV0dXJuICdDb25zb2xlQXBwZW5kZXInO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogUmV0dXJucyB0cnVlIGlmIHRoZSBhcHBlbmRlciBpcyBhY3RpdmUsIGVsc2UgZmFsc2VcclxuXHQgKlxyXG5cdCAqIEBmdW5jdGlvblxyXG5cdCAqIEBtZW1iZXJPZiBjb25zb2xlQXBwZW5kZXJcclxuXHQgKlxyXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBsZXZlbFxyXG5cdCAqXHJcblx0ICogQHJldHVybiB7Ym9vbGVhbn1cclxuXHQgKi9cclxuXHRmdW5jdGlvbiBpc0FjdGl2ZShsZXZlbCkge1xyXG5cdFx0cmV0dXJuIChsZXZlbCA8PSBsb2dMZXZlbF8pO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQGZ1bmN0aW9uXHJcblx0ICogQG1lbWJlck9mIGNvbnNvbGVBcHBlbmRlclxyXG5cdCAqXHJcblx0ICogQHBhcmFtIHtudW1iZXJ9IGxvZ0xldmVsXHJcblx0ICovXHJcblx0ZnVuY3Rpb24gc2V0TG9nTGV2ZWwobG9nTGV2ZWwpIHtcclxuXHRcdGxvZ0xldmVsXyA9IGxvZ0xldmVsO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQGZ1bmN0aW9uXHJcblx0ICogQG1lbWJlck9mIGNvbnNvbGVBcHBlbmRlclxyXG5cdCAqXHJcblx0ICogQHBhcmFtIHtzdHJpbmd9IHRhZ0xheW91dFxyXG5cdCAqL1xyXG5cdGZ1bmN0aW9uIHNldFRhZ0xheW91dCh0YWdMYXlvdXQpIHtcclxuXHRcdHRhZ0xheW91dF8gPSB0YWdMYXlvdXQ7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0YXBwZW5kIDogYXBwZW5kLFxyXG5cdFx0Z2V0TmFtZSA6IGdldE5hbWUsXHJcblx0XHRpc0FjdGl2ZSA6IGlzQWN0aXZlLFxyXG5cdFx0c2V0TG9nTGV2ZWwgOiBzZXRMb2dMZXZlbCxcclxuXHRcdHNldFRhZ0xheW91dCA6IHNldFRhZ0xheW91dFxyXG5cdH07XHJcblxyXG59XHJcbiJdfQ==


/***/ },
/* 8 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {module.exports = __webpack_amd_options__;

	/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ }
/******/ ])
});
;