import { LogAppender } from '..';
import { LogLevel } from '..';
import { ILogEvent } from '../log.event';
import Marker from '../marker';

export class Logger {

    private readonly _logContext: string;

    private _logSequence: number;
    private _relative: number;

    constructor(context: string, private _appenders: Array<LogAppender<any>>) {

        this._logContext = context;

        this._logSequence = 0;
        this._relative = (new Date()).getTime();

    }

    /**
     * Logs an error event
     *
     * @function
     * @memberOf Logger
     */
    public fatal(...args: any[]) {
        this._appenders.forEach((appender) =>
            appender.append(this._constructLogEvent(LogLevel.FATAL, arguments)));
    }

    /**
     * Logs an error event
     *
     * @function
     * @memberOf Logger
     */
    public error(...args: any[]) {
        this._appenders.forEach((appender) =>
            appender.append(this._constructLogEvent(LogLevel.ERROR, arguments)));
    }

    /**
     * Logs a warning
     *
     * @function
     * @memberOf Logger
     */
    public warn(...args: any[]) {
        this._appenders.forEach((appender) =>
            appender.append(this._constructLogEvent(LogLevel.WARN, arguments)));
    }

    /**
     * Logs an info level event
     *
     * @function
     * @memberOf Logger
     */
    public info(...args: any[]) {
        this._appenders.forEach((appender) =>
            appender.append(this._constructLogEvent(LogLevel.INFO, arguments)));
    }

    /**
     * Logs a debug event
     *
     * @function
     * @memberOf Logger
     */
    public debug(...args: any[]) {
        this._appenders.forEach((appender) =>
            appender.append(this._constructLogEvent(LogLevel.DEBUG, arguments)));
    }

    /**
     * Logs a trace event
     *
     * @function
     * @memberOf Logger
     */
    public trace(...args: any[]) {
        this._appenders.forEach((appender) =>
            appender.append(this._constructLogEvent(LogLevel.TRACE, arguments)));
    }

    /**
     * @function
     *
     * @param {number} level
     * @param {Array.<Object>} args
     *
     * @return {ILogEvent}
     */
    private _constructLogEvent(level: LogLevel, args: IArguments): ILogEvent {

        const logTime = new Date();
        let error = null;

        // this looks horrible, but this is the only way to catch the stack for IE to later parse the stack
        try {
            throw new Error();
        } catch (e) {
            error = e;
        }

        const logEvent: ILogEvent = {
            date: logTime,
            error: null,
            logErrorStack: error,
            file: null,
            level,
            lineNumber: null,
            logger: this._logContext,
            message: '',
            method: this._isNotStrict() ? args.callee.caller : 0,
            properties: undefined,
            relative: logTime.getTime() - this._relative,
            sequence: this._logSequence++,
        };

        const regex = /\{\}/g;
        for (let i = 0; i < args.length; i++) {

            if (i === 0) {
                logEvent.message = args[i];
            } else if (regex.exec(logEvent.message)) {
                logEvent.message = logEvent.message.replace(/\{\}/, args[i]);
            } else if (args[i] instanceof Error) {
                logEvent.error = args[i];
            } else if (args[i] instanceof Marker) {
                logEvent.marker = args[i] as Marker;
            } else {
                logEvent.properties = args[i];
            }

        }

        return logEvent;

    }

    /**
     * Returns whether or not the script is in strict mode
     *
     * @private
     * @function
     *
     * @returns {boolean}
     */
    private _isNotStrict() {
        return (() => !this)();
    }

}
