import {Appender} from "../decorator/appender";
import {LogEvent} from "../log.event";
import LogAppender from './appender';

@Appender('File')
export default class FileAppender extends LogAppender {

    /**
     * Gets the name of the appender (e.g. 'console')
     * @returns {null}
     */
    public static get appenderName(): string {
        return 'File';
    }

    /**
     * Appends the log event
     * @param {LogEvent} logEvent
     */
    public append(logEvent: LogEvent) {
        if (logEvent.level <= this.getLogLevel()) {
            this._appendToFile(logEvent);
        }
    }

    /**
     * @private
     * @function
     *
     * @param {LogEvent} logEvent
     */
    private _appendToFile(logEvent: LogEvent) {

        const message = this.format(logEvent);



    }

}
