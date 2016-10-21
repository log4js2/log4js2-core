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
  *
  * @returns {boolean}
  * @private
  */
	let _isStrict = function () {
		return !this;
	};

	return this;
}
//# sourceMappingURL=data:application/json;base64,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LEtBQUssQ0FBTCxDQUExQixDQURNO0lBRkE7R0FUUjs7QUFpQkEsU0FBTyxZQUFQLENBN0N3QztFQUF6Qzs7Ozs7OztBQXBENEMsS0EwR3hDLFlBQVksWUFBWTtBQUNyQixTQUFPLENBQUMsSUFBRCxDQURjO0VBQVosQ0ExRzRCOztBQThHNUMsUUFBTyxJQUFQLENBOUc0QztDQUF0QyIsImZpbGUiOiJsb2dnZXJcXGxvZ2dlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBsb2c0anMgPGh0dHBzOi8vZ2l0aHViLmNvbS9hbmlnZW5lcm8vbG9nNGpzPlxyXG4gKlxyXG4gKiBDb3B5cmlnaHQgMjAxNi1wcmVzZW50IFJvYmluIFNjaHVsdHogPGh0dHA6Ly9hbmlnZW5lcm8uY29tPlxyXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2VcclxuICovXHJcblxyXG5pbXBvcnQge0xvZ0xldmVsfSBmcm9tICcuLi9jb25zdC9sb2dMZXZlbCc7XHJcblxyXG4vKipcclxuICogSG9sZHMgdGhlIGRlZmluaXRpb24gZm9yIHRoZSBsb2cgZXZlbnQgb2JqZWN0XHJcbiAqXHJcbiAqIEB0eXBlZGVmIHt7IGRhdGUgOiBudW1iZXIsIGVycm9yIDogT2JqZWN0LCBmaWxlbmFtZTogc3RyaW5nLCBsaW5lTnVtYmVyOiA/c3RyaW5nLCBjb2x1bW46ID9zdHJpbmcsXHJcbiAqICAgICAgbG9nRXJyb3JTdGFjayA6IE9iamVjdCwgZmlsZSA6IFN0cmluZywgbGV2ZWwgOiBudW1iZXIsIGxvZ2dlciA6IHN0cmluZywgbWVzc2FnZSA6IHN0cmluZyxcclxuICogICAgICBtZXRob2QgOiBGdW5jdGlvbiwgcHJvcGVydGllcyA6IE9iamVjdD0sIHJlbGF0aXZlIDogbnVtYmVyLCBzZXF1ZW5jZSA6IG51bWJlciB9fVxyXG4gKi9cclxubGV0IExPR19FVkVOVDtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBMb2dnZXIoY29udGV4dCwgYXBwZW5kZXJPYmopIHtcclxuXHJcbiAgICAvKiogQHR5cGUge3N0cmluZ30gKi9cclxuICAgIGxldCBfbG9nQ29udGV4dCA9IGNvbnRleHQ7XHJcbiAgICAvKiogQHR5cGVvZiB7bnVtYmVyfSAqL1xyXG4gICAgbGV0IF9sb2dTZXF1ZW5jZSA9IDE7XHJcblx0LyoqIEB0eXBlb2Yge251bWJlcn0gKi9cclxuXHRsZXQgX3JlbGF0aXZlID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKTtcclxuXHJcblx0LyoqXHJcblx0ICogTG9ncyBhbiBlcnJvciBldmVudFxyXG5cdCAqL1xyXG5cdHRoaXMuZXJyb3IgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRhcHBlbmRlck9iai5hcHBlbmQoX2NvbnN0cnVjdExvZ0V2ZW50KExvZ0xldmVsLkVSUk9SLCBhcmd1bWVudHMpKTtcclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBMb2dzIGEgd2FybmluZ1xyXG5cdCAqL1xyXG5cdHRoaXMud2FybiA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdGFwcGVuZGVyT2JqLmFwcGVuZChfY29uc3RydWN0TG9nRXZlbnQoTG9nTGV2ZWwuV0FSTiwgYXJndW1lbnRzKSk7XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogTG9ncyBhbiBpbmZvIGxldmVsIGV2ZW50XHJcblx0ICovXHJcblx0dGhpcy5pbmZvID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0YXBwZW5kZXJPYmouYXBwZW5kKF9jb25zdHJ1Y3RMb2dFdmVudChMb2dMZXZlbC5JTkZPLCBhcmd1bWVudHMpKTtcclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBMb2dzIGEgZGVidWcgZXZlbnRcclxuXHQgKi9cclxuXHR0aGlzLmRlYnVnID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0YXBwZW5kZXJPYmouYXBwZW5kKF9jb25zdHJ1Y3RMb2dFdmVudChMb2dMZXZlbC5ERUJVRywgYXJndW1lbnRzKSk7XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogTG9ncyBhIHRyYWNlIGV2ZW50XHJcblx0ICovXHJcblx0dGhpcy50cmFjZSA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdGFwcGVuZGVyT2JqLmFwcGVuZChfY29uc3RydWN0TG9nRXZlbnQoTG9nTGV2ZWwuVFJBQ0UsIGFyZ3VtZW50cykpO1xyXG5cdH07XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBmdW5jdGlvblxyXG5cdCAqXHJcblx0ICogQHBhcmFtIHtudW1iZXJ9IGxldmVsXHJcblx0ICogQHBhcmFtIHtBcnJheX0gYXJndW1lbnRzXHJcblx0ICpcclxuXHQgKiBAcmV0dXJuIHtMT0dfRVZFTlR9XHJcblx0ICovXHJcblx0ZnVuY3Rpb24gX2NvbnN0cnVjdExvZ0V2ZW50KGxldmVsLCBhcmdzKSB7XHJcblxyXG5cdFx0bGV0IGxvZ1RpbWUgPSBuZXcgRGF0ZSgpO1xyXG5cdFx0bGV0IGVycm9yID0gbnVsbDtcclxuXHJcblx0XHQvLyB0aGlzIGxvb2tzIGhvcnJpYmxlLCBidXQgdGhpcyBpcyB0aGUgb25seSB3YXkgdG8gY2F0Y2ggdGhlIHN0YWNrIGZvciBJRSB0byBsYXRlciBwYXJzZSB0aGUgc3RhY2tcclxuXHRcdHRyeSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcigpO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRlcnJvciA9IGU7XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IGxvZ2dpbmdFdmVudCA9IHtcclxuXHRcdFx0J2RhdGUnIDogbG9nVGltZSxcclxuXHRcdFx0J2Vycm9yJyA6IG51bGwsXHJcblx0XHRcdCdsb2dFcnJvclN0YWNrJyA6IGVycm9yLFxyXG5cdFx0XHQnZmlsZScgOiBudWxsLFxyXG5cdFx0XHQnbGV2ZWwnIDogbGV2ZWwsXHJcblx0XHRcdCdsaW5lTnVtYmVyJyA6IG51bGwsXHJcblx0XHRcdCdsb2dnZXInIDogX2xvZ0NvbnRleHQsXHJcblx0XHRcdCdtZXNzYWdlJyA6ICcnLFxyXG5cdFx0XHQnbWV0aG9kJyA6ICFfaXNTdHJpY3QoKSA/IGFyZ3MuY2FsbGVlLmNhbGxlciA6IDAsXHJcblx0XHRcdCdwcm9wZXJ0aWVzJyA6IHVuZGVmaW5lZCxcclxuXHRcdFx0J3JlbGF0aXZlJyA6IGxvZ1RpbWUuZ2V0VGltZSgpIC0gX3JlbGF0aXZlLFxyXG5cdFx0XHQnc2VxdWVuY2UnIDogX2xvZ1NlcXVlbmNlKytcclxuXHRcdH07XHJcblxyXG5cdFx0bGV0IG1lc3NhZ2VTdHVicyA9IDA7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcclxuXHJcblx0XHRcdGlmIChpID09PSAwKSB7XHJcblx0XHRcdFx0bG9nZ2luZ0V2ZW50Lm1lc3NhZ2UgPSBhcmdzW2ldO1xyXG5cdFx0XHRcdGxldCBzdHVicyA9ICgvXFx7fS9nKS5leGVjKGxvZ2dpbmdFdmVudC5tZXNzYWdlKTtcclxuXHRcdFx0XHRtZXNzYWdlU3R1YnMgPSAoc3R1YnMgaW5zdGFuY2VvZiBBcnJheSkgPyBzdHVicy5sZW5ndGggOiAwO1xyXG5cdFx0XHR9IGVsc2UgaWYgKG1lc3NhZ2VTdHVicyA+IDApIHtcclxuXHRcdFx0XHRsb2dnaW5nRXZlbnQubWVzc2FnZSA9IGxvZ2dpbmdFdmVudC5tZXNzYWdlLnJlcGxhY2UoL1xce30vLCBhcmdzW2ldKTtcclxuXHRcdFx0XHRtZXNzYWdlU3R1YnMtLTtcclxuXHRcdFx0fSBlbHNlIGlmIChhcmdzW2ldIGluc3RhbmNlb2YgRXJyb3IpIHtcclxuXHRcdFx0XHRsb2dnaW5nRXZlbnQuZXJyb3IgPSBhcmdzW2ldO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGxvZ2dpbmdFdmVudC5wcm9wZXJ0aWVzID0gYXJnc1tpXTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gbG9nZ2luZ0V2ZW50O1xyXG5cclxuXHR9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcblx0bGV0IF9pc1N0cmljdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gIXRoaXM7XHJcbiAgICB9O1xyXG5cclxuXHRyZXR1cm4gdGhpcztcclxuXHJcbn1cclxuIl19