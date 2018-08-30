import { LogLevel } from '../const/log.level';
import { Appender } from '../decorator/appender';
import { ILogEvent } from '../log.event';
import { getVirtualConsole } from '../util/virtual.console';
import { LogAppender } from './log.appender';

@Appender('Console')
export class ConsoleAppender extends LogAppender {

    /**
     * Gets the name of the appender (e.g. 'console')
     * @returns {string}
     */
    public static get appenderName(): string {
        return 'Console';
    }

    /**
     * Appends the log event
     * @param {ILogEvent} logEvent
     */
    public append(logEvent: ILogEvent) {
        if (logEvent.level <= this.getLogLevel()) {
            this._appendToConsole(logEvent);
        }
    }

    /**
     * @private
     * @function
     *
     * @param {ILogEvent} logEvent
     */
    private _appendToConsole(logEvent: ILogEvent) {

        const message = this.format(logEvent);

        switch (logEvent.level) {

            case LogLevel.ERROR: {
                if (logEvent.error) {
                    getVirtualConsole().error(message, logEvent.error);
                } else {
                    getVirtualConsole().error(message);
                }
                break;
            }

            case LogLevel.WARN: {
                getVirtualConsole().warn(message);
                break;
            }

            case LogLevel.INFO: {
                getVirtualConsole().info(message);
                break;
            }

            case LogLevel.DEBUG:
            case LogLevel.TRACE: {
                getVirtualConsole().debug(message);
                break;
            }

            default:
                break;

        }

    }

}
