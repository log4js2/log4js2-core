import { Appender } from '../decorator/appender';
import { ILogEvent } from '../log.event';
import { FileHandler } from './handler/file.handler';
import { LogAppender } from './log.appender';

export interface IFileAppenderConfig {
    destination: string;
}

@Appender()
export class FileAppender extends LogAppender<IFileAppenderConfig> {

    private readonly _handler: FileHandler;

    /**
     * Gets the name of the appender (e.g. 'console')
     * @returns {null}
     */
    public static get appenderName(): string {
        return 'File';
    }

    constructor(private readonly _config: IFileAppenderConfig) {

        super(_config);

        if (typeof process === 'undefined') {
            throw new Error('Cannot use FileAppender in browser mode');
        } else {
            this._handler = new FileHandler(_config);
        }

    }

    /**
     * Appends the log event
     * @param {ILogEvent} logEvent
     */
    public append(logEvent: ILogEvent) {
        if (logEvent.level <= this.getLogLevel()) {
            process.nextTick(() => this._handler.append(this.format(logEvent)));
        }
    }

}
