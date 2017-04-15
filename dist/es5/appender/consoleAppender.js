/*istanbul ignore next*/'use strict';

exports.__esModule = true;
exports.ConsoleAppender = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var /*istanbul ignore next*/_appender = require('./appender');

var /*istanbul ignore next*/_logLevel = require('../const/logLevel');

/*istanbul ignore next*/function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * log4js <https://github.com/anigenero/log4js>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Copyright 2016-present Robin Schultz <http://anigenero.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Released under the MIT License
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var ConsoleAppender = exports.ConsoleAppender = function (_LogAppender) {
	_inherits(ConsoleAppender, _LogAppender);

	function ConsoleAppender() {
		_classCallCheck(this, ConsoleAppender);

		return _possibleConstructorReturn(this, _LogAppender.apply(this, arguments));
	}

	/**
  * Appends the log event
  * @param logEvent
  */
	ConsoleAppender.prototype.append = function append(logEvent) {
		if (logEvent.level <= this.getLogLevel()) {
			this._appendToConsole(logEvent);
		}
	};

	/**
  * @private
  * @function
  *
  * @param {LOG_EVENT} logEvent
  */


	ConsoleAppender.prototype._appendToConsole = function _appendToConsole(logEvent) {

		var message = this.format(logEvent);

		if (logEvent.level == /*istanbul ignore next*/_logLevel.LogLevel.ERROR) {
			console.error(message);
		} else if (logEvent.level == /*istanbul ignore next*/_logLevel.LogLevel.WARN) {
			console.warn(message);
		} else if (logEvent.level == /*istanbul ignore next*/_logLevel.LogLevel.INFO) {
			console.info(message);
		} else if ([/*istanbul ignore next*/_logLevel.LogLevel.DEBUG, /*istanbul ignore next*/_logLevel.LogLevel.TRACE].indexOf(logEvent.level) > -1) {
			console.log(message);
		}
	};

	_createClass(ConsoleAppender, null, [{
		key: 'name',
		get: function get() {
			return 'console';
		}
	}]);

	return ConsoleAppender;
}(_appender.LogAppender);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcGVuZGVyL2NvbnNvbGVBcHBlbmRlci5qcyJdLCJuYW1lcyI6WyJDb25zb2xlQXBwZW5kZXIiLCJhcHBlbmQiLCJsb2dFdmVudCIsImxldmVsIiwiZ2V0TG9nTGV2ZWwiLCJfYXBwZW5kVG9Db25zb2xlIiwibWVzc2FnZSIsImZvcm1hdCIsIkVSUk9SIiwiY29uc29sZSIsImVycm9yIiwiV0FSTiIsIndhcm4iLCJJTkZPIiwiaW5mbyIsIkRFQlVHIiwiVFJBQ0UiLCJpbmRleE9mIiwibG9nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBT0E7O0FBQ0E7Ozs7OzsrZUFSQTs7Ozs7OztJQVVhQSxlLFdBQUFBLGU7Ozs7Ozs7OztBQU1UOzs7OzJCQUlBQyxNLG1CQUFPQyxRLEVBQVU7QUFDYixNQUFJQSxTQUFTQyxLQUFULElBQWtCLEtBQUtDLFdBQUwsRUFBdEIsRUFBMEM7QUFDdEMsUUFBS0MsZ0JBQUwsQ0FBc0JILFFBQXRCO0FBQ0g7QUFDSixFOztBQUVKOzs7Ozs7OzsyQkFNQUcsZ0IsNkJBQWlCSCxRLEVBQVU7O0FBRTFCLE1BQUlJLFVBQVUsS0FBS0MsTUFBTCxDQUFZTCxRQUFaLENBQWQ7O0FBRUEsTUFBSUEsU0FBU0MsS0FBVCxJQUFrQiwyQ0FBU0ssS0FBL0IsRUFBc0M7QUFDckNDLFdBQVFDLEtBQVIsQ0FBY0osT0FBZDtBQUNBLEdBRkQsTUFFTyxJQUFJSixTQUFTQyxLQUFULElBQWtCLDJDQUFTUSxJQUEvQixFQUFxQztBQUMzQ0YsV0FBUUcsSUFBUixDQUFhTixPQUFiO0FBQ0EsR0FGTSxNQUVBLElBQUlKLFNBQVNDLEtBQVQsSUFBa0IsMkNBQVNVLElBQS9CLEVBQXFDO0FBQzNDSixXQUFRSyxJQUFSLENBQWFSLE9BQWI7QUFDQSxHQUZNLE1BRUEsSUFBSSxDQUFDLDJDQUFTUyxLQUFWLEVBQWlCLDJDQUFTQyxLQUExQixFQUFpQ0MsT0FBakMsQ0FBeUNmLFNBQVNDLEtBQWxELElBQTJELENBQUMsQ0FBaEUsRUFBbUU7QUFDekVNLFdBQVFTLEdBQVIsQ0FBWVosT0FBWjtBQUNBO0FBRUQsRTs7OztzQkFsQ29CO0FBQ2QsVUFBTyxTQUFQO0FBQ0giLCJmaWxlIjoiYXBwZW5kZXIvY29uc29sZUFwcGVuZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBsb2c0anMgPGh0dHBzOi8vZ2l0aHViLmNvbS9hbmlnZW5lcm8vbG9nNGpzPlxuICpcbiAqIENvcHlyaWdodCAyMDE2LXByZXNlbnQgUm9iaW4gU2NodWx0eiA8aHR0cDovL2FuaWdlbmVyby5jb20+XG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0xvZ0FwcGVuZGVyfSBmcm9tICcuL2FwcGVuZGVyJztcbmltcG9ydCB7TG9nTGV2ZWx9IGZyb20gJy4uL2NvbnN0L2xvZ0xldmVsJztcblxuZXhwb3J0IGNsYXNzIENvbnNvbGVBcHBlbmRlciBleHRlbmRzIExvZ0FwcGVuZGVyIHtcblxuICAgIHN0YXRpYyBnZXQgbmFtZSgpIHtcbiAgICAgICAgcmV0dXJuICdjb25zb2xlJztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBcHBlbmRzIHRoZSBsb2cgZXZlbnRcbiAgICAgKiBAcGFyYW0gbG9nRXZlbnRcbiAgICAgKi9cbiAgICBhcHBlbmQobG9nRXZlbnQpIHtcbiAgICAgICAgaWYgKGxvZ0V2ZW50LmxldmVsIDw9IHRoaXMuZ2V0TG9nTGV2ZWwoKSkge1xuICAgICAgICAgICAgdGhpcy5fYXBwZW5kVG9Db25zb2xlKGxvZ0V2ZW50KTtcbiAgICAgICAgfVxuICAgIH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogQGZ1bmN0aW9uXG5cdCAqXG5cdCAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dFdmVudFxuXHQgKi9cblx0X2FwcGVuZFRvQ29uc29sZShsb2dFdmVudCkge1xuXG5cdFx0bGV0IG1lc3NhZ2UgPSB0aGlzLmZvcm1hdChsb2dFdmVudCk7XG5cblx0XHRpZiAobG9nRXZlbnQubGV2ZWwgPT0gTG9nTGV2ZWwuRVJST1IpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IobWVzc2FnZSk7XG5cdFx0fSBlbHNlIGlmIChsb2dFdmVudC5sZXZlbCA9PSBMb2dMZXZlbC5XQVJOKSB7XG5cdFx0XHRjb25zb2xlLndhcm4obWVzc2FnZSk7XG5cdFx0fSBlbHNlIGlmIChsb2dFdmVudC5sZXZlbCA9PSBMb2dMZXZlbC5JTkZPKSB7XG5cdFx0XHRjb25zb2xlLmluZm8obWVzc2FnZSk7XG5cdFx0fSBlbHNlIGlmIChbTG9nTGV2ZWwuREVCVUcsIExvZ0xldmVsLlRSQUNFXS5pbmRleE9mKGxvZ0V2ZW50LmxldmVsKSA+IC0xKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhtZXNzYWdlKTtcblx0XHR9XG5cblx0fVxuXG59XG4iXX0=