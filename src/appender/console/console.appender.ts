/**
 * log4js2 <https://github.com/anigenero/log4js2>
 *
 * Copyright 2016-present Robin Schultz <http://anigenero.com>
 * Released under the MIT License
 */

import LogAppender from '../appender';
import {LogLevel} from '../../const/logLevel';
import {Appender} from "../../appender";

@Appender({
    name: 'Console'
})
export default class ConsoleAppender extends LogAppender {

    /**
     * Appends the log event
     * @param logEvent
     */
    public append(logEvent) {
        if (logEvent.level <= this.getLogLevel()) {
            this._appendToConsole(logEvent);
        }
    }

    /**
     * @private
     * @function
     *
     * @param {LOG_EVENT} logEvent
     */
    private _appendToConsole(logEvent) {

        let message = this.format(logEvent);

        if (logEvent.level == LogLevel.ERROR) {
            console.error(message);
        } else if (logEvent.level == LogLevel.WARN) {
            console.warn(message);
        } else if (logEvent.level == LogLevel.INFO) {
            console.info(message);
        } else if ([LogLevel.DEBUG, LogLevel.TRACE].indexOf(logEvent.level) > -1) {
            console.log(message);
        }

    }

}
