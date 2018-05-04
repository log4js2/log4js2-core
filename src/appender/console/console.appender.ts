import {LogLevel} from '../../const/log.level';
import {Appender} from "../../decorator/appender";
import {LogEvent} from "../../log.event";
import LogAppender from '../appender';

@Appender('Console')
export default class ConsoleAppender extends LogAppender {

    /**
     * Gets the name of the appender (e.g. 'console')
     * @returns {null}
     */
    public static get appenderName(): string {
        return 'console';
    }

    /**
     * Appends the log event
     * @param {LogEvent} logEvent
     */
    public append(logEvent: LogEvent) {
        if (logEvent.level <= this.getLogLevel()) {
            this._appendToConsole(logEvent);
        }
    }

    /**
     * @private
     * @function
     *
     * @param {LogEvent} logEvent
     */
    private _appendToConsole(logEvent: LogEvent) {

        const message = this.format(logEvent);

        if (logEvent.level === LogLevel.ERROR) {
            console.error(message);
        } else if (logEvent.level === LogLevel.WARN) {
            console.warn(message);
        } else if (logEvent.level === LogLevel.INFO) {
            console.info(message);
        } else if ([LogLevel.DEBUG, LogLevel.TRACE].indexOf(logEvent.level) > -1) {
            console.log(message);
        }

    }

}
