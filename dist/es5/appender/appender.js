/*istanbul ignore next*/'use strict';

exports.__esModule = true;
exports.LogAppender = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var /*istanbul ignore next*/_formatter = require('../formatter');

/*istanbul ignore next*/
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LogAppender = exports.LogAppender = function () {
    function LogAppender() {
        _classCallCheck(this, LogAppender);
    }

    /**
     *
     * @param logEvent
     */

    LogAppender.prototype.append = function append(logEvent) {};

    LogAppender.prototype.getLogLevel = function getLogLevel() {
        return this.logLevel;
    };

    /**
     *
     * @param {number} logLevel
     */


    LogAppender.prototype.setLogLevel = function setLogLevel(logLevel) {
        this.logLevel = logLevel;
    };

    /**
     *
     * @param layout
     */


    LogAppender.prototype.setLayout = function setLayout(layout) {
        this.layout = layout;
    };

    LogAppender.prototype.getLayout = function getLayout() {
        return this.layout;
    };

    /**
     *
     * @param logEvent
     */


    LogAppender.prototype.format = function format(logEvent) {
        return (/*istanbul ignore next*/(0, _formatter.format)(this.getLayout(), logEvent)
        );
    };

    _createClass(LogAppender, null, [{
        key: 'name',


        /**
         *
         * @returns {null}
         */
        get: function get() {
            return null;
        }
    }]);

    return LogAppender;
}();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcGVuZGVyXFxhcHBlbmRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7O0lBRWE7Ozs7Ozs7Ozs7MEJBY1QseUJBQU8sVUFBVTs7MEJBSWpCLHFDQUFjO0FBQ1YsZUFBTyxLQUFLLFFBQUwsQ0FERzs7Ozs7Ozs7OzBCQVFkLG1DQUFZLFVBQVU7QUFDbEIsYUFBSyxRQUFMLEdBQWdCLFFBQWhCLENBRGtCOzs7Ozs7Ozs7MEJBUXRCLCtCQUFVLFFBQVE7QUFDZCxhQUFLLE1BQUwsR0FBYyxNQUFkLENBRGM7OzswQkFJbEIsaUNBQVk7QUFDUixlQUFPLEtBQUssTUFBTCxDQURDOzs7Ozs7Ozs7MEJBUVoseUJBQU8sVUFBVTtBQUNiLGVBQU8sZ0RBQU8sS0FBSyxTQUFMLEVBQVAsRUFBeUIsUUFBekIsQ0FBUDtVQURhOzs7Ozs7Ozs7Ozs0QkF4Q0M7QUFDZCxtQkFBTyxJQUFQLENBRGMiLCJmaWxlIjoiYXBwZW5kZXJcXGFwcGVuZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtmb3JtYXR9IGZyb20gJy4uL2Zvcm1hdHRlcic7XHJcblxyXG5leHBvcnQgY2xhc3MgTG9nQXBwZW5kZXIge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtudWxsfVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZ2V0IG5hbWUoKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGxvZ0V2ZW50XHJcbiAgICAgKi9cclxuICAgIGFwcGVuZChsb2dFdmVudCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBnZXRMb2dMZXZlbCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5sb2dMZXZlbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbG9nTGV2ZWxcclxuICAgICAqL1xyXG4gICAgc2V0TG9nTGV2ZWwobG9nTGV2ZWwpIHtcclxuICAgICAgICB0aGlzLmxvZ0xldmVsID0gbG9nTGV2ZWw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGxheW91dFxyXG4gICAgICovXHJcbiAgICBzZXRMYXlvdXQobGF5b3V0KSB7XHJcbiAgICAgICAgdGhpcy5sYXlvdXQgPSBsYXlvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TGF5b3V0KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmxheW91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gbG9nRXZlbnRcclxuICAgICAqL1xyXG4gICAgZm9ybWF0KGxvZ0V2ZW50KSB7XHJcbiAgICAgICAgcmV0dXJuIGZvcm1hdCh0aGlzLmdldExheW91dCgpLCBsb2dFdmVudCk7XHJcbiAgICB9XHJcblxyXG59XHJcbiJdfQ==