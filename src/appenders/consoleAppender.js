/**
 * log4js <https://github.com/anigenero/log4js>
 *
 * Copyright 2016-present Robin Schultz <http://cunae.com>
 * Released under the MIT License
 */

import * as LogLevel from '../const/logLevel';
import * as formatter from '../formatter';

export function ConsoleAppender() {

	/** @type {string} */
	let tagLayout_ = '%m';
	/** @type {number} */
	let logLevel_ = LogLevel.INFO;

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

		let message = formatter.format(tagLayout_, loggingEvent);

		if (loggingEvent.level == LogLevel.ERROR) {
			console.error(message);
		} else if (loggingEvent.level == LogLevel.WARN) {
			console.warn(message);
		} else if (loggingEvent.level == LogLevel.INFO) {
			console.info(message);
		} else if (loggingEvent.level == LogLevel.DEBUG ||
			loggingEvent.level == LogLevel.TRACE) {
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
		return (level <= logLevel_);
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
		append : append,
		getName : getName,
		isActive : isActive,
		getLogLevel : getLogLevel,
		setLogLevel : setLogLevel,
		setTagLayout : setTagLayout
	};

}
