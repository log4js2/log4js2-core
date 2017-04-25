/**
 * log4js <https://github.com/anigenero/log4js>
 *
 * Copyright 2016-present Robin Schultz <http://anigenero.com>
 * Released under the MIT License
 */

import {dateFormat} from './dateFormatter';
import * as utility from './utility';
import {LogLevel} from './const/logLevel';

/** @const */
const _COMMAND_REGEX = /%([a-z,A-Z]+)(?=\{|)/;

/** @type {Object} */
let _compiledLayouts = {};

/**
 * @function
 * @memberOf formatter
 *
 * @param {LOG_EVENT} logEvent
 *
 * @return {string}
 */
let _formatLogger = function (logEvent) {
	return logEvent.logger;
};

/**
 * @function
 * @memberOf formatter
 *
 * @param {LOG_EVENT} logEvent
 * @param {Array.<string>} params
 *
 * @return {string}
 */
let _formatDate = function (logEvent, params) {
	return dateFormat(logEvent.date, params[0]);
};

/**
 * @function
 * @memberOf formatter
 *
 * @param {LOG_EVENT} logEvent
 *
 * @return {string}
 */
let _formatException = function (logEvent) {

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

};

/**
 * Formats the file (e.g. test.js) to the file
 *
 * @private
 * @function
 * @memberOf formatter
 *
 * @param {LOG_EVENT} logEvent
 */
let _formatFile = function (logEvent) {

    if (!logEvent.file) {
		_getFileDetails(logEvent);
	}

	return logEvent.file;

};

/**
 * @function
 * @memberOf formatter
 *
 * @param {LOG_EVENT} logEvent
 *
 * @return {string}
 */
let _formatLineNumber = function (logEvent) {

    if (!logEvent.lineNumber) {
		_getFileDetails(logEvent);
	}

	return `${logEvent.lineNumber}`;

};

/**
 * @function
 * @memberOf formatter
 *
 * @param {LOG_EVENT} logEvent
 *
 * @return {string}
 */
let _formatColumn = function (logEvent) {

    if (!logEvent.column) {
		_getFileDetails(logEvent);
	}

	return `${logEvent.column}`;

};

/**
 * @function
 * @memberOf formatter
 *
 * @param {LOG_EVENT} logEvent
 * @param {Array.<string>} params
 *
 * @return {string}
 */
let _formatMapMessage = function (logEvent, params) {
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
};

/**
 * @function
 * @memberOf formatter
 *
 * @param {LOG_EVENT} logEvent
 *
 * @return {string}
 */
let _formatLogMessage = function (logEvent) {
	return logEvent.message;
};

/**
 * @function
 * @memberOf formatter
 *
 * @param {LOG_EVENT} logEvent
 *
 * @return {string}
 */
let _formatMethodName = function (logEvent) {
	return utility.getFunctionName(logEvent.method);
};

/**
 * @private
 * @function
 * @memberOf formatter
 */
let _formatLineSeparator = function () {
	return '\n';
};

/**
 * @function
 * @memberOf formatter
 *
 * @param {LOG_EVENT} logEvent
 *
 * @return {string}
 */
let _formatLevel = function (logEvent) {

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

};

/**
 * @function
 * @memberOf formatter
 *
 * @param {LOG_EVENT} logEvent
 *
 * @return {string}
 */
let _formatRelative = function (logEvent) {
	return '' + logEvent.relative;
};

/**
 * @function
 * @memberOf formatter
 *
 * @param {LOG_EVENT} logEvent
 *
 * @return {string}
 */
let _formatSequenceNumber = function (logEvent) {
	return '' + logEvent.sequence;
};

let _formatters = {
	'c|logger' : _formatLogger,
	'd|date' : _formatDate,
	'ex|exception|throwable' : _formatException,
	'F|file' : _formatFile,
	'K|map|MAP' : _formatMapMessage,
	'L|line' : _formatLineNumber,
	'column': _formatColumn,
	'm|msg|message' : _formatLogMessage,
	'M|method' : _formatMethodName,
	'n' : _formatLineSeparator,
	'p|level' : _formatLevel,
	'r|relative' : _formatRelative,
	'sn|sequenceNumber' : _formatSequenceNumber
};

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
let _getCompiledLayout = function (layout) {

	if (_compiledLayouts[layout]) {
		return _compiledLayouts[layout];
	}

	return _compileLayout(layout);

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
let _compileLayout = function (layout) {

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

		formatArray.push(_getFormatterObject(currentFormatString));

	} while (index > -1);

    // set the format array to the specified compiled layout
	_compiledLayouts[layout] = formatArray;

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
let _getFormatterObject = function (formatString) {

	let result = _COMMAND_REGEX.exec(formatString);
	if (result != null && result.length == 2) {

		let formatter = _getFormatterFunction(result[1]);
		if (!formatter) {
			return null;
		}

		let params = _getLayoutTagParams(formatString);

		let after = '';
		let endIndex = formatString.lastIndexOf('}');
		if (endIndex != -1) {
			after = formatString.substring(endIndex + 1);
		} else {
			after = formatString.substring(result.index + result[1].length + 1);
		}

		return {
			'formatter' : formatter,
			'params' : params,
			'after' : after
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
let _getFormatterFunction = function (command) {

	let regex;
	for (let key in _formatters) {
        if (_formatters.hasOwnProperty(key)) {
            regex = new RegExp('^(' + key + ')$');
            if (regex.exec(command)) {
                return _formatters[key];
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
let _getLayoutTagParams = function (command) {

	let params = [];
	let result = command.match(/\{([^}]*)(?=})/g);
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
 * @param {LOG_EVENT} logEvent
 *
 * @return {string}
 */
let _formatLogEvent = function (formatter, logEvent) {

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
 * @param {LOG_EVENT} logEvent
 */
let _getFileDetails = function (logEvent) {

	if (logEvent.logErrorStack) {

		let parts = logEvent.logErrorStack.stack.split(/\n/g);
		let file = parts[3];
		file = file.replace(/at (.*\(|)(file|http|https|)(:|)(\/|)*/, '');
		file = file.replace(')', '');
		file = file.replace((typeof location !== 'undefined') ? location.host : '', '').trim();

		let fileParts = file.split(/\:/g);

		logEvent.column = fileParts.pop();
		logEvent.lineNumber = fileParts.pop();
		
		if (typeof define !== 'undefined') {
			let path = require('path');
			let appDir = path.dirname(require.main.filename);
			if (!fileParts[0].startsWith(appDir)) {
				appDir = '';
			}
			logEvent.filename = fileParts.join(':').replace(appDir, '').replace(/^(\\|\/)/, '');
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

/**
 * @function
 * @memberOf formatter
 *
 * @param {string} layout
 *
 * @return {string}
 */
export function preCompile(layout) {
	_getCompiledLayout(layout);
}

/**
 * @function
 * @memberOf formatter
 *
 * @param {string} layout
 * @param {LOG_EVENT} logEvent
 *
 * @return {string}
 */
export function format(layout, logEvent) {
	return _formatLogEvent(_getCompiledLayout(layout), logEvent);
}
