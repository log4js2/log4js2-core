/*istanbul ignore next*/'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LogAppender = undefined;

var /*istanbul ignore next*/_formatter = require('../formatter');

class LogAppender {

    /**
     * Gets the name of the appender (e.g. 'console')
     * @returns {null}
     */
    static get name() {
        return null;
    }

    /**
     * Returns whether or not the appender is active
     * @returns {boolean}
     */
    isActive() {
        return true;
    }

    /**
     * Appends the log
     * @param {Object} logEvent
     */
    append(logEvent) {}
    // stub


    /**
     * Gets the current log level
     * @returns {number}
     */
    getLogLevel() {
        return this.logLevel;
    }

    /**
     * Sets the log level of the appender
     * @param {number} logLevel
     */
    setLogLevel(logLevel) {
        this.logLevel = logLevel;
    }

    /**
     * Sets the layout of the appender
     * @param {string} layout
     */
    setLayout(layout) {
        this.layout = layout;
    }

    /**
     * Gets the layout associated with the appender
     * @returns {string}
     */
    getLayout() {
        return this.layout;
    }

    /**
     * Formats the log event using the layout provided
     * @param {Object} logEvent
     */
    format(logEvent) {
        return (/*istanbul ignore next*/(0, _formatter.format)(this.getLayout(), logEvent)
        );
    }

}
/*istanbul ignore next*/exports.LogAppender = LogAppender;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcGVuZGVyXFxhcHBlbmRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBRU8sTUFBTSxXQUFOLENBQWtCOzs7Ozs7QUFNckIsZUFBVyxJQUFYLEdBQWtCO0FBQ2QsZUFBTyxJQUFQLENBRGM7S0FBbEI7Ozs7OztBQU5xQixZQWNyQixHQUFXO0FBQ1AsZUFBTyxJQUFQLENBRE87S0FBWDs7Ozs7O0FBZHFCLFVBc0JyQixDQUFPLFFBQVAsRUFBaUI7Ozs7Ozs7O0FBQWpCLGVBUUEsR0FBYztBQUNWLGVBQU8sS0FBSyxRQUFMLENBREc7S0FBZDs7Ozs7O0FBOUJxQixlQXNDckIsQ0FBWSxRQUFaLEVBQXNCO0FBQ2xCLGFBQUssUUFBTCxHQUFnQixRQUFoQixDQURrQjtLQUF0Qjs7Ozs7O0FBdENxQixhQThDckIsQ0FBVSxNQUFWLEVBQWtCO0FBQ2QsYUFBSyxNQUFMLEdBQWMsTUFBZCxDQURjO0tBQWxCOzs7Ozs7QUE5Q3FCLGFBc0RyQixHQUFZO0FBQ1IsZUFBTyxLQUFLLE1BQUwsQ0FEQztLQUFaOzs7Ozs7QUF0RHFCLFVBOERyQixDQUFPLFFBQVAsRUFBaUI7QUFDYixlQUFPLGdEQUFPLEtBQUssU0FBTCxFQUFQLEVBQXlCLFFBQXpCLENBQVA7VUFEYTtLQUFqQjs7Q0E5REc7Z0NBQU0iLCJmaWxlIjoiYXBwZW5kZXJcXGFwcGVuZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtmb3JtYXR9IGZyb20gJy4uL2Zvcm1hdHRlcic7XHJcblxyXG5leHBvcnQgY2xhc3MgTG9nQXBwZW5kZXIge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0cyB0aGUgbmFtZSBvZiB0aGUgYXBwZW5kZXIgKGUuZy4gJ2NvbnNvbGUnKVxyXG4gICAgICogQHJldHVybnMge251bGx9XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBnZXQgbmFtZSgpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgd2hldGhlciBvciBub3QgdGhlIGFwcGVuZGVyIGlzIGFjdGl2ZVxyXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICAgKi9cclxuICAgIGlzQWN0aXZlKCkge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQXBwZW5kcyB0aGUgbG9nXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gbG9nRXZlbnRcclxuICAgICAqL1xyXG4gICAgYXBwZW5kKGxvZ0V2ZW50KSB7XHJcbiAgICAgICAgLy8gc3R1YlxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0cyB0aGUgY3VycmVudCBsb2cgbGV2ZWxcclxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIGdldExvZ0xldmVsKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmxvZ0xldmVsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB0aGUgbG9nIGxldmVsIG9mIHRoZSBhcHBlbmRlclxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxvZ0xldmVsXHJcbiAgICAgKi9cclxuICAgIHNldExvZ0xldmVsKGxvZ0xldmVsKSB7XHJcbiAgICAgICAgdGhpcy5sb2dMZXZlbCA9IGxvZ0xldmVsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB0aGUgbGF5b3V0IG9mIHRoZSBhcHBlbmRlclxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGxheW91dFxyXG4gICAgICovXHJcbiAgICBzZXRMYXlvdXQobGF5b3V0KSB7XHJcbiAgICAgICAgdGhpcy5sYXlvdXQgPSBsYXlvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXRzIHRoZSBsYXlvdXQgYXNzb2NpYXRlZCB3aXRoIHRoZSBhcHBlbmRlclxyXG4gICAgICogQHJldHVybnMge3N0cmluZ31cclxuICAgICAqL1xyXG4gICAgZ2V0TGF5b3V0KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmxheW91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEZvcm1hdHMgdGhlIGxvZyBldmVudCB1c2luZyB0aGUgbGF5b3V0IHByb3ZpZGVkXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gbG9nRXZlbnRcclxuICAgICAqL1xyXG4gICAgZm9ybWF0KGxvZ0V2ZW50KSB7XHJcbiAgICAgICAgcmV0dXJuIGZvcm1hdCh0aGlzLmdldExheW91dCgpLCBsb2dFdmVudCk7XHJcbiAgICB9XHJcblxyXG59XHJcbiJdfQ==