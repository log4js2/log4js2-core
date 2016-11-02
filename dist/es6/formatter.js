/*istanbul ignore next*/'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.preCompile = preCompile;
/*istanbul ignore next*/exports.format = format;

var /*istanbul ignore next*/_dateFormatter = require('./dateFormatter');

var /*istanbul ignore next*/_utility = require('./utility');

/*istanbul ignore next*/
var utility = _interopRequireWildcard(_utility);

var /*istanbul ignore next*/_logLevel = require('./const/logLevel');

/*istanbul ignore next*/
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/** @const */
const _COMMAND_REGEX = /%([a-z,A-Z]+)(?=\{|)/;

/** @type {Object} */
/**
 * log4js <https://github.com/anigenero/log4js>
 *
 * Copyright 2016-present Robin Schultz <http://anigenero.com>
 * Released under the MIT License
 */

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
  return (/*istanbul ignore next*/(0, _dateFormatter.dateFormat)(logEvent.date, params[0])
  );
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
        message += `\t${ stack }\n`;
      });
    } else if (logEvent.error.message != null && logEvent.error.message != '') {
      message += `\t${ logEvent.error.name }: ${ logEvent.error.message }\n`;
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

  return `${ logEvent.lineNumber }`;
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

    case /*istanbul ignore next*/_logLevel.LogLevel.FATAL:
      return 'FATAL';
    case /*istanbul ignore next*/_logLevel.LogLevel.ERROR:
      return 'ERROR';
    case /*istanbul ignore next*/_logLevel.LogLevel.WARN:
      return 'WARN';
    case /*istanbul ignore next*/_logLevel.LogLevel.INFO:
      return 'INFO';
    case /*istanbul ignore next*/_logLevel.LogLevel.DEBUG:
      return 'DEBUG';
    case /*istanbul ignore next*/_logLevel.LogLevel.TRACE:
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
  'c|logger': _formatLogger,
  'd|date': _formatDate,
  'ex|exception|throwable': _formatException,
  'F|file': _formatFile,
  'K|map|MAP': _formatMapMessage,
  'L|line': _formatLineNumber,
  'm|msg|message': _formatLogMessage,
  'M|method': _formatMethodName,
  'n': _formatLineSeparator,
  'p|level': _formatLevel,
  'r|relative': _formatRelative,
  'sn|sequenceNumber': _formatSequenceNumber
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
    file = file.replace(typeof location !== 'undefined' ? location.host : '', '').trim();

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
};

/**
 * @function
 * @memberOf formatter
 *
 * @param {string} layout
 *
 * @return {string}
 */
function preCompile(layout) {
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
function format(layout, logEvent) {
  return _formatLogEvent(_getCompiledLayout(layout), logEvent);
}
//# sourceMappingURL=data:application/json;base64,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UyxRQUFULEdBQW9CLFdBQXBCLENBSE07QUFJTixhQUFTLFVBQVQsR0FBc0IsR0FBdEIsQ0FKTTtHQXJCUDtDQUZxQjs7Ozs7Ozs7OztBQXlDZixTQUFTLFVBQVQsQ0FBb0IsTUFBcEIsRUFBNEI7QUFDbEMscUJBQW1CLE1BQW5CLEVBRGtDO0NBQTVCOzs7Ozs7Ozs7OztBQWFBLFNBQVMsTUFBVCxDQUFnQixNQUFoQixFQUF3QixRQUF4QixFQUFrQztBQUN4QyxTQUFPLGdCQUFnQixtQkFBbUIsTUFBbkIsQ0FBaEIsRUFBNEMsUUFBNUMsQ0FBUCxDQUR3QztDQUFsQyIsImZpbGUiOiJmb3JtYXR0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogbG9nNGpzIDxodHRwczovL2dpdGh1Yi5jb20vYW5pZ2VuZXJvL2xvZzRqcz5cclxuICpcclxuICogQ29weXJpZ2h0IDIwMTYtcHJlc2VudCBSb2JpbiBTY2h1bHR6IDxodHRwOi8vYW5pZ2VuZXJvLmNvbT5cclxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlXHJcbiAqL1xyXG5cclxuaW1wb3J0IHtkYXRlRm9ybWF0fSBmcm9tICcuL2RhdGVGb3JtYXR0ZXInO1xyXG5pbXBvcnQgKiBhcyB1dGlsaXR5IGZyb20gJy4vdXRpbGl0eSc7XHJcbmltcG9ydCB7TG9nTGV2ZWx9IGZyb20gJy4vY29uc3QvbG9nTGV2ZWwnO1xyXG5cclxuLyoqIEBjb25zdCAqL1xyXG5jb25zdCBfQ09NTUFORF9SRUdFWCA9IC8lKFthLXosQS1aXSspKD89XFx7fCkvO1xyXG5cclxuLyoqIEB0eXBlIHtPYmplY3R9ICovXHJcbmxldCBfY29tcGlsZWRMYXlvdXRzID0ge307XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcclxuICpcclxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XHJcbiAqXHJcbiAqIEByZXR1cm4ge3N0cmluZ31cclxuICovXHJcbmxldCBfZm9ybWF0TG9nZ2VyID0gZnVuY3Rpb24gKGxvZ0V2ZW50KSB7XHJcblx0cmV0dXJuIGxvZ0V2ZW50LmxvZ2dlcjtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGZvcm1hdHRlclxyXG4gKlxyXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcclxuICogQHBhcmFtIHtBcnJheS48c3RyaW5nPn0gcGFyYW1zXHJcbiAqXHJcbiAqIEByZXR1cm4ge3N0cmluZ31cclxuICovXHJcbmxldCBfZm9ybWF0RGF0ZSA9IGZ1bmN0aW9uIChsb2dFdmVudCwgcGFyYW1zKSB7XHJcblx0cmV0dXJuIGRhdGVGb3JtYXQobG9nRXZlbnQuZGF0ZSwgcGFyYW1zWzBdKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGZvcm1hdHRlclxyXG4gKlxyXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcclxuICpcclxuICogQHJldHVybiB7c3RyaW5nfVxyXG4gKi9cclxubGV0IF9mb3JtYXRFeGNlcHRpb24gPSBmdW5jdGlvbiAobG9nRXZlbnQpIHtcclxuXHJcbiAgICBsZXQgbWVzc2FnZSA9ICcnO1xyXG5cclxuICAgIGlmIChsb2dFdmVudC5lcnJvciAhPSBudWxsKSB7XHJcblxyXG5cdFx0aWYgKGxvZ0V2ZW50LmVycm9yLnN0YWNrICE9IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRsZXQgc3RhY2tzID0gbG9nRXZlbnQuZXJyb3Iuc3RhY2suc3BsaXQoL1xcbi9nKTtcclxuICAgICAgICAgICAgc3RhY2tzLmZvckVhY2goZnVuY3Rpb24gKHN0YWNrKSB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlICs9IGBcXHQke3N0YWNrfVxcbmA7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cdFx0fSBlbHNlIGlmIChsb2dFdmVudC5lcnJvci5tZXNzYWdlICE9IG51bGwgJiYgbG9nRXZlbnQuZXJyb3IubWVzc2FnZSAhPSAnJykge1xyXG5cdFx0XHRtZXNzYWdlICs9IGBcXHQke2xvZ0V2ZW50LmVycm9yLm5hbWV9OiAke2xvZ0V2ZW50LmVycm9yLm1lc3NhZ2V9XFxuYDtcclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHRyZXR1cm4gbWVzc2FnZTtcclxuXHJcbn07XHJcblxyXG4vKipcclxuICogRm9ybWF0cyB0aGUgZmlsZSAoZS5nLiB0ZXN0LmpzKSB0byB0aGUgZmlsZVxyXG4gKlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGZvcm1hdHRlclxyXG4gKlxyXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcclxuICovXHJcbmxldCBfZm9ybWF0RmlsZSA9IGZ1bmN0aW9uIChsb2dFdmVudCkge1xyXG5cclxuICAgIGlmICghbG9nRXZlbnQuZmlsZSkge1xyXG5cdFx0X2dldEZpbGVEZXRhaWxzKGxvZ0V2ZW50KTtcclxuXHR9XHJcblxyXG5cdHJldHVybiBsb2dFdmVudC5maWxlO1xyXG5cclxufTtcclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGZvcm1hdHRlclxyXG4gKlxyXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcclxuICpcclxuICogQHJldHVybiB7c3RyaW5nfVxyXG4gKi9cclxubGV0IF9mb3JtYXRMaW5lTnVtYmVyID0gZnVuY3Rpb24gKGxvZ0V2ZW50KSB7XHJcblxyXG4gICAgaWYgKCFsb2dFdmVudC5saW5lTnVtYmVyKSB7XHJcblx0XHRfZ2V0RmlsZURldGFpbHMobG9nRXZlbnQpO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIGAke2xvZ0V2ZW50LmxpbmVOdW1iZXJ9YDtcclxuXHJcbn07XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcclxuICpcclxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XHJcbiAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz59IHBhcmFtc1xyXG4gKlxyXG4gKiBAcmV0dXJuIHtzdHJpbmd9XHJcbiAqL1xyXG5sZXQgX2Zvcm1hdE1hcE1lc3NhZ2UgPSBmdW5jdGlvbiAobG9nRXZlbnQsIHBhcmFtcykge1xyXG5cdGxldCBtZXNzYWdlID0gbnVsbDtcclxuXHRpZiAobG9nRXZlbnQucHJvcGVydGllcykge1xyXG5cclxuXHRcdG1lc3NhZ2UgPSBbXTtcclxuXHRcdGZvciAobGV0IGtleSBpbiBsb2dFdmVudC5wcm9wZXJ0aWVzKSB7XHJcblx0XHRcdGlmIChwYXJhbXNbMF0pIHtcclxuXHRcdFx0XHRpZiAocGFyYW1zWzBdID09IGtleSkge1xyXG5cdFx0XHRcdFx0bWVzc2FnZS5wdXNoKGxvZ0V2ZW50LnByb3BlcnRpZXNba2V5XSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdG1lc3NhZ2UucHVzaCgneycgKyBrZXkgKyAnLCcgKyBsb2dFdmVudC5wcm9wZXJ0aWVzW2tleV0gKyAnfScpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuICd7JyArIG1lc3NhZ2Uuam9pbignLCcpICsgJ30nO1xyXG5cclxuXHR9XHJcblx0cmV0dXJuIG1lc3NhZ2U7XHJcbn07XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcclxuICpcclxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XHJcbiAqXHJcbiAqIEByZXR1cm4ge3N0cmluZ31cclxuICovXHJcbmxldCBfZm9ybWF0TG9nTWVzc2FnZSA9IGZ1bmN0aW9uIChsb2dFdmVudCkge1xyXG5cdHJldHVybiBsb2dFdmVudC5tZXNzYWdlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXHJcbiAqXHJcbiAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dFdmVudFxyXG4gKlxyXG4gKiBAcmV0dXJuIHtzdHJpbmd9XHJcbiAqL1xyXG5sZXQgX2Zvcm1hdE1ldGhvZE5hbWUgPSBmdW5jdGlvbiAobG9nRXZlbnQpIHtcclxuXHRyZXR1cm4gdXRpbGl0eS5nZXRGdW5jdGlvbk5hbWUobG9nRXZlbnQubWV0aG9kKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGZvcm1hdHRlclxyXG4gKi9cclxubGV0IF9mb3JtYXRMaW5lU2VwYXJhdG9yID0gZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiAnXFxuJztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGZvcm1hdHRlclxyXG4gKlxyXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcclxuICpcclxuICogQHJldHVybiB7c3RyaW5nfVxyXG4gKi9cclxubGV0IF9mb3JtYXRMZXZlbCA9IGZ1bmN0aW9uIChsb2dFdmVudCkge1xyXG5cclxuICAgIHN3aXRjaCAobG9nRXZlbnQubGV2ZWwpIHtcclxuXHJcbiAgICAgICAgY2FzZSBMb2dMZXZlbC5GQVRBTDpcclxuICAgICAgICAgICAgcmV0dXJuICdGQVRBTCc7XHJcbiAgICAgICAgY2FzZSBMb2dMZXZlbC5FUlJPUjpcclxuICAgICAgICAgICAgcmV0dXJuICdFUlJPUic7XHJcbiAgICAgICAgY2FzZSBMb2dMZXZlbC5XQVJOOlxyXG4gICAgICAgICAgICByZXR1cm4gJ1dBUk4nO1xyXG4gICAgICAgIGNhc2UgTG9nTGV2ZWwuSU5GTzpcclxuICAgICAgICAgICAgcmV0dXJuICdJTkZPJztcclxuICAgICAgICBjYXNlIExvZ0xldmVsLkRFQlVHOlxyXG4gICAgICAgICAgICByZXR1cm4gJ0RFQlVHJztcclxuICAgICAgICBjYXNlIExvZ0xldmVsLlRSQUNFOlxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiAnVFJBQ0UnO1xyXG5cclxuICAgIH1cclxuXHJcbn07XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcclxuICpcclxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XHJcbiAqXHJcbiAqIEByZXR1cm4ge3N0cmluZ31cclxuICovXHJcbmxldCBfZm9ybWF0UmVsYXRpdmUgPSBmdW5jdGlvbiAobG9nRXZlbnQpIHtcclxuXHRyZXR1cm4gJycgKyBsb2dFdmVudC5yZWxhdGl2ZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGZvcm1hdHRlclxyXG4gKlxyXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcclxuICpcclxuICogQHJldHVybiB7c3RyaW5nfVxyXG4gKi9cclxubGV0IF9mb3JtYXRTZXF1ZW5jZU51bWJlciA9IGZ1bmN0aW9uIChsb2dFdmVudCkge1xyXG5cdHJldHVybiAnJyArIGxvZ0V2ZW50LnNlcXVlbmNlO1xyXG59O1xyXG5cclxubGV0IF9mb3JtYXR0ZXJzID0ge1xyXG5cdCdjfGxvZ2dlcicgOiBfZm9ybWF0TG9nZ2VyLFxyXG5cdCdkfGRhdGUnIDogX2Zvcm1hdERhdGUsXHJcblx0J2V4fGV4Y2VwdGlvbnx0aHJvd2FibGUnIDogX2Zvcm1hdEV4Y2VwdGlvbixcclxuXHQnRnxmaWxlJyA6IF9mb3JtYXRGaWxlLFxyXG5cdCdLfG1hcHxNQVAnIDogX2Zvcm1hdE1hcE1lc3NhZ2UsXHJcblx0J0x8bGluZScgOiBfZm9ybWF0TGluZU51bWJlcixcclxuXHQnbXxtc2d8bWVzc2FnZScgOiBfZm9ybWF0TG9nTWVzc2FnZSxcclxuXHQnTXxtZXRob2QnIDogX2Zvcm1hdE1ldGhvZE5hbWUsXHJcblx0J24nIDogX2Zvcm1hdExpbmVTZXBhcmF0b3IsXHJcblx0J3B8bGV2ZWwnIDogX2Zvcm1hdExldmVsLFxyXG5cdCdyfHJlbGF0aXZlJyA6IF9mb3JtYXRSZWxhdGl2ZSxcclxuXHQnc258c2VxdWVuY2VOdW1iZXInIDogX2Zvcm1hdFNlcXVlbmNlTnVtYmVyXHJcbn07XHJcblxyXG4vKipcclxuICogR2V0IHRoZSBjb21waWxlZCBsYXlvdXQgZm9yIHRoZSBzcGVjaWZpZWQgbGF5b3V0IHN0cmluZy4gSWYgdGhlIGNvbXBpbGVkIGxheW91dCBkb2VzIG5vdFxyXG4gKiBleGlzdCwgdGhlbiB3ZSB3YW50IHRvIGNyZWF0ZSBpdC5cclxuICpcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IGxheW91dFxyXG4gKlxyXG4gKiBAcmV0dXJuIHtBcnJheS48c3RyaW5nfGZ1bmN0aW9uPn1cclxuICovXHJcbmxldCBfZ2V0Q29tcGlsZWRMYXlvdXQgPSBmdW5jdGlvbiAobGF5b3V0KSB7XHJcblxyXG5cdGlmIChfY29tcGlsZWRMYXlvdXRzW2xheW91dF0pIHtcclxuXHRcdHJldHVybiBfY29tcGlsZWRMYXlvdXRzW2xheW91dF07XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gX2NvbXBpbGVMYXlvdXQobGF5b3V0KTtcclxuXHJcbn07XHJcblxyXG4vKipcclxuICogQ29tcGlsZXMgYSBsYXlvdXQgaW50byBhbiBhcnJheS4gVGhlIGFycmF5IGNvbnRhaW5zIGZ1bmN0aW9uc1xyXG4gKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGZvcm1hdHRlclxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gbGF5b3V0XHJcbiAqXHJcbiAqIEByZXR1cm4ge0FycmF5LjxzdHJpbmd8ZnVuY3Rpb24+fVxyXG4gKi9cclxubGV0IF9jb21waWxlTGF5b3V0ID0gZnVuY3Rpb24gKGxheW91dCkge1xyXG5cclxuXHRsZXQgaW5kZXggPSBsYXlvdXQuaW5kZXhPZignJScpO1xyXG5cdGxldCBjdXJyZW50Rm9ybWF0U3RyaW5nID0gJyc7XHJcblx0bGV0IGZvcm1hdEFycmF5ID0gW107XHJcblxyXG5cdGlmIChpbmRleCAhPSAwKSB7XHJcblx0XHRmb3JtYXRBcnJheS5wdXNoKGxheW91dC5zdWJzdHJpbmcoMCwgaW5kZXgpKTtcclxuXHR9XHJcblxyXG5cdGRvIHtcclxuXHJcblx0XHRsZXQgc3RhcnRJbmRleCA9IGluZGV4O1xyXG5cdFx0bGV0IGVuZEluZGV4ID0gaW5kZXggPSBsYXlvdXQuaW5kZXhPZignJScsIGluZGV4ICsgMSk7XHJcblxyXG5cdFx0aWYgKGVuZEluZGV4IDwgMCkge1xyXG5cdFx0XHRjdXJyZW50Rm9ybWF0U3RyaW5nID0gbGF5b3V0LnN1YnN0cmluZyhzdGFydEluZGV4KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGN1cnJlbnRGb3JtYXRTdHJpbmcgPSBsYXlvdXQuc3Vic3RyaW5nKHN0YXJ0SW5kZXgsIGVuZEluZGV4KTtcclxuXHRcdH1cclxuXHJcblx0XHRmb3JtYXRBcnJheS5wdXNoKF9nZXRGb3JtYXR0ZXJPYmplY3QoY3VycmVudEZvcm1hdFN0cmluZykpO1xyXG5cclxuXHR9IHdoaWxlIChpbmRleCA+IC0xKTtcclxuXHJcbiAgICAvLyBzZXQgdGhlIGZvcm1hdCBhcnJheSB0byB0aGUgc3BlY2lmaWVkIGNvbXBpbGVkIGxheW91dFxyXG5cdF9jb21waWxlZExheW91dHNbbGF5b3V0XSA9IGZvcm1hdEFycmF5O1xyXG5cclxuXHRyZXR1cm4gZm9ybWF0QXJyYXk7XHJcblxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBmb3JtYXRTdHJpbmdcclxuICpcclxuICogQHJldHVybiB7T2JqZWN0fHN0cmluZ31cclxuICovXHJcbmxldCBfZ2V0Rm9ybWF0dGVyT2JqZWN0ID0gZnVuY3Rpb24gKGZvcm1hdFN0cmluZykge1xyXG5cclxuXHRsZXQgcmVzdWx0ID0gX0NPTU1BTkRfUkVHRVguZXhlYyhmb3JtYXRTdHJpbmcpO1xyXG5cdGlmIChyZXN1bHQgIT0gbnVsbCAmJiByZXN1bHQubGVuZ3RoID09IDIpIHtcclxuXHJcblx0XHRsZXQgZm9ybWF0dGVyID0gX2dldEZvcm1hdHRlckZ1bmN0aW9uKHJlc3VsdFsxXSk7XHJcblx0XHRpZiAoIWZvcm1hdHRlcikge1xyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgcGFyYW1zID0gX2dldExheW91dFRhZ1BhcmFtcyhmb3JtYXRTdHJpbmcpO1xyXG5cclxuXHRcdGxldCBhZnRlciA9ICcnO1xyXG5cdFx0bGV0IGVuZEluZGV4ID0gZm9ybWF0U3RyaW5nLmxhc3RJbmRleE9mKCd9Jyk7XHJcblx0XHRpZiAoZW5kSW5kZXggIT0gLTEpIHtcclxuXHRcdFx0YWZ0ZXIgPSBmb3JtYXRTdHJpbmcuc3Vic3RyaW5nKGVuZEluZGV4ICsgMSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRhZnRlciA9IGZvcm1hdFN0cmluZy5zdWJzdHJpbmcocmVzdWx0LmluZGV4ICsgcmVzdWx0WzFdLmxlbmd0aCArIDEpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdCdmb3JtYXR0ZXInIDogZm9ybWF0dGVyLFxyXG5cdFx0XHQncGFyYW1zJyA6IHBhcmFtcyxcclxuXHRcdFx0J2FmdGVyJyA6IGFmdGVyXHJcblx0XHR9O1xyXG5cclxuXHR9XHJcblxyXG5cdHJldHVybiBmb3JtYXRTdHJpbmc7XHJcblxyXG59O1xyXG5cclxuLyoqXHJcbiAqIERldGVybWluZXMgd2hhdCBmb3JtYXR0ZXIgZnVuY3Rpb24gaGFzIGJlZW4gY29uZmlndXJlZFxyXG4gKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGZvcm1hdHRlclxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gY29tbWFuZFxyXG4gKlxyXG4gKiBAcmV0dXJuIHs/c3RyaW5nfVxyXG4gKi9cclxubGV0IF9nZXRGb3JtYXR0ZXJGdW5jdGlvbiA9IGZ1bmN0aW9uIChjb21tYW5kKSB7XHJcblxyXG5cdGxldCByZWdleDtcclxuXHRmb3IgKGxldCBrZXkgaW4gX2Zvcm1hdHRlcnMpIHtcclxuICAgICAgICBpZiAoX2Zvcm1hdHRlcnMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgICByZWdleCA9IG5ldyBSZWdFeHAoJ14oJyArIGtleSArICcpJCcpO1xyXG4gICAgICAgICAgICBpZiAocmVnZXguZXhlYyhjb21tYW5kKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIF9mb3JtYXR0ZXJzW2tleV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gbnVsbDtcclxuXHJcbn07XHJcblxyXG4vKipcclxuICogR2V0cyB0aGUgbGF5b3V0IHRhZyBwYXJhbXMgYXNzb2NpYXRlZCB3aXRoIHRoZSBsYXlvdXQgdGFnLiBTbywgZm9yIGV4YW1wbGUsICclZHt5eXl5LU1NLWRkfWBcclxuICogd291bGQgb3V0cHV0IGFuIGFycmF5IG9mIFsneXl5eS1NTS1kZCddXHJcbiAqXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBmdW5jdGlvblxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gY29tbWFuZFxyXG4gKlxyXG4gKiBAcmV0dXJuIHtBcnJheS48c3RyaW5nPn1cclxuICovXHJcbmxldCBfZ2V0TGF5b3V0VGFnUGFyYW1zID0gZnVuY3Rpb24gKGNvbW1hbmQpIHtcclxuXHJcblx0bGV0IHBhcmFtcyA9IFtdO1xyXG5cdGxldCByZXN1bHQgPSBjb21tYW5kLm1hdGNoKC9cXHsoW159XSopKD89fSkvZyk7XHJcblx0aWYgKHJlc3VsdCAhPSBudWxsKSB7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHJlc3VsdC5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRwYXJhbXMucHVzaChyZXN1bHRbaV0uc3Vic3RyaW5nKDEpKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJldHVybiBwYXJhbXM7XHJcblxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEhhbmRsZXMgZm9ybWF0dGluZyB0aGUgbG9nIGV2ZW50IHVzaW5nIHRoZSBzcGVjaWZpZWQgZm9ybWF0dGVyIGFycmF5XHJcbiAqXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBmdW5jdGlvblxyXG4gKlxyXG4gKiBAcGFyYW0ge0FycmF5LjxmdW5jdGlvbnxzdHJpbmc+fSBmb3JtYXR0ZXJcclxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XHJcbiAqXHJcbiAqIEByZXR1cm4ge3N0cmluZ31cclxuICovXHJcbmxldCBfZm9ybWF0TG9nRXZlbnQgPSBmdW5jdGlvbiAoZm9ybWF0dGVyLCBsb2dFdmVudCkge1xyXG5cclxuXHRsZXQgcmVzcG9uc2U7XHJcblx0bGV0IG1lc3NhZ2UgPSAnJztcclxuXHRsZXQgY291bnQgPSBmb3JtYXR0ZXIubGVuZ3RoO1xyXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xyXG5cdFx0aWYgKGZvcm1hdHRlcltpXSAhPT0gbnVsbCkge1xyXG5cclxuXHRcdFx0aWYgKGZvcm1hdHRlcltpXSBpbnN0YW5jZW9mIE9iamVjdCkge1xyXG5cclxuXHRcdFx0XHRyZXNwb25zZSA9IGZvcm1hdHRlcltpXS5mb3JtYXR0ZXIobG9nRXZlbnQsIGZvcm1hdHRlcltpXS5wYXJhbXMpO1xyXG5cdFx0XHRcdGlmIChyZXNwb25zZSAhPSBudWxsKSB7XHJcblx0XHRcdFx0XHRtZXNzYWdlICs9IHJlc3BvbnNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRtZXNzYWdlICs9IGZvcm1hdHRlcltpXS5hZnRlcjtcclxuXHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0bWVzc2FnZSArPSBmb3JtYXR0ZXJbaV07XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gbWVzc2FnZS50cmltKCk7XHJcblxyXG59O1xyXG5cclxuLyoqXHJcbiAqXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXHJcbiAqXHJcbiAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dFdmVudFxyXG4gKi9cclxubGV0IF9nZXRGaWxlRGV0YWlscyA9IGZ1bmN0aW9uIChsb2dFdmVudCkge1xyXG5cclxuXHRpZiAobG9nRXZlbnQubG9nRXJyb3JTdGFjaykge1xyXG5cclxuXHRcdGxldCBwYXJ0cyA9IGxvZ0V2ZW50LmxvZ0Vycm9yU3RhY2suc3RhY2suc3BsaXQoL1xcbi9nKTtcclxuXHRcdGxldCBmaWxlID0gcGFydHNbM107XHJcblx0XHRmaWxlID0gZmlsZS5yZXBsYWNlKC9hdCAoLipcXCh8KShmaWxlfGh0dHB8aHR0cHN8KSg6fCkoXFwvfCkqLywgJycpO1xyXG5cdFx0ZmlsZSA9IGZpbGUucmVwbGFjZSgnKScsICcnKTtcclxuXHRcdGZpbGUgPSBmaWxlLnJlcGxhY2UoKHR5cGVvZiBsb2NhdGlvbiAhPT0gJ3VuZGVmaW5lZCcpID8gbG9jYXRpb24uaG9zdCA6ICcnLCAnJykudHJpbSgpO1xyXG5cclxuXHRcdGxldCBmaWxlUGFydHMgPSBmaWxlLnNwbGl0KC9cXDovZyk7XHJcblxyXG5cdFx0bG9nRXZlbnQuY29sdW1uID0gZmlsZVBhcnRzLnBvcCgpO1xyXG5cdFx0bG9nRXZlbnQubGluZU51bWJlciA9IGZpbGVQYXJ0cy5wb3AoKTtcclxuXHJcblx0XHRpZiAodHlwZW9mIGRlZmluZSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0bGV0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XHJcblx0XHRcdGxldCBhcHBEaXIgPSBwYXRoLmRpcm5hbWUocmVxdWlyZS5tYWluLmZpbGVuYW1lKTtcclxuXHRcdFx0bG9nRXZlbnQuZmlsZW5hbWUgPSBmaWxlUGFydHMuam9pbignOicpLnJlcGxhY2UoYXBwRGlyLCAnJykucmVwbGFjZSgvKFxcXFx8XFwvKS8sICcnKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGxvZ0V2ZW50LmZpbGVuYW1lID0gZmlsZVBhcnRzLmpvaW4oJzonKTtcclxuXHRcdH1cclxuXHJcblx0fSBlbHNlIHtcclxuXHJcblx0XHRsb2dFdmVudC5jb2x1bW4gPSAnPyc7XHJcblx0XHRsb2dFdmVudC5maWxlbmFtZSA9ICdhbm9ueW1vdXMnO1xyXG5cdFx0bG9nRXZlbnQubGluZU51bWJlciA9ICc/JztcclxuXHJcblx0fVxyXG5cclxufTtcclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlck9mIGZvcm1hdHRlclxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gbGF5b3V0XHJcbiAqXHJcbiAqIEByZXR1cm4ge3N0cmluZ31cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBwcmVDb21waWxlKGxheW91dCkge1xyXG5cdF9nZXRDb21waWxlZExheW91dChsYXlvdXQpO1xyXG59XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IGxheW91dFxyXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcclxuICpcclxuICogQHJldHVybiB7c3RyaW5nfVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdChsYXlvdXQsIGxvZ0V2ZW50KSB7XHJcblx0cmV0dXJuIF9mb3JtYXRMb2dFdmVudChfZ2V0Q29tcGlsZWRMYXlvdXQobGF5b3V0KSwgbG9nRXZlbnQpO1xyXG59XHJcbiJdfQ==