import { LogLevel } from '../const/log.level';
import { Formatter } from '../layout/formatter';
import { ILogEvent } from '../log.event';

export abstract class LogAppender<C extends {}> {

    private active: boolean;

    private logLevel: LogLevel;
    private layout: string;

    constructor(config?: C) {
        // do nothing
    }

    /**
     * Returns whether or not the appender is active
     * @returns {boolean}
     */
    public isActive(): boolean {
        return this.active === true;
    }

    /**
     * Appends the log
     * @param {ILogEvent} logEvent
     */
    public append(logEvent: ILogEvent) {
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
     * @param {ILogEvent} logEvent
     */
    public format(logEvent: ILogEvent) {
        return Formatter.format(this.getLayout(), logEvent);
    }

}
