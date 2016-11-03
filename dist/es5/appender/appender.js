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
     * Returns whether or not the appender is active
     * @returns {boolean}
     */

    LogAppender.prototype.isActive = function isActive() {
        return true;
    };

    /**
     * Appends the log
     * @param {Object} logEvent
     */


    LogAppender.prototype.append = function append(logEvent) {}
    // stub


    /**
     * Gets the current log level
     * @returns {number}
     */
    ;

    LogAppender.prototype.getLogLevel = function getLogLevel() {
        return this.logLevel;
    };

    /**
     * Sets the log level of the appender
     * @param {number} logLevel
     */


    LogAppender.prototype.setLogLevel = function setLogLevel(logLevel) {
        this.logLevel = logLevel;
    };

    /**
     * Sets the layout of the appender
     * @param {string} layout
     */


    LogAppender.prototype.setLayout = function setLayout(layout) {
        this.layout = layout;
    };

    /**
     * Gets the layout associated with the appender
     * @returns {string}
     */


    LogAppender.prototype.getLayout = function getLayout() {
        return this.layout;
    };

    /**
     * Formats the log event using the layout provided
     * @param {Object} logEvent
     */


    LogAppender.prototype.format = function format(logEvent) {
        return (/*istanbul ignore next*/(0, _formatter.format)(this.getLayout(), logEvent)
        );
    };

    _createClass(LogAppender, null, [{
        key: 'name',


        /**
         * Gets the name of the appender (e.g. 'console')
         * @returns {null}
         */
        get: function get() {
            return null;
        }
    }]);

    return LogAppender;
}();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcGVuZGVyXFxhcHBlbmRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7O0lBRWE7Ozs7Ozs7Ozs7MEJBY1QsK0JBQVc7QUFDUCxlQUFPLElBQVAsQ0FETzs7Ozs7Ozs7OzBCQVFYLHlCQUFPLFVBQVU7Ozs7Ozs7Ozs7MEJBUWpCLHFDQUFjO0FBQ1YsZUFBTyxLQUFLLFFBQUwsQ0FERzs7Ozs7Ozs7OzBCQVFkLG1DQUFZLFVBQVU7QUFDbEIsYUFBSyxRQUFMLEdBQWdCLFFBQWhCLENBRGtCOzs7Ozs7Ozs7MEJBUXRCLCtCQUFVLFFBQVE7QUFDZCxhQUFLLE1BQUwsR0FBYyxNQUFkLENBRGM7Ozs7Ozs7OzswQkFRbEIsaUNBQVk7QUFDUixlQUFPLEtBQUssTUFBTCxDQURDOzs7Ozs7Ozs7MEJBUVoseUJBQU8sVUFBVTtBQUNiLGVBQU8sZ0RBQU8sS0FBSyxTQUFMLEVBQVAsRUFBeUIsUUFBekIsQ0FBUDtVQURhOzs7Ozs7Ozs7Ozs0QkF4REM7QUFDZCxtQkFBTyxJQUFQLENBRGMiLCJmaWxlIjoiYXBwZW5kZXJcXGFwcGVuZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtmb3JtYXR9IGZyb20gJy4uL2Zvcm1hdHRlcic7XHJcblxyXG5leHBvcnQgY2xhc3MgTG9nQXBwZW5kZXIge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0cyB0aGUgbmFtZSBvZiB0aGUgYXBwZW5kZXIgKGUuZy4gJ2NvbnNvbGUnKVxyXG4gICAgICogQHJldHVybnMge251bGx9XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBnZXQgbmFtZSgpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgd2hldGhlciBvciBub3QgdGhlIGFwcGVuZGVyIGlzIGFjdGl2ZVxyXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICAgKi9cclxuICAgIGlzQWN0aXZlKCkge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQXBwZW5kcyB0aGUgbG9nXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gbG9nRXZlbnRcclxuICAgICAqL1xyXG4gICAgYXBwZW5kKGxvZ0V2ZW50KSB7XHJcbiAgICAgICAgLy8gc3R1YlxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0cyB0aGUgY3VycmVudCBsb2cgbGV2ZWxcclxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIGdldExvZ0xldmVsKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmxvZ0xldmVsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB0aGUgbG9nIGxldmVsIG9mIHRoZSBhcHBlbmRlclxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxvZ0xldmVsXHJcbiAgICAgKi9cclxuICAgIHNldExvZ0xldmVsKGxvZ0xldmVsKSB7XHJcbiAgICAgICAgdGhpcy5sb2dMZXZlbCA9IGxvZ0xldmVsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB0aGUgbGF5b3V0IG9mIHRoZSBhcHBlbmRlclxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGxheW91dFxyXG4gICAgICovXHJcbiAgICBzZXRMYXlvdXQobGF5b3V0KSB7XHJcbiAgICAgICAgdGhpcy5sYXlvdXQgPSBsYXlvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXRzIHRoZSBsYXlvdXQgYXNzb2NpYXRlZCB3aXRoIHRoZSBhcHBlbmRlclxyXG4gICAgICogQHJldHVybnMge3N0cmluZ31cclxuICAgICAqL1xyXG4gICAgZ2V0TGF5b3V0KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmxheW91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEZvcm1hdHMgdGhlIGxvZyBldmVudCB1c2luZyB0aGUgbGF5b3V0IHByb3ZpZGVkXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gbG9nRXZlbnRcclxuICAgICAqL1xyXG4gICAgZm9ybWF0KGxvZ0V2ZW50KSB7XHJcbiAgICAgICAgcmV0dXJuIGZvcm1hdCh0aGlzLmdldExheW91dCgpLCBsb2dFdmVudCk7XHJcbiAgICB9XHJcblxyXG59XHJcbiJdfQ==