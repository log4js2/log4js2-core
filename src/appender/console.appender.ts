import {LogLevel} from '../const/log.level';
import {Appender} from "../decorator/appender";
import {LogEvent} from "../log.event";
import LogAppender from './log.appender';

@Appender('Console')
export default class ConsoleAppender extends LogAppender {

    /**
     * Gets the name of the appender (e.g. 'console')
     * @returns {null}
     */
    public static get appenderName(): string {
        return 'Console';
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

        switch (logEvent.level) {

            case LogLevel.ERROR: {
                console.error(message, logEvent.error);
                break;
            }

            case LogLevel.WARN: {
                console.warn(message);
                break;
            }

            case LogLevel.INFO: {
                console.info(message);
                break;
            }

            case LogLevel.DEBUG:
            case LogLevel.TRACE: {
                console.debug(message);
                break;
            }

            default:
                break;

        }

    }

}
