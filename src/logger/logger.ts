import { LogLevel } from '..';
import { AppenderWrapper } from '../appender/appender.wrapper';
import { ILogEvent } from '../log.event';
import { Marker } from '../marker';

export type NotMarker = Array<Exclude<any, Marker>>;

export class Logger {

    private readonly _logContext: string;

    private _logSequence: number;
    private _relative: number;

    constructor(context: string, private _appenders: AppenderWrapper[]) {

        this._logContext = context;

        this._logSequence = 0;
        this._relative = (new Date()).getTime();

    }

    /**
     * Allow passing of a level to a plain log
     *
     * @function
     * @memberOf Logger
     */
    public log(level: LogLevel, ...args: any[]): void;
    public log(level: LogLevel, marker: Marker, ...args: NotMarker[]): void {
        const passed = arguments;
        this._appenders.forEach((appender) =>
            appender.append(this._constructLogEvent(level, passed, 1)));
    }

    /**
     * Logs an error event
     *
     * @function
     * @memberOf Logger
     */
    public fatal(...args: any[]): void;
    public fatal(marker: Marker, ...args: NotMarker[]): void {
        const passed = arguments;
        this._appenders.forEach((appender) =>
            appender.append(this._constructLogEvent(LogLevel.FATAL, passed)));
    }

    /**
     * Logs an error event
     *
     * @function
     * @memberOf Logger
     */
    public error(...args: any[]): void;
    public error(marker: Marker, ...args: NotMarker[]): void {
        const passed = arguments;
        this._appenders.forEach((appender) =>
            appender.append(this._constructLogEvent(LogLevel.ERROR, passed)));
    }

    /**
     * Logs a warning
     *
     * @function
     * @memberOf Logger
     */
    public warn(...args: any[]): void;
    public warn(marker: Marker, ...args: NotMarker[]): void {
        const passed = arguments;
        this._appenders.forEach((appender) =>
            appender.append(this._constructLogEvent(LogLevel.WARN, passed)));
    }

    /**
     * Logs an info level event
     *
     * @function
     * @memberOf Logger
     */
    public info(...args: any[]): void;
    public info(marker: Marker, ...args: NotMarker[]): void {
        const passed = arguments;
        this._appenders.forEach((appender) =>
            appender.append(this._constructLogEvent(LogLevel.INFO, passed)));
    }

    /**
     * Logs a debug event
     *
     * @function
     * @memberOf Logger
     */
    public debug(...args: any[]): void;
    public debug(marker: Marker, ...args: NotMarker[]): void {
        const passed = arguments;
        this._appenders.forEach((appender) =>
            appender.append(this._constructLogEvent(LogLevel.DEBUG, passed)));
    }

    /**
     * Logs a trace event
     *
     * @function
     * @memberOf Logger
     */
    public trace(...args: any[]): void;
    public trace(marker: Marker, ...args: NotMarker[]): void {
        const passed = arguments;
        this._appenders.forEach((appender) =>
            appender.append(this._constructLogEvent(LogLevel.TRACE, passed)));
    }

    /**
     * @function
     *
     * @param {number} level
     * @param {Array.<Object>} args
     * @param {number} offset
     *
     * @return {ILogEvent}
     */
    private _constructLogEvent(level: LogLevel, args: IArguments, offset: number = 0): ILogEvent {

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
        for (let i = offset; i < args.length; i++) {

            if (i === offset || (i === offset + 1 && logEvent.marker)) {
                if (args[i] instanceof Marker) {
                    logEvent.marker = args[i] as Marker;
                } else {
                    logEvent.message = args[i];
                }
            } else if (regex.exec(logEvent.message)) {
                logEvent.message = logEvent.message.replace(/\{\}/, args[i]);
            } else if (args[i] instanceof Error) {
                logEvent.error = args[i];
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
