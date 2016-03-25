/**
 * log4js <https://github.com/anigenero/log4js>
 *
 * Copyright 2016-present Robin Schultz <http://cunae.com>
 * Released under the MIT License
 */

import { dateFormat } from './dateFormatter';
import * as utility from './utility';
import * as logLevel from './const/logLevel';

/** @type {Object} */
var compiledLayouts_ = {};

/**
 * @function
 * @memberOf formatter
 *
 * @param {LOG_EVENT} logEvent
 * @param {Array.<string>} params
 *
 * @return {string}
 */
var formatLogger_ = function(logEvent, params) {
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
var formatDate_ = function(logEvent, params) {
	return dateFormat(new Date(), params[0]);
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
var formatException_ = function(logEvent, params) {
	var message = '';
	if (logEvent.error != null) {

		if (logEvent.error.stack != undefined) {
			var stacks = logEvent.error.stack.split(/\n/g);
			for ( var key in stacks) {
				message += '\t' + stacks[key] + '\n';
			}
		} else if (logEvent.error.message != null && logEvent.error.message != '') {
			message += '\t';
			message += logEvent.error.name + ': ' + logEvent.error.message;
			message += '\n';
		}

	}
	return message;
};

/**
 *
 */
var formatFile_ = function(logEvent, params) {
	if (logEvent.file === null) {
		getFileDetails_(logEvent);
	}
	return logEvent.file;
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
var formatLineNumber_ = function(logEvent, params) {
	if (logEvent.lineNumber === null) {
		getFileDetails_(logEvent);
	}
	return '' + logEvent.lineNumber;
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
var formatMapMessage_ = function(logEvent, params) {
	var message = null;
	if (logEvent.properties) {

		message = [];
		for ( var key in logEvent.properties) {
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
 * @param {Array.<string>} params
 *
 * @return {string}
 */
var formatLogMessage_ = function(logEvent, params) {
	return logEvent.message;
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
var formatMethodName_ = function(logEvent, params) {
	return utility.getFunctionName(logEvent.method);
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
var formatLineSeparator_ = function(logEvent, params) {
	return '\n';
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
var formatLevel_ = function(logEvent, params) {
	if (logEvent.level == logLevel.FATAL) {
		return 'FATAL';
	} else if (logEvent.level == logLevel.ERROR) {
		return 'ERROR';
	} else if (logEvent.level == logLevel.WARN) {
		return 'WARN';
	} else if (logEvent.level == logLevel.INFO) {
		return 'INFO';
	} else if (logEvent.level == logLevel.DEBUG) {
		return 'DEBUG';
	} else if (logEvent.level == logLevel.TRACE) {
		return 'TRACE';
	}
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
var formatRelative_ = function(logEvent, params) {
	return '' + logEvent.relative;
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
var formatSequenceNumber_ = function(logEvent, params) {
	return '' + logEvent.sequence;
};

var formatters_ = {
	'c|logger' : formatLogger_,
	'd|date' : formatDate_,
	'ex|exception|throwable' : formatException_,
	'F|file' : formatFile_,
	'K|map|MAP' : formatMapMessage_,
	'L|line' : formatLineNumber_,
	'm|msg|message' : formatLogMessage_,
	'M|method' : formatMethodName_,
	'n' : formatLineSeparator_,
	'p|level' : formatLevel_,
	'r|relative' : formatRelative_,
	'sn|sequenceNumber' : formatSequenceNumber_
};

/**
 * @function
 * @memberOf formatter
 *
 * @param {string} layout
 *
 * @return {string}
 */
var getCompiledLayout_ = function(layout) {

	if (compiledLayouts_[layout] != undefined) {
		return compiledLayouts_[layout];
	}

	return compileLayout_(layout);

};

/**
 * @function
 * @memberOf formatter
 *
 * @param {string} layout
 *
 * @return {string}
 */
var compileLayout_ = function(layout) {

	var index = layout.indexOf('%');
	var currentFormatString = '';
	var formatter = [];

	if (index != 0) {
		formatter.push(layout.substring(0, index));
	}

	do {

		var startIndex = index;
		var endIndex = index = layout.indexOf('%', index + 1);

		if (endIndex < 0) {
			currentFormatString = layout.substring(startIndex);
		} else {
			currentFormatString = layout.substring(startIndex, endIndex);
		}

		formatter.push(getFormatterObject_(currentFormatString));

	} while (index > -1);

	compiledLayouts_[layout] = formatter;

	return formatter;

};

/**
 * @function
 * @memberOf formatter
 *
 * @param {string} formatString
 *
 * @return {?string}
 */
var getFormatterObject_ = function(formatString) {

	var commandRegex = /%([a-z,A-Z]+)(?=\{|)/;
	var result = commandRegex.exec(formatString);
	if (result != null && result.length == 2) {

		var formatter = getFormatterFunction_(result[1]);
		if (formatter == null) {
			return null;
		}

		var params = getFormatterParams_(formatString);

		var after = '';
		var endIndex = formatString.lastIndexOf('}');
		if (endIndex != -1) {
			after = formatString.substring(endIndex + 1);
		} else {
			after = formatString.substring(result.index + result[1].length + 1);
		}

		return {
			formatter : formatter,
			params : params,
			after : after
		};

	}

	return formatString;

};

/**
 * @function
 * @memberOf formatter
 *
 * @param {string} command
 *
 * @return {?string}
 */
var getFormatterFunction_ = function(command) {

	var regex;
	for ( var key in formatters_) {
		regex = new RegExp('^' + key + '$');
		if (regex.exec(command) != null) {
			return formatters_[key];
		}
	}

	return null;

};

/**
 * @private
 * @function
 *
 * @param {string} command
 *
 * @return {string}
 */
var getFormatterParams_ = function(command) {

	var params = [];
	var result = command.match(/\{([^\}]*)(?=\})/g);
	if (result != null) {
		for (var i = 0; i < result.length; i++) {
			params.push(result[i].substring(1));
		}
	}

	return params;

};

/**
 * @private
 * @function
 *
 * @param {Array.<function|string>} formatter
 * @param {LOG_EVENT} logEvent
 *
 * @return {string}
 */
var formatLogEvent_ = function(formatter, logEvent) {

	var response;
	var message = '';
	var count = formatter.length;
	for (var i = 0; i < count; i++) {
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

function getFileDetails_(logEvent) {

	if (logEvent.logErrorStack !== undefined) {

		let parts = logEvent.logErrorStack.stack.split(/\n/g);
		let file = parts[3];
		file = file.replace(/at (.*\(|)(file|http|https|)(\:|)(\/|)*/, '');
		file = file.replace(')', '');
		file = file.replace((typeof location !== 'undefined') ? location.host : '', '').trim();

		let fileParts = file.split(/\:/g);

		logEvent.column = fileParts.pop();
		logEvent.lineNumber = fileParts.pop();

		if (typeof define !== 'undefined') {
			let path = require('path');
			let appDir = path.dirname(require.main.filename);
			logEvent.filename = fileParts.join(':').replace(appDir, '').replace(/(\\|\/)/, '');
		} else {
			logEvent.filename = fileParts.join(':');
		}

	} else {

		logEvent.column = '?';
		logEvent.filename = 'anonymous';
		logEvent.lineNumber = '?';

	}

}

/**
 * @function
 * @memberOf formatter
 *
 * @param {string} layout
 *
 * @return {string}
 */
export function preCompile(layout) {
	getCompiledLayout_(layout);
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
	return formatLogEvent_(getCompiledLayout_(layout), logEvent);
}