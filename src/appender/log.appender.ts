import {LogLevel} from "../const/log.level";
import {Formatter} from "../layout/formatter";
import {LogEvent} from "../log.event";

export default abstract class LogAppender {

    /**
     * Gets the name of the appender (e.g. 'console')
     * @returns {null}
     */
    public static get appenderName(): string {
        return null;
    }

    private active: boolean;

    private logLevel: LogLevel;
    private layout: string;

    /**
     * Returns whether or not the appender is active
     * @returns {boolean}
     */
    public isActive(): boolean {
        return this.active === true;
    }

    /**
     * Appends the log
     * @param {LogEvent} logEvent
     */
    public append(logEvent: LogEvent) {
        // stub
    }

    /**
     * Gets the current log level
     * @returns {number}
     */
    public getLogLevel() {
        return this.logLevel;
    }

    /**
     * Sets the log level of the appender
     * @param {LogLevel} logLevel
     */
    public setLogLevel(logLevel: LogLevel) {
        this.logLevel = logLevel;
    }

    /**
     * Sets the layout of the appender
     * @param {string} layout
     */
    public setLayout(layout: string) {
        this.layout = layout;
    }

    /**
     * Gets the layout associated with the appender
     * @returns {string}
     */
    public getLayout() {
        return this.layout;
    }

    /**
     * Formats the log event using the layout provided
     * @param {LogEvent} logEvent
     */
    public format(logEvent: LogEvent) {
        return Formatter.format(this.getLayout(), logEvent);
    }

}
