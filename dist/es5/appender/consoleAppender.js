/*istanbul ignore next*/'use strict';

exports.__esModule = true;
exports.ConsoleAppender = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var /*istanbul ignore next*/_appender = require('./appender');

var /*istanbul ignore next*/_logLevel = require('../const/logLevel');

/*istanbul ignore next*/
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
  * @param {LOG_EVENT} loggingEvent
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcGVuZGVyXFxjb25zb2xlQXBwZW5kZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQU9BOztBQUNBOzs7Ozs7Ozs7Ozs7OztJQUVhOzs7Ozs7Ozs7Ozs7OzsyQkFVVCx5QkFBTyxVQUFVO0FBQ2IsTUFBSSxTQUFTLEtBQVQsSUFBa0IsS0FBSyxXQUFMLEVBQWxCLEVBQXNDO0FBQ3RDLFFBQUssZ0JBQUwsQ0FBc0IsUUFBdEIsRUFEc0M7R0FBMUM7Ozs7Ozs7Ozs7OzJCQVdQLDZDQUFpQixVQUFVOztBQUUxQixNQUFJLFVBQVUsS0FBSyxNQUFMLENBQVksUUFBWixDQUFWLENBRnNCOztBQUkxQixNQUFJLFNBQVMsS0FBVCxJQUFrQiwyQ0FBUyxLQUFULEVBQWdCO0FBQ3JDLFdBQVEsS0FBUixDQUFjLE9BQWQsRUFEcUM7R0FBdEMsTUFFTyxJQUFJLFNBQVMsS0FBVCxJQUFrQiwyQ0FBUyxJQUFULEVBQWU7QUFDM0MsV0FBUSxJQUFSLENBQWEsT0FBYixFQUQyQztHQUFyQyxNQUVBLElBQUksU0FBUyxLQUFULElBQWtCLDJDQUFTLElBQVQsRUFBZTtBQUMzQyxXQUFRLElBQVIsQ0FBYSxPQUFiLEVBRDJDO0dBQXJDLE1BRUEsSUFBSSxDQUFDLDJDQUFTLEtBQVQsRUFBZ0IsMkNBQVMsS0FBVCxDQUFqQixDQUFpQyxPQUFqQyxDQUF5QyxTQUFTLEtBQVQsQ0FBekMsR0FBMkQsQ0FBQyxDQUFELEVBQUk7QUFDekUsV0FBUSxHQUFSLENBQVksT0FBWixFQUR5RTtHQUFuRTs7Ozs7c0JBOUJhO0FBQ2QsVUFBTyxTQUFQLENBRGMiLCJmaWxlIjoiYXBwZW5kZXJcXGNvbnNvbGVBcHBlbmRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBsb2c0anMgPGh0dHBzOi8vZ2l0aHViLmNvbS9hbmlnZW5lcm8vbG9nNGpzPlxyXG4gKlxyXG4gKiBDb3B5cmlnaHQgMjAxNi1wcmVzZW50IFJvYmluIFNjaHVsdHogPGh0dHA6Ly9hbmlnZW5lcm8uY29tPlxyXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2VcclxuICovXHJcblxyXG5pbXBvcnQge0xvZ0FwcGVuZGVyfSBmcm9tICcuL2FwcGVuZGVyJztcclxuaW1wb3J0IHtMb2dMZXZlbH0gZnJvbSAnLi4vY29uc3QvbG9nTGV2ZWwnO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbnNvbGVBcHBlbmRlciBleHRlbmRzIExvZ0FwcGVuZGVyIHtcclxuXHJcbiAgICBzdGF0aWMgZ2V0IG5hbWUoKSB7XHJcbiAgICAgICAgcmV0dXJuICdjb25zb2xlJztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFwcGVuZHMgdGhlIGxvZyBldmVudFxyXG4gICAgICogQHBhcmFtIGxvZ0V2ZW50XHJcbiAgICAgKi9cclxuICAgIGFwcGVuZChsb2dFdmVudCkge1xyXG4gICAgICAgIGlmIChsb2dFdmVudC5sZXZlbCA8PSB0aGlzLmdldExvZ0xldmVsKCkpIHtcclxuICAgICAgICAgICAgdGhpcy5fYXBwZW5kVG9Db25zb2xlKGxvZ0V2ZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBwcml2YXRlXHJcblx0ICogQGZ1bmN0aW9uXHJcblx0ICpcclxuXHQgKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nZ2luZ0V2ZW50XHJcblx0ICovXHJcblx0X2FwcGVuZFRvQ29uc29sZShsb2dFdmVudCkge1xyXG5cclxuXHRcdGxldCBtZXNzYWdlID0gdGhpcy5mb3JtYXQobG9nRXZlbnQpO1xyXG5cclxuXHRcdGlmIChsb2dFdmVudC5sZXZlbCA9PSBMb2dMZXZlbC5FUlJPUikge1xyXG5cdFx0XHRjb25zb2xlLmVycm9yKG1lc3NhZ2UpO1xyXG5cdFx0fSBlbHNlIGlmIChsb2dFdmVudC5sZXZlbCA9PSBMb2dMZXZlbC5XQVJOKSB7XHJcblx0XHRcdGNvbnNvbGUud2FybihtZXNzYWdlKTtcclxuXHRcdH0gZWxzZSBpZiAobG9nRXZlbnQubGV2ZWwgPT0gTG9nTGV2ZWwuSU5GTykge1xyXG5cdFx0XHRjb25zb2xlLmluZm8obWVzc2FnZSk7XHJcblx0XHR9IGVsc2UgaWYgKFtMb2dMZXZlbC5ERUJVRywgTG9nTGV2ZWwuVFJBQ0VdLmluZGV4T2YobG9nRXZlbnQubGV2ZWwpID4gLTEpIHtcclxuXHRcdFx0Y29uc29sZS5sb2cobWVzc2FnZSk7XHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcbn1cclxuIl19