import { LogLevel } from '../const/log.level';
import { Method } from '../def';
import { ILogEvent } from '../log.event';
import { Marker } from '../marker';
import { getFunctionName } from '../util/utility';
import { DateTimeFormat, formatDate } from './date.formatter';

interface IFormatterObject {
    formatter: Method<any>;
    params: string[];
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
export function format(layout: string, logEvent: ILogEvent) {
    return _formatLogEvent(_getCompiledLayout(layout), logEvent);
}

/** @type {Map} */
const _compiledLayouts: Map<string, any[]> = new Map<string, any[]>();

const _formatters: { [key: string]: Method<any> } = {
    'c|logger': _formatLogger,
    'd|date': _formatDate,
    'ex|exception|throwable': _formatException,
    'F|file': _formatFile,
    'K|map|MAP': _formatMapMessage,
    'L|line': _formatLineNumber,
    'column': _formatColumn,
    'm|msg|message': _formatLogMessage,
    'M|method': _formatMethodName,
    'marker': _formatMarker,
    'markerSimpleName': _formatMarkerSimple,
    'n': _formatLineSeparator,
    'p|level': _formatLevel,
    'r|relative': _formatRelative,
    'sn|sequenceNumber': _formatSequenceNumber
};

/**
 * @function
 * @memberOf formatter
 *
 * @param {ILogEvent} logEvent
 *
 * @return {string}
 */
function _formatLogger(logEvent: ILogEvent): string {
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
function _formatDate(logEvent: ILogEvent, params: string[]): string {
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
function _formatException(logEvent: ILogEvent): string {

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
function _formatFile(logEvent: ILogEvent): string {

    if (!logEvent.file) {
        _getFileDetails(logEvent);
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
function _formatLineNumber(logEvent: ILogEvent): string {

    if (!logEvent.lineNumber) {
        _getFileDetails(logEvent);
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
function _formatColumn(logEvent: ILogEvent): string {

    if (!logEvent.column) {
        _getFileDetails(logEvent);
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
function _formatMapMessage(logEvent: ILogEvent, params: string[]): string {

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
function _formatLogMessage(logEvent: ILogEvent): string {
    return logEvent.message;
}

function _formatMarkerFromEvent(marker: Marker): string {

    if (marker.hasParents()) {
        const formatted = marker.getParents().map((parent: Marker) => _formatMarkerFromEvent(parent));
        return `${marker.name}[ ${formatted} ]`;
    } else {
        return `${marker.name}`;
    }

}

/**
 *
 * @private
 *
 * @param {ILogEvent} logEvent
 * @return {string}
 */
function _formatMarker(logEvent: ILogEvent): string {
    return (logEvent.marker) ? _formatMarkerFromEvent(logEvent.marker) : '';
}

/**
 * Formats just the marker name (no parents)
 *
 * @private
 *
 * @param {ILogEvent} logEvent
 * @return {string}
 */
function _formatMarkerSimple(logEvent: ILogEvent): string {
    return (logEvent.marker) ? logEvent.marker.name : '';
}

/**
 * @function
 * @memberOf formatter
 *
 * @param {ILogEvent} logEvent
 *
 * @return {string}
 */
function _formatMethodName(logEvent: ILogEvent): string {
    return getFunctionName(logEvent.method as Method<any>);
}

/**
 * @private
 * @function
 * @memberOf formatter
 */
function _formatLineSeparator(): string {
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
function _formatLevel(logEvent: ILogEvent): string {

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
function _formatRelative(logEvent: ILogEvent) {
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
function _formatSequenceNumber(logEvent: ILogEvent) {
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
function _getCompiledLayout(layout: string) {

    if (_compiledLayouts.has(layout)) {
        return _compiledLayouts.get(layout);
    }

    return _compileLayout(layout);

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
function _compileLayout(layout: string) {

    const formatArray = layout.match(/(%\w+({[\w-]+}|)|.)/g)
        .map((value) => _getFormatterObject(value));

    // set the format array to the specified compiled layout
    _compiledLayouts.set(layout, formatArray);

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
function _getFormatterObject(formatString: string) {

    const result = /%(\w+)(?:{([\w-]+)})*/g.exec(formatString);

    if (result == null) {
        return formatString;
    } else if (result.length < 3) {

        return {
            formatter: _getFormatterFunction(result[1]),
            params: [] as string[]
        };

    } else {

        const formatter = _getFormatterFunction(result[1]);
        if (!formatter) {
            return null;
        }

        const params = _getLayoutTagParams(result[2]);

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
function _getFormatterFunction(command: string): Method<any> {

    let regex;
    for (const key in _formatters) {
        if (_formatters.hasOwnProperty(key)) {
            regex = new RegExp('^(' + key + ')$');
            if (regex.exec(command)) {
                return _formatters[key];
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
function _getLayoutTagParams(command: string): string[] {
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
function _formatLogEvent(formatter: IFormatterObject[], logEvent: ILogEvent) {

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
function _getFileDetails(logEvent: ILogEvent) {

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
            if (!fileParts[0] || !fileParts[0].startsWith(appDir)) {
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
