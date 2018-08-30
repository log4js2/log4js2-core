import { Appender } from '../decorator/appender';
import { ILogEvent } from '../log.event';
import { IFileAppenderConfig } from './file.appender';
import { LogAppender } from './log.appender';

export interface IRollingFileAppenderConfig extends IFileAppenderConfig {
    fileNamePattern: string;
    maxSize: number;
}

@Appender()
export class RollingFileAppender extends LogAppender<IRollingFileAppenderConfig> {

    private static _logFile: NodeJS.WriteStream;

    private readonly _config: IRollingFileAppenderConfig;

    constructor(config?: IRollingFileAppenderConfig) {

        super(config);

        if (typeof window !== 'undefined') {
            throw new Error('Cannot use FileAppender in browser mode');
        } else if (!RollingFileAppender._logFile) {

            this._config = config;

            const FS = 'fs';
            const fs = require(`${FS}`);
            if (!fs.exists(config.destination)) {
                fs.mkdirSync(config.destination);
            }

            RollingFileAppender._logFile = fs.createWriteStream(config.destination, {flags: 'w'});

        }

    }

    /**
     * Appends the log event
     * @param {ILogEvent} logEvent
     */
    public append(logEvent: ILogEvent) {
        if (logEvent.level <= this.getLogLevel()) {
            this._appendToFile(logEvent);
        }
    }

    /**
     * @private
     * @function
     *
     * @param {ILogEvent} logEvent
     */
    private _appendToFile(logEvent: ILogEvent) {
        RollingFileAppender._logFile.write(this.format(logEvent) + '\n');
    }

}
