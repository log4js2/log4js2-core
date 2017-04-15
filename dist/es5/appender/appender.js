/*istanbul ignore next*/'use strict';

exports.__esModule = true;
exports.LogAppender = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var /*istanbul ignore next*/_formatter = require('../formatter');

/*istanbul ignore next*/function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcGVuZGVyL2FwcGVuZGVyLmpzIl0sIm5hbWVzIjpbIkxvZ0FwcGVuZGVyIiwiaXNBY3RpdmUiLCJhcHBlbmQiLCJsb2dFdmVudCIsImdldExvZ0xldmVsIiwibG9nTGV2ZWwiLCJzZXRMb2dMZXZlbCIsInNldExheW91dCIsImxheW91dCIsImdldExheW91dCIsImZvcm1hdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOzs7O0lBRWFBLFcsV0FBQUEsVzs7Ozs7QUFVVDs7OzswQkFJQUMsUSx1QkFBVztBQUNQLGVBQU8sSUFBUDtBQUNILEs7O0FBRUQ7Ozs7OzswQkFJQUMsTSxtQkFBT0MsUSxFQUFVLENBRWhCO0FBREc7OztBQUdKOzs7Ozs7MEJBSUFDLFcsMEJBQWM7QUFDVixlQUFPLEtBQUtDLFFBQVo7QUFDSCxLOztBQUVEOzs7Ozs7MEJBSUFDLFcsd0JBQVlELFEsRUFBVTtBQUNsQixhQUFLQSxRQUFMLEdBQWdCQSxRQUFoQjtBQUNILEs7O0FBRUQ7Ozs7OzswQkFJQUUsUyxzQkFBVUMsTSxFQUFRO0FBQ2QsYUFBS0EsTUFBTCxHQUFjQSxNQUFkO0FBQ0gsSzs7QUFFRDs7Ozs7OzBCQUlBQyxTLHdCQUFZO0FBQ1IsZUFBTyxLQUFLRCxNQUFaO0FBQ0gsSzs7QUFFRDs7Ozs7OzBCQUlBRSxNLG1CQUFPUCxRLEVBQVU7QUFDYixlQUFPLGdEQUFPLEtBQUtNLFNBQUwsRUFBUCxFQUF5Qk4sUUFBekI7QUFBUDtBQUNILEs7Ozs7OztBQTlERDs7Ozs0QkFJa0I7QUFDZCxtQkFBTyxJQUFQO0FBQ0giLCJmaWxlIjoiYXBwZW5kZXIvYXBwZW5kZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2Zvcm1hdH0gZnJvbSAnLi4vZm9ybWF0dGVyJztcblxuZXhwb3J0IGNsYXNzIExvZ0FwcGVuZGVyIHtcblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIG5hbWUgb2YgdGhlIGFwcGVuZGVyIChlLmcuICdjb25zb2xlJylcbiAgICAgKiBAcmV0dXJucyB7bnVsbH1cbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IG5hbWUoKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgd2hldGhlciBvciBub3QgdGhlIGFwcGVuZGVyIGlzIGFjdGl2ZVxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqL1xuICAgIGlzQWN0aXZlKCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBcHBlbmRzIHRoZSBsb2dcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gbG9nRXZlbnRcbiAgICAgKi9cbiAgICBhcHBlbmQobG9nRXZlbnQpIHtcbiAgICAgICAgLy8gc3R1YlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIGN1cnJlbnQgbG9nIGxldmVsXG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKi9cbiAgICBnZXRMb2dMZXZlbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9nTGV2ZWw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgbG9nIGxldmVsIG9mIHRoZSBhcHBlbmRlclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsb2dMZXZlbFxuICAgICAqL1xuICAgIHNldExvZ0xldmVsKGxvZ0xldmVsKSB7XG4gICAgICAgIHRoaXMubG9nTGV2ZWwgPSBsb2dMZXZlbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBsYXlvdXQgb2YgdGhlIGFwcGVuZGVyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGxheW91dFxuICAgICAqL1xuICAgIHNldExheW91dChsYXlvdXQpIHtcbiAgICAgICAgdGhpcy5sYXlvdXQgPSBsYXlvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgbGF5b3V0IGFzc29jaWF0ZWQgd2l0aCB0aGUgYXBwZW5kZXJcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgIGdldExheW91dCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGF5b3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZvcm1hdHMgdGhlIGxvZyBldmVudCB1c2luZyB0aGUgbGF5b3V0IHByb3ZpZGVkXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGxvZ0V2ZW50XG4gICAgICovXG4gICAgZm9ybWF0KGxvZ0V2ZW50KSB7XG4gICAgICAgIHJldHVybiBmb3JtYXQodGhpcy5nZXRMYXlvdXQoKSwgbG9nRXZlbnQpO1xuICAgIH1cblxufVxuIl19