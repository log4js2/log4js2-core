/*istanbul ignore next*/'use strict';

exports.__esModule = true;
exports.Logger = Logger;

var /*istanbul ignore next*/_logLevel = require('../const/logLevel');

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
//# sourceMappingURL=data:application/json;base64,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QUFhLFVBQWIsR0FBMEIsS0FBSyxDQUFMLENBQTFCLENBRE07SUFGQTtHQVRSOztBQWlCQSxTQUFPLFlBQVAsQ0E3Q3dDO0VBQXpDOzs7Ozs7Ozs7O0FBbkU0QyxLQTRIeEMsWUFBWSxTQUFaLFNBQVksR0FBWTtBQUNyQixTQUFPLENBQUMsSUFBRCxDQURjO0VBQVosQ0E1SDRCOztBQWdJNUMsUUFBTyxJQUFQLENBaEk0QztDQUF0QyIsImZpbGUiOiJsb2dnZXJcXGxvZ2dlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBsb2c0anMgPGh0dHBzOi8vZ2l0aHViLmNvbS9hbmlnZW5lcm8vbG9nNGpzPlxyXG4gKlxyXG4gKiBDb3B5cmlnaHQgMjAxNi1wcmVzZW50IFJvYmluIFNjaHVsdHogPGh0dHA6Ly9hbmlnZW5lcm8uY29tPlxyXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2VcclxuICovXHJcblxyXG5pbXBvcnQge0xvZ0xldmVsfSBmcm9tICcuLi9jb25zdC9sb2dMZXZlbCc7XHJcblxyXG4vKipcclxuICogSG9sZHMgdGhlIGRlZmluaXRpb24gZm9yIHRoZSBsb2cgZXZlbnQgb2JqZWN0XHJcbiAqXHJcbiAqIEB0eXBlZGVmIHt7IGRhdGUgOiBudW1iZXIsIGVycm9yIDogT2JqZWN0LCBmaWxlbmFtZTogc3RyaW5nLCBsaW5lTnVtYmVyOiA/c3RyaW5nLCBjb2x1bW46ID9zdHJpbmcsXHJcbiAqICAgICAgbG9nRXJyb3JTdGFjayA6IE9iamVjdCwgZmlsZSA6IFN0cmluZywgbGV2ZWwgOiBudW1iZXIsIGxvZ2dlciA6IHN0cmluZywgbWVzc2FnZSA6IHN0cmluZyxcclxuICogICAgICBtZXRob2QgOiBGdW5jdGlvbiwgcHJvcGVydGllcyA6IE9iamVjdD0sIHJlbGF0aXZlIDogbnVtYmVyLCBzZXF1ZW5jZSA6IG51bWJlciB9fVxyXG4gKi9cclxubGV0IExPR19FVkVOVDtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBMb2dnZXIoY29udGV4dCwgYXBwZW5kZXJPYmopIHtcclxuXHJcbiAgICAvKiogQHR5cGUge3N0cmluZ30gKi9cclxuICAgIGxldCBfbG9nQ29udGV4dCA9IGNvbnRleHQ7XHJcbiAgICAvKiogQHR5cGVvZiB7bnVtYmVyfSAqL1xyXG4gICAgbGV0IF9sb2dTZXF1ZW5jZSA9IDE7XHJcblx0LyoqIEB0eXBlb2Yge251bWJlcn0gKi9cclxuXHRsZXQgX3JlbGF0aXZlID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKTtcclxuXHJcblx0LyoqXHJcblx0ICogTG9ncyBhbiBlcnJvciBldmVudFxyXG4gICAgICpcclxuICAgICAqIEBmdW5jdGlvblxyXG4gICAgICogQG1lbWJlck9mIExvZ2dlclxyXG5cdCAqL1xyXG5cdHRoaXMuZXJyb3IgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRhcHBlbmRlck9iai5hcHBlbmQoX2NvbnN0cnVjdExvZ0V2ZW50KExvZ0xldmVsLkVSUk9SLCBhcmd1bWVudHMpKTtcclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBMb2dzIGEgd2FybmluZ1xyXG4gICAgICpcclxuICAgICAqIEBmdW5jdGlvblxyXG4gICAgICogQG1lbWJlck9mIExvZ2dlclxyXG5cdCAqL1xyXG5cdHRoaXMud2FybiA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdGFwcGVuZGVyT2JqLmFwcGVuZChfY29uc3RydWN0TG9nRXZlbnQoTG9nTGV2ZWwuV0FSTiwgYXJndW1lbnRzKSk7XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogTG9ncyBhbiBpbmZvIGxldmVsIGV2ZW50XHJcbiAgICAgKlxyXG4gICAgICogQGZ1bmN0aW9uXHJcbiAgICAgKiBAbWVtYmVyT2YgTG9nZ2VyXHJcblx0ICovXHJcblx0dGhpcy5pbmZvID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0YXBwZW5kZXJPYmouYXBwZW5kKF9jb25zdHJ1Y3RMb2dFdmVudChMb2dMZXZlbC5JTkZPLCBhcmd1bWVudHMpKTtcclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBMb2dzIGEgZGVidWcgZXZlbnRcclxuICAgICAqXHJcbiAgICAgKiBAZnVuY3Rpb25cclxuICAgICAqIEBtZW1iZXJPZiBMb2dnZXJcclxuXHQgKi9cclxuXHR0aGlzLmRlYnVnID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0YXBwZW5kZXJPYmouYXBwZW5kKF9jb25zdHJ1Y3RMb2dFdmVudChMb2dMZXZlbC5ERUJVRywgYXJndW1lbnRzKSk7XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogTG9ncyBhIHRyYWNlIGV2ZW50XHJcbiAgICAgKlxyXG4gICAgICogQGZ1bmN0aW9uXHJcbiAgICAgKiBAbWVtYmVyT2YgTG9nZ2VyXHJcblx0ICovXHJcblx0dGhpcy50cmFjZSA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdGFwcGVuZGVyT2JqLmFwcGVuZChfY29uc3RydWN0TG9nRXZlbnQoTG9nTGV2ZWwuVFJBQ0UsIGFyZ3VtZW50cykpO1xyXG5cdH07XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBmdW5jdGlvblxyXG5cdCAqXHJcblx0ICogQHBhcmFtIHtudW1iZXJ9IGxldmVsXHJcblx0ICogQHBhcmFtIHtBcnJheS48T2JqZWN0Pn0gYXJnc1xyXG5cdCAqXHJcblx0ICogQHJldHVybiB7TE9HX0VWRU5UfVxyXG5cdCAqL1xyXG5cdGZ1bmN0aW9uIF9jb25zdHJ1Y3RMb2dFdmVudChsZXZlbCwgYXJncykge1xyXG5cclxuXHRcdGxldCBsb2dUaW1lID0gbmV3IERhdGUoKTtcclxuXHRcdGxldCBlcnJvciA9IG51bGw7XHJcblxyXG5cdFx0Ly8gdGhpcyBsb29rcyBob3JyaWJsZSwgYnV0IHRoaXMgaXMgdGhlIG9ubHkgd2F5IHRvIGNhdGNoIHRoZSBzdGFjayBmb3IgSUUgdG8gbGF0ZXIgcGFyc2UgdGhlIHN0YWNrXHJcblx0XHR0cnkge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoKTtcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0ZXJyb3IgPSBlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBsb2dnaW5nRXZlbnQgPSB7XHJcblx0XHRcdCdkYXRlJyA6IGxvZ1RpbWUsXHJcblx0XHRcdCdlcnJvcicgOiBudWxsLFxyXG5cdFx0XHQnbG9nRXJyb3JTdGFjaycgOiBlcnJvcixcclxuXHRcdFx0J2ZpbGUnIDogbnVsbCxcclxuXHRcdFx0J2xldmVsJyA6IGxldmVsLFxyXG5cdFx0XHQnbGluZU51bWJlcicgOiBudWxsLFxyXG5cdFx0XHQnbG9nZ2VyJyA6IF9sb2dDb250ZXh0LFxyXG5cdFx0XHQnbWVzc2FnZScgOiAnJyxcclxuXHRcdFx0J21ldGhvZCcgOiAhX2lzU3RyaWN0KCkgPyBhcmdzLmNhbGxlZS5jYWxsZXIgOiAwLFxyXG5cdFx0XHQncHJvcGVydGllcycgOiB1bmRlZmluZWQsXHJcblx0XHRcdCdyZWxhdGl2ZScgOiBsb2dUaW1lLmdldFRpbWUoKSAtIF9yZWxhdGl2ZSxcclxuXHRcdFx0J3NlcXVlbmNlJyA6IF9sb2dTZXF1ZW5jZSsrXHJcblx0XHR9O1xyXG5cclxuXHRcdGxldCBtZXNzYWdlU3R1YnMgPSAwO1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XHJcblxyXG5cdFx0XHRpZiAoaSA9PT0gMCkge1xyXG5cdFx0XHRcdGxvZ2dpbmdFdmVudC5tZXNzYWdlID0gYXJnc1tpXTtcclxuXHRcdFx0XHRsZXQgc3R1YnMgPSAoL1xce30vZykuZXhlYyhsb2dnaW5nRXZlbnQubWVzc2FnZSk7XHJcblx0XHRcdFx0bWVzc2FnZVN0dWJzID0gKHN0dWJzIGluc3RhbmNlb2YgQXJyYXkpID8gc3R1YnMubGVuZ3RoIDogMDtcclxuXHRcdFx0fSBlbHNlIGlmIChtZXNzYWdlU3R1YnMgPiAwKSB7XHJcblx0XHRcdFx0bG9nZ2luZ0V2ZW50Lm1lc3NhZ2UgPSBsb2dnaW5nRXZlbnQubWVzc2FnZS5yZXBsYWNlKC9cXHt9LywgYXJnc1tpXSk7XHJcblx0XHRcdFx0bWVzc2FnZVN0dWJzLS07XHJcblx0XHRcdH0gZWxzZSBpZiAoYXJnc1tpXSBpbnN0YW5jZW9mIEVycm9yKSB7XHJcblx0XHRcdFx0bG9nZ2luZ0V2ZW50LmVycm9yID0gYXJnc1tpXTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRsb2dnaW5nRXZlbnQucHJvcGVydGllcyA9IGFyZ3NbaV07XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGxvZ2dpbmdFdmVudDtcclxuXHJcblx0fVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgc2NyaXB0IGlzIGluIHN0cmljdCBtb2RlXHJcbiAgICAgKlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEBmdW5jdGlvblxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAgICovXHJcblx0bGV0IF9pc1N0cmljdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gIXRoaXM7XHJcbiAgICB9O1xyXG5cclxuXHRyZXR1cm4gdGhpcztcclxuXHJcbn1cclxuIl19