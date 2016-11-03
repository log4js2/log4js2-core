/*istanbul ignore next*/'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Logger = Logger;

var /*istanbul ignore next*/_logLevel = require('../const/logLevel');

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
//# sourceMappingURL=data:application/json;base64,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QkFBYSxVQUFiLEdBQTBCLEtBQUssQ0FBTCxDQUExQixDQURNO0lBRkE7R0FUUjs7QUFpQkEsU0FBTyxZQUFQLENBN0N3QztFQUF6Qzs7Ozs7Ozs7OztBQW5FNEMsS0E0SHhDLFlBQVksWUFBWTtBQUNyQixTQUFPLENBQUMsSUFBRCxDQURjO0VBQVosQ0E1SDRCOztBQWdJNUMsUUFBTyxJQUFQLENBaEk0QztDQUF0QyIsImZpbGUiOiJsb2dnZXJcXGxvZ2dlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBsb2c0anMgPGh0dHBzOi8vZ2l0aHViLmNvbS9hbmlnZW5lcm8vbG9nNGpzPlxyXG4gKlxyXG4gKiBDb3B5cmlnaHQgMjAxNi1wcmVzZW50IFJvYmluIFNjaHVsdHogPGh0dHA6Ly9hbmlnZW5lcm8uY29tPlxyXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2VcclxuICovXHJcblxyXG5pbXBvcnQge0xvZ0xldmVsfSBmcm9tICcuLi9jb25zdC9sb2dMZXZlbCc7XHJcblxyXG4vKipcclxuICogSG9sZHMgdGhlIGRlZmluaXRpb24gZm9yIHRoZSBsb2cgZXZlbnQgb2JqZWN0XHJcbiAqXHJcbiAqIEB0eXBlZGVmIHt7IGRhdGUgOiBudW1iZXIsIGVycm9yIDogT2JqZWN0LCBmaWxlbmFtZTogc3RyaW5nLCBsaW5lTnVtYmVyOiA/c3RyaW5nLCBjb2x1bW46ID9zdHJpbmcsXHJcbiAqICAgICAgbG9nRXJyb3JTdGFjayA6IE9iamVjdCwgZmlsZSA6IFN0cmluZywgbGV2ZWwgOiBudW1iZXIsIGxvZ2dlciA6IHN0cmluZywgbWVzc2FnZSA6IHN0cmluZyxcclxuICogICAgICBtZXRob2QgOiBGdW5jdGlvbiwgcHJvcGVydGllcyA6IE9iamVjdD0sIHJlbGF0aXZlIDogbnVtYmVyLCBzZXF1ZW5jZSA6IG51bWJlciB9fVxyXG4gKi9cclxubGV0IExPR19FVkVOVDtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBMb2dnZXIoY29udGV4dCwgYXBwZW5kZXJPYmopIHtcclxuXHJcbiAgICAvKiogQHR5cGUge3N0cmluZ30gKi9cclxuICAgIGxldCBfbG9nQ29udGV4dCA9IGNvbnRleHQ7XHJcbiAgICAvKiogQHR5cGVvZiB7bnVtYmVyfSAqL1xyXG4gICAgbGV0IF9sb2dTZXF1ZW5jZSA9IDE7XHJcblx0LyoqIEB0eXBlb2Yge251bWJlcn0gKi9cclxuXHRsZXQgX3JlbGF0aXZlID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKTtcclxuXHJcblx0LyoqXHJcblx0ICogTG9ncyBhbiBlcnJvciBldmVudFxyXG4gICAgICpcclxuICAgICAqIEBmdW5jdGlvblxyXG4gICAgICogQG1lbWJlck9mIExvZ2dlclxyXG5cdCAqL1xyXG5cdHRoaXMuZXJyb3IgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRhcHBlbmRlck9iai5hcHBlbmQoX2NvbnN0cnVjdExvZ0V2ZW50KExvZ0xldmVsLkVSUk9SLCBhcmd1bWVudHMpKTtcclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBMb2dzIGEgd2FybmluZ1xyXG4gICAgICpcclxuICAgICAqIEBmdW5jdGlvblxyXG4gICAgICogQG1lbWJlck9mIExvZ2dlclxyXG5cdCAqL1xyXG5cdHRoaXMud2FybiA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdGFwcGVuZGVyT2JqLmFwcGVuZChfY29uc3RydWN0TG9nRXZlbnQoTG9nTGV2ZWwuV0FSTiwgYXJndW1lbnRzKSk7XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogTG9ncyBhbiBpbmZvIGxldmVsIGV2ZW50XHJcbiAgICAgKlxyXG4gICAgICogQGZ1bmN0aW9uXHJcbiAgICAgKiBAbWVtYmVyT2YgTG9nZ2VyXHJcblx0ICovXHJcblx0dGhpcy5pbmZvID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0YXBwZW5kZXJPYmouYXBwZW5kKF9jb25zdHJ1Y3RMb2dFdmVudChMb2dMZXZlbC5JTkZPLCBhcmd1bWVudHMpKTtcclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBMb2dzIGEgZGVidWcgZXZlbnRcclxuICAgICAqXHJcbiAgICAgKiBAZnVuY3Rpb25cclxuICAgICAqIEBtZW1iZXJPZiBMb2dnZXJcclxuXHQgKi9cclxuXHR0aGlzLmRlYnVnID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0YXBwZW5kZXJPYmouYXBwZW5kKF9jb25zdHJ1Y3RMb2dFdmVudChMb2dMZXZlbC5ERUJVRywgYXJndW1lbnRzKSk7XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogTG9ncyBhIHRyYWNlIGV2ZW50XHJcbiAgICAgKlxyXG4gICAgICogQGZ1bmN0aW9uXHJcbiAgICAgKiBAbWVtYmVyT2YgTG9nZ2VyXHJcblx0ICovXHJcblx0dGhpcy50cmFjZSA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdGFwcGVuZGVyT2JqLmFwcGVuZChfY29uc3RydWN0TG9nRXZlbnQoTG9nTGV2ZWwuVFJBQ0UsIGFyZ3VtZW50cykpO1xyXG5cdH07XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBmdW5jdGlvblxyXG5cdCAqXHJcblx0ICogQHBhcmFtIHtudW1iZXJ9IGxldmVsXHJcblx0ICogQHBhcmFtIHtBcnJheS48T2JqZWN0Pn0gYXJnc1xyXG5cdCAqXHJcblx0ICogQHJldHVybiB7TE9HX0VWRU5UfVxyXG5cdCAqL1xyXG5cdGZ1bmN0aW9uIF9jb25zdHJ1Y3RMb2dFdmVudChsZXZlbCwgYXJncykge1xyXG5cclxuXHRcdGxldCBsb2dUaW1lID0gbmV3IERhdGUoKTtcclxuXHRcdGxldCBlcnJvciA9IG51bGw7XHJcblxyXG5cdFx0Ly8gdGhpcyBsb29rcyBob3JyaWJsZSwgYnV0IHRoaXMgaXMgdGhlIG9ubHkgd2F5IHRvIGNhdGNoIHRoZSBzdGFjayBmb3IgSUUgdG8gbGF0ZXIgcGFyc2UgdGhlIHN0YWNrXHJcblx0XHR0cnkge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoKTtcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0ZXJyb3IgPSBlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBsb2dnaW5nRXZlbnQgPSB7XHJcblx0XHRcdCdkYXRlJyA6IGxvZ1RpbWUsXHJcblx0XHRcdCdlcnJvcicgOiBudWxsLFxyXG5cdFx0XHQnbG9nRXJyb3JTdGFjaycgOiBlcnJvcixcclxuXHRcdFx0J2ZpbGUnIDogbnVsbCxcclxuXHRcdFx0J2xldmVsJyA6IGxldmVsLFxyXG5cdFx0XHQnbGluZU51bWJlcicgOiBudWxsLFxyXG5cdFx0XHQnbG9nZ2VyJyA6IF9sb2dDb250ZXh0LFxyXG5cdFx0XHQnbWVzc2FnZScgOiAnJyxcclxuXHRcdFx0J21ldGhvZCcgOiAhX2lzU3RyaWN0KCkgPyBhcmdzLmNhbGxlZS5jYWxsZXIgOiAwLFxyXG5cdFx0XHQncHJvcGVydGllcycgOiB1bmRlZmluZWQsXHJcblx0XHRcdCdyZWxhdGl2ZScgOiBsb2dUaW1lLmdldFRpbWUoKSAtIF9yZWxhdGl2ZSxcclxuXHRcdFx0J3NlcXVlbmNlJyA6IF9sb2dTZXF1ZW5jZSsrXHJcblx0XHR9O1xyXG5cclxuXHRcdGxldCBtZXNzYWdlU3R1YnMgPSAwO1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XHJcblxyXG5cdFx0XHRpZiAoaSA9PT0gMCkge1xyXG5cdFx0XHRcdGxvZ2dpbmdFdmVudC5tZXNzYWdlID0gYXJnc1tpXTtcclxuXHRcdFx0XHRsZXQgc3R1YnMgPSAoL1xce30vZykuZXhlYyhsb2dnaW5nRXZlbnQubWVzc2FnZSk7XHJcblx0XHRcdFx0bWVzc2FnZVN0dWJzID0gKHN0dWJzIGluc3RhbmNlb2YgQXJyYXkpID8gc3R1YnMubGVuZ3RoIDogMDtcclxuXHRcdFx0fSBlbHNlIGlmIChtZXNzYWdlU3R1YnMgPiAwKSB7XHJcblx0XHRcdFx0bG9nZ2luZ0V2ZW50Lm1lc3NhZ2UgPSBsb2dnaW5nRXZlbnQubWVzc2FnZS5yZXBsYWNlKC9cXHt9LywgYXJnc1tpXSk7XHJcblx0XHRcdFx0bWVzc2FnZVN0dWJzLS07XHJcblx0XHRcdH0gZWxzZSBpZiAoYXJnc1tpXSBpbnN0YW5jZW9mIEVycm9yKSB7XHJcblx0XHRcdFx0bG9nZ2luZ0V2ZW50LmVycm9yID0gYXJnc1tpXTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRsb2dnaW5nRXZlbnQucHJvcGVydGllcyA9IGFyZ3NbaV07XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGxvZ2dpbmdFdmVudDtcclxuXHJcblx0fVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgc2NyaXB0IGlzIGluIHN0cmljdCBtb2RlXHJcbiAgICAgKlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEBmdW5jdGlvblxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAgICovXHJcblx0bGV0IF9pc1N0cmljdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gIXRoaXM7XHJcbiAgICB9O1xyXG5cclxuXHRyZXR1cm4gdGhpcztcclxuXHJcbn1cclxuIl19