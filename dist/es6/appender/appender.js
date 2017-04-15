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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcGVuZGVyL2FwcGVuZGVyLmpzIl0sIm5hbWVzIjpbIkxvZ0FwcGVuZGVyIiwibmFtZSIsImlzQWN0aXZlIiwiYXBwZW5kIiwibG9nRXZlbnQiLCJnZXRMb2dMZXZlbCIsImxvZ0xldmVsIiwic2V0TG9nTGV2ZWwiLCJzZXRMYXlvdXQiLCJsYXlvdXQiLCJnZXRMYXlvdXQiLCJmb3JtYXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFFTyxNQUFNQSxXQUFOLENBQWtCOztBQUVyQjs7OztBQUlBLGVBQVdDLElBQVgsR0FBa0I7QUFDZCxlQUFPLElBQVA7QUFDSDs7QUFFRDs7OztBQUlBQyxlQUFXO0FBQ1AsZUFBTyxJQUFQO0FBQ0g7O0FBRUQ7Ozs7QUFJQUMsV0FBT0MsUUFBUCxFQUFpQixDQUVoQjtBQURHOzs7QUFHSjs7OztBQUlBQyxrQkFBYztBQUNWLGVBQU8sS0FBS0MsUUFBWjtBQUNIOztBQUVEOzs7O0FBSUFDLGdCQUFZRCxRQUFaLEVBQXNCO0FBQ2xCLGFBQUtBLFFBQUwsR0FBZ0JBLFFBQWhCO0FBQ0g7O0FBRUQ7Ozs7QUFJQUUsY0FBVUMsTUFBVixFQUFrQjtBQUNkLGFBQUtBLE1BQUwsR0FBY0EsTUFBZDtBQUNIOztBQUVEOzs7O0FBSUFDLGdCQUFZO0FBQ1IsZUFBTyxLQUFLRCxNQUFaO0FBQ0g7O0FBRUQ7Ozs7QUFJQUUsV0FBT1AsUUFBUCxFQUFpQjtBQUNiLGVBQU8sZ0RBQU8sS0FBS00sU0FBTCxFQUFQLEVBQXlCTixRQUF6QjtBQUFQO0FBQ0g7O0FBaEVvQjtnQ0FBWkosVyxHQUFBQSxXIiwiZmlsZSI6ImFwcGVuZGVyL2FwcGVuZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtmb3JtYXR9IGZyb20gJy4uL2Zvcm1hdHRlcic7XG5cbmV4cG9ydCBjbGFzcyBMb2dBcHBlbmRlciB7XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBuYW1lIG9mIHRoZSBhcHBlbmRlciAoZS5nLiAnY29uc29sZScpXG4gICAgICogQHJldHVybnMge251bGx9XG4gICAgICovXG4gICAgc3RhdGljIGdldCBuYW1lKCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IHRoZSBhcHBlbmRlciBpcyBhY3RpdmVcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBpc0FjdGl2ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXBwZW5kcyB0aGUgbG9nXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGxvZ0V2ZW50XG4gICAgICovXG4gICAgYXBwZW5kKGxvZ0V2ZW50KSB7XG4gICAgICAgIC8vIHN0dWJcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBjdXJyZW50IGxvZyBsZXZlbFxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG4gICAgZ2V0TG9nTGV2ZWwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvZ0xldmVsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIGxvZyBsZXZlbCBvZiB0aGUgYXBwZW5kZXJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbG9nTGV2ZWxcbiAgICAgKi9cbiAgICBzZXRMb2dMZXZlbChsb2dMZXZlbCkge1xuICAgICAgICB0aGlzLmxvZ0xldmVsID0gbG9nTGV2ZWw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgbGF5b3V0IG9mIHRoZSBhcHBlbmRlclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBsYXlvdXRcbiAgICAgKi9cbiAgICBzZXRMYXlvdXQobGF5b3V0KSB7XG4gICAgICAgIHRoaXMubGF5b3V0ID0gbGF5b3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIGxheW91dCBhc3NvY2lhdGVkIHdpdGggdGhlIGFwcGVuZGVyXG4gICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgKi9cbiAgICBnZXRMYXlvdXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxheW91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGb3JtYXRzIHRoZSBsb2cgZXZlbnQgdXNpbmcgdGhlIGxheW91dCBwcm92aWRlZFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBsb2dFdmVudFxuICAgICAqL1xuICAgIGZvcm1hdChsb2dFdmVudCkge1xuICAgICAgICByZXR1cm4gZm9ybWF0KHRoaXMuZ2V0TGF5b3V0KCksIGxvZ0V2ZW50KTtcbiAgICB9XG5cbn1cbiJdfQ==