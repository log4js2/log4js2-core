import {format} from '../formatter';

export class LogAppender {

    /**
     * Gets the name of the appender (e.g. 'console')
     * @returns {null}
     */
    static get name() {
        return null;
    }

    /**
     * Appends the log
     * @param {Object} logEvent
     */
    append(logEvent) {
        // stub
    }

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
        return format(this.getLayout(), logEvent);
    }

}
