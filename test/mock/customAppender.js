const log4js = require('../../dist/es6/log4js2');

global.logStack = {
    error: [],
    warn: [],
    info: [],
    debug: [],
    trace: []
};

class CustomAppender extends log4js.LogAppender {

    static get name() {
        return 'custom';
    }

    append(logEvent) {
        if (logEvent.level <= this.getLogLevel()) {
            this._append(logEvent);
        }
    }

    _append(logEvent) {

        let message = this.format(logEvent);

        if (logEvent.level == log4js.LogLevel.ERROR) {
            logStack.error.push(message);
        } else if (logEvent.level == log4js.LogLevel.WARN) {
            logStack.warn.push(message);
        } else if (logEvent.level == log4js.LogLevel.INFO) {
            logStack.info.push(message);
        } else if (logEvent.level == log4js.LogLevel.DEBUG) {
            logStack.debug.push(message);
        } else if (logEvent.level == log4js.LogLevel.TRACE) {
            logStack.trace.push(message);
        }

    }

    clear() {

    }

}

log4js.addAppender(CustomAppender);