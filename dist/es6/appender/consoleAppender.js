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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcGVuZGVyXFxjb25zb2xlQXBwZW5kZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQU9BOztBQUNBOzs7Ozs7Ozs7QUFFTyxNQUFNLGVBQU4sdURBQTBDOztBQUU3QyxZQUFXLElBQVgsR0FBa0I7QUFDZCxTQUFPLFNBQVAsQ0FEYztFQUFsQjs7Ozs7O0FBRjZDLE9BVTdDLENBQU8sUUFBUCxFQUFpQjtBQUNiLE1BQUksU0FBUyxLQUFULElBQWtCLEtBQUssV0FBTCxFQUFsQixFQUFzQztBQUN0QyxRQUFLLGdCQUFMLENBQXNCLFFBQXRCLEVBRHNDO0dBQTFDO0VBREo7Ozs7Ozs7O0FBVjZDLGlCQXNCaEQsQ0FBaUIsUUFBakIsRUFBMkI7O0FBRTFCLE1BQUksVUFBVSxLQUFLLE1BQUwsQ0FBWSxRQUFaLENBQVYsQ0FGc0I7O0FBSTFCLE1BQUksU0FBUyxLQUFULElBQWtCLDJDQUFTLEtBQVQsRUFBZ0I7QUFDckMsV0FBUSxLQUFSLENBQWMsT0FBZCxFQURxQztHQUF0QyxNQUVPLElBQUksU0FBUyxLQUFULElBQWtCLDJDQUFTLElBQVQsRUFBZTtBQUMzQyxXQUFRLElBQVIsQ0FBYSxPQUFiLEVBRDJDO0dBQXJDLE1BRUEsSUFBSSxTQUFTLEtBQVQsSUFBa0IsMkNBQVMsSUFBVCxFQUFlO0FBQzNDLFdBQVEsSUFBUixDQUFhLE9BQWIsRUFEMkM7R0FBckMsTUFFQSxJQUFJLENBQUMsMkNBQVMsS0FBVCxFQUFnQiwyQ0FBUyxLQUFULENBQWpCLENBQWlDLE9BQWpDLENBQXlDLFNBQVMsS0FBVCxDQUF6QyxHQUEyRCxDQUFDLENBQUQsRUFBSTtBQUN6RSxXQUFRLEdBQVIsQ0FBWSxPQUFaLEVBRHlFO0dBQW5FO0VBVlI7O0NBdEJNO2dDQUFNIiwiZmlsZSI6ImFwcGVuZGVyXFxjb25zb2xlQXBwZW5kZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogbG9nNGpzIDxodHRwczovL2dpdGh1Yi5jb20vYW5pZ2VuZXJvL2xvZzRqcz5cclxuICpcclxuICogQ29weXJpZ2h0IDIwMTYtcHJlc2VudCBSb2JpbiBTY2h1bHR6IDxodHRwOi8vYW5pZ2VuZXJvLmNvbT5cclxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlXHJcbiAqL1xyXG5cclxuaW1wb3J0IHtMb2dBcHBlbmRlcn0gZnJvbSAnLi9hcHBlbmRlcic7XHJcbmltcG9ydCB7TG9nTGV2ZWx9IGZyb20gJy4uL2NvbnN0L2xvZ0xldmVsJztcclxuXHJcbmV4cG9ydCBjbGFzcyBDb25zb2xlQXBwZW5kZXIgZXh0ZW5kcyBMb2dBcHBlbmRlciB7XHJcblxyXG4gICAgc3RhdGljIGdldCBuYW1lKCkge1xyXG4gICAgICAgIHJldHVybiAnY29uc29sZSc7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBcHBlbmRzIHRoZSBsb2cgZXZlbnRcclxuICAgICAqIEBwYXJhbSBsb2dFdmVudFxyXG4gICAgICovXHJcbiAgICBhcHBlbmQobG9nRXZlbnQpIHtcclxuICAgICAgICBpZiAobG9nRXZlbnQubGV2ZWwgPD0gdGhpcy5nZXRMb2dMZXZlbCgpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2FwcGVuZFRvQ29uc29sZShsb2dFdmVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHQvKipcclxuXHQgKiBAcHJpdmF0ZVxyXG5cdCAqIEBmdW5jdGlvblxyXG5cdCAqXHJcblx0ICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XHJcblx0ICovXHJcblx0X2FwcGVuZFRvQ29uc29sZShsb2dFdmVudCkge1xyXG5cclxuXHRcdGxldCBtZXNzYWdlID0gdGhpcy5mb3JtYXQobG9nRXZlbnQpO1xyXG5cclxuXHRcdGlmIChsb2dFdmVudC5sZXZlbCA9PSBMb2dMZXZlbC5FUlJPUikge1xyXG5cdFx0XHRjb25zb2xlLmVycm9yKG1lc3NhZ2UpO1xyXG5cdFx0fSBlbHNlIGlmIChsb2dFdmVudC5sZXZlbCA9PSBMb2dMZXZlbC5XQVJOKSB7XHJcblx0XHRcdGNvbnNvbGUud2FybihtZXNzYWdlKTtcclxuXHRcdH0gZWxzZSBpZiAobG9nRXZlbnQubGV2ZWwgPT0gTG9nTGV2ZWwuSU5GTykge1xyXG5cdFx0XHRjb25zb2xlLmluZm8obWVzc2FnZSk7XHJcblx0XHR9IGVsc2UgaWYgKFtMb2dMZXZlbC5ERUJVRywgTG9nTGV2ZWwuVFJBQ0VdLmluZGV4T2YobG9nRXZlbnQubGV2ZWwpID4gLTEpIHtcclxuXHRcdFx0Y29uc29sZS5sb2cobWVzc2FnZSk7XHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcbn1cclxuIl19