/**
 * log4js <https://github.com/anigenero/log4js>
 *
 * Copyright 2016-present Robin Schultz <http://anigenero.com>
 * Released under the MIT License
 */

import {LogAppender} from './appender';
import {LogLevel} from '../const/logLevel';

export class ConsoleAppender extends LogAppender {

    static get name() {
        return 'console';
    }

    /**
     * Appends the log event
     * @param logEvent
     */
    append(logEvent) {
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
	_appendToConsole(logEvent) {

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
