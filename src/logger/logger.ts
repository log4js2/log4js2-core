import {LogLevel} from '../const/logLevel';
import LogAppender from "../appender/appender";
import LogEvent from "../logevent";
import Marker from "../marker";

/**
 * Holds the definition for the log event object
 *
 * @typedef {{ date : number, error : Object, filename: string, lineNumber: ?string, column: ?string,
 *      logErrorStack : Object, file : String, level : number, logger : string, message : string,
 *      method : Function, properties : Object=, relative : number, sequence : number }}
 */
let LOG_EVENT;

export default class Logger {

    private readonly _logContext: string;

    private _logSequence: number;
    private _relative: number;

    constructor(context: string, private appender: LogAppender) {

        this._logContext = context;

        this._logSequence = 1;
        this._relative = (new Date()).getTime();

    }

    /**
     * Logs an error event
     *
     * @function
     * @memberOf Logger
     */
    public error() {
        this.appender.append(this._constructLogEvent(LogLevel.ERROR, arguments));
    };

    /**
     * Logs a warning
     *
     * @function
     * @memberOf Logger
     */
    public warn() {
        this.appender.append(this._constructLogEvent(LogLevel.WARN, arguments));
    };

    /**
     * Logs an info level event
     *
     * @function
     * @memberOf Logger
     */
    public info() {
        this.appender.append(this._constructLogEvent(LogLevel.INFO, arguments));
    };

    /**
     * Logs a debug event
     *
     * @function
     * @memberOf Logger
     */
    public debug() {
        this.appender.append(this._constructLogEvent(LogLevel.DEBUG, arguments));
    };

    /**
     * Logs a trace event
     *
     * @function
     * @memberOf Logger
     */
    public trace() {
        this.appender.append(this._constructLogEvent(LogLevel.TRACE, arguments));
    };

    /**
     * @function
     *
     * @param {number} level
     * @param {Array.<Object>} args
     *
     * @return {LOG_EVENT}
     */
    private _constructLogEvent(level: LogLevel, args): LogEvent {

        let logTime = new Date();
        let error = null;

        // this looks horrible, but this is the only way to catch the stack for IE to later parse the stack
        try {
            throw new Error();
        } catch (e) {
            error = e;
        }

        let logEvent: LogEvent = new LogEvent;

        logEvent.date = logTime;
        logEvent.error = null;
        logEvent.logErrorStack = error;
        logEvent.file = null;
        logEvent.level = level;
        logEvent.lineNumber = null;
        logEvent.logger = this._logContext;
        logEvent.message = '';
        logEvent.method = !this._isStrict() ? args.callee.caller : 0;
        logEvent.properties = undefined;
        logEvent.relative = logTime.getTime() - this._relative;
        logEvent.sequence = this._logSequence++;

        let regex = /\{\}/g;
        for (let i = 0; i < args.length; i++) {

            if (i === 0) {
                logEvent.message = args[i];
            } else if (regex.exec(logEvent.message)) {
                logEvent.message = logEvent.message.replace(/\{\}/, args[i]);
            } else if (args[i] instanceof Error) {
                logEvent.error = args[i];
            } else if (args[i] instanceof Marker) {
                logEvent.marker = <Marker> args[i];
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
    private _isStrict() {
        return (function () {
            return !this;
        })();
    };

}
