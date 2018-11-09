import { Appender } from '../decorator/appender';
import { ILogEvent } from '../log.event';
import { RollingFileHandler } from './handler/rolling.file.handler';
import { LogAppender } from './log.appender';

export interface IRollingFileAppenderConfig {

    fileName: string;
    filePattern: string;
    maxBackup: number;
    maxSize: number;

}

@Appender('RollingFile')
export class RollingFileAppender extends LogAppender<IRollingFileAppenderConfig> {

    private _handler: RollingFileHandler;

    constructor(private readonly _config: IRollingFileAppenderConfig = {
        fileName: './logs/app.log',
        filePattern: './logs/app.%d{yyyy-MM-ddTHH:mm}.log',
        maxBackup: 5,
        maxSize: 10
    }) {

        super(_config);

        if (typeof process === 'undefined') {
            throw new Error('Cannot use RollingFileAppender in browser mode');
        } else {

            this._config = {
                ..._config,
                maxSize: _config.maxSize * 1024 * 1024
            };

            this._handler = new RollingFileHandler(this._config);

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
