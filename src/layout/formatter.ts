import * as define from 'core-js/library/fn/object/define';
import { LogLevel } from '../const/log.level';
import { Method } from '../def';
import { ILogEvent } from '../log.event';
import { getFunctionName } from '../util/utility';
import { DateTimeFormat, formatDate } from './date.formatter';

interface IFormatterObject {
    formatter: Method<any>;
    params: string[];
}

export class Formatter {

    /**
     * @function
     * @memberOf formatter
     *
     * @param {string} layout
     *
     * @return {string}
     */
    public static preCompile(layout: string) {
        Formatter._getCompiledLayout(layout);
    }

    /**
     * @function
     * @memberOf formatter
     *
     * @param {string} layout
     * @param {ILogEvent} logEvent
     *
     * @return {string}
     */
    public static format(layout: string, logEvent: ILogEvent) {
        return Formatter._formatLogEvent(Formatter._getCompiledLayout(layout), logEvent);
    }

    private static readonly _formatters: { [key: string]: Method<any> } = {
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

    /** @type {Map} */
    private static _compiledLayouts: Map<string, any[]> = new Map<string, any[]>();

    /**
     * @function
     * @memberOf formatter
     *
     * @param {ILogEvent} logEvent
     *
     * @return {string}
     */
    private static _formatLogger(logEvent: ILogEvent): string {
        return logEvent.logger;
    }

    /**
     * @function
     * @memberOf formatter
     *
     * @param {ILogEvent} logEvent
     * @param {Array.<string>} params
     *
     * @return {string}
     */
    private static _formatDate(logEvent: ILogEvent, params: string[]): string {
        return formatDate(logEvent.date, (DateTimeFormat as any)[params[0]] || params[0]);
    }

    /**
     * @function
     * @memberOf formatter
     *
     * @param {ILogEvent} logEvent
     *
     * @return {string}
     */
    private static _formatException(logEvent: ILogEvent): string {

        let message = '';

        if (logEvent.error != null) {

            if (logEvent.error.stack) {
                const stacks = logEvent.error.stack.split(/\n/g);
                message += stacks.reduce((accumulator, value) => accumulator + `\t${value}\n`);
            } else if (logEvent.error.message != null && logEvent.error.message !== '') {
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
     * @param {ILogEvent} logEvent
     */
    private static _formatFile(logEvent: ILogEvent): string {

        if (!logEvent.file) {
            Formatter._getFileDetails(logEvent);
        }

        return logEvent.file;

    }

    /**
     * @function
     * @memberOf formatter
     *
     * @param {ILogEvent} logEvent
     *
     * @return {string}
     */
    private static _formatLineNumber(logEvent: ILogEvent): string {

        if (!logEvent.lineNumber) {
            Formatter._getFileDetails(logEvent);
        }

        return `${logEvent.lineNumber}`;

    }

    /**
     * @function
     * @memberOf formatter
     *
     * @param {ILogEvent} logEvent
     *
     * @return {string}
     */
    private static _formatColumn(logEvent: ILogEvent): string {

        if (!logEvent.column) {
            Formatter._getFileDetails(logEvent);
        }

        return `${logEvent.column}`;

    }

    /**
     * @function
     * @memberOf formatter
     *
     * @param {ILogEvent} logEvent
     * @param {Array.<string>} params
     *
     * @return {string}
     */
    private static _formatMapMessage(logEvent: ILogEvent, params: string[]): string {

        let message = null;
        if (logEvent.properties) {

            message = [];
            for (const key in logEvent.properties) {
                if (params[0]) {
                    if (params[0] === key) {
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
     * @param {ILogEvent} logEvent
     *
     * @return {string}
     */
    private static _formatLogMessage(logEvent: ILogEvent): string {
        return logEvent.message;
    }

    /**
     * @function
     * @memberOf formatter
     *
     * @param {ILogEvent} logEvent
     *
     * @return {string}
     */
    private static _formatMethodName(logEvent: ILogEvent): string {
        return getFunctionName(logEvent.method as Method<any>);
    }

    /**
     * @private
     * @function
     * @memberOf formatter
     */
    private static _formatLineSeparator(): string {
        return '\n';
    }

    /**
     * @function
     * @memberOf formatter
     *
     * @param {ILogEvent} logEvent
     *
     * @return {string}
     */
    private static _formatLevel(logEvent: ILogEvent): string {

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
     * @param {ILogEvent} logEvent
     *
     * @return {string}
     */
    private static _formatRelative(logEvent: ILogEvent) {
        return '' + logEvent.relative;
    }

    /**
     * @function
     * @memberOf formatter
     *
     * @param {ILogEvent} logEvent
     *
     * @return {string}
     */
    private static _formatSequenceNumber(logEvent: ILogEvent) {
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
    private static _getCompiledLayout(layout: string) {

        if (Formatter._compiledLayouts.has(layout)) {
            return Formatter._compiledLayouts.get(layout);
        }

        return Formatter._compileLayout(layout);

    }

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
    private static _compileLayout(layout: string) {

        const formatArray = layout.match(/(%\w+({[\w-]+}|)|.)/g)
            .map((value) => Formatter._getFormatterObject(value));

        // set the format array to the specified compiled layout
        Formatter._compiledLayouts.set(layout, formatArray);

        return formatArray;

    }

    /**
     * @function
     * @memberOf formatter
     *
     * @param {string} formatString
     *
     * @return {Object|string}
     */
    private static _getFormatterObject(formatString: string) {

        const result = /%(\w+)(?:{([\w-]+)})*/g.exec(formatString);

        if (result == null) {
            return formatString;
        } else if (result.length < 3) {

            return {
                formatter: Formatter._getFormatterFunction(result[1]),
                params: [] as string[]
            };

        } else {

            const formatter = Formatter._getFormatterFunction(result[1]);
            if (!formatter) {
                return null;
            }

            const params = Formatter._getLayoutTagParams(result[2]);

            return {
                formatter,
                params
            };

        }

    }

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
    private static _getFormatterFunction(command: string): Method<any> {

        let regex;
        for (const key in Formatter._formatters) {
            if (Formatter._formatters.hasOwnProperty(key)) {
                regex = new RegExp('^(' + key + ')$');
                if (regex.exec(command)) {
                    return Formatter._formatters[key];
                }
            }
        }

        return null;

    }

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
        return (command) ? command.split(',') : [];
    }

    /**
     * Handles formatting the log event using the specified formatter array
     *
     * @private
     * @function
     *
     * @param {Array.<function|string>} formatter
     * @param {ILogEvent} logEvent
     *
     * @return {string}
     */
    private static _formatLogEvent(formatter: IFormatterObject[], logEvent: ILogEvent) {

        let response;
        let message = '';
        const count = formatter.length;
        for (let i = 0; i < count; i++) {
            if (formatter[i] !== null) {

                if (formatter[i] instanceof Object) {

                    response = formatter[i].formatter(logEvent, formatter[i].params);
                    if (response != null) {
                        message += response;
                    }

                } else {
                    message += formatter[i];
                }

            }
        }

        return message.trim();

    }

    /**
     *
     * @private
     * @function
     * @memberOf formatter
     *
     * @param {ILogEvent} logEvent
     */
    private static _getFileDetails(logEvent: ILogEvent) {

        if (logEvent.logErrorStack) {

            const parts = logEvent.logErrorStack.stack.split(/\n/g);
            let file = parts[3];
            file = file.replace(/at (.*\(|)(file|http|https|)(:|)(\/|)*/, '');
            file = file.replace(')', '');
            file = file.replace((typeof location !== 'undefined') ? location.host : '', '').trim();

            const fileParts = file.split(/:/g);

            logEvent.column = fileParts.pop();
            logEvent.lineNumber = fileParts.pop();

            if (typeof define !== 'undefined') {
                const path = require('path');
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

    }

}
