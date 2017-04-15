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

		var regex = /\{\}/g;
		for (var i = 0; i < args.length; i++) {

			if (i === 0) {
				loggingEvent.message = args[i];
			} else if (regex.exec(loggingEvent.message)) {
				loggingEvent.message = loggingEvent.message.replace(/\{\}/, args[i]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxvZ2dlci9sb2dnZXIuanMiXSwibmFtZXMiOlsiTG9nZ2VyIiwiTE9HX0VWRU5UIiwiY29udGV4dCIsImFwcGVuZGVyT2JqIiwiX2xvZ0NvbnRleHQiLCJfbG9nU2VxdWVuY2UiLCJfcmVsYXRpdmUiLCJEYXRlIiwiZ2V0VGltZSIsImVycm9yIiwiYXBwZW5kIiwiX2NvbnN0cnVjdExvZ0V2ZW50IiwiRVJST1IiLCJhcmd1bWVudHMiLCJ3YXJuIiwiV0FSTiIsImluZm8iLCJJTkZPIiwiZGVidWciLCJERUJVRyIsInRyYWNlIiwiVFJBQ0UiLCJsZXZlbCIsImFyZ3MiLCJsb2dUaW1lIiwiRXJyb3IiLCJlIiwibG9nZ2luZ0V2ZW50IiwiX2lzU3RyaWN0IiwiY2FsbGVlIiwiY2FsbGVyIiwidW5kZWZpbmVkIiwicmVnZXgiLCJpIiwibGVuZ3RoIiwibWVzc2FnZSIsImV4ZWMiLCJyZXBsYWNlIiwicHJvcGVydGllcyJdLCJtYXBwaW5ncyI6Ijs7O1FBa0JnQkEsTSxHQUFBQSxNOztBQVhoQjs7QUFFQTs7Ozs7OztBQU9BLElBQUlDLDBDQUFKLEMsQ0FoQkE7Ozs7Ozs7QUFrQk8sU0FBU0QsTUFBVCxDQUFnQkUsT0FBaEIsRUFBeUJDLFdBQXpCLEVBQXNDOztBQUV6QztBQUNBLEtBQUlDLGNBQWNGLE9BQWxCO0FBQ0E7QUFDQSxLQUFJRyxlQUFlLENBQW5CO0FBQ0g7QUFDQSxLQUFJQyxZQUFhLElBQUlDLElBQUosRUFBRCxDQUFhQyxPQUFiLEVBQWhCOztBQUVBOzs7Ozs7QUFNQSxNQUFLQyxLQUFMLEdBQWEsWUFBWTtBQUN4Qk4sY0FBWU8sTUFBWixDQUFtQkMsbUJBQW1CLDRDQUFTQyxLQUE1QixFQUFtQ0MsU0FBbkMsQ0FBbkI7QUFDQSxFQUZEOztBQUlBOzs7Ozs7QUFNQSxNQUFLQyxJQUFMLEdBQVksWUFBWTtBQUN2QlgsY0FBWU8sTUFBWixDQUFtQkMsbUJBQW1CLDRDQUFTSSxJQUE1QixFQUFrQ0YsU0FBbEMsQ0FBbkI7QUFDQSxFQUZEOztBQUlBOzs7Ozs7QUFNQSxNQUFLRyxJQUFMLEdBQVksWUFBWTtBQUN2QmIsY0FBWU8sTUFBWixDQUFtQkMsbUJBQW1CLDRDQUFTTSxJQUE1QixFQUFrQ0osU0FBbEMsQ0FBbkI7QUFDQSxFQUZEOztBQUlBOzs7Ozs7QUFNQSxNQUFLSyxLQUFMLEdBQWEsWUFBWTtBQUN4QmYsY0FBWU8sTUFBWixDQUFtQkMsbUJBQW1CLDRDQUFTUSxLQUE1QixFQUFtQ04sU0FBbkMsQ0FBbkI7QUFDQSxFQUZEOztBQUlBOzs7Ozs7QUFNQSxNQUFLTyxLQUFMLEdBQWEsWUFBWTtBQUN4QmpCLGNBQVlPLE1BQVosQ0FBbUJDLG1CQUFtQiw0Q0FBU1UsS0FBNUIsRUFBbUNSLFNBQW5DLENBQW5CO0FBQ0EsRUFGRDs7QUFJQTs7Ozs7Ozs7QUFRQSxVQUFTRixrQkFBVCxDQUE0QlcsS0FBNUIsRUFBbUNDLElBQW5DLEVBQXlDOztBQUV4QyxNQUFJQyxVQUFVLElBQUlqQixJQUFKLEVBQWQ7QUFDQSxNQUFJRSxRQUFRLElBQVo7O0FBRUE7QUFDQSxNQUFJO0FBQ0gsU0FBTSxJQUFJZ0IsS0FBSixFQUFOO0FBQ0EsR0FGRCxDQUVFLE9BQU9DLENBQVAsRUFBVTtBQUNYakIsV0FBUWlCLENBQVI7QUFDQTs7QUFFRCxNQUFJQyxlQUFlO0FBQ2xCLFdBQVNILE9BRFM7QUFFbEIsWUFBVSxJQUZRO0FBR2xCLG9CQUFrQmYsS0FIQTtBQUlsQixXQUFTLElBSlM7QUFLbEIsWUFBVWEsS0FMUTtBQU1sQixpQkFBZSxJQU5HO0FBT2xCLGFBQVdsQixXQVBPO0FBUWxCLGNBQVksRUFSTTtBQVNsQixhQUFXLENBQUN3QixXQUFELEdBQWVMLEtBQUtNLE1BQUwsQ0FBWUMsTUFBM0IsR0FBb0MsQ0FUN0I7QUFVbEIsaUJBQWVDLFNBVkc7QUFXbEIsZUFBYVAsUUFBUWhCLE9BQVIsS0FBb0JGLFNBWGY7QUFZbEIsZUFBYUQ7QUFaSyxHQUFuQjs7QUFlQSxNQUFJMkIsUUFBUSxPQUFaO0FBQ0EsT0FBSyxJQUFJQyxJQUFJLENBQWIsRUFBZ0JBLElBQUlWLEtBQUtXLE1BQXpCLEVBQWlDRCxHQUFqQyxFQUFzQzs7QUFFckMsT0FBSUEsTUFBTSxDQUFWLEVBQWE7QUFDWk4saUJBQWFRLE9BQWIsR0FBdUJaLEtBQUtVLENBQUwsQ0FBdkI7QUFDQSxJQUZELE1BRU8sSUFBSUQsTUFBTUksSUFBTixDQUFXVCxhQUFhUSxPQUF4QixDQUFKLEVBQXNDO0FBQzVDUixpQkFBYVEsT0FBYixHQUF1QlIsYUFBYVEsT0FBYixDQUFxQkUsT0FBckIsQ0FBNkIsTUFBN0IsRUFBcUNkLEtBQUtVLENBQUwsQ0FBckMsQ0FBdkI7QUFDQSxJQUZNLE1BRUEsSUFBSVYsS0FBS1UsQ0FBTCxhQUFtQlIsS0FBdkIsRUFBOEI7QUFDcENFLGlCQUFhbEIsS0FBYixHQUFxQmMsS0FBS1UsQ0FBTCxDQUFyQjtBQUNBLElBRk0sTUFFQTtBQUNOTixpQkFBYVcsVUFBYixHQUEwQmYsS0FBS1UsQ0FBTCxDQUExQjtBQUNBO0FBRUQ7O0FBRUQsU0FBT04sWUFBUDtBQUVBOztBQUVFOzs7Ozs7OztBQVFILEtBQUlDLFlBQVksU0FBWkEsU0FBWSxHQUFZO0FBQ3JCLFNBQU8sQ0FBQyxJQUFSO0FBQ0gsRUFGSjs7QUFJQSxRQUFPLElBQVA7QUFFQSIsImZpbGUiOiJsb2dnZXIvbG9nZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBsb2c0anMgPGh0dHBzOi8vZ2l0aHViLmNvbS9hbmlnZW5lcm8vbG9nNGpzPlxuICpcbiAqIENvcHlyaWdodCAyMDE2LXByZXNlbnQgUm9iaW4gU2NodWx0eiA8aHR0cDovL2FuaWdlbmVyby5jb20+XG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0xvZ0xldmVsfSBmcm9tICcuLi9jb25zdC9sb2dMZXZlbCc7XG5cbi8qKlxuICogSG9sZHMgdGhlIGRlZmluaXRpb24gZm9yIHRoZSBsb2cgZXZlbnQgb2JqZWN0XG4gKlxuICogQHR5cGVkZWYge3sgZGF0ZSA6IG51bWJlciwgZXJyb3IgOiBPYmplY3QsIGZpbGVuYW1lOiBzdHJpbmcsIGxpbmVOdW1iZXI6ID9zdHJpbmcsIGNvbHVtbjogP3N0cmluZyxcbiAqICAgICAgbG9nRXJyb3JTdGFjayA6IE9iamVjdCwgZmlsZSA6IFN0cmluZywgbGV2ZWwgOiBudW1iZXIsIGxvZ2dlciA6IHN0cmluZywgbWVzc2FnZSA6IHN0cmluZyxcbiAqICAgICAgbWV0aG9kIDogRnVuY3Rpb24sIHByb3BlcnRpZXMgOiBPYmplY3Q9LCByZWxhdGl2ZSA6IG51bWJlciwgc2VxdWVuY2UgOiBudW1iZXIgfX1cbiAqL1xubGV0IExPR19FVkVOVDtcblxuZXhwb3J0IGZ1bmN0aW9uIExvZ2dlcihjb250ZXh0LCBhcHBlbmRlck9iaikge1xuXG4gICAgLyoqIEB0eXBlIHtzdHJpbmd9ICovXG4gICAgbGV0IF9sb2dDb250ZXh0ID0gY29udGV4dDtcbiAgICAvKiogQHR5cGVvZiB7bnVtYmVyfSAqL1xuICAgIGxldCBfbG9nU2VxdWVuY2UgPSAxO1xuXHQvKiogQHR5cGVvZiB7bnVtYmVyfSAqL1xuXHRsZXQgX3JlbGF0aXZlID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKTtcblxuXHQvKipcblx0ICogTG9ncyBhbiBlcnJvciBldmVudFxuICAgICAqXG4gICAgICogQGZ1bmN0aW9uXG4gICAgICogQG1lbWJlck9mIExvZ2dlclxuXHQgKi9cblx0dGhpcy5lcnJvciA9IGZ1bmN0aW9uICgpIHtcblx0XHRhcHBlbmRlck9iai5hcHBlbmQoX2NvbnN0cnVjdExvZ0V2ZW50KExvZ0xldmVsLkVSUk9SLCBhcmd1bWVudHMpKTtcblx0fTtcblxuXHQvKipcblx0ICogTG9ncyBhIHdhcm5pbmdcbiAgICAgKlxuICAgICAqIEBmdW5jdGlvblxuICAgICAqIEBtZW1iZXJPZiBMb2dnZXJcblx0ICovXG5cdHRoaXMud2FybiA9IGZ1bmN0aW9uICgpIHtcblx0XHRhcHBlbmRlck9iai5hcHBlbmQoX2NvbnN0cnVjdExvZ0V2ZW50KExvZ0xldmVsLldBUk4sIGFyZ3VtZW50cykpO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBMb2dzIGFuIGluZm8gbGV2ZWwgZXZlbnRcbiAgICAgKlxuICAgICAqIEBmdW5jdGlvblxuICAgICAqIEBtZW1iZXJPZiBMb2dnZXJcblx0ICovXG5cdHRoaXMuaW5mbyA9IGZ1bmN0aW9uICgpIHtcblx0XHRhcHBlbmRlck9iai5hcHBlbmQoX2NvbnN0cnVjdExvZ0V2ZW50KExvZ0xldmVsLklORk8sIGFyZ3VtZW50cykpO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBMb2dzIGEgZGVidWcgZXZlbnRcbiAgICAgKlxuICAgICAqIEBmdW5jdGlvblxuICAgICAqIEBtZW1iZXJPZiBMb2dnZXJcblx0ICovXG5cdHRoaXMuZGVidWcgPSBmdW5jdGlvbiAoKSB7XG5cdFx0YXBwZW5kZXJPYmouYXBwZW5kKF9jb25zdHJ1Y3RMb2dFdmVudChMb2dMZXZlbC5ERUJVRywgYXJndW1lbnRzKSk7XG5cdH07XG5cblx0LyoqXG5cdCAqIExvZ3MgYSB0cmFjZSBldmVudFxuICAgICAqXG4gICAgICogQGZ1bmN0aW9uXG4gICAgICogQG1lbWJlck9mIExvZ2dlclxuXHQgKi9cblx0dGhpcy50cmFjZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRhcHBlbmRlck9iai5hcHBlbmQoX2NvbnN0cnVjdExvZ0V2ZW50KExvZ0xldmVsLlRSQUNFLCBhcmd1bWVudHMpKTtcblx0fTtcblxuXHQvKipcblx0ICogQGZ1bmN0aW9uXG5cdCAqXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBsZXZlbFxuXHQgKiBAcGFyYW0ge0FycmF5LjxPYmplY3Q+fSBhcmdzXG5cdCAqXG5cdCAqIEByZXR1cm4ge0xPR19FVkVOVH1cblx0ICovXG5cdGZ1bmN0aW9uIF9jb25zdHJ1Y3RMb2dFdmVudChsZXZlbCwgYXJncykge1xuXG5cdFx0bGV0IGxvZ1RpbWUgPSBuZXcgRGF0ZSgpO1xuXHRcdGxldCBlcnJvciA9IG51bGw7XG5cblx0XHQvLyB0aGlzIGxvb2tzIGhvcnJpYmxlLCBidXQgdGhpcyBpcyB0aGUgb25seSB3YXkgdG8gY2F0Y2ggdGhlIHN0YWNrIGZvciBJRSB0byBsYXRlciBwYXJzZSB0aGUgc3RhY2tcblx0XHR0cnkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCk7XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0ZXJyb3IgPSBlO1xuXHRcdH1cblxuXHRcdGxldCBsb2dnaW5nRXZlbnQgPSB7XG5cdFx0XHQnZGF0ZScgOiBsb2dUaW1lLFxuXHRcdFx0J2Vycm9yJyA6IG51bGwsXG5cdFx0XHQnbG9nRXJyb3JTdGFjaycgOiBlcnJvcixcblx0XHRcdCdmaWxlJyA6IG51bGwsXG5cdFx0XHQnbGV2ZWwnIDogbGV2ZWwsXG5cdFx0XHQnbGluZU51bWJlcicgOiBudWxsLFxuXHRcdFx0J2xvZ2dlcicgOiBfbG9nQ29udGV4dCxcblx0XHRcdCdtZXNzYWdlJyA6ICcnLFxuXHRcdFx0J21ldGhvZCcgOiAhX2lzU3RyaWN0KCkgPyBhcmdzLmNhbGxlZS5jYWxsZXIgOiAwLFxuXHRcdFx0J3Byb3BlcnRpZXMnIDogdW5kZWZpbmVkLFxuXHRcdFx0J3JlbGF0aXZlJyA6IGxvZ1RpbWUuZ2V0VGltZSgpIC0gX3JlbGF0aXZlLFxuXHRcdFx0J3NlcXVlbmNlJyA6IF9sb2dTZXF1ZW5jZSsrXG5cdFx0fTtcblxuXHRcdGxldCByZWdleCA9IC9cXHtcXH0vZztcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcblxuXHRcdFx0aWYgKGkgPT09IDApIHtcblx0XHRcdFx0bG9nZ2luZ0V2ZW50Lm1lc3NhZ2UgPSBhcmdzW2ldO1xuXHRcdFx0fSBlbHNlIGlmIChyZWdleC5leGVjKGxvZ2dpbmdFdmVudC5tZXNzYWdlKSkge1xuXHRcdFx0XHRsb2dnaW5nRXZlbnQubWVzc2FnZSA9IGxvZ2dpbmdFdmVudC5tZXNzYWdlLnJlcGxhY2UoL1xce1xcfS8sIGFyZ3NbaV0pO1xuXHRcdFx0fSBlbHNlIGlmIChhcmdzW2ldIGluc3RhbmNlb2YgRXJyb3IpIHtcblx0XHRcdFx0bG9nZ2luZ0V2ZW50LmVycm9yID0gYXJnc1tpXTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGxvZ2dpbmdFdmVudC5wcm9wZXJ0aWVzID0gYXJnc1tpXTtcblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdHJldHVybiBsb2dnaW5nRXZlbnQ7XG5cblx0fVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgc2NyaXB0IGlzIGluIHN0cmljdCBtb2RlXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBmdW5jdGlvblxuICAgICAqXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG5cdGxldCBfaXNTdHJpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAhdGhpcztcbiAgICB9O1xuXG5cdHJldHVybiB0aGlzO1xuXG59XG4iXX0=