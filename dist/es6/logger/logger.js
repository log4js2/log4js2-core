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

		let regex = /\{\}/g;
		for (let i = 0; i < args.length; i++) {

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
	let _isStrict = function () {
		return !this;
	};

	return this;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxvZ2dlci9sb2dnZXIuanMiXSwibmFtZXMiOlsiTG9nZ2VyIiwiTE9HX0VWRU5UIiwiY29udGV4dCIsImFwcGVuZGVyT2JqIiwiX2xvZ0NvbnRleHQiLCJfbG9nU2VxdWVuY2UiLCJfcmVsYXRpdmUiLCJEYXRlIiwiZ2V0VGltZSIsImVycm9yIiwiYXBwZW5kIiwiX2NvbnN0cnVjdExvZ0V2ZW50IiwiRVJST1IiLCJhcmd1bWVudHMiLCJ3YXJuIiwiV0FSTiIsImluZm8iLCJJTkZPIiwiZGVidWciLCJERUJVRyIsInRyYWNlIiwiVFJBQ0UiLCJsZXZlbCIsImFyZ3MiLCJsb2dUaW1lIiwiRXJyb3IiLCJlIiwibG9nZ2luZ0V2ZW50IiwiX2lzU3RyaWN0IiwiY2FsbGVlIiwiY2FsbGVyIiwidW5kZWZpbmVkIiwicmVnZXgiLCJpIiwibGVuZ3RoIiwibWVzc2FnZSIsImV4ZWMiLCJyZXBsYWNlIiwicHJvcGVydGllcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFrQmdCQSxNLEdBQUFBLE07O0FBWGhCOztBQUVBOzs7Ozs7O0FBT0EsSUFBSUMsU0FBSixDLENBaEJBOzs7Ozs7O0FBa0JPLFNBQVNELE1BQVQsQ0FBZ0JFLE9BQWhCLEVBQXlCQyxXQUF6QixFQUFzQzs7QUFFekM7QUFDQSxLQUFJQyxjQUFjRixPQUFsQjtBQUNBO0FBQ0EsS0FBSUcsZUFBZSxDQUFuQjtBQUNIO0FBQ0EsS0FBSUMsWUFBYSxJQUFJQyxJQUFKLEVBQUQsQ0FBYUMsT0FBYixFQUFoQjs7QUFFQTs7Ozs7O0FBTUEsTUFBS0MsS0FBTCxHQUFhLFlBQVk7QUFDeEJOLGNBQVlPLE1BQVosQ0FBbUJDLG1CQUFtQiw0Q0FBU0MsS0FBNUIsRUFBbUNDLFNBQW5DLENBQW5CO0FBQ0EsRUFGRDs7QUFJQTs7Ozs7O0FBTUEsTUFBS0MsSUFBTCxHQUFZLFlBQVk7QUFDdkJYLGNBQVlPLE1BQVosQ0FBbUJDLG1CQUFtQiw0Q0FBU0ksSUFBNUIsRUFBa0NGLFNBQWxDLENBQW5CO0FBQ0EsRUFGRDs7QUFJQTs7Ozs7O0FBTUEsTUFBS0csSUFBTCxHQUFZLFlBQVk7QUFDdkJiLGNBQVlPLE1BQVosQ0FBbUJDLG1CQUFtQiw0Q0FBU00sSUFBNUIsRUFBa0NKLFNBQWxDLENBQW5CO0FBQ0EsRUFGRDs7QUFJQTs7Ozs7O0FBTUEsTUFBS0ssS0FBTCxHQUFhLFlBQVk7QUFDeEJmLGNBQVlPLE1BQVosQ0FBbUJDLG1CQUFtQiw0Q0FBU1EsS0FBNUIsRUFBbUNOLFNBQW5DLENBQW5CO0FBQ0EsRUFGRDs7QUFJQTs7Ozs7O0FBTUEsTUFBS08sS0FBTCxHQUFhLFlBQVk7QUFDeEJqQixjQUFZTyxNQUFaLENBQW1CQyxtQkFBbUIsNENBQVNVLEtBQTVCLEVBQW1DUixTQUFuQyxDQUFuQjtBQUNBLEVBRkQ7O0FBSUE7Ozs7Ozs7O0FBUUEsVUFBU0Ysa0JBQVQsQ0FBNEJXLEtBQTVCLEVBQW1DQyxJQUFuQyxFQUF5Qzs7QUFFeEMsTUFBSUMsVUFBVSxJQUFJakIsSUFBSixFQUFkO0FBQ0EsTUFBSUUsUUFBUSxJQUFaOztBQUVBO0FBQ0EsTUFBSTtBQUNILFNBQU0sSUFBSWdCLEtBQUosRUFBTjtBQUNBLEdBRkQsQ0FFRSxPQUFPQyxDQUFQLEVBQVU7QUFDWGpCLFdBQVFpQixDQUFSO0FBQ0E7O0FBRUQsTUFBSUMsZUFBZTtBQUNsQixXQUFTSCxPQURTO0FBRWxCLFlBQVUsSUFGUTtBQUdsQixvQkFBa0JmLEtBSEE7QUFJbEIsV0FBUyxJQUpTO0FBS2xCLFlBQVVhLEtBTFE7QUFNbEIsaUJBQWUsSUFORztBQU9sQixhQUFXbEIsV0FQTztBQVFsQixjQUFZLEVBUk07QUFTbEIsYUFBVyxDQUFDd0IsV0FBRCxHQUFlTCxLQUFLTSxNQUFMLENBQVlDLE1BQTNCLEdBQW9DLENBVDdCO0FBVWxCLGlCQUFlQyxTQVZHO0FBV2xCLGVBQWFQLFFBQVFoQixPQUFSLEtBQW9CRixTQVhmO0FBWWxCLGVBQWFEO0FBWkssR0FBbkI7O0FBZUEsTUFBSTJCLFFBQVEsT0FBWjtBQUNBLE9BQUssSUFBSUMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJVixLQUFLVyxNQUF6QixFQUFpQ0QsR0FBakMsRUFBc0M7O0FBRXJDLE9BQUlBLE1BQU0sQ0FBVixFQUFhO0FBQ1pOLGlCQUFhUSxPQUFiLEdBQXVCWixLQUFLVSxDQUFMLENBQXZCO0FBQ0EsSUFGRCxNQUVPLElBQUlELE1BQU1JLElBQU4sQ0FBV1QsYUFBYVEsT0FBeEIsQ0FBSixFQUFzQztBQUM1Q1IsaUJBQWFRLE9BQWIsR0FBdUJSLGFBQWFRLE9BQWIsQ0FBcUJFLE9BQXJCLENBQTZCLE1BQTdCLEVBQXFDZCxLQUFLVSxDQUFMLENBQXJDLENBQXZCO0FBQ0EsSUFGTSxNQUVBLElBQUlWLEtBQUtVLENBQUwsYUFBbUJSLEtBQXZCLEVBQThCO0FBQ3BDRSxpQkFBYWxCLEtBQWIsR0FBcUJjLEtBQUtVLENBQUwsQ0FBckI7QUFDQSxJQUZNLE1BRUE7QUFDTk4saUJBQWFXLFVBQWIsR0FBMEJmLEtBQUtVLENBQUwsQ0FBMUI7QUFDQTtBQUVEOztBQUVELFNBQU9OLFlBQVA7QUFFQTs7QUFFRTs7Ozs7Ozs7QUFRSCxLQUFJQyxZQUFZLFlBQVk7QUFDckIsU0FBTyxDQUFDLElBQVI7QUFDSCxFQUZKOztBQUlBLFFBQU8sSUFBUDtBQUVBIiwiZmlsZSI6ImxvZ2dlci9sb2dnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIGxvZzRqcyA8aHR0cHM6Ly9naXRodWIuY29tL2FuaWdlbmVyby9sb2c0anM+XG4gKlxuICogQ29weXJpZ2h0IDIwMTYtcHJlc2VudCBSb2JpbiBTY2h1bHR6IDxodHRwOi8vYW5pZ2VuZXJvLmNvbT5cbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZVxuICovXG5cbmltcG9ydCB7TG9nTGV2ZWx9IGZyb20gJy4uL2NvbnN0L2xvZ0xldmVsJztcblxuLyoqXG4gKiBIb2xkcyB0aGUgZGVmaW5pdGlvbiBmb3IgdGhlIGxvZyBldmVudCBvYmplY3RcbiAqXG4gKiBAdHlwZWRlZiB7eyBkYXRlIDogbnVtYmVyLCBlcnJvciA6IE9iamVjdCwgZmlsZW5hbWU6IHN0cmluZywgbGluZU51bWJlcjogP3N0cmluZywgY29sdW1uOiA/c3RyaW5nLFxuICogICAgICBsb2dFcnJvclN0YWNrIDogT2JqZWN0LCBmaWxlIDogU3RyaW5nLCBsZXZlbCA6IG51bWJlciwgbG9nZ2VyIDogc3RyaW5nLCBtZXNzYWdlIDogc3RyaW5nLFxuICogICAgICBtZXRob2QgOiBGdW5jdGlvbiwgcHJvcGVydGllcyA6IE9iamVjdD0sIHJlbGF0aXZlIDogbnVtYmVyLCBzZXF1ZW5jZSA6IG51bWJlciB9fVxuICovXG5sZXQgTE9HX0VWRU5UO1xuXG5leHBvcnQgZnVuY3Rpb24gTG9nZ2VyKGNvbnRleHQsIGFwcGVuZGVyT2JqKSB7XG5cbiAgICAvKiogQHR5cGUge3N0cmluZ30gKi9cbiAgICBsZXQgX2xvZ0NvbnRleHQgPSBjb250ZXh0O1xuICAgIC8qKiBAdHlwZW9mIHtudW1iZXJ9ICovXG4gICAgbGV0IF9sb2dTZXF1ZW5jZSA9IDE7XG5cdC8qKiBAdHlwZW9mIHtudW1iZXJ9ICovXG5cdGxldCBfcmVsYXRpdmUgPSAobmV3IERhdGUoKSkuZ2V0VGltZSgpO1xuXG5cdC8qKlxuXHQgKiBMb2dzIGFuIGVycm9yIGV2ZW50XG4gICAgICpcbiAgICAgKiBAZnVuY3Rpb25cbiAgICAgKiBAbWVtYmVyT2YgTG9nZ2VyXG5cdCAqL1xuXHR0aGlzLmVycm9yID0gZnVuY3Rpb24gKCkge1xuXHRcdGFwcGVuZGVyT2JqLmFwcGVuZChfY29uc3RydWN0TG9nRXZlbnQoTG9nTGV2ZWwuRVJST1IsIGFyZ3VtZW50cykpO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBMb2dzIGEgd2FybmluZ1xuICAgICAqXG4gICAgICogQGZ1bmN0aW9uXG4gICAgICogQG1lbWJlck9mIExvZ2dlclxuXHQgKi9cblx0dGhpcy53YXJuID0gZnVuY3Rpb24gKCkge1xuXHRcdGFwcGVuZGVyT2JqLmFwcGVuZChfY29uc3RydWN0TG9nRXZlbnQoTG9nTGV2ZWwuV0FSTiwgYXJndW1lbnRzKSk7XG5cdH07XG5cblx0LyoqXG5cdCAqIExvZ3MgYW4gaW5mbyBsZXZlbCBldmVudFxuICAgICAqXG4gICAgICogQGZ1bmN0aW9uXG4gICAgICogQG1lbWJlck9mIExvZ2dlclxuXHQgKi9cblx0dGhpcy5pbmZvID0gZnVuY3Rpb24gKCkge1xuXHRcdGFwcGVuZGVyT2JqLmFwcGVuZChfY29uc3RydWN0TG9nRXZlbnQoTG9nTGV2ZWwuSU5GTywgYXJndW1lbnRzKSk7XG5cdH07XG5cblx0LyoqXG5cdCAqIExvZ3MgYSBkZWJ1ZyBldmVudFxuICAgICAqXG4gICAgICogQGZ1bmN0aW9uXG4gICAgICogQG1lbWJlck9mIExvZ2dlclxuXHQgKi9cblx0dGhpcy5kZWJ1ZyA9IGZ1bmN0aW9uICgpIHtcblx0XHRhcHBlbmRlck9iai5hcHBlbmQoX2NvbnN0cnVjdExvZ0V2ZW50KExvZ0xldmVsLkRFQlVHLCBhcmd1bWVudHMpKTtcblx0fTtcblxuXHQvKipcblx0ICogTG9ncyBhIHRyYWNlIGV2ZW50XG4gICAgICpcbiAgICAgKiBAZnVuY3Rpb25cbiAgICAgKiBAbWVtYmVyT2YgTG9nZ2VyXG5cdCAqL1xuXHR0aGlzLnRyYWNlID0gZnVuY3Rpb24gKCkge1xuXHRcdGFwcGVuZGVyT2JqLmFwcGVuZChfY29uc3RydWN0TG9nRXZlbnQoTG9nTGV2ZWwuVFJBQ0UsIGFyZ3VtZW50cykpO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBAZnVuY3Rpb25cblx0ICpcblx0ICogQHBhcmFtIHtudW1iZXJ9IGxldmVsXG5cdCAqIEBwYXJhbSB7QXJyYXkuPE9iamVjdD59IGFyZ3Ncblx0ICpcblx0ICogQHJldHVybiB7TE9HX0VWRU5UfVxuXHQgKi9cblx0ZnVuY3Rpb24gX2NvbnN0cnVjdExvZ0V2ZW50KGxldmVsLCBhcmdzKSB7XG5cblx0XHRsZXQgbG9nVGltZSA9IG5ldyBEYXRlKCk7XG5cdFx0bGV0IGVycm9yID0gbnVsbDtcblxuXHRcdC8vIHRoaXMgbG9va3MgaG9ycmlibGUsIGJ1dCB0aGlzIGlzIHRoZSBvbmx5IHdheSB0byBjYXRjaCB0aGUgc3RhY2sgZm9yIElFIHRvIGxhdGVyIHBhcnNlIHRoZSBzdGFja1xuXHRcdHRyeSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoKTtcblx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRlcnJvciA9IGU7XG5cdFx0fVxuXG5cdFx0bGV0IGxvZ2dpbmdFdmVudCA9IHtcblx0XHRcdCdkYXRlJyA6IGxvZ1RpbWUsXG5cdFx0XHQnZXJyb3InIDogbnVsbCxcblx0XHRcdCdsb2dFcnJvclN0YWNrJyA6IGVycm9yLFxuXHRcdFx0J2ZpbGUnIDogbnVsbCxcblx0XHRcdCdsZXZlbCcgOiBsZXZlbCxcblx0XHRcdCdsaW5lTnVtYmVyJyA6IG51bGwsXG5cdFx0XHQnbG9nZ2VyJyA6IF9sb2dDb250ZXh0LFxuXHRcdFx0J21lc3NhZ2UnIDogJycsXG5cdFx0XHQnbWV0aG9kJyA6ICFfaXNTdHJpY3QoKSA/IGFyZ3MuY2FsbGVlLmNhbGxlciA6IDAsXG5cdFx0XHQncHJvcGVydGllcycgOiB1bmRlZmluZWQsXG5cdFx0XHQncmVsYXRpdmUnIDogbG9nVGltZS5nZXRUaW1lKCkgLSBfcmVsYXRpdmUsXG5cdFx0XHQnc2VxdWVuY2UnIDogX2xvZ1NlcXVlbmNlKytcblx0XHR9O1xuXG5cdFx0bGV0IHJlZ2V4ID0gL1xce1xcfS9nO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuXG5cdFx0XHRpZiAoaSA9PT0gMCkge1xuXHRcdFx0XHRsb2dnaW5nRXZlbnQubWVzc2FnZSA9IGFyZ3NbaV07XG5cdFx0XHR9IGVsc2UgaWYgKHJlZ2V4LmV4ZWMobG9nZ2luZ0V2ZW50Lm1lc3NhZ2UpKSB7XG5cdFx0XHRcdGxvZ2dpbmdFdmVudC5tZXNzYWdlID0gbG9nZ2luZ0V2ZW50Lm1lc3NhZ2UucmVwbGFjZSgvXFx7XFx9LywgYXJnc1tpXSk7XG5cdFx0XHR9IGVsc2UgaWYgKGFyZ3NbaV0gaW5zdGFuY2VvZiBFcnJvcikge1xuXHRcdFx0XHRsb2dnaW5nRXZlbnQuZXJyb3IgPSBhcmdzW2ldO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bG9nZ2luZ0V2ZW50LnByb3BlcnRpZXMgPSBhcmdzW2ldO1xuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0cmV0dXJuIGxvZ2dpbmdFdmVudDtcblxuXHR9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IHRoZSBzY3JpcHQgaXMgaW4gc3RyaWN0IG1vZGVcbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQGZ1bmN0aW9uXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cblx0bGV0IF9pc1N0cmljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzO1xuICAgIH07XG5cblx0cmV0dXJuIHRoaXM7XG5cbn1cbiJdfQ==