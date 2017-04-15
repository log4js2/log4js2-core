/*istanbul ignore next*/'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ConsoleAppender = undefined;

var /*istanbul ignore next*/_appender = require('./appender');

var /*istanbul ignore next*/_logLevel = require('../const/logLevel');

/**
 * log4js <https://github.com/anigenero/log4js>
 *
 * Copyright 2016-present Robin Schultz <http://anigenero.com>
 * Released under the MIT License
 */

class ConsoleAppender extends /*istanbul ignore next*/_appender.LogAppender {

	static get name() {
		return 'console';
	}

	/**
  * Appends the log event
  * @param logEvent
  */
	append(logEvent) {
		if (logEvent.level <= this.getLogLevel()) {
			this._appendToConsole(logEvent);
		}
	}

	/**
  * @private
  * @function
  *
  * @param {LOG_EVENT} logEvent
  */
	_appendToConsole(logEvent) {

		let message = this.format(logEvent);

		if (logEvent.level == /*istanbul ignore next*/_logLevel.LogLevel.ERROR) {
			console.error(message);
		} else if (logEvent.level == /*istanbul ignore next*/_logLevel.LogLevel.WARN) {
			console.warn(message);
		} else if (logEvent.level == /*istanbul ignore next*/_logLevel.LogLevel.INFO) {
			console.info(message);
		} else if ([/*istanbul ignore next*/_logLevel.LogLevel.DEBUG, /*istanbul ignore next*/_logLevel.LogLevel.TRACE].indexOf(logEvent.level) > -1) {
			console.log(message);
		}
	}

}
/*istanbul ignore next*/exports.ConsoleAppender = ConsoleAppender;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcGVuZGVyL2NvbnNvbGVBcHBlbmRlci5qcyJdLCJuYW1lcyI6WyJDb25zb2xlQXBwZW5kZXIiLCJuYW1lIiwiYXBwZW5kIiwibG9nRXZlbnQiLCJsZXZlbCIsImdldExvZ0xldmVsIiwiX2FwcGVuZFRvQ29uc29sZSIsIm1lc3NhZ2UiLCJmb3JtYXQiLCJFUlJPUiIsImNvbnNvbGUiLCJlcnJvciIsIldBUk4iLCJ3YXJuIiwiSU5GTyIsImluZm8iLCJERUJVRyIsIlRSQUNFIiwiaW5kZXhPZiIsImxvZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQU9BOztBQUNBOztBQVJBOzs7Ozs7O0FBVU8sTUFBTUEsZUFBTix1REFBMEM7O0FBRTdDLFlBQVdDLElBQVgsR0FBa0I7QUFDZCxTQUFPLFNBQVA7QUFDSDs7QUFFRDs7OztBQUlBQyxRQUFPQyxRQUFQLEVBQWlCO0FBQ2IsTUFBSUEsU0FBU0MsS0FBVCxJQUFrQixLQUFLQyxXQUFMLEVBQXRCLEVBQTBDO0FBQ3RDLFFBQUtDLGdCQUFMLENBQXNCSCxRQUF0QjtBQUNIO0FBQ0o7O0FBRUo7Ozs7OztBQU1BRyxrQkFBaUJILFFBQWpCLEVBQTJCOztBQUUxQixNQUFJSSxVQUFVLEtBQUtDLE1BQUwsQ0FBWUwsUUFBWixDQUFkOztBQUVBLE1BQUlBLFNBQVNDLEtBQVQsSUFBa0IsMkNBQVNLLEtBQS9CLEVBQXNDO0FBQ3JDQyxXQUFRQyxLQUFSLENBQWNKLE9BQWQ7QUFDQSxHQUZELE1BRU8sSUFBSUosU0FBU0MsS0FBVCxJQUFrQiwyQ0FBU1EsSUFBL0IsRUFBcUM7QUFDM0NGLFdBQVFHLElBQVIsQ0FBYU4sT0FBYjtBQUNBLEdBRk0sTUFFQSxJQUFJSixTQUFTQyxLQUFULElBQWtCLDJDQUFTVSxJQUEvQixFQUFxQztBQUMzQ0osV0FBUUssSUFBUixDQUFhUixPQUFiO0FBQ0EsR0FGTSxNQUVBLElBQUksQ0FBQywyQ0FBU1MsS0FBVixFQUFpQiwyQ0FBU0MsS0FBMUIsRUFBaUNDLE9BQWpDLENBQXlDZixTQUFTQyxLQUFsRCxJQUEyRCxDQUFDLENBQWhFLEVBQW1FO0FBQ3pFTSxXQUFRUyxHQUFSLENBQVlaLE9BQVo7QUFDQTtBQUVEOztBQXBDK0M7Z0NBQXBDUCxlLEdBQUFBLGUiLCJmaWxlIjoiYXBwZW5kZXIvY29uc29sZUFwcGVuZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBsb2c0anMgPGh0dHBzOi8vZ2l0aHViLmNvbS9hbmlnZW5lcm8vbG9nNGpzPlxuICpcbiAqIENvcHlyaWdodCAyMDE2LXByZXNlbnQgUm9iaW4gU2NodWx0eiA8aHR0cDovL2FuaWdlbmVyby5jb20+XG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0xvZ0FwcGVuZGVyfSBmcm9tICcuL2FwcGVuZGVyJztcbmltcG9ydCB7TG9nTGV2ZWx9IGZyb20gJy4uL2NvbnN0L2xvZ0xldmVsJztcblxuZXhwb3J0IGNsYXNzIENvbnNvbGVBcHBlbmRlciBleHRlbmRzIExvZ0FwcGVuZGVyIHtcblxuICAgIHN0YXRpYyBnZXQgbmFtZSgpIHtcbiAgICAgICAgcmV0dXJuICdjb25zb2xlJztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBcHBlbmRzIHRoZSBsb2cgZXZlbnRcbiAgICAgKiBAcGFyYW0gbG9nRXZlbnRcbiAgICAgKi9cbiAgICBhcHBlbmQobG9nRXZlbnQpIHtcbiAgICAgICAgaWYgKGxvZ0V2ZW50LmxldmVsIDw9IHRoaXMuZ2V0TG9nTGV2ZWwoKSkge1xuICAgICAgICAgICAgdGhpcy5fYXBwZW5kVG9Db25zb2xlKGxvZ0V2ZW50KTtcbiAgICAgICAgfVxuICAgIH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogQGZ1bmN0aW9uXG5cdCAqXG5cdCAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dFdmVudFxuXHQgKi9cblx0X2FwcGVuZFRvQ29uc29sZShsb2dFdmVudCkge1xuXG5cdFx0bGV0IG1lc3NhZ2UgPSB0aGlzLmZvcm1hdChsb2dFdmVudCk7XG5cblx0XHRpZiAobG9nRXZlbnQubGV2ZWwgPT0gTG9nTGV2ZWwuRVJST1IpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IobWVzc2FnZSk7XG5cdFx0fSBlbHNlIGlmIChsb2dFdmVudC5sZXZlbCA9PSBMb2dMZXZlbC5XQVJOKSB7XG5cdFx0XHRjb25zb2xlLndhcm4obWVzc2FnZSk7XG5cdFx0fSBlbHNlIGlmIChsb2dFdmVudC5sZXZlbCA9PSBMb2dMZXZlbC5JTkZPKSB7XG5cdFx0XHRjb25zb2xlLmluZm8obWVzc2FnZSk7XG5cdFx0fSBlbHNlIGlmIChbTG9nTGV2ZWwuREVCVUcsIExvZ0xldmVsLlRSQUNFXS5pbmRleE9mKGxvZ0V2ZW50LmxldmVsKSA+IC0xKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhtZXNzYWdlKTtcblx0XHR9XG5cblx0fVxuXG59XG4iXX0=