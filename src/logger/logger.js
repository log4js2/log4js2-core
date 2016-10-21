/**
 * log4js <https://github.com/anigenero/log4js>
 *
 * Copyright 2016-present Robin Schultz <http://anigenero.com>
 * Released under the MIT License
 */

import {LogLevel} from '../const/logLevel';

/**
 * Holds the definition for the log event object
 *
 * @typedef {{ date : number, error : Object, filename: string, lineNumber: ?string, column: ?string,
 *      logErrorStack : Object, file : String, level : number, logger : string, message : string,
 *      method : Function, properties : Object=, relative : number, sequence : number }}
 */
let LOG_EVENT;

export function Logger(context, appenderObj) {

    /** @type {string} */
    let _logContext = context;
    /** @typeof {number} */
    let _logSequence = 1;
	/** @typeof {number} */
	let _relative = (new Date()).getTime();

	/**
	 * Logs an error event
     *
     * @function
     * @memberOf Logger
	 */
	this.error = function () {
		appenderObj.append(_constructLogEvent(LogLevel.ERROR, arguments));
	};

	/**
	 * Logs a warning
     *
     * @function
     * @memberOf Logger
	 */
	this.warn = function () {
		appenderObj.append(_constructLogEvent(LogLevel.WARN, arguments));
	};

	/**
	 * Logs an info level event
     *
     * @function
     * @memberOf Logger
	 */
	this.info = function () {
		appenderObj.append(_constructLogEvent(LogLevel.INFO, arguments));
	};

	/**
	 * Logs a debug event
     *
     * @function
     * @memberOf Logger
	 */
	this.debug = function () {
		appenderObj.append(_constructLogEvent(LogLevel.DEBUG, arguments));
	};

	/**
	 * Logs a trace event
     *
     * @function
     * @memberOf Logger
	 */
	this.trace = function () {
		appenderObj.append(_constructLogEvent(LogLevel.TRACE, arguments));
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
			'date' : logTime,
			'error' : null,
			'logErrorStack' : error,
			'file' : null,
			'level' : level,
			'lineNumber' : null,
			'logger' : _logContext,
			'message' : '',
			'method' : !_isStrict() ? args.callee.caller : 0,
			'properties' : undefined,
			'relative' : logTime.getTime() - _relative,
			'sequence' : _logSequence++
		};

		let messageStubs = 0;
		for (let i = 0; i < args.length; i++) {

			if (i === 0) {
				loggingEvent.message = args[i];
				let stubs = (/\{}/g).exec(loggingEvent.message);
				messageStubs = (stubs instanceof Array) ? stubs.length : 0;
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
	let _isStrict = function () {
        return !this;
    };

	return this;

}
