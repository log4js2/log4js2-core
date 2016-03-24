import * as formatter from './formatter';
import { Logger } from './logger/logger';
import * as LogLevel from './const/logLevel';

import * as consoleAppender from './appenders/consoleAppender';

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

export {LogLevel};

/**
 * Configures the logger
 *
 * @function
 *
 * @params {CONFIG_PARAMS} config
 */
export function configure(config) {

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

var configureAppenders_ = function (appenders, callback) {

	if (!(typeof define != 'undefined' && define.amd != undefined) && !(typeof module != 'undefined' && module.exports)) {
		return;
	}

	if (appenders instanceof Array) {
		var count = appenders.length;
		for (var i = 0; i < count; i++) {
			callback();
		}
	}

};

var configureLoggers_ = function (loggers) {

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

var getLoggers_ = function (logLevel) {

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
export function addAppender(appender) {

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
var validateAppender_ = function (appender) {

	if (appender == null || typeof appender !== 'function') {
		throw new Error('Invalid appender: not an function');
	}

	var appenderObj = appender();

	var appenderMethods = ['append', 'getName', 'isActive', 'setLogLevel', 'setTagLayout'];
	for (var key in appenderMethods) {
		if (appenderObj[appenderMethods[key]] == undefined ||
			typeof appenderObj[appenderMethods[key]] != 'function') {
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
export function append(loggingEvent) {

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
var validateLevel_ = function (level) {
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
var finalizeConfiguration_ = function () {
	finalized_ = true;
};

/**
 * Gets the application information from the configuration
 * @return {Object}
 */
export function getApplicationInfo() {
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
export function getLogger(context) {
	return Logger(context, {
		append: append
	});
}

/**
 * Sets the log level for all loggers
 * @param {number} logLevel
 */
export function setLogLevel(logLevel) {
	validateLevel_(logLevel);
	for (var logKey in loggers_) {
		for (var key in loggers_[logKey]) {
			loggers_[logKey][key].setLogLevel(logLevel);
		}
	}
}

addAppender(consoleAppender.ConsoleAppender);