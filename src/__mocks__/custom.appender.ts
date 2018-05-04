import LogAppender from "../appender/appender";
import {LogLevel} from "../const/log.level";
import {Appender} from "../decorator/appender";
import {LogEvent} from "../log.event";

export const logStack: { [key: string]: string[] } = {
    error: [],
    warn: [],
    info: [],
    debug: [],
    trace: []
};

export const CUSTOM_APPENDER_NAME = 'custom';

@Appender(CUSTOM_APPENDER_NAME)
export class CustomAppender extends LogAppender {

    public static get appenderName(): string {
        return CUSTOM_APPENDER_NAME;
    }

    public append(logEvent: LogEvent) {
        if (logEvent.level <= this.getLogLevel()) {
            this._append(logEvent);
        }
    }

    public clear() {
        logStack.error = [];
        logStack.warn = [];
        logStack.info = [];
        logStack.debug = [];
        logStack.trace = [];
    }

    private _append(logEvent: LogEvent) {

        const message = this.format(logEvent);

        if (logEvent.level === LogLevel.ERROR) {
            logStack.error.push(message);
        } else if (logEvent.level === LogLevel.WARN) {
            logStack.warn.push(message);
        } else if (logEvent.level === LogLevel.INFO) {
            logStack.info.push(message);
        } else if (logEvent.level === LogLevel.DEBUG) {
            logStack.debug.push(message);
        } else if (logEvent.level === LogLevel.TRACE) {
            logStack.trace.push(message);
        }

    }

}
