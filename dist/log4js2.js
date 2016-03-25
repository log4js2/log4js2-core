(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["log4js2"] = factory();
	else
		root["log4js2"] = factory();
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

	var _loggerLogger = __webpack_require__(7);

	var _constLogLevel = __webpack_require__(4);

	var LogLevel = _interopRequireWildcard(_constLogLevel);

	var _appendersConsoleAppender = __webpack_require__(8);

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
	 * @typedef {{ date : Date, error : Error, message : string, properties : Object,
	 *          timestamp : string }}
	 */
	var LOG_EVENT;

	/**
	 * @typedef {{ logLevel : number }}
	 */
	var LOGGER;

	/** @const */
	var DEFAULT_CONFIG = {
		tagLayout: '%d{HH:mm:ss} [%level] %logger - %message',
		appenders: ['consoleAppender'],
		loggers: [{
			logLevel: LogLevel.INFO
		}],
		allowAppenderInjection: true
	};

	/** @type {Array.<APPENDER>} */
	var appenders_ = [];
	/** @type {?CONFIG_PARAMS} */
	var configuration_ = null;
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

		if (configuration_ instanceof Object && configuration_.tagLayout) {
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

		// we need to initialize if we haven't
		if (configuration_ === null) {
			configure(DEFAULT_CONFIG);
		}

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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sb2dNYW5hZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt5QkFPMkIsYUFBYTs7SUFBNUIsU0FBUzs7NEJBQ0UsaUJBQWlCOzs2QkFDZCxrQkFBa0I7O0lBQWhDLFFBQVE7O3dDQUVhLDZCQUE2Qjs7SUFBbEQsZUFBZTs7Ozs7Ozs7QUFRM0IsSUFBSSxRQUFRLENBQUM7Ozs7OztBQU1iLElBQUksYUFBYSxDQUFDOzs7Ozs7OztBQVFsQixJQUFJLFNBQVMsQ0FBQzs7Ozs7QUFLZCxJQUFJLE1BQU0sQ0FBQzs7O0FBR1gsSUFBTSxjQUFjLEdBQUc7QUFDdEIsVUFBUyxFQUFHLDBDQUEwQztBQUN0RCxVQUFTLEVBQUcsQ0FBRSxpQkFBaUIsQ0FBRTtBQUNqQyxRQUFPLEVBQUcsQ0FBRTtBQUNYLFVBQVEsRUFBRyxRQUFRLENBQUMsSUFBSTtFQUN4QixDQUFFO0FBQ0gsdUJBQXNCLEVBQUcsSUFBSTtDQUM3QixDQUFDOzs7QUFHRixJQUFJLFVBQVUsR0FBRyxFQUFFLENBQUM7O0FBRXBCLElBQUksY0FBYyxHQUFHLElBQUksQ0FBQzs7QUFFMUIsSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDOztBQUV2QixJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7O1FBRVYsUUFBUSxHQUFSLFFBQVE7Ozs7Ozs7Ozs7QUFTVCxTQUFTLFNBQVMsQ0FBQyxNQUFNLEVBQUU7O0FBRWpDLEtBQUksVUFBVSxFQUFFO0FBQ2YsUUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsZ0RBQWdELENBQUMsQ0FBQztBQUN6RSxTQUFPO0VBQ1A7O0FBRUQsb0JBQW1CLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxZQUFZOztBQUVqRCxtQkFBaUIsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRWxDLE1BQUksTUFBTSxDQUFDLFNBQVMsRUFBRTtBQUNyQixZQUFTLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENB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QUMsRUFBRTtBQUN6QyxhQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQzVDO0lBQ0Q7R0FDRDtFQUNEO0NBRUQ7O0FBRUQsV0FBVyxDQUFDLGVBQWUsQ0FBQyxlQUFlLENBQUMsQ0FBQyIsImZpbGUiOiJsb2dNYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIGxvZzRqcyA8aHR0cHM6Ly9naXRodWIuY29tL2FuaWdlbmVyby9sb2c0anM+XHJcbiAqXHJcbiAqIENvcHlyaWdodCAyMDE2IFJvYmluIFNjaHVsdHogPGh0dHA6Ly9jdW5hZS5jb20+XHJcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZVxyXG4gKi9cclxuXHJcbmltcG9ydCAqIGFzIGZvcm1hdHRlciBmcm9tICcuL2Zvcm1hdHRlcic7XHJcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gJy4vbG9nZ2VyL2xvZ2dlcic7XHJcbmltcG9ydCAqIGFzIExvZ0xldmVsIGZyb20gJy4vY29uc3QvbG9nTGV2ZWwnO1xyXG5cclxuaW1wb3J0ICogYXMgY29uc29sZUFwcGVuZGVyIGZyb20gJy4vYXBwZW5kZXJzL2NvbnNvbGVBcHBlbmRlcic7XHJcblxyXG4vKipcclxuICogSG9sZHMgdGhlIGRlZmluaXRpb24gZm9yIHRoZSBhcHBlbmRlciBjbG9zdXJlXHJcbiAqXHJcbiAqIEB0eXBlZGVmIHt7IGFwcGVuZCA6IGZ1bmN0aW9uIChudW1iZXIsIExPR19FVkVOVCksIGlzQWN0aXZlIDogZnVuY3Rpb24oKSxcclxuICogICAgICAgICAgc2V0TG9nTGV2ZWwgOiBmdW5jdGlvbihudW1iZXIpLCBzZXRUYWdMYXlvdXQgOiBmdW5jdGlvbihzdHJpbmcpIH19XHJcbiAqL1xyXG52YXIgQVBQRU5ERVI7XHJcblxyXG4vKipcclxuICogQHR5cGVkZWYge3sgYWxsb3dBcHBlbmRlckluamVjdGlvbiA6IGJvb2xlYW4sIGFwcGVuZGVycyA6IEFycmF5LjxBUFBFTkRFUj4sXHJcbiAqIFx0XHRcdGFwcGxpY2F0aW9uIDogT2JqZWN0LCBsb2dnZXJzIDogQXJyYXkuPExPR0dFUj4sIHRhZ0xheW91dCA6IHN0cmluZyB9fVxyXG4gKi9cclxudmFyIENPTkZJR19QQVJBTVM7XHJcblxyXG4vKipcclxuICogSG9sZHMgdGhlIGRlZmluaXRpb24gZm9yIHRoZSBsb2cgZXZlbnQgb2JqZWN0XHJcbiAqXHJcbiAqIEB0eXBlZGVmIHt7IGRhdGUgOiBEYXRlLCBlcnJvciA6IEVycm9yLCBtZXNzYWdlIDogc3RyaW5nLCBwcm9wZXJ0aWVzIDogT2JqZWN0LFxyXG4gKiAgICAgICAgICB0aW1lc3RhbXAgOiBzdHJpbmcgfX1cclxuICovXHJcbnZhciBMT0dfRVZFTlQ7XHJcblxyXG4vKipcclxuICogQHR5cGVkZWYge3sgbG9nTGV2ZWwgOiBudW1iZXIgfX1cclxuICovXHJcbnZhciBMT0dHRVI7XHJcblxyXG4vKiogQGNvbnN0ICovXHJcbmNvbnN0IERFRkFVTFRfQ09ORklHID0ge1xyXG5cdHRhZ0xheW91dCA6ICclZHtISDptbTpzc30gWyVsZXZlbF0gJWxvZ2dlciAtICVtZXNzYWdlJyxcclxuXHRhcHBlbmRlcnMgOiBbICdjb25zb2xlQXBwZW5kZXInIF0sXHJcblx0bG9nZ2VycyA6IFsge1xyXG5cdFx0bG9nTGV2ZWwgOiBMb2dMZXZlbC5JTkZPXHJcblx0fSBdLFxyXG5cdGFsbG93QXBwZW5kZXJJbmplY3Rpb24gOiB0cnVlXHJcbn07XHJcblxyXG4vKiogQHR5cGUge0FycmF5LjxBUFBFTkRFUj59ICovXHJcbnZhciBhcHBlbmRlcnNfID0gW107XHJcbi8qKiBAdHlwZSB7P0NPTkZJR19QQVJBTVN9ICovXHJcbnZhciBjb25maWd1cmF0aW9uXyA9IG51bGw7XHJcbi8qKiBAdHlwZSB7Ym9vbGVhbn0gKi9cclxudmFyIGZpbmFsaXplZF8gPSBmYWxzZTtcclxuLyoqIEB0eXBlIHtPYmplY3R9ICovXHJcbnZhciBsb2dnZXJzXyA9IHt9O1xyXG5cclxuZXhwb3J0IHtMb2dMZXZlbH07XHJcblxyXG4vKipcclxuICogQ29uZmlndXJlcyB0aGUgbG9nZ2VyXHJcbiAqXHJcbiAqIEBmdW5jdGlvblxyXG4gKlxyXG4gKiBAcGFyYW1zIHtDT05GSUdfUEFSQU1TfSBjb25maWdcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBjb25maWd1cmUoY29uZmlnKSB7XHJcblxyXG5cdGlmIChmaW5hbGl6ZWRfKSB7XHJcblx0XHRhcHBlbmQoTG9nTGV2ZWwuRVJST1IsICdDb3VsZCBub3QgY29uZmlndXJlLiBMb2dVdGlsaXR5IGFscmVhZHkgaW4gdXNlJyk7XHJcblx0XHRyZXR1cm47XHJcblx0fVxyXG5cclxuXHRjb25maWd1cmVBcHBlbmRlcnNfKGNvbmZpZy5hcHBlbmRlcnMsIGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRjb25maWd1cmVMb2dnZXJzXyhjb25maWcubG9nZ2Vycyk7XHJcblxyXG5cdFx0aWYgKGNvbmZpZy50YWdMYXlvdXQpIHtcclxuXHRcdFx0Zm9ybWF0dGVyLnByZUNvbXBpbGUoY29uZmlnLnRhZ0xheW91dCk7XHJcblx0XHRcdGZvciAodmFyIGxvZ0tleSBpbiBsb2dnZXJzXykge1xyXG5cdFx0XHRcdGlmIChsb2dnZXJzXy5oYXNPd25Qcm9wZXJ0eShsb2dLZXkpKSB7XHJcblx0XHRcdFx0XHRmb3IgKHZhciBrZXkgaW4gbG9nZ2Vyc19bbG9nS2V5XSkge1xyXG5cdFx0XHRcdFx0XHRpZiAobG9nZ2Vyc19bbG9nS2V5XS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcblx0XHRcdFx0XHRcdFx0bG9nZ2Vyc19bbG9nS2V5XVtrZXldLnNldFRhZ0xheW91dChjb25maWcudGFnTGF5b3V0KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGNvbmZpZ3VyYXRpb25fID0gY29uZmlnO1xyXG5cclxuXHR9KTtcclxuXHJcbn1cclxuXHJcbnZhciBjb25maWd1cmVBcHBlbmRlcnNfID0gZnVuY3Rpb24gKGFwcGVuZGVycywgY2FsbGJhY2spIHtcclxuXHJcblx0aWYgKGFwcGVuZGVycyBpbnN0YW5jZW9mIEFycmF5KSB7XHJcblx0XHR2YXIgY291bnQgPSBhcHBlbmRlcnMubGVuZ3RoO1xyXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XHJcblx0XHRcdGNhbGxiYWNrKCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxufTtcclxuXHJcbnZhciBjb25maWd1cmVMb2dnZXJzXyA9IGZ1bmN0aW9uIChsb2dnZXJzKSB7XHJcblxyXG5cdGlmICghKGxvZ2dlcnMgaW5zdGFuY2VvZiBBcnJheSkpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgbG9nZ2Vyc1wiKTtcclxuXHR9XHJcblxyXG5cdHZhciBjb3VudCA9IGxvZ2dlcnMubGVuZ3RoO1xyXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xyXG5cclxuXHRcdGlmICghbG9nZ2Vyc1tpXS50YWcpIHtcclxuXHRcdFx0bG9nZ2Vyc19bJ21haW4nXSA9IGdldExvZ2dlcnNfKGxvZ2dlcnNbaV0ubG9nTGV2ZWwpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0bG9nZ2Vyc19bbG9nZ2Vyc1tpXS50YWddID0gZ2V0TG9nZ2Vyc18obG9nZ2Vyc1tpXS5sb2dMZXZlbCk7XHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcbn07XHJcblxyXG52YXIgZ2V0TG9nZ2Vyc18gPSBmdW5jdGlvbiAobG9nTGV2ZWwpIHtcclxuXHJcblx0dmFyIGxvZ2dlcjtcclxuXHR2YXIgbG9nZ2VycyA9IFtdO1xyXG5cdHZhciBjb3VudCA9IGFwcGVuZGVyc18ubGVuZ3RoO1xyXG5cdHdoaWxlIChjb3VudC0tKSB7XHJcblx0XHRsb2dnZXIgPSBhcHBlbmRlcnNfW2NvdW50XSgpO1xyXG5cdFx0bG9nZ2VyLnNldExvZ0xldmVsKGxvZ0xldmVsKTtcclxuXHRcdGxvZ2dlcnMucHVzaChsb2dnZXIpO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIGxvZ2dlcnM7XHJcblxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEFkZHMgYW4gYXBwZW5kZXIgdG8gdGhlIGFwcGVuZGVyIHF1ZXVlLiBJZiB0aGUgc3RhY2sgaXMgZmluYWxpemVkLCBhbmRcclxuICogdGhlIGFsbG93QXBwZW5kZXJJbmplY3Rpb24gaXMgc2V0IHRvIGZhbHNlLCB0aGVuIHRoZSBldmVudCB3aWxsIG5vdCBiZVxyXG4gKiBhcHBlbmRlZFxyXG4gKlxyXG4gKiBAZnVuY3Rpb25cclxuICpcclxuICogQHBhcmFtcyB7QVBQRU5ERVJ9IGFwcGVuZGVyXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gYWRkQXBwZW5kZXIoYXBwZW5kZXIpIHtcclxuXHJcblx0aWYgKGZpbmFsaXplZF8gJiYgIWNvbmZpZ3VyYXRpb25fLmFsbG93QXBwZW5kZXJJbmplY3Rpb24pIHtcclxuXHRcdGNvbnNvbGUuZXJyb3IoJ0Nhbm5vdCBhZGQgYXBwZW5kZXIgd2hlbiBjb25maWd1cmF0aW9uIGZpbmFsaXplZCcpO1xyXG5cdFx0cmV0dXJuO1xyXG5cdH1cclxuXHJcblx0dmFsaWRhdGVBcHBlbmRlcl8oYXBwZW5kZXIpO1xyXG5cdGFwcGVuZGVyc18ucHVzaChhcHBlbmRlcik7XHJcblxyXG59XHJcblxyXG4vKipcclxuICogVmFsaWRhdGVzIHRoYXQgdGhlIGFwcGVuZGVyXHJcbiAqXHJcbiAqIEBmdW5jdGlvblxyXG4gKlxyXG4gKiBAcGFyYW1zIHtBUFBFTkRFUn0gYXBwZW5kZXJcclxuICovXHJcbnZhciB2YWxpZGF0ZUFwcGVuZGVyXyA9IGZ1bmN0aW9uIChhcHBlbmRlcikge1xyXG5cclxuXHRpZiAoYXBwZW5kZXIgPT0gbnVsbCB8fCB0eXBlb2YgYXBwZW5kZXIgIT09ICdmdW5jdGlvbicpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcignSW52YWxpZCBhcHBlbmRlcjogbm90IGFuIGZ1bmN0aW9uJyk7XHJcblx0fVxyXG5cclxuXHR2YXIgYXBwZW5kZXJPYmogPSBhcHBlbmRlcigpO1xyXG5cclxuXHR2YXIgYXBwZW5kZXJNZXRob2RzID0gWydhcHBlbmQnLCAnZ2V0TmFtZScsICdpc0FjdGl2ZScsICdzZXRMb2dMZXZlbCcsICdzZXRUYWdMYXlvdXQnXTtcclxuXHRmb3IgKHZhciBrZXkgaW4gYXBwZW5kZXJNZXRob2RzKSB7XHJcblx0XHRpZiAoYXBwZW5kZXJNZXRob2RzLmhhc093blByb3BlcnR5KGtleSkgJiYgYXBwZW5kZXJPYmpbYXBwZW5kZXJNZXRob2RzW2tleV1dID09IHVuZGVmaW5lZCB8fFxyXG5cdFx0XHR0eXBlb2YgYXBwZW5kZXJPYmpbYXBwZW5kZXJNZXRob2RzW2tleV1dICE9ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGFwcGVuZGVyOiBtaXNzaW5nIG1ldGhvZDogJyArIGFwcGVuZGVyTWV0aG9kc1trZXldKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGlmIChjb25maWd1cmF0aW9uXyBpbnN0YW5jZW9mIE9iamVjdCAmJiBjb25maWd1cmF0aW9uXy50YWdMYXlvdXQpIHtcclxuXHRcdGFwcGVuZGVyT2JqLnNldFRhZ0xheW91dChjb25maWd1cmF0aW9uXy50YWdMYXlvdXQpO1xyXG5cdH1cclxuXHJcbn07XHJcblxyXG4vKipcclxuICogQXBwZW5kcyB0aGUgbG9nIGV2ZW50XHJcbiAqXHJcbiAqIEBmdW5jdGlvblxyXG4gKlxyXG4gKiBAcGFyYW0ge09iamVjdH0gbG9nZ2luZ0V2ZW50XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gYXBwZW5kKGxvZ2dpbmdFdmVudCkge1xyXG5cclxuXHQvLyBmaW5hbGl6ZSB0aGUgY29uZmlndXJhdGlvbiB0byBtYWtlIHN1cmUgbm8gb3RoZXIgYXBwZW5kZXJzIGFyZSBpbmplY3RlZCAoaWYgc2V0KVxyXG5cdGZpbmFsaXplZF8gPSB0cnVlO1xyXG5cclxuXHR2YXIgbG9nZ2VycztcclxuXHRpZiAobG9nZ2Vyc19bbG9nZ2luZ0V2ZW50LmxvZ2dlcl0pIHtcclxuXHRcdGxvZ2dlcnMgPSBsb2dnZXJzX1tsb2dnaW5nRXZlbnQubG9nZ2VyXTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0bG9nZ2VycyA9IGxvZ2dlcnNfWydtYWluJ107XHJcblx0fVxyXG5cclxuXHR2YXIgY291bnQgPSBsb2dnZXJzLmxlbmd0aDtcclxuXHR3aGlsZSAoY291bnQtLSkge1xyXG5cdFx0aWYgKGxvZ2dlcnNbY291bnRdLmlzQWN0aXZlKGxvZ2dpbmdFdmVudC5sZXZlbCkpIHtcclxuXHRcdFx0bG9nZ2Vyc1tjb3VudF0uYXBwZW5kKGxvZ2dpbmdFdmVudCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxufVxyXG5cclxuLyoqXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBmdW5jdGlvblxyXG4gKlxyXG4gKiBAcGFyYW0ge251bWJlcn0gbGV2ZWxcclxuICovXHJcbnZhciB2YWxpZGF0ZUxldmVsXyA9IGZ1bmN0aW9uIChsZXZlbCkge1xyXG5cclxuXHRmb3IgKHZhciBrZXkgaW4gTG9nTGV2ZWwpIHtcclxuXHRcdGlmIChsZXZlbCA9PT0gTG9nTGV2ZWxba2V5XSkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgbG9nIGxldmVsOiAnICsgbGV2ZWwpO1xyXG5cclxufTtcclxuXHJcbi8qKlxyXG4gKiBHZXRzIHRoZSBhcHBsaWNhdGlvbiBpbmZvcm1hdGlvbiBmcm9tIHRoZSBjb25maWd1cmF0aW9uXHJcbiAqIEByZXR1cm4ge09iamVjdH1cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRBcHBsaWNhdGlvbkluZm8oKSB7XHJcblx0aWYgKGNvbmZpZ3VyYXRpb25fLmFwcGxpY2F0aW9uICE9IG51bGwpIHtcclxuXHRcdHJldHVybiBjb25maWd1cmF0aW9uXy5hcHBsaWNhdGlvbjtcclxuXHR9IGVsc2Uge1xyXG5cdFx0cmV0dXJuIG51bGw7XHJcblx0fVxyXG59XHJcblxyXG4vKipcclxuICogSGFuZGxlcyBjcmVhdGluZyB0aGUgbG9nZ2VyIGFuZCByZXR1cm5pbmcgaXRcclxuICogQHBhcmFtIHtzdHJpbmd9IGNvbnRleHRcclxuICogQHJldHVybiB7TG9nZ2VyfVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGdldExvZ2dlcihjb250ZXh0KSB7XHJcblxyXG5cdC8vIHdlIG5lZWQgdG8gaW5pdGlhbGl6ZSBpZiB3ZSBoYXZlbid0XHJcblx0aWYgKGNvbmZpZ3VyYXRpb25fID09PSBudWxsKSB7XHJcblx0XHRjb25maWd1cmUoREVGQVVMVF9DT05GSUcpO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIG5ldyBMb2dnZXIoY29udGV4dCwge1xyXG5cdFx0YXBwZW5kOiBhcHBlbmRcclxuXHR9KTtcclxuXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXRzIHRoZSBsb2cgbGV2ZWwgZm9yIGFsbCBsb2dnZXJzXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBsb2dMZXZlbFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHNldExvZ0xldmVsKGxvZ0xldmVsKSB7XHJcblxyXG5cdHZhbGlkYXRlTGV2ZWxfKGxvZ0xldmVsKTtcclxuXHJcblx0Zm9yICh2YXIgbG9nS2V5IGluIGxvZ2dlcnNfKSB7XHJcblx0XHRpZiAobG9nZ2Vyc18uaGFzT3duUHJvcGVydHkobG9nS2V5KSkge1xyXG5cdFx0XHRmb3IgKHZhciBrZXkgaW4gbG9nZ2Vyc19bbG9nS2V5XSkge1xyXG5cdFx0XHRcdGlmIChsb2dnZXJzX1tsb2dLZXldLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuXHRcdFx0XHRcdGxvZ2dlcnNfW2xvZ0tleV1ba2V5XS5zZXRMb2dMZXZlbChsb2dMZXZlbCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxufVxyXG5cclxuYWRkQXBwZW5kZXIoY29uc29sZUFwcGVuZGVyLkNvbnNvbGVBcHBlbmRlcik7Il19


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

	var _utility = __webpack_require__(3);

	var utility = _interopRequireWildcard(_utility);

	var _constLogLevel = __webpack_require__(4);

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
		return _dateFormatter.dateFormat(logEvent.date, params[0]);
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
		if (logEvent.file === null) {
			getFileDetails_(logEvent);
		}
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
		if (logEvent.lineNumber === null) {
			getFileDetails_(logEvent);
		}
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
		return utility.getFunctionName(logEvent.method);
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

	function getFileDetails_(logEvent) {

		if (logEvent.logErrorStack !== undefined) {

			var parts = logEvent.logErrorStack.stack.split(/\n/g);
			var file = parts[3];
			file = file.replace(/at (.*\(|)(file|http|https|)(\:|)(\/|)*/, '');
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
	}

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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mb3JtYXR0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7NkJBTzJCLGlCQUFpQjs7dUJBQ25CLFdBQVc7O0lBQXhCLE9BQU87OzZCQUNPLGtCQUFrQjs7SUFBaEMsUUFBUTs7O0FBR3BCLElBQUksZ0JBQWdCLEdBQUcsRUFBRSxDQUFDOzs7Ozs7Ozs7OztBQVcxQixJQUFJLGFBQWEsR0FBRyxTQUFoQixhQUFhLENBQVksUUFBUSxFQUFFLE1BQU0sRUFBRTtBQUM5QyxRQUFPLFFBQVEsQ0FBQyxNQUFNLENBQUM7Q0FDdkIsQ0FBQzs7Ozs7Ozs7Ozs7QUFXRixJQUFJLFdBQVcsR0FBRyxTQUFkLFdBQVcsQ0FBWSxRQUFRLEVBQUUsTUFBTSxFQUFFO0FBQzVDLFFBQU8sMEJBQVcsUUFBUSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztDQUM1QyxDQUFDOzs7Ozs7Ozs7OztBQVdGLElBQUksZ0JBQWdCLEdBQUcsU0FBbkIsZ0JBQWdCLENBQVksUUFBUSxFQUFFLE1BQU0sRUFBRTtBQUNqRCxLQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDakIsS0FBSSxRQUFRLENBQUMsS0FBSyxJQUFJLElBQUksRUFBRTs7QUFFM0IsTUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssSUFBSSxTQUFTLEVBQUU7QUFDdEMsT0FBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQy9DLFFBQU0sSUFBSSxHQUFHLElBQUksTUFBTSxFQUFFO0FBQ3hCLFdBQU8sSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztJQUNyQztHQUNELE1BQU0sSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sSUFBSSxJQUFJLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLElBQUksRUFBRSxFQUFFO0FBQzFFLFVBQU8sSUFBSSxJQUFJLENBQUM7QUFDaEIsVUFBTyxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLElBQUksR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQztBQUMvRCxVQUFPLElBQUksSUFBSSxDQUFDO0dBQ2hCO0VBRUQ7QUFDRCxRQUFPLE9BQU8sQ0FBQztDQUNmLENBQUM7Ozs7O0FBS0YsSUFBSSxXQUFXLEdBQUcsU0FBZCxXQUFXLENBQVksUUFBUSxFQUFFLE1BQU0sRUFBRTtBQUM1QyxLQUFJLFFBQVEsQ0FBQyxJQUFJLEtBQUssSUFBSSxFQUFFO0FBQzNCLGlCQUFlLENBQUMsUUFBUSxDQUFDLENBQUM7RUFDMUI7QUFDRCxRQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUM7Q0FDckIsQ0FBQzs7Ozs7Ozs7Ozs7QUFXRixJQUFJLGlCQUFpQixHQUFHLFNBQXBCLGlCQUFpQixDQUFZLFFBQVEsRUFBRSxNQUFNLEVBQUU7QUFDbEQsS0FBSSxRQUFRLENBQUMsVUFBVSxLQUFLLElBQUksRUFBRTtBQUNqQyxpQkFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0VBQzFCO0FBQ0QsUUFBTyxFQUFFLEdBQUcsUUFBUSxDQUFDLFVBQVUsQ0FBQztDQUNoQyxDQUFDOzs7Ozs7Ozs7OztBQVdGLElBQUksaUJBQWlCLEdBQUcsU0FBcEIsaUJBQWlCLENBQVksUUFBUSxFQUFFLE1BQU0sRUFBRTtBQUNsRCxLQUFJLE9BQU8sR0FBRyxJQUFJLENBQUM7QUFDbkIsS0FBSSxRQUFRLENBQUMsVUFBVSxFQUFFOztBQUV4QixTQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ2IsT0FBTSxJQUFJLEdBQUcsSUFBSSxRQUFRLENBQUMsVUFBVSxFQUFFO0FBQ3JDLE9BQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQ2QsUUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxFQUFFO0FBQ3JCLFlBQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0tBQ3ZDO0lBQ0QsTUFBTTtBQUNOLFdBQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsUUFBUSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztJQUMvRDtHQUNEOztBQUVELFNBQU8sR0FBRyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO0VBRXJDO0FBQ0QsUUFBTyxPQUFPLENBQUM7Q0FDZixDQUFDOzs7Ozs7Ozs7OztBQVdGLElBQUksaUJBQWlCLEdBQUcsU0FBcEIsaUJBQWlCLENBQVksUUFBUSxFQUFFLE1BQU0sRUFBRTtBQUNsRCxRQUFPLFFBQVEsQ0FBQyxPQUFPLENBQUM7Q0FDeEIsQ0FBQzs7Ozs7Ozs7Ozs7QUFXRixJQUFJLGlCQUFpQixHQUFHLFNBQXBCLGlCQUFpQixDQUFZLFFBQVEsRUFBRSxNQUFNLEVBQUU7QUFDbEQsUUFBTyxPQUFPLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztDQUNoRCxDQUFDOzs7Ozs7Ozs7OztBQVdGLElBQUksb0JBQW9CLEdBQUcsU0FBdkIsb0JBQW9CLENBQVksUUFBUSxFQUFFLE1BQU0sRUFBRTtBQUNyRCxRQUFPLElBQUksQ0FBQztDQUNaLENBQUM7Ozs7Ozs7Ozs7O0FBV0YsSUFBSSxZQUFZLEdBQUcsU0FBZixZQUFZLENBQVksUUFBUSxFQUFFLE1BQU0sRUFBRTtBQUM3QyxLQUFJLFFBQVEsQ0FBQyxLQUFLLElBQUksUUFBUSxDQUFDLEtBQUssRUFBRTtBQUNyQyxTQUFPLE9BQU8sQ0FBQztFQUNmLE1BQU0sSUFBSSxRQUFRLENBQUMsS0FBSyxJQUFJLFFBQVEsQ0FBQyxLQUFLLEVBQUU7QUFDNUMsU0FBTyxPQUFPLENBQUM7RUFDZixNQUFNLElBQUksUUFBUSxDQUFDLEtBQUssSUFBSSxRQUFRLENBQUMsSUFBSSxFQUFFO0FBQzNDLFNBQU8sTUFBTSxDQUFDO0VBQ2QsTUFBTSxJQUFJLFFBQVEsQ0FBQyxLQUFLLElBQUksUUFBUSxDQUFDLElBQUksRUFBRTtBQUMzQyxTQUFPLE1BQU0sQ0FBQztFQUNkLE1BQU0sSUFBSSxRQUFRLENBQUMsS0FBSyxJQUFJLFFBQVEsQ0FBQyxLQUFLLEVBQUU7QUFDNUMsU0FBTyxPQUFPLENBQUM7RUFDZixNQUFNLElBQUksUUFBUSxDQUFDLEtBQUssSUFBSSxRQUFRLENBQUMsS0FBSyxFQUFFO0FBQzVDLFNBQU8sT0FBTyxDQUFDO0VBQ2Y7Q0FDRCxDQUFDOzs7Ozs7Ozs7OztBQVdGLElBQUksZUFBZSxHQUFHLFNBQWxCLGVBQWUsQ0FBWSxRQUFRLEVBQUUsTUFBTSxFQUFFO0FBQ2hELFFBQU8sRUFBRSxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUM7Q0FDOUIsQ0FBQzs7Ozs7Ozs7Ozs7QUFXRixJQUFJLHFCQUFxQixHQUFHLFNBQXhCLHFCQUFxQixDQUFZLFFBQVEsRUFBRSxNQUFNLEVBQUU7QUFDdEQsUUFBTyxFQUFFLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQztDQUM5QixDQUFDOztBQUVGLElBQUksV0FBVyxHQUFHO0FBQ2pCLFdBQVUsRUFBRyxhQUFhO0FBQzFCLFNBQVEsRUFBRyxXQUFXO0FBQ3RCLHlCQUF3QixFQUFHLGdCQUFnQjtBQUMzQyxTQUFRLEVBQUcsV0FBVztBQUN0QixZQUFXLEVBQUcsaUJBQWlCO0FBQy9CLFNBQVEsRUFBRyxpQkFBaUI7QUFDNUIsZ0JBQWUsRUFBRyxpQkFBaUI7QUFDbkMsV0FBVSxFQUFHLGlCQUFpQjtBQUM5QixJQUFHLEVBQUcsb0JBQW9CO0FBQzFCLFVBQVMsRUFBRyxZQUFZO0FBQ3hCLGFBQVksRUFBRyxlQUFlO0FBQzlCLG9CQUFtQixFQUFHLHFCQUFxQjtDQUMzQyxDQUFDOzs7Ozs7Ozs7O0FBVUYsSUFBSSxrQkFBa0IsR0FBRyxTQUFyQixrQkFBa0IsQ0FBWSxNQUFNLEVBQUU7O0FBRXpDLEtBQUksZ0JBQWdCLENBQUMsTUFBTSxDQUFDLElBQUksU0FBUyxFQUFFO0FBQzFDLFNBQU8sZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7RUFDaEM7O0FBRUQsUUFBTyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7Q0FFOUIsQ0FBQzs7Ozs7Ozs7OztBQVVGLElBQUksY0FBYyxHQUFHLFNBQWpCLGNBQWMsQ0FBWSxNQUFNLEVBQUU7O0FBRXJDLEtBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDaEMsS0FBSSxtQkFBbUIsR0FBRyxFQUFFLENBQUM7QUFDN0IsS0FBSSxTQUFTLEdBQUcsRUFBRSxDQUFDOztBQUVuQixLQUFJLEtBQUssSUFBSSxDQUFDLEVBQUU7QUFDZixXQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7RUFDM0M7O0FBRUQsSUFBRzs7QUFFRixNQUFJLFVBQVUsR0FBRyxLQUFLLENBQUM7QUFDdkIsTUFBSSxRQUFRLEdBQUcsS0FBSyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQzs7QUFFdEQsTUFBSSxRQUFRLEdBQUcsQ0FBQyxFQUFFO0FBQ2pCLHNCQUFtQixHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7R0FDbkQsTUFBTTtBQUNOLHNCQUFtQixHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0dBQzdEOztBQUVELFdBQVMsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDO0VBRXpELFFBQVEsS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFOztBQUVyQixpQkFBZ0IsQ0FBQyxNQUFNLENBQUMsR0FBRyxTQUFTLENBQUM7O0FBRXJDLFFBQU8sU0FBUyxDQUFDO0NBRWpCLENBQUM7Ozs7Ozs7Ozs7QUFVRixJQUFJLG1CQUFtQixHQUFHLFNBQXRCLG1CQUFtQixDQUFZLFlBQVksRUFBRTs7QUFFaEQsS0FBSSxZQUFZLEdBQUcsc0JBQXNCLENBQUM7QUFDMUMsS0FBSSxNQUFNLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUM3QyxLQUFJLE1BQU0sSUFBSSxJQUFJLElBQUksTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7O0FBRXpDLE1BQUksU0FBUyxHQUFHLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2pELE1BQUksU0FBUyxJQUFJLElBQUksRUFBRTtBQUN0QixVQUFPLElBQUksQ0FBQztHQUNaOztBQUVELE1BQUksTUFBTSxHQUFHLG1CQUFtQixDQUFDLFlBQVksQ0FBQyxDQUFDOztBQUUvQyxNQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7QUFDZixNQUFJLFFBQVEsR0FBRyxZQUFZLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzdDLE1BQUksUUFBUSxJQUFJLENBQUMsQ0FBQyxFQUFFO0FBQ25CLFFBQUssR0FBRyxZQUFZLENBQUMsU0FBUyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQztHQUM3QyxNQUFNO0FBQ04sUUFBSyxHQUFHLFlBQVksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0dBQ3BFOztBQUVELFNBQU87QUFDTixZQUFTLEVBQUcsU0FBUztBQUNyQixTQUFNLEVBQUcsTUFBTTtBQUNmLFFBQUssRUFBRyxLQUFLO0dBQ2IsQ0FBQztFQUVGOztBQUVELFFBQU8sWUFBWSxDQUFDO0NBRXBCLENBQUM7Ozs7Ozs7Ozs7QUFVRixJQUFJLHFCQUFxQixHQUFHLFNBQXhCLHFCQUFxQixDQUFZLE9BQU8sRUFBRTs7QUFFN0MsS0FBSSxLQUFLLENBQUM7QUFDVixNQUFNLElBQUksR0FBRyxJQUFJLFdBQVcsRUFBRTtBQUM3QixPQUFLLEdBQUcsSUFBSSxNQUFNLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztBQUNwQyxNQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxFQUFFO0FBQ2hDLFVBQU8sV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0dBQ3hCO0VBQ0Q7O0FBRUQsUUFBTyxJQUFJLENBQUM7Q0FFWixDQUFDOzs7Ozs7Ozs7O0FBVUYsSUFBSSxtQkFBbUIsR0FBRyxTQUF0QixtQkFBbUIsQ0FBWSxPQUFPLEVBQUU7O0FBRTNDLEtBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNoQixLQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDaEQsS0FBSSxNQUFNLElBQUksSUFBSSxFQUFFO0FBQ25CLE9BQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3ZDLFNBQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0dBQ3BDO0VBQ0Q7O0FBRUQsUUFBTyxNQUFNLENBQUM7Q0FFZCxDQUFDOzs7Ozs7Ozs7OztBQVdGLElBQUksZUFBZSxHQUFHLFNBQWxCLGVBQWUsQ0FBWSxTQUFTLEVBQUUsUUFBUSxFQUFFOztBQUVuRCxLQUFJLFFBQVEsQ0FBQztBQUNiLEtBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztBQUNqQixLQUFJLEtBQUssR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDO0FBQzdCLE1BQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDL0IsTUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxFQUFFOztBQUUxQixPQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsWUFBWSxNQUFNLEVBQUU7O0FBRW5DLFlBQVEsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDakUsUUFBSSxRQUFRLElBQUksSUFBSSxFQUFFO0FBQ3JCLFlBQU8sSUFBSSxRQUFRLENBQUM7S0FDcEI7QUFDRCxXQUFPLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUU5QixNQUFNO0FBQ04sV0FBTyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN4QjtHQUVEO0VBQ0Q7O0FBRUQsUUFBTyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7Q0FFdEIsQ0FBQzs7QUFFRixTQUFTLGVBQWUsQ0FBQyxRQUFRLEVBQUU7O0FBRWxDLEtBQUksUUFBUSxDQUFDLGFBQWEsS0FBSyxTQUFTLEVBQUU7O0FBRXpDLE1BQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN0RCxNQUFJLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEIsTUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMseUNBQXlDLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDbkUsTUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQzdCLE1BQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEFBQUMsT0FBTyxRQUFRLEtBQUssV0FBVyxHQUFJLFFBQVEsQ0FBQyxJQUFJLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDOztBQUV2RixNQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUVsQyxVQUFRLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNsQyxVQUFRLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQzs7QUFFdEMsTUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXLEVBQUU7QUFDbEMsT0FBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzNCLE9BQUksTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNqRCxXQUFRLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0dBQ25GLE1BQU07QUFDTixXQUFRLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7R0FDeEM7RUFFRCxNQUFNOztBQUVOLFVBQVEsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO0FBQ3RCLFVBQVEsQ0FBQyxRQUFRLEdBQUcsV0FBVyxDQUFDO0FBQ2hDLFVBQVEsQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDO0VBRTFCO0NBRUQ7Ozs7Ozs7Ozs7O0FBVU0sU0FBUyxVQUFVLENBQUMsTUFBTSxFQUFFO0FBQ2xDLG1CQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0NBQzNCOzs7Ozs7Ozs7Ozs7QUFXTSxTQUFTLE1BQU0sQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFO0FBQ3hDLFFBQU8sZUFBZSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0NBQzdEIiwiZmlsZSI6ImZvcm1hdHRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBsb2c0anMgPGh0dHBzOi8vZ2l0aHViLmNvbS9hbmlnZW5lcm8vbG9nNGpzPlxyXG4gKlxyXG4gKiBDb3B5cmlnaHQgMjAxNi1wcmVzZW50IFJvYmluIFNjaHVsdHogPGh0dHA6Ly9jdW5hZS5jb20+XHJcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZVxyXG4gKi9cclxuXHJcbmltcG9ydCB7IGRhdGVGb3JtYXQgfSBmcm9tICcuL2RhdGVGb3JtYXR0ZXInO1xyXG5pbXBvcnQgKiBhcyB1dGlsaXR5IGZyb20gJy4vdXRpbGl0eSc7XHJcbmltcG9ydCAqIGFzIGxvZ0xldmVsIGZyb20gJy4vY29uc3QvbG9nTGV2ZWwnO1xyXG5cclxuLyoqIEB0eXBlIHtPYmplY3R9ICovXHJcbnZhciBjb21waWxlZExheW91dHNfID0ge307XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcclxuICpcclxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XHJcbiAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz59IHBhcmFtc1xyXG4gKlxyXG4gKiBAcmV0dXJuIHtzdHJpbmd9XHJcbiAqL1xyXG52YXIgZm9ybWF0TG9nZ2VyXyA9IGZ1bmN0aW9uKGxvZ0V2ZW50LCBwYXJhbXMpIHtcclxuXHRyZXR1cm4gbG9nRXZlbnQubG9nZ2VyO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXHJcbiAqXHJcbiAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dFdmVudFxyXG4gKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSBwYXJhbXNcclxuICpcclxuICogQHJldHVybiB7c3RyaW5nfVxyXG4gKi9cclxudmFyIGZvcm1hdERhdGVfID0gZnVuY3Rpb24obG9nRXZlbnQsIHBhcmFtcykge1xyXG5cdHJldHVybiBkYXRlRm9ybWF0KGxvZ0V2ZW50LmRhdGUsIHBhcmFtc1swXSk7XHJcbn07XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcclxuICpcclxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XHJcbiAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz59IHBhcmFtc1xyXG4gKlxyXG4gKiBAcmV0dXJuIHtzdHJpbmd9XHJcbiAqL1xyXG52YXIgZm9ybWF0RXhjZXB0aW9uXyA9IGZ1bmN0aW9uKGxvZ0V2ZW50LCBwYXJhbXMpIHtcclxuXHR2YXIgbWVzc2FnZSA9ICcnO1xyXG5cdGlmIChsb2dFdmVudC5lcnJvciAhPSBudWxsKSB7XHJcblxyXG5cdFx0aWYgKGxvZ0V2ZW50LmVycm9yLnN0YWNrICE9IHVuZGVmaW5lZCkge1xyXG5cdFx0XHR2YXIgc3RhY2tzID0gbG9nRXZlbnQuZXJyb3Iuc3RhY2suc3BsaXQoL1xcbi9nKTtcclxuXHRcdFx0Zm9yICggdmFyIGtleSBpbiBzdGFja3MpIHtcclxuXHRcdFx0XHRtZXNzYWdlICs9ICdcXHQnICsgc3RhY2tzW2tleV0gKyAnXFxuJztcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIGlmIChsb2dFdmVudC5lcnJvci5tZXNzYWdlICE9IG51bGwgJiYgbG9nRXZlbnQuZXJyb3IubWVzc2FnZSAhPSAnJykge1xyXG5cdFx0XHRtZXNzYWdlICs9ICdcXHQnO1xyXG5cdFx0XHRtZXNzYWdlICs9IGxvZ0V2ZW50LmVycm9yLm5hbWUgKyAnOiAnICsgbG9nRXZlbnQuZXJyb3IubWVzc2FnZTtcclxuXHRcdFx0bWVzc2FnZSArPSAnXFxuJztcclxuXHRcdH1cclxuXHJcblx0fVxyXG5cdHJldHVybiBtZXNzYWdlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqXHJcbiAqL1xyXG52YXIgZm9ybWF0RmlsZV8gPSBmdW5jdGlvbihsb2dFdmVudCwgcGFyYW1zKSB7XHJcblx0aWYgKGxvZ0V2ZW50LmZpbGUgPT09IG51bGwpIHtcclxuXHRcdGdldEZpbGVEZXRhaWxzXyhsb2dFdmVudCk7XHJcblx0fVxyXG5cdHJldHVybiBsb2dFdmVudC5maWxlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXHJcbiAqXHJcbiAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dFdmVudFxyXG4gKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSBwYXJhbXNcclxuICpcclxuICogQHJldHVybiB7c3RyaW5nfVxyXG4gKi9cclxudmFyIGZvcm1hdExpbmVOdW1iZXJfID0gZnVuY3Rpb24obG9nRXZlbnQsIHBhcmFtcykge1xyXG5cdGlmIChsb2dFdmVudC5saW5lTnVtYmVyID09PSBudWxsKSB7XHJcblx0XHRnZXRGaWxlRGV0YWlsc18obG9nRXZlbnQpO1xyXG5cdH1cclxuXHRyZXR1cm4gJycgKyBsb2dFdmVudC5saW5lTnVtYmVyO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXHJcbiAqXHJcbiAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dFdmVudFxyXG4gKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSBwYXJhbXNcclxuICpcclxuICogQHJldHVybiB7c3RyaW5nfVxyXG4gKi9cclxudmFyIGZvcm1hdE1hcE1lc3NhZ2VfID0gZnVuY3Rpb24obG9nRXZlbnQsIHBhcmFtcykge1xyXG5cdHZhciBtZXNzYWdlID0gbnVsbDtcclxuXHRpZiAobG9nRXZlbnQucHJvcGVydGllcykge1xyXG5cclxuXHRcdG1lc3NhZ2UgPSBbXTtcclxuXHRcdGZvciAoIHZhciBrZXkgaW4gbG9nRXZlbnQucHJvcGVydGllcykge1xyXG5cdFx0XHRpZiAocGFyYW1zWzBdKSB7XHJcblx0XHRcdFx0aWYgKHBhcmFtc1swXSA9PSBrZXkpIHtcclxuXHRcdFx0XHRcdG1lc3NhZ2UucHVzaChsb2dFdmVudC5wcm9wZXJ0aWVzW2tleV0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRtZXNzYWdlLnB1c2goJ3snICsga2V5ICsgJywnICsgbG9nRXZlbnQucHJvcGVydGllc1trZXldICsgJ30nKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiAneycgKyBtZXNzYWdlLmpvaW4oJywnKSArICd9JztcclxuXHJcblx0fVxyXG5cdHJldHVybiBtZXNzYWdlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXHJcbiAqXHJcbiAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dFdmVudFxyXG4gKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSBwYXJhbXNcclxuICpcclxuICogQHJldHVybiB7c3RyaW5nfVxyXG4gKi9cclxudmFyIGZvcm1hdExvZ01lc3NhZ2VfID0gZnVuY3Rpb24obG9nRXZlbnQsIHBhcmFtcykge1xyXG5cdHJldHVybiBsb2dFdmVudC5tZXNzYWdlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXHJcbiAqXHJcbiAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dFdmVudFxyXG4gKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSBwYXJhbXNcclxuICpcclxuICogQHJldHVybiB7c3RyaW5nfVxyXG4gKi9cclxudmFyIGZvcm1hdE1ldGhvZE5hbWVfID0gZnVuY3Rpb24obG9nRXZlbnQsIHBhcmFtcykge1xyXG5cdHJldHVybiB1dGlsaXR5LmdldEZ1bmN0aW9uTmFtZShsb2dFdmVudC5tZXRob2QpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXHJcbiAqXHJcbiAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dFdmVudFxyXG4gKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSBwYXJhbXNcclxuICpcclxuICogQHJldHVybiB7c3RyaW5nfVxyXG4gKi9cclxudmFyIGZvcm1hdExpbmVTZXBhcmF0b3JfID0gZnVuY3Rpb24obG9nRXZlbnQsIHBhcmFtcykge1xyXG5cdHJldHVybiAnXFxuJztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGZvcm1hdHRlclxyXG4gKlxyXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcclxuICogQHBhcmFtIHtBcnJheS48c3RyaW5nPn0gcGFyYW1zXHJcbiAqXHJcbiAqIEByZXR1cm4ge3N0cmluZ31cclxuICovXHJcbnZhciBmb3JtYXRMZXZlbF8gPSBmdW5jdGlvbihsb2dFdmVudCwgcGFyYW1zKSB7XHJcblx0aWYgKGxvZ0V2ZW50LmxldmVsID09IGxvZ0xldmVsLkZBVEFMKSB7XHJcblx0XHRyZXR1cm4gJ0ZBVEFMJztcclxuXHR9IGVsc2UgaWYgKGxvZ0V2ZW50LmxldmVsID09IGxvZ0xldmVsLkVSUk9SKSB7XHJcblx0XHRyZXR1cm4gJ0VSUk9SJztcclxuXHR9IGVsc2UgaWYgKGxvZ0V2ZW50LmxldmVsID09IGxvZ0xldmVsLldBUk4pIHtcclxuXHRcdHJldHVybiAnV0FSTic7XHJcblx0fSBlbHNlIGlmIChsb2dFdmVudC5sZXZlbCA9PSBsb2dMZXZlbC5JTkZPKSB7XHJcblx0XHRyZXR1cm4gJ0lORk8nO1xyXG5cdH0gZWxzZSBpZiAobG9nRXZlbnQubGV2ZWwgPT0gbG9nTGV2ZWwuREVCVUcpIHtcclxuXHRcdHJldHVybiAnREVCVUcnO1xyXG5cdH0gZWxzZSBpZiAobG9nRXZlbnQubGV2ZWwgPT0gbG9nTGV2ZWwuVFJBQ0UpIHtcclxuXHRcdHJldHVybiAnVFJBQ0UnO1xyXG5cdH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGZvcm1hdHRlclxyXG4gKlxyXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcclxuICogQHBhcmFtIHtBcnJheS48c3RyaW5nPn0gcGFyYW1zXHJcbiAqXHJcbiAqIEByZXR1cm4ge3N0cmluZ31cclxuICovXHJcbnZhciBmb3JtYXRSZWxhdGl2ZV8gPSBmdW5jdGlvbihsb2dFdmVudCwgcGFyYW1zKSB7XHJcblx0cmV0dXJuICcnICsgbG9nRXZlbnQucmVsYXRpdmU7XHJcbn07XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcclxuICpcclxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XHJcbiAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz59IHBhcmFtc1xyXG4gKlxyXG4gKiBAcmV0dXJuIHtzdHJpbmd9XHJcbiAqL1xyXG52YXIgZm9ybWF0U2VxdWVuY2VOdW1iZXJfID0gZnVuY3Rpb24obG9nRXZlbnQsIHBhcmFtcykge1xyXG5cdHJldHVybiAnJyArIGxvZ0V2ZW50LnNlcXVlbmNlO1xyXG59O1xyXG5cclxudmFyIGZvcm1hdHRlcnNfID0ge1xyXG5cdCdjfGxvZ2dlcicgOiBmb3JtYXRMb2dnZXJfLFxyXG5cdCdkfGRhdGUnIDogZm9ybWF0RGF0ZV8sXHJcblx0J2V4fGV4Y2VwdGlvbnx0aHJvd2FibGUnIDogZm9ybWF0RXhjZXB0aW9uXyxcclxuXHQnRnxmaWxlJyA6IGZvcm1hdEZpbGVfLFxyXG5cdCdLfG1hcHxNQVAnIDogZm9ybWF0TWFwTWVzc2FnZV8sXHJcblx0J0x8bGluZScgOiBmb3JtYXRMaW5lTnVtYmVyXyxcclxuXHQnbXxtc2d8bWVzc2FnZScgOiBmb3JtYXRMb2dNZXNzYWdlXyxcclxuXHQnTXxtZXRob2QnIDogZm9ybWF0TWV0aG9kTmFtZV8sXHJcblx0J24nIDogZm9ybWF0TGluZVNlcGFyYXRvcl8sXHJcblx0J3B8bGV2ZWwnIDogZm9ybWF0TGV2ZWxfLFxyXG5cdCdyfHJlbGF0aXZlJyA6IGZvcm1hdFJlbGF0aXZlXyxcclxuXHQnc258c2VxdWVuY2VOdW1iZXInIDogZm9ybWF0U2VxdWVuY2VOdW1iZXJfXHJcbn07XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IGxheW91dFxyXG4gKlxyXG4gKiBAcmV0dXJuIHtzdHJpbmd9XHJcbiAqL1xyXG52YXIgZ2V0Q29tcGlsZWRMYXlvdXRfID0gZnVuY3Rpb24obGF5b3V0KSB7XHJcblxyXG5cdGlmIChjb21waWxlZExheW91dHNfW2xheW91dF0gIT0gdW5kZWZpbmVkKSB7XHJcblx0XHRyZXR1cm4gY29tcGlsZWRMYXlvdXRzX1tsYXlvdXRdO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIGNvbXBpbGVMYXlvdXRfKGxheW91dCk7XHJcblxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBsYXlvdXRcclxuICpcclxuICogQHJldHVybiB7c3RyaW5nfVxyXG4gKi9cclxudmFyIGNvbXBpbGVMYXlvdXRfID0gZnVuY3Rpb24obGF5b3V0KSB7XHJcblxyXG5cdHZhciBpbmRleCA9IGxheW91dC5pbmRleE9mKCclJyk7XHJcblx0dmFyIGN1cnJlbnRGb3JtYXRTdHJpbmcgPSAnJztcclxuXHR2YXIgZm9ybWF0dGVyID0gW107XHJcblxyXG5cdGlmIChpbmRleCAhPSAwKSB7XHJcblx0XHRmb3JtYXR0ZXIucHVzaChsYXlvdXQuc3Vic3RyaW5nKDAsIGluZGV4KSk7XHJcblx0fVxyXG5cclxuXHRkbyB7XHJcblxyXG5cdFx0dmFyIHN0YXJ0SW5kZXggPSBpbmRleDtcclxuXHRcdHZhciBlbmRJbmRleCA9IGluZGV4ID0gbGF5b3V0LmluZGV4T2YoJyUnLCBpbmRleCArIDEpO1xyXG5cclxuXHRcdGlmIChlbmRJbmRleCA8IDApIHtcclxuXHRcdFx0Y3VycmVudEZvcm1hdFN0cmluZyA9IGxheW91dC5zdWJzdHJpbmcoc3RhcnRJbmRleCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRjdXJyZW50Rm9ybWF0U3RyaW5nID0gbGF5b3V0LnN1YnN0cmluZyhzdGFydEluZGV4LCBlbmRJbmRleCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Zm9ybWF0dGVyLnB1c2goZ2V0Rm9ybWF0dGVyT2JqZWN0XyhjdXJyZW50Rm9ybWF0U3RyaW5nKSk7XHJcblxyXG5cdH0gd2hpbGUgKGluZGV4ID4gLTEpO1xyXG5cclxuXHRjb21waWxlZExheW91dHNfW2xheW91dF0gPSBmb3JtYXR0ZXI7XHJcblxyXG5cdHJldHVybiBmb3JtYXR0ZXI7XHJcblxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBmb3JtYXRTdHJpbmdcclxuICpcclxuICogQHJldHVybiB7P3N0cmluZ31cclxuICovXHJcbnZhciBnZXRGb3JtYXR0ZXJPYmplY3RfID0gZnVuY3Rpb24oZm9ybWF0U3RyaW5nKSB7XHJcblxyXG5cdHZhciBjb21tYW5kUmVnZXggPSAvJShbYS16LEEtWl0rKSg/PVxce3wpLztcclxuXHR2YXIgcmVzdWx0ID0gY29tbWFuZFJlZ2V4LmV4ZWMoZm9ybWF0U3RyaW5nKTtcclxuXHRpZiAocmVzdWx0ICE9IG51bGwgJiYgcmVzdWx0Lmxlbmd0aCA9PSAyKSB7XHJcblxyXG5cdFx0dmFyIGZvcm1hdHRlciA9IGdldEZvcm1hdHRlckZ1bmN0aW9uXyhyZXN1bHRbMV0pO1xyXG5cdFx0aWYgKGZvcm1hdHRlciA9PSBudWxsKSB7XHJcblx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBwYXJhbXMgPSBnZXRGb3JtYXR0ZXJQYXJhbXNfKGZvcm1hdFN0cmluZyk7XHJcblxyXG5cdFx0dmFyIGFmdGVyID0gJyc7XHJcblx0XHR2YXIgZW5kSW5kZXggPSBmb3JtYXRTdHJpbmcubGFzdEluZGV4T2YoJ30nKTtcclxuXHRcdGlmIChlbmRJbmRleCAhPSAtMSkge1xyXG5cdFx0XHRhZnRlciA9IGZvcm1hdFN0cmluZy5zdWJzdHJpbmcoZW5kSW5kZXggKyAxKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGFmdGVyID0gZm9ybWF0U3RyaW5nLnN1YnN0cmluZyhyZXN1bHQuaW5kZXggKyByZXN1bHRbMV0ubGVuZ3RoICsgMSk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0Zm9ybWF0dGVyIDogZm9ybWF0dGVyLFxyXG5cdFx0XHRwYXJhbXMgOiBwYXJhbXMsXHJcblx0XHRcdGFmdGVyIDogYWZ0ZXJcclxuXHRcdH07XHJcblxyXG5cdH1cclxuXHJcblx0cmV0dXJuIGZvcm1hdFN0cmluZztcclxuXHJcbn07XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IGNvbW1hbmRcclxuICpcclxuICogQHJldHVybiB7P3N0cmluZ31cclxuICovXHJcbnZhciBnZXRGb3JtYXR0ZXJGdW5jdGlvbl8gPSBmdW5jdGlvbihjb21tYW5kKSB7XHJcblxyXG5cdHZhciByZWdleDtcclxuXHRmb3IgKCB2YXIga2V5IGluIGZvcm1hdHRlcnNfKSB7XHJcblx0XHRyZWdleCA9IG5ldyBSZWdFeHAoJ14nICsga2V5ICsgJyQnKTtcclxuXHRcdGlmIChyZWdleC5leGVjKGNvbW1hbmQpICE9IG51bGwpIHtcclxuXHRcdFx0cmV0dXJuIGZvcm1hdHRlcnNfW2tleV07XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gbnVsbDtcclxuXHJcbn07XHJcblxyXG4vKipcclxuICogQHByaXZhdGVcclxuICogQGZ1bmN0aW9uXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb21tYW5kXHJcbiAqXHJcbiAqIEByZXR1cm4ge3N0cmluZ31cclxuICovXHJcbnZhciBnZXRGb3JtYXR0ZXJQYXJhbXNfID0gZnVuY3Rpb24oY29tbWFuZCkge1xyXG5cclxuXHR2YXIgcGFyYW1zID0gW107XHJcblx0dmFyIHJlc3VsdCA9IGNvbW1hbmQubWF0Y2goL1xceyhbXlxcfV0qKSg/PVxcfSkvZyk7XHJcblx0aWYgKHJlc3VsdCAhPSBudWxsKSB7XHJcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHJlc3VsdC5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRwYXJhbXMucHVzaChyZXN1bHRbaV0uc3Vic3RyaW5nKDEpKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJldHVybiBwYXJhbXM7XHJcblxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBmdW5jdGlvblxyXG4gKlxyXG4gKiBAcGFyYW0ge0FycmF5LjxmdW5jdGlvbnxzdHJpbmc+fSBmb3JtYXR0ZXJcclxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XHJcbiAqXHJcbiAqIEByZXR1cm4ge3N0cmluZ31cclxuICovXHJcbnZhciBmb3JtYXRMb2dFdmVudF8gPSBmdW5jdGlvbihmb3JtYXR0ZXIsIGxvZ0V2ZW50KSB7XHJcblxyXG5cdHZhciByZXNwb25zZTtcclxuXHR2YXIgbWVzc2FnZSA9ICcnO1xyXG5cdHZhciBjb3VudCA9IGZvcm1hdHRlci5sZW5ndGg7XHJcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XHJcblx0XHRpZiAoZm9ybWF0dGVyW2ldICE9PSBudWxsKSB7XHJcblxyXG5cdFx0XHRpZiAoZm9ybWF0dGVyW2ldIGluc3RhbmNlb2YgT2JqZWN0KSB7XHJcblxyXG5cdFx0XHRcdHJlc3BvbnNlID0gZm9ybWF0dGVyW2ldLmZvcm1hdHRlcihsb2dFdmVudCwgZm9ybWF0dGVyW2ldLnBhcmFtcyk7XHJcblx0XHRcdFx0aWYgKHJlc3BvbnNlICE9IG51bGwpIHtcclxuXHRcdFx0XHRcdG1lc3NhZ2UgKz0gcmVzcG9uc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG1lc3NhZ2UgKz0gZm9ybWF0dGVyW2ldLmFmdGVyO1xyXG5cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRtZXNzYWdlICs9IGZvcm1hdHRlcltpXTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJldHVybiBtZXNzYWdlLnRyaW0oKTtcclxuXHJcbn07XHJcblxyXG5mdW5jdGlvbiBnZXRGaWxlRGV0YWlsc18obG9nRXZlbnQpIHtcclxuXHJcblx0aWYgKGxvZ0V2ZW50LmxvZ0Vycm9yU3RhY2sgIT09IHVuZGVmaW5lZCkge1xyXG5cclxuXHRcdGxldCBwYXJ0cyA9IGxvZ0V2ZW50LmxvZ0Vycm9yU3RhY2suc3RhY2suc3BsaXQoL1xcbi9nKTtcclxuXHRcdGxldCBmaWxlID0gcGFydHNbM107XHJcblx0XHRmaWxlID0gZmlsZS5yZXBsYWNlKC9hdCAoLipcXCh8KShmaWxlfGh0dHB8aHR0cHN8KShcXDp8KShcXC98KSovLCAnJyk7XHJcblx0XHRmaWxlID0gZmlsZS5yZXBsYWNlKCcpJywgJycpO1xyXG5cdFx0ZmlsZSA9IGZpbGUucmVwbGFjZSgodHlwZW9mIGxvY2F0aW9uICE9PSAndW5kZWZpbmVkJykgPyBsb2NhdGlvbi5ob3N0IDogJycsICcnKS50cmltKCk7XHJcblxyXG5cdFx0bGV0IGZpbGVQYXJ0cyA9IGZpbGUuc3BsaXQoL1xcOi9nKTtcclxuXHJcblx0XHRsb2dFdmVudC5jb2x1bW4gPSBmaWxlUGFydHMucG9wKCk7XHJcblx0XHRsb2dFdmVudC5saW5lTnVtYmVyID0gZmlsZVBhcnRzLnBvcCgpO1xyXG5cclxuXHRcdGlmICh0eXBlb2YgZGVmaW5lICE9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHRsZXQgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcclxuXHRcdFx0bGV0IGFwcERpciA9IHBhdGguZGlybmFtZShyZXF1aXJlLm1haW4uZmlsZW5hbWUpO1xyXG5cdFx0XHRsb2dFdmVudC5maWxlbmFtZSA9IGZpbGVQYXJ0cy5qb2luKCc6JykucmVwbGFjZShhcHBEaXIsICcnKS5yZXBsYWNlKC8oXFxcXHxcXC8pLywgJycpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0bG9nRXZlbnQuZmlsZW5hbWUgPSBmaWxlUGFydHMuam9pbignOicpO1xyXG5cdFx0fVxyXG5cclxuXHR9IGVsc2Uge1xyXG5cclxuXHRcdGxvZ0V2ZW50LmNvbHVtbiA9ICc/JztcclxuXHRcdGxvZ0V2ZW50LmZpbGVuYW1lID0gJ2Fub255bW91cyc7XHJcblx0XHRsb2dFdmVudC5saW5lTnVtYmVyID0gJz8nO1xyXG5cclxuXHR9XHJcblxyXG59XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IGxheW91dFxyXG4gKlxyXG4gKiBAcmV0dXJuIHtzdHJpbmd9XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gcHJlQ29tcGlsZShsYXlvdXQpIHtcclxuXHRnZXRDb21waWxlZExheW91dF8obGF5b3V0KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBsYXlvdXRcclxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XHJcbiAqXHJcbiAqIEByZXR1cm4ge3N0cmluZ31cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXQobGF5b3V0LCBsb2dFdmVudCkge1xyXG5cdHJldHVybiBmb3JtYXRMb2dFdmVudF8oZ2V0Q29tcGlsZWRMYXlvdXRfKGxheW91dCksIGxvZ0V2ZW50KTtcclxufSJdfQ==


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
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsaXR5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFPLFNBQVMsZUFBZSxDQUFDLElBQUksRUFBRTs7QUFFbEMsUUFBSSxPQUFPLElBQUksS0FBSyxVQUFVLEVBQUU7QUFDNUIsZUFBTyxXQUFXLENBQUM7S0FDdEI7O0FBRUQsUUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQ25DLGdCQUFZLEdBQUcsWUFBWSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDMUQsZ0JBQVksR0FBRyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7O0FBRXBFLFdBQU8sQUFBQyxZQUFZLEtBQUssRUFBRSxHQUFJLFlBQVksR0FBRyxXQUFXLENBQUM7Q0FFN0QiLCJmaWxlIjoidXRpbGl0eS5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBnZXRGdW5jdGlvbk5hbWUoZnVuYykge1xyXG5cclxuICAgIGlmICh0eXBlb2YgZnVuYyAhPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIHJldHVybiAnYW5vbnltb3VzJztcclxuICAgIH1cclxuXHJcbiAgICBsZXQgZnVuY3Rpb25OYW1lID0gZnVuYy50b1N0cmluZygpO1xyXG4gICAgZnVuY3Rpb25OYW1lID0gZnVuY3Rpb25OYW1lLnN1YnN0cmluZygnZnVuY3Rpb24gJy5sZW5ndGgpO1xyXG4gICAgZnVuY3Rpb25OYW1lID0gZnVuY3Rpb25OYW1lLnN1YnN0cmluZygwLCBmdW5jdGlvbk5hbWUuaW5kZXhPZignKCcpKTtcclxuXHJcbiAgICByZXR1cm4gKGZ1bmN0aW9uTmFtZSAhPT0gJycpID8gZnVuY3Rpb25OYW1lIDogJ2Fub255bW91cyc7XHJcblxyXG59Il19


/***/ },
/* 4 */
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
	exports.Logger = Logger;
	// istanbul ignore next

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

	/**
	 * log4js <https://github.com/anigenero/log4js>
	 *
	 * Copyright 2016-present Robin Schultz <http://cunae.com>
	 * Released under the MIT License
	 */

	var _utility = __webpack_require__(3);

	var utility = _interopRequireWildcard(_utility);

	var _constLogLevel = __webpack_require__(4);

	var logLevel = _interopRequireWildcard(_constLogLevel);

	function Logger(context, appenderObj) {

		/** @typeof {number} */
		var relative_ = new Date().getTime();
		/** @typeof {number} */
		var logSequence_ = 1;

		// Get the context
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
	  * @param {Array} args
	  *
	  * @return {LOG_EVENT}
	  */
		function constructLogEvent_(level, args) {

			var logTime = new Date();
			var error = new Error();

			var loggingEvent = {
				date: logTime,
				error: null,
				logErrorStack: error,
				file: null,
				level: level,
				lineNumber: null,
				logger: logContext_,
				message: '',
				method: args.callee.caller,
				properties: undefined,
				relative: logTime.getTime() - relative_,
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

		return this;
	}
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sb2dnZXIvbG9nZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7dUJBT3lCLFlBQVk7O0lBQXpCLE9BQU87OzZCQUNPLG1CQUFtQjs7SUFBakMsUUFBUTs7QUFFYixTQUFTLE1BQU0sQ0FBQyxPQUFPLEVBQUUsV0FBVyxFQUFFOzs7QUFHNUMsS0FBSSxTQUFTLEdBQUcsQUFBQyxJQUFJLElBQUksRUFBRSxDQUFFLE9BQU8sRUFBRSxDQUFDOztBQUV2QyxLQUFJLFlBQVksR0FBRyxDQUFDLENBQUM7OztBQUdyQixLQUFJLE9BQU8sT0FBTyxJQUFJLFFBQVEsRUFBRTs7QUFFL0IsTUFBSSxPQUFPLE9BQU8sSUFBSSxVQUFVLEVBQUU7QUFDakMsVUFBTyxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7R0FDM0MsTUFBTSxJQUFJLE9BQU8sT0FBTyxJQUFJLFFBQVEsRUFBRTtBQUN0QyxVQUFPLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDdkQsT0FBSSxPQUFPLElBQUksUUFBUSxFQUFFO0FBQ3hCLFdBQU8sR0FBRyxXQUFXLENBQUM7SUFDdEI7R0FDRCxNQUFNO0FBQ04sVUFBTyxHQUFHLFdBQVcsQ0FBQztHQUN0QjtFQUVEOzs7QUFHRCxLQUFJLFdBQVcsR0FBRyxPQUFPLENBQUM7Ozs7O0FBSzFCLEtBQUksQ0FBQyxLQUFLLEdBQUcsWUFBVztBQUN2QixhQUFXLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztFQUNsRSxDQUFDOzs7OztBQUtGLEtBQUksQ0FBQyxJQUFJLEdBQUcsWUFBVztBQUN0QixhQUFXLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztFQUNqRSxDQUFDOzs7OztBQUtGLEtBQUksQ0FBQyxJQUFJLEdBQUcsWUFBVztBQUN0QixhQUFXLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztFQUNqRSxDQUFDOzs7OztBQUtGLEtBQUksQ0FBQyxLQUFLLEdBQUcsWUFBVztBQUN2QixhQUFXLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztFQUNsRSxDQUFDOzs7OztBQUtGLEtBQUksQ0FBQyxLQUFLLEdBQUcsWUFBVztBQUN2QixhQUFXLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztFQUNsRSxDQUFDOzs7Ozs7Ozs7O0FBVUYsVUFBUyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFOztBQUV4QyxNQUFJLE9BQU8sR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO0FBQ3pCLE1BQUksS0FBSyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7O0FBRXhCLE1BQUksWUFBWSxHQUFHO0FBQ2xCLE9BQUksRUFBRyxPQUFPO0FBQ2QsUUFBSyxFQUFHLElBQUk7QUFDWixnQkFBYSxFQUFHLEtBQUs7QUFDckIsT0FBSSxFQUFHLElBQUk7QUFDWCxRQUFLLEVBQUcsS0FBSztBQUNiLGFBQVUsRUFBRyxJQUFJO0FBQ2pCLFNBQU0sRUFBRyxXQUFXO0FBQ3BCLFVBQU8sRUFBRyxFQUFFO0FBQ1osU0FBTSxFQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTTtBQUMzQixhQUFVLEVBQUcsU0FBUztBQUN0QixXQUFRLEVBQUcsT0FBTyxDQUFDLE9BQU8sRUFBRSxHQUFHLFNBQVM7QUFDeEMsV0FBUSxFQUFHLFlBQVksRUFBRTtHQUN6QixDQUFDOztBQUVGLE1BQUksWUFBWSxHQUFHLENBQUMsQ0FBQztBQUNyQixPQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTs7QUFFckMsT0FBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQ1osZ0JBQVksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLFFBQUksS0FBSyxHQUFHLEFBQUMsT0FBTyxDQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDakQsZ0JBQVksR0FBRyxBQUFDLEtBQUssWUFBWSxLQUFLLEdBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDM0QsTUFBTSxJQUFJLFlBQVksR0FBRyxDQUFDLEVBQUU7QUFDNUIsZ0JBQVksQ0FBQyxPQUFPLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JFLGdCQUFZLEVBQUUsQ0FBQztJQUNmLE1BQU0sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLFlBQVksS0FBSyxFQUFFO0FBQ3BDLGdCQUFZLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM3QixNQUFNO0FBQ04sZ0JBQVksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xDO0dBRUQ7O0FBRUQsU0FBTyxZQUFZLENBQUM7RUFFcEI7O0FBRUQsUUFBTyxJQUFJLENBQUM7Q0FFWiIsImZpbGUiOiJsb2dnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogbG9nNGpzIDxodHRwczovL2dpdGh1Yi5jb20vYW5pZ2VuZXJvL2xvZzRqcz5cclxuICpcclxuICogQ29weXJpZ2h0IDIwMTYtcHJlc2VudCBSb2JpbiBTY2h1bHR6IDxodHRwOi8vY3VuYWUuY29tPlxyXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2VcclxuICovXHJcblxyXG5pbXBvcnQgKiBhcyB1dGlsaXR5IGZyb20gJy4uL3V0aWxpdHknO1xyXG5pbXBvcnQgKiBhcyBsb2dMZXZlbCBmcm9tICcuLi9jb25zdC9sb2dMZXZlbCc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gTG9nZ2VyKGNvbnRleHQsIGFwcGVuZGVyT2JqKSB7XHJcblxyXG5cdC8qKiBAdHlwZW9mIHtudW1iZXJ9ICovXHJcblx0bGV0IHJlbGF0aXZlXyA9IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7XHJcblx0LyoqIEB0eXBlb2Yge251bWJlcn0gKi9cclxuXHRsZXQgbG9nU2VxdWVuY2VfID0gMTtcclxuXHJcblx0Ly8gR2V0IHRoZSBjb250ZXh0XHJcblx0aWYgKHR5cGVvZiBjb250ZXh0ICE9ICdzdHJpbmcnKSB7XHJcblxyXG5cdFx0aWYgKHR5cGVvZiBjb250ZXh0ID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0Y29udGV4dCA9IHV0aWxpdHkuZ2V0RnVuY3Rpb25OYW1lKGNvbnRleHQpO1xyXG5cdFx0fSBlbHNlIGlmICh0eXBlb2YgY29udGV4dCA9PSAnb2JqZWN0Jykge1xyXG5cdFx0XHRjb250ZXh0ID0gdXRpbGl0eS5nZXRGdW5jdGlvbk5hbWUoY29udGV4dC5jb25zdHJ1Y3Rvcik7XHJcblx0XHRcdGlmIChjb250ZXh0ID09ICdPYmplY3QnKSB7XHJcblx0XHRcdFx0Y29udGV4dCA9ICdhbm9ueW1vdXMnO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRjb250ZXh0ID0gJ2Fub255bW91cyc7XHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblx0LyoqIEB0eXBlIHtzdHJpbmd9ICovXHJcblx0bGV0IGxvZ0NvbnRleHRfID0gY29udGV4dDtcclxuXHJcblx0LyoqXHJcblx0ICogTG9ncyBhbiBlcnJvciBldmVudFxyXG5cdCAqL1xyXG5cdHRoaXMuZXJyb3IgPSBmdW5jdGlvbigpIHtcclxuXHRcdGFwcGVuZGVyT2JqLmFwcGVuZChjb25zdHJ1Y3RMb2dFdmVudF8obG9nTGV2ZWwuRVJST1IsIGFyZ3VtZW50cykpO1xyXG5cdH07XHJcblxyXG5cdC8qKlxyXG5cdCAqIExvZ3MgYSB3YXJuaW5nXHJcblx0ICovXHJcblx0dGhpcy53YXJuID0gZnVuY3Rpb24oKSB7XHJcblx0XHRhcHBlbmRlck9iai5hcHBlbmQoY29uc3RydWN0TG9nRXZlbnRfKGxvZ0xldmVsLldBUk4sIGFyZ3VtZW50cykpO1xyXG5cdH07XHJcblxyXG5cdC8qKlxyXG5cdCAqIExvZ3MgYW4gaW5mbyBsZXZlbCBldmVudFxyXG5cdCAqL1xyXG5cdHRoaXMuaW5mbyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0YXBwZW5kZXJPYmouYXBwZW5kKGNvbnN0cnVjdExvZ0V2ZW50Xyhsb2dMZXZlbC5JTkZPLCBhcmd1bWVudHMpKTtcclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBMb2dzIGEgZGVidWcgZXZlbnRcclxuXHQgKi9cclxuXHR0aGlzLmRlYnVnID0gZnVuY3Rpb24oKSB7XHJcblx0XHRhcHBlbmRlck9iai5hcHBlbmQoY29uc3RydWN0TG9nRXZlbnRfKGxvZ0xldmVsLkRFQlVHLCBhcmd1bWVudHMpKTtcclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBMb2dzIGEgdHJhY2UgZXZlbnRcclxuXHQgKi9cclxuXHR0aGlzLnRyYWNlID0gZnVuY3Rpb24oKSB7XHJcblx0XHRhcHBlbmRlck9iai5hcHBlbmQoY29uc3RydWN0TG9nRXZlbnRfKGxvZ0xldmVsLlRSQUNFLCBhcmd1bWVudHMpKTtcclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBAZnVuY3Rpb25cclxuXHQgKlxyXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBsZXZlbFxyXG5cdCAqIEBwYXJhbSB7QXJyYXl9IGFyZ3NcclxuXHQgKlxyXG5cdCAqIEByZXR1cm4ge0xPR19FVkVOVH1cclxuXHQgKi9cclxuXHRmdW5jdGlvbiBjb25zdHJ1Y3RMb2dFdmVudF8obGV2ZWwsIGFyZ3MpIHtcclxuXHJcblx0XHRsZXQgbG9nVGltZSA9IG5ldyBEYXRlKCk7XHJcblx0XHRsZXQgZXJyb3IgPSBuZXcgRXJyb3IoKTtcclxuXHJcblx0XHRsZXQgbG9nZ2luZ0V2ZW50ID0ge1xyXG5cdFx0XHRkYXRlIDogbG9nVGltZSxcclxuXHRcdFx0ZXJyb3IgOiBudWxsLFxyXG5cdFx0XHRsb2dFcnJvclN0YWNrIDogZXJyb3IsXHJcblx0XHRcdGZpbGUgOiBudWxsLFxyXG5cdFx0XHRsZXZlbCA6IGxldmVsLFxyXG5cdFx0XHRsaW5lTnVtYmVyIDogbnVsbCxcclxuXHRcdFx0bG9nZ2VyIDogbG9nQ29udGV4dF8sXHJcblx0XHRcdG1lc3NhZ2UgOiAnJyxcclxuXHRcdFx0bWV0aG9kIDogYXJncy5jYWxsZWUuY2FsbGVyLFxyXG5cdFx0XHRwcm9wZXJ0aWVzIDogdW5kZWZpbmVkLFxyXG5cdFx0XHRyZWxhdGl2ZSA6IGxvZ1RpbWUuZ2V0VGltZSgpIC0gcmVsYXRpdmVfLFxyXG5cdFx0XHRzZXF1ZW5jZSA6IGxvZ1NlcXVlbmNlXysrXHJcblx0XHR9O1xyXG5cclxuXHRcdGxldCBtZXNzYWdlU3R1YnMgPSAwO1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XHJcblxyXG5cdFx0XHRpZiAoaSA9PT0gMCkge1xyXG5cdFx0XHRcdGxvZ2dpbmdFdmVudC5tZXNzYWdlID0gYXJnc1tpXTtcclxuXHRcdFx0XHRsZXQgc3R1YnMgPSAoL1xce1xcfS9nKS5leGVjKGxvZ2dpbmdFdmVudC5tZXNzYWdlKTtcclxuXHRcdFx0XHRtZXNzYWdlU3R1YnMgPSAoc3R1YnMgaW5zdGFuY2VvZiBBcnJheSkgPyBzdHVicy5sZW5ndGggOiAwO1xyXG5cdFx0XHR9IGVsc2UgaWYgKG1lc3NhZ2VTdHVicyA+IDApIHtcclxuXHRcdFx0XHRsb2dnaW5nRXZlbnQubWVzc2FnZSA9IGxvZ2dpbmdFdmVudC5tZXNzYWdlLnJlcGxhY2UoL1xce1xcfS8sIGFyZ3NbaV0pO1xyXG5cdFx0XHRcdG1lc3NhZ2VTdHVicy0tO1xyXG5cdFx0XHR9IGVsc2UgaWYgKGFyZ3NbaV0gaW5zdGFuY2VvZiBFcnJvcikge1xyXG5cdFx0XHRcdGxvZ2dpbmdFdmVudC5lcnJvciA9IGFyZ3NbaV07XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0bG9nZ2luZ0V2ZW50LnByb3BlcnRpZXMgPSBhcmdzW2ldO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBsb2dnaW5nRXZlbnQ7XHJcblxyXG5cdH1cclxuXHJcblx0cmV0dXJuIHRoaXM7XHJcblxyXG59XHJcbiJdfQ==


/***/ },
/* 8 */
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

	var _constLogLevel = __webpack_require__(4);

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