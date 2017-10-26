/**
 * log4js2 <https://github.com/anigenero/log4js2>
 *
 * Copyright 2016-2017 Robin Schultz <http://anigenero.com>
 * Released under the MIT License
 */

import DateFormatter from './util/dateFormatter';
import {LogLevel} from './const/logLevel';
import LogEvent from './logevent';
import * as define from 'core-js/library/fn/object/define';
import {Utility} from "./util/utility";

export class Formatter {


    /** @const */
    private static readonly _COMMAND_REGEX: RegExp = /%([a-z,A-Z]+)(?=\{|)/;

    /** @type {Map} */
    private static _compiledLayouts: Map<string, Function[]> = new Map<string, Function[]>();

    /**
     * @function
     * @memberOf formatter
     *
     * @param {LogEvent} logEvent
     *
     * @return {string}
     */
    private static _formatLogger(logEvent: LogEvent): string {
        return logEvent.logger;
    }

    /**
     * @function
     * @memberOf formatter
     *
     * @param {LogEvent} logEvent
     * @param {Array.<string>} params
     *
     * @return {string}
     */
    private static _formatDate(logEvent: LogEvent, params): string {
        return DateFormatter.format(logEvent.date, params[0]);
    }

    /**
     * @function
     * @memberOf formatter
     *
     * @param {LogEvent} logEvent
     *
     * @return {string}
     */
    private static _formatException(logEvent: LogEvent): string {

        let message = '';

        if (logEvent.error != null) {

            if (logEvent.error.stack != undefined) {
                let stacks = logEvent.error.stack.split(/\n/g);
                stacks.forEach(function (stack) {
                    message += `\t${stack}\n`;
                });
            } else if (logEvent.error.message != null && logEvent.error.message != '') {
                message += `\t${logEvent.error.name}: ${logEvent.error.message}\n`;
            }

        }

        return message;

    }

    /**
     * Formats the file (e.g. test.js) to the file
     *
     * @private
     * @function
     * @memberOf formatter
     *
     * @param {LogEvent} logEvent
     */
    private static _formatFile(logEvent: LogEvent): string {

        if (!logEvent.file) {
            Formatter._getFileDetails(logEvent);
        }

        return logEvent.file;

    }

    /**
     * @function
     * @memberOf formatter
     *
     * @param {LogEvent} logEvent
     *
     * @return {string}
     */
    private static _formatLineNumber(logEvent: LogEvent): string {

        if (!logEvent.lineNumber) {
            Formatter._getFileDetails(logEvent);
        }

        return `${logEvent.lineNumber}`;

    }

    /**
     * @function
     * @memberOf formatter
     *
     * @param {LogEvent} logEvent
     *
     * @return {string}
     */
    private static _formatColumn(logEvent: LogEvent): string {

        if (!logEvent.column) {
            Formatter._getFileDetails(logEvent);
        }

        return `${logEvent.column}`;

    }

    /**
     * @function
     * @memberOf formatter
     *
     * @param {LogEvent} logEvent
     * @param {Array.<string>} params
     *
     * @return {string}
     */
    private static _formatMapMessage(logEvent: LogEvent, params: String[]): string {

        let message = null;
        if (logEvent.properties) {

            message = [];
            for (let key in logEvent.properties) {
                if (params[0]) {
                    if (params[0] == key) {
                        message.push(logEvent.properties[key]);
                    }
                } else {
                    message.push('{' + key + ',' + logEvent.properties[key] + '}');
                }
            }

            return '{' + message.join(',') + '}';

        }

        return message;

    }

    /**
     * @function
     * @memberOf formatter
     *
     * @param {LogEvent} logEvent
     *
     * @return {string}
     */
    private static _formatLogMessage(logEvent: LogEvent): string {
        return logEvent.message;
    }

    /**
     * @function
     * @memberOf formatter
     *
     * @param {LogEvent} logEvent
     *
     * @return {string}
     */
    private static _formatMethodName(logEvent: LogEvent): string {
        return Utility.getFunctionName(logEvent.method);
    }

    /**
     * @private
     * @function
     * @memberOf formatter
     */
    private static _formatLineSeparator(): string {
        return '\n';
    };

    /**
     * @function
     * @memberOf formatter
     *
     * @param {LogEvent} logEvent
     *
     * @return {string}
     */
    private static _formatLevel(logEvent: LogEvent): string {

        switch (logEvent.level) {

            case LogLevel.FATAL:
                return 'FATAL';
            case LogLevel.ERROR:
                return 'ERROR';
            case LogLevel.WARN:
                return 'WARN';
            case LogLevel.INFO:
                return 'INFO';
            case LogLevel.DEBUG:
                return 'DEBUG';
            case LogLevel.TRACE:
            default:
                return 'TRACE';

        }

    }

    /**
     * @function
     * @memberOf formatter
     *
     * @param {LogEvent} logEvent
     *
     * @return {string}
     */
    private static _formatRelative(logEvent: LogEvent) {
        return '' + logEvent.relative;
    }

    /**
     * @function
     * @memberOf formatter
     *
     * @param {LogEvent} logEvent
     *
     * @return {string}
     */
    private static _formatSequenceNumber(logEvent: LogEvent) {
        return '' + logEvent.sequence;
    }

    /**
     * Get the compiled layout for the specified layout string. If the compiled layout does not
     * exist, then we want to create it.
     *
     * @function
     * @memberOf formatter
     *
     * @param {string} layout
     *
     * @return {Array.<string|function>}
     */
    private static _getCompiledLayout = function (layout) {

        if (Formatter._compiledLayouts[layout]) {
            return Formatter._compiledLayouts[layout];
        }

        return Formatter._compileLayout(layout);

    };

    /**
     * Compiles a layout into an array. The array contains functions
     *
     * @function
     * @memberOf formatter
     *
     * @param {string} layout
     *
     * @return {Array.<string|function>}
     */
    private static _compileLayout(layout) {

        let index = layout.indexOf('%');
        let currentFormatString = '';
        let formatArray = [];

        if (index != 0) {
            formatArray.push(layout.substring(0, index));
        }

        do {

            let startIndex = index;
            let endIndex = index = layout.indexOf('%', index + 1);

            if (endIndex < 0) {
                currentFormatString = layout.substring(startIndex);
            } else {
                currentFormatString = layout.substring(startIndex, endIndex);
            }

            formatArray.push(Formatter._getFormatterObject(currentFormatString));

        } while (index > -1);

        // set the format array to the specified compiled layout
        Formatter._compiledLayouts[layout] = formatArray;

        return formatArray;

    };

    /**
     * @function
     * @memberOf formatter
     *
     * @param {string} formatString
     *
     * @return {Object|string}
     */
    private static _getFormatterObject(formatString) {

        let result = Formatter._COMMAND_REGEX.exec(formatString);
        if (result != null && result.length == 2) {

            let formatter = Formatter._getFormatterFunction(result[1]);
            if (!formatter) {
                return null;
            }

            let params = Formatter._getLayoutTagParams(formatString);

            let after = '';
            let endIndex = formatString.lastIndexOf('}');
            if (endIndex != -1) {
                after = formatString.substring(endIndex + 1);
            } else {
                after = formatString.substring(result.index + result[1].length + 1);
            }

            return {
                'formatter': formatter,
                'params': params,
                'after': after
            };

        }

        return formatString;

    };

    /**
     * Determines what formatter function has been configured
     *
     * @function
     * @memberOf formatter
     *
     * @param {string} command
     *
     * @return {?string}
     */
    private static _getFormatterFunction(command: string): string {

        let regex;
        for (let key in Formatter._formatters) {
            if (Formatter._formatters.hasOwnProperty(key)) {
                regex = new RegExp('^(' + key + ')$');
                if (regex.exec(command)) {
                    return Formatter._formatters[key];
                }
            }
        }

        return null;

    };

    /**
     * Gets the layout tag params associated with the layout tag. So, for example, '%d{yyyy-MM-dd}`
     * would output an array of ['yyyy-MM-dd']
     *
     * @private
     * @function
     *
     * @param {string} command
     *
     * @return {Array.<string>}
     */
    private static _getLayoutTagParams(command: string): string[] {

        let params: string[] = [];
        let result = command.match(/{([^}]*)(?=})/g);
        if (result != null) {
            for (let i = 0; i < result.length; i++) {
                params.push(result[i].substring(1));
            }
        }

        return params;

    };

    /**
     * Handles formatting the log event using the specified formatter array
     *
     * @private
     * @function
     *
     * @param {Array.<function|string>} formatter
     * @param {LogEvent} logEvent
     *
     * @return {string}
     */
    private static _formatLogEvent(formatter: Function|string[], logEvent: LogEvent) {

        let response;
        let message = '';
        let count = formatter.length;
        for (let i = 0; i < count; i++) {
            if (formatter[i] !== null) {

                if (formatter[i] instanceof Object) {

                    response = formatter[i].formatter(logEvent, formatter[i].params);
                    if (response != null) {
                        message += response;
                    }
                    message += formatter[i].after;

                } else {
                    message += formatter[i];
                }

            }
        }

        return message.trim();

    };

    /**
     *
     * @private
     * @function
     * @memberOf formatter
     *
     * @param {LogEvent} logEvent
     */
    private static _getFileDetails = function (logEvent: LogEvent) {

        if (logEvent.logErrorStack) {

            let parts = logEvent.logErrorStack.stack.split(/\n/g);
            let file = parts[3];
            file = file.replace(/at (.*\(|)(file|http|https|)(:|)(\/|)*/, '');
            file = file.replace(')', '');
            file = file.replace((typeof location !== 'undefined') ? location.host : '', '').trim();

            let fileParts = file.split(/:/g);

            logEvent.column = fileParts.pop();
            logEvent.lineNumber = fileParts.pop();

            if (typeof define !== 'undefined') {
                let path = require('path');
                let appDir = path.dirname(require.main.filename);
                if (!fileParts[0].startsWith(appDir)) {
                    appDir = '';
                }
                logEvent.filename = fileParts.join(':').replace(appDir, '').replace(/^([\\\/])/, '');
            } else {
                logEvent.filename = fileParts.join(':');
            }

        } else {

            logEvent.column = '?';
            logEvent.filename = 'anonymous';
            logEvent.lineNumber = '?';

        }
        logEvent.file = logEvent.filename;
    };

    private static readonly _formatters: Object = {
        'c|logger': Formatter._formatLogger,
        'd|date': Formatter._formatDate,
        'ex|exception|throwable': Formatter._formatException,
        'F|file': Formatter._formatFile,
        'K|map|MAP': Formatter._formatMapMessage,
        'L|line': Formatter._formatLineNumber,
        'column': Formatter._formatColumn,
        'm|msg|message': Formatter._formatLogMessage,
        'M|method': Formatter._formatMethodName,
        'n': Formatter._formatLineSeparator,
        'p|level': Formatter._formatLevel,
        'r|relative': Formatter._formatRelative,
        'sn|sequenceNumber': Formatter._formatSequenceNumber
    };

    /**
     * @function
     * @memberOf formatter
     *
     * @param {string} layout
     *
     * @return {string}
     */
    public static preCompile(layout) {
        Formatter._getCompiledLayout(layout);
    }

    /**
     * @function
     * @memberOf formatter
     *
     * @param {string} layout
     * @param {LogEvent} logEvent
     *
     * @return {string}
     */
    public static format(layout, logEvent) {
        return Formatter._formatLogEvent(Formatter._getCompiledLayout(layout), logEvent);
    }


}