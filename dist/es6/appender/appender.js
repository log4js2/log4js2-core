/*istanbul ignore next*/'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LogAppender = undefined;

var /*istanbul ignore next*/_formatter = require('../formatter');

class LogAppender {

    /**
     *
     * @returns {null}
     */
    static get name() {
        return null;
    }

    /**
     *
     * @param logEvent
     */
    append(logEvent) {}

    getLogLevel() {
        return this.logLevel;
    }

    /**
     *
     * @param {number} logLevel
     */
    setLogLevel(logLevel) {
        this.logLevel = logLevel;
    }

    /**
     *
     * @param layout
     */
    setLayout(layout) {
        this.layout = layout;
    }

    getLayout() {
        return this.layout;
    }

    /**
     *
     * @param logEvent
     */
    format(logEvent) {
        return (/*istanbul ignore next*/(0, _formatter.format)(this.getLayout(), logEvent)
        );
    }

}
/*istanbul ignore next*/exports.LogAppender = LogAppender;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcGVuZGVyXFxhcHBlbmRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBRU8sTUFBTSxXQUFOLENBQWtCOzs7Ozs7QUFNckIsZUFBVyxJQUFYLEdBQWtCO0FBQ2QsZUFBTyxJQUFQLENBRGM7S0FBbEI7Ozs7OztBQU5xQixVQWNyQixDQUFPLFFBQVAsRUFBaUIsRUFBakI7O0FBSUEsa0JBQWM7QUFDVixlQUFPLEtBQUssUUFBTCxDQURHO0tBQWQ7Ozs7OztBQWxCcUIsZUEwQnJCLENBQVksUUFBWixFQUFzQjtBQUNsQixhQUFLLFFBQUwsR0FBZ0IsUUFBaEIsQ0FEa0I7S0FBdEI7Ozs7OztBQTFCcUIsYUFrQ3JCLENBQVUsTUFBVixFQUFrQjtBQUNkLGFBQUssTUFBTCxHQUFjLE1BQWQsQ0FEYztLQUFsQjs7QUFJQSxnQkFBWTtBQUNSLGVBQU8sS0FBSyxNQUFMLENBREM7S0FBWjs7Ozs7O0FBdENxQixVQThDckIsQ0FBTyxRQUFQLEVBQWlCO0FBQ2IsZUFBTyxnREFBTyxLQUFLLFNBQUwsRUFBUCxFQUF5QixRQUF6QixDQUFQO1VBRGE7S0FBakI7O0NBOUNHO2dDQUFNIiwiZmlsZSI6ImFwcGVuZGVyXFxhcHBlbmRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Zm9ybWF0fSBmcm9tICcuLi9mb3JtYXR0ZXInO1xyXG5cclxuZXhwb3J0IGNsYXNzIExvZ0FwcGVuZGVyIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7bnVsbH1cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGdldCBuYW1lKCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBsb2dFdmVudFxyXG4gICAgICovXHJcbiAgICBhcHBlbmQobG9nRXZlbnQpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TG9nTGV2ZWwoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubG9nTGV2ZWw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxvZ0xldmVsXHJcbiAgICAgKi9cclxuICAgIHNldExvZ0xldmVsKGxvZ0xldmVsKSB7XHJcbiAgICAgICAgdGhpcy5sb2dMZXZlbCA9IGxvZ0xldmVsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBsYXlvdXRcclxuICAgICAqL1xyXG4gICAgc2V0TGF5b3V0KGxheW91dCkge1xyXG4gICAgICAgIHRoaXMubGF5b3V0ID0gbGF5b3V0O1xyXG4gICAgfVxyXG5cclxuICAgIGdldExheW91dCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5sYXlvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGxvZ0V2ZW50XHJcbiAgICAgKi9cclxuICAgIGZvcm1hdChsb2dFdmVudCkge1xyXG4gICAgICAgIHJldHVybiBmb3JtYXQodGhpcy5nZXRMYXlvdXQoKSwgbG9nRXZlbnQpO1xyXG4gICAgfVxyXG5cclxufVxyXG4iXX0=