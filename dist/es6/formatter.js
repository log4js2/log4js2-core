/*istanbul ignore next*/'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.preCompile = preCompile;
/*istanbul ignore next*/exports.format = format;

var /*istanbul ignore next*/_dateFormatter = require('./dateFormatter');

var /*istanbul ignore next*/_utility = require('./utility');

/*istanbul ignore next*/var utility = _interopRequireWildcard(_utility);

var /*istanbul ignore next*/_logLevel = require('./const/logLevel');

/*istanbul ignore next*/function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZvcm1hdHRlci5qcyJdLCJuYW1lcyI6WyJwcmVDb21waWxlIiwiZm9ybWF0IiwidXRpbGl0eSIsIl9DT01NQU5EX1JFR0VYIiwiX2NvbXBpbGVkTGF5b3V0cyIsIl9mb3JtYXRMb2dnZXIiLCJsb2dFdmVudCIsImxvZ2dlciIsIl9mb3JtYXREYXRlIiwicGFyYW1zIiwiZGF0ZSIsIl9mb3JtYXRFeGNlcHRpb24iLCJtZXNzYWdlIiwiZXJyb3IiLCJzdGFjayIsInVuZGVmaW5lZCIsInN0YWNrcyIsInNwbGl0IiwiZm9yRWFjaCIsIm5hbWUiLCJfZm9ybWF0RmlsZSIsImZpbGUiLCJfZ2V0RmlsZURldGFpbHMiLCJfZm9ybWF0TGluZU51bWJlciIsImxpbmVOdW1iZXIiLCJfZm9ybWF0TWFwTWVzc2FnZSIsInByb3BlcnRpZXMiLCJrZXkiLCJwdXNoIiwiam9pbiIsIl9mb3JtYXRMb2dNZXNzYWdlIiwiX2Zvcm1hdE1ldGhvZE5hbWUiLCJnZXRGdW5jdGlvbk5hbWUiLCJtZXRob2QiLCJfZm9ybWF0TGluZVNlcGFyYXRvciIsIl9mb3JtYXRMZXZlbCIsImxldmVsIiwiRkFUQUwiLCJFUlJPUiIsIldBUk4iLCJJTkZPIiwiREVCVUciLCJUUkFDRSIsIl9mb3JtYXRSZWxhdGl2ZSIsInJlbGF0aXZlIiwiX2Zvcm1hdFNlcXVlbmNlTnVtYmVyIiwic2VxdWVuY2UiLCJfZm9ybWF0dGVycyIsIl9nZXRDb21waWxlZExheW91dCIsImxheW91dCIsIl9jb21waWxlTGF5b3V0IiwiaW5kZXgiLCJpbmRleE9mIiwiY3VycmVudEZvcm1hdFN0cmluZyIsImZvcm1hdEFycmF5Iiwic3Vic3RyaW5nIiwic3RhcnRJbmRleCIsImVuZEluZGV4IiwiX2dldEZvcm1hdHRlck9iamVjdCIsImZvcm1hdFN0cmluZyIsInJlc3VsdCIsImV4ZWMiLCJsZW5ndGgiLCJmb3JtYXR0ZXIiLCJfZ2V0Rm9ybWF0dGVyRnVuY3Rpb24iLCJfZ2V0TGF5b3V0VGFnUGFyYW1zIiwiYWZ0ZXIiLCJsYXN0SW5kZXhPZiIsImNvbW1hbmQiLCJyZWdleCIsImhhc093blByb3BlcnR5IiwiUmVnRXhwIiwibWF0Y2giLCJpIiwiX2Zvcm1hdExvZ0V2ZW50IiwicmVzcG9uc2UiLCJjb3VudCIsIk9iamVjdCIsInRyaW0iLCJsb2dFcnJvclN0YWNrIiwicGFydHMiLCJyZXBsYWNlIiwibG9jYXRpb24iLCJob3N0IiwiZmlsZVBhcnRzIiwiY29sdW1uIiwicG9wIiwiZGVmaW5lIiwicGF0aCIsInJlcXVpcmUiLCJhcHBEaXIiLCJkaXJuYW1lIiwibWFpbiIsImZpbGVuYW1lIl0sIm1hcHBpbmdzIjoiOzs7OztRQWllZ0JBLFUsR0FBQUEsVTtnQ0FhQUMsTSxHQUFBQSxNOztBQXZlaEI7O0FBQ0E7OzRCQUFZQyxPOztBQUNaOzs7O0FBRUE7QUFDQSxNQUFNQyxpQkFBaUIsc0JBQXZCOztBQUVBO0FBZEE7Ozs7Ozs7QUFlQSxJQUFJQyxtQkFBbUIsRUFBdkI7O0FBRUE7Ozs7Ozs7O0FBUUEsSUFBSUMsZ0JBQWdCLFVBQVVDLFFBQVYsRUFBb0I7QUFDdkMsU0FBT0EsU0FBU0MsTUFBaEI7QUFDQSxDQUZEOztBQUlBOzs7Ozs7Ozs7QUFTQSxJQUFJQyxjQUFjLFVBQVVGLFFBQVYsRUFBb0JHLE1BQXBCLEVBQTRCO0FBQzdDLFNBQU8sd0RBQVdILFNBQVNJLElBQXBCLEVBQTBCRCxPQUFPLENBQVAsQ0FBMUI7QUFBUDtBQUNBLENBRkQ7O0FBSUE7Ozs7Ozs7O0FBUUEsSUFBSUUsbUJBQW1CLFVBQVVMLFFBQVYsRUFBb0I7O0FBRXZDLE1BQUlNLFVBQVUsRUFBZDs7QUFFQSxNQUFJTixTQUFTTyxLQUFULElBQWtCLElBQXRCLEVBQTRCOztBQUU5QixRQUFJUCxTQUFTTyxLQUFULENBQWVDLEtBQWYsSUFBd0JDLFNBQTVCLEVBQXVDO0FBQ3RDLFVBQUlDLFNBQVNWLFNBQVNPLEtBQVQsQ0FBZUMsS0FBZixDQUFxQkcsS0FBckIsQ0FBMkIsS0FBM0IsQ0FBYjtBQUNTRCxhQUFPRSxPQUFQLENBQWUsVUFBVUosS0FB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QUFLRyxPQUFMLENBQWFGLFFBQVFHLElBQVIsQ0FBYUMsUUFBMUIsQ0FBYjtBQUNBdkYsZUFBU3VGLFFBQVQsR0FBb0JULFVBQVV2RCxJQUFWLENBQWUsR0FBZixFQUFvQm9ELE9BQXBCLENBQTRCUyxNQUE1QixFQUFvQyxFQUFwQyxFQUF3Q1QsT0FBeEMsQ0FBZ0QsU0FBaEQsRUFBMkQsRUFBM0QsQ0FBcEI7QUFDQSxLQUpELE1BSU87QUFDTjNFLGVBQVN1RixRQUFULEdBQW9CVCxVQUFVdkQsSUFBVixDQUFlLEdBQWYsQ0FBcEI7QUFDQTtBQUVELEdBckJELE1BcUJPOztBQUVOdkIsYUFBUytFLE1BQVQsR0FBa0IsR0FBbEI7QUFDQS9FLGFBQVN1RixRQUFULEdBQW9CLFdBQXBCO0FBQ0F2RixhQUFTa0IsVUFBVCxHQUFzQixHQUF0QjtBQUVBO0FBRUQsQ0EvQkQ7O0FBaUNBOzs7Ozs7OztBQVFPLFNBQVN4QixVQUFULENBQW9CaUQsTUFBcEIsRUFBNEI7QUFDbENELHFCQUFtQkMsTUFBbkI7QUFDQTs7QUFFRDs7Ozs7Ozs7O0FBU08sU0FBU2hELE1BQVQsQ0FBZ0JnRCxNQUFoQixFQUF3QjNDLFFBQXhCLEVBQWtDO0FBQ3hDLFNBQU9vRSxnQkFBZ0IxQixtQkFBbUJDLE1BQW5CLENBQWhCLEVBQTRDM0MsUUFBNUMsQ0FBUDtBQUNBIiwiZmlsZSI6ImZvcm1hdHRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogbG9nNGpzIDxodHRwczovL2dpdGh1Yi5jb20vYW5pZ2VuZXJvL2xvZzRqcz5cbiAqXG4gKiBDb3B5cmlnaHQgMjAxNi1wcmVzZW50IFJvYmluIFNjaHVsdHogPGh0dHA6Ly9hbmlnZW5lcm8uY29tPlxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlXG4gKi9cblxuaW1wb3J0IHtkYXRlRm9ybWF0fSBmcm9tICcuL2RhdGVGb3JtYXR0ZXInO1xuaW1wb3J0ICogYXMgdXRpbGl0eSBmcm9tICcuL3V0aWxpdHknO1xuaW1wb3J0IHtMb2dMZXZlbH0gZnJvbSAnLi9jb25zdC9sb2dMZXZlbCc7XG5cbi8qKiBAY29uc3QgKi9cbmNvbnN0IF9DT01NQU5EX1JFR0VYID0gLyUoW2EteixBLVpdKykoPz1cXHt8KS87XG5cbi8qKiBAdHlwZSB7T2JqZWN0fSAqL1xubGV0IF9jb21waWxlZExheW91dHMgPSB7fTtcblxuLyoqXG4gKiBAZnVuY3Rpb25cbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcbiAqXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcbiAqXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmxldCBfZm9ybWF0TG9nZ2VyID0gZnVuY3Rpb24gKGxvZ0V2ZW50KSB7XG5cdHJldHVybiBsb2dFdmVudC5sb2dnZXI7XG59O1xuXG4vKipcbiAqIEBmdW5jdGlvblxuICogQG1lbWJlck9mIGZvcm1hdHRlclxuICpcbiAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dFdmVudFxuICogQHBhcmFtIHtBcnJheS48c3RyaW5nPn0gcGFyYW1zXG4gKlxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5sZXQgX2Zvcm1hdERhdGUgPSBmdW5jdGlvbiAobG9nRXZlbnQsIHBhcmFtcykge1xuXHRyZXR1cm4gZGF0ZUZvcm1hdChsb2dFdmVudC5kYXRlLCBwYXJhbXNbMF0pO1xufTtcblxuLyoqXG4gKiBAZnVuY3Rpb25cbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcbiAqXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcbiAqXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmxldCBfZm9ybWF0RXhjZXB0aW9uID0gZnVuY3Rpb24gKGxvZ0V2ZW50KSB7XG5cbiAgICBsZXQgbWVzc2FnZSA9ICcnO1xuXG4gICAgaWYgKGxvZ0V2ZW50LmVycm9yICE9IG51bGwpIHtcblxuXHRcdGlmIChsb2dFdmVudC5lcnJvci5zdGFjayAhPSB1bmRlZmluZWQpIHtcblx0XHRcdGxldCBzdGFja3MgPSBsb2dFdmVudC5lcnJvci5zdGFjay5zcGxpdCgvXFxuL2cpO1xuICAgICAgICAgICAgc3RhY2tzLmZvckVhY2goZnVuY3Rpb24gKHN0YWNrKSB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZSArPSBgXFx0JHtzdGFja31cXG5gO1xuICAgICAgICAgICAgfSk7XG5cdFx0fSBlbHNlIGlmIChsb2dFdmVudC5lcnJvci5tZXNzYWdlICE9IG51bGwgJiYgbG9nRXZlbnQuZXJyb3IubWVzc2FnZSAhPSAnJykge1xuXHRcdFx0bWVzc2FnZSArPSBgXFx0JHtsb2dFdmVudC5lcnJvci5uYW1lfTogJHtsb2dFdmVudC5lcnJvci5tZXNzYWdlfVxcbmA7XG5cdFx0fVxuXG5cdH1cblxuXHRyZXR1cm4gbWVzc2FnZTtcblxufTtcblxuLyoqXG4gKiBGb3JtYXRzIHRoZSBmaWxlIChlLmcuIHRlc3QuanMpIHRvIHRoZSBmaWxlXG4gKlxuICogQHByaXZhdGVcbiAqIEBmdW5jdGlvblxuICogQG1lbWJlck9mIGZvcm1hdHRlclxuICpcbiAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dFdmVudFxuICovXG5sZXQgX2Zvcm1hdEZpbGUgPSBmdW5jdGlvbiAobG9nRXZlbnQpIHtcblxuICAgIGlmICghbG9nRXZlbnQuZmlsZSkge1xuXHRcdF9nZXRGaWxlRGV0YWlscyhsb2dFdmVudCk7XG5cdH1cblxuXHRyZXR1cm4gbG9nRXZlbnQuZmlsZTtcblxufTtcblxuLyoqXG4gKiBAZnVuY3Rpb25cbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcbiAqXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcbiAqXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmxldCBfZm9ybWF0TGluZU51bWJlciA9IGZ1bmN0aW9uIChsb2dFdmVudCkge1xuXG4gICAgaWYgKCFsb2dFdmVudC5saW5lTnVtYmVyKSB7XG5cdFx0X2dldEZpbGVEZXRhaWxzKGxvZ0V2ZW50KTtcblx0fVxuXG5cdHJldHVybiBgJHtsb2dFdmVudC5saW5lTnVtYmVyfWA7XG5cbn07XG5cbi8qKlxuICogQGZ1bmN0aW9uXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXG4gKlxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XG4gKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSBwYXJhbXNcbiAqXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmxldCBfZm9ybWF0TWFwTWVzc2FnZSA9IGZ1bmN0aW9uIChsb2dFdmVudCwgcGFyYW1zKSB7XG5cdGxldCBtZXNzYWdlID0gbnVsbDtcblx0aWYgKGxvZ0V2ZW50LnByb3BlcnRpZXMpIHtcblxuXHRcdG1lc3NhZ2UgPSBbXTtcblx0XHRmb3IgKGxldCBrZXkgaW4gbG9nRXZlbnQucHJvcGVydGllcykge1xuXHRcdFx0aWYgKHBhcmFtc1swXSkge1xuXHRcdFx0XHRpZiAocGFyYW1zWzBdID09IGtleSkge1xuXHRcdFx0XHRcdG1lc3NhZ2UucHVzaChsb2dFdmVudC5wcm9wZXJ0aWVzW2tleV0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRtZXNzYWdlLnB1c2goJ3snICsga2V5ICsgJywnICsgbG9nRXZlbnQucHJvcGVydGllc1trZXldICsgJ30nKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gJ3snICsgbWVzc2FnZS5qb2luKCcsJykgKyAnfSc7XG5cblx0fVxuXHRyZXR1cm4gbWVzc2FnZTtcbn07XG5cbi8qKlxuICogQGZ1bmN0aW9uXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXG4gKlxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XG4gKlxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5sZXQgX2Zvcm1hdExvZ01lc3NhZ2UgPSBmdW5jdGlvbiAobG9nRXZlbnQpIHtcblx0cmV0dXJuIGxvZ0V2ZW50Lm1lc3NhZ2U7XG59O1xuXG4vKipcbiAqIEBmdW5jdGlvblxuICogQG1lbWJlck9mIGZvcm1hdHRlclxuICpcbiAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dFdmVudFxuICpcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xubGV0IF9mb3JtYXRNZXRob2ROYW1lID0gZnVuY3Rpb24gKGxvZ0V2ZW50KSB7XG5cdHJldHVybiB1dGlsaXR5LmdldEZ1bmN0aW9uTmFtZShsb2dFdmVudC5tZXRob2QpO1xufTtcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogQGZ1bmN0aW9uXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXG4gKi9cbmxldCBfZm9ybWF0TGluZVNlcGFyYXRvciA9IGZ1bmN0aW9uICgpIHtcblx0cmV0dXJuICdcXG4nO1xufTtcblxuLyoqXG4gKiBAZnVuY3Rpb25cbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcbiAqXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcbiAqXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmxldCBfZm9ybWF0TGV2ZWwgPSBmdW5jdGlvbiAobG9nRXZlbnQpIHtcblxuICAgIHN3aXRjaCAobG9nRXZlbnQubGV2ZWwpIHtcblxuICAgICAgICBjYXNlIExvZ0xldmVsLkZBVEFMOlxuICAgICAgICAgICAgcmV0dXJuICdGQVRBTCc7XG4gICAgICAgIGNhc2UgTG9nTGV2ZWwuRVJST1I6XG4gICAgICAgICAgICByZXR1cm4gJ0VSUk9SJztcbiAgICAgICAgY2FzZSBMb2dMZXZlbC5XQVJOOlxuICAgICAgICAgICAgcmV0dXJuICdXQVJOJztcbiAgICAgICAgY2FzZSBMb2dMZXZlbC5JTkZPOlxuICAgICAgICAgICAgcmV0dXJuICdJTkZPJztcbiAgICAgICAgY2FzZSBMb2dMZXZlbC5ERUJVRzpcbiAgICAgICAgICAgIHJldHVybiAnREVCVUcnO1xuICAgICAgICBjYXNlIExvZ0xldmVsLlRSQUNFOlxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuICdUUkFDRSc7XG5cbiAgICB9XG5cbn07XG5cbi8qKlxuICogQGZ1bmN0aW9uXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXG4gKlxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XG4gKlxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5sZXQgX2Zvcm1hdFJlbGF0aXZlID0gZnVuY3Rpb24gKGxvZ0V2ZW50KSB7XG5cdHJldHVybiAnJyArIGxvZ0V2ZW50LnJlbGF0aXZlO1xufTtcblxuLyoqXG4gKiBAZnVuY3Rpb25cbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcbiAqXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcbiAqXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmxldCBfZm9ybWF0U2VxdWVuY2VOdW1iZXIgPSBmdW5jdGlvbiAobG9nRXZlbnQpIHtcblx0cmV0dXJuICcnICsgbG9nRXZlbnQuc2VxdWVuY2U7XG59O1xuXG5sZXQgX2Zvcm1hdHRlcnMgPSB7XG5cdCdjfGxvZ2dlcicgOiBfZm9ybWF0TG9nZ2VyLFxuXHQnZHxkYXRlJyA6IF9mb3JtYXREYXRlLFxuXHQnZXh8ZXhjZXB0aW9ufHRocm93YWJsZScgOiBfZm9ybWF0RXhjZXB0aW9uLFxuXHQnRnxmaWxlJyA6IF9mb3JtYXRGaWxlLFxuXHQnS3xtYXB8TUFQJyA6IF9mb3JtYXRNYXBNZXNzYWdlLFxuXHQnTHxsaW5lJyA6IF9mb3JtYXRMaW5lTnVtYmVyLFxuXHQnbXxtc2d8bWVzc2FnZScgOiBfZm9ybWF0TG9nTWVzc2FnZSxcblx0J018bWV0aG9kJyA6IF9mb3JtYXRNZXRob2ROYW1lLFxuXHQnbicgOiBfZm9ybWF0TGluZVNlcGFyYXRvcixcblx0J3B8bGV2ZWwnIDogX2Zvcm1hdExldmVsLFxuXHQncnxyZWxhdGl2ZScgOiBfZm9ybWF0UmVsYXRpdmUsXG5cdCdzbnxzZXF1ZW5jZU51bWJlcicgOiBfZm9ybWF0U2VxdWVuY2VOdW1iZXJcbn07XG5cbi8qKlxuICogR2V0IHRoZSBjb21waWxlZCBsYXlvdXQgZm9yIHRoZSBzcGVjaWZpZWQgbGF5b3V0IHN0cmluZy4gSWYgdGhlIGNvbXBpbGVkIGxheW91dCBkb2VzIG5vdFxuICogZXhpc3QsIHRoZW4gd2Ugd2FudCB0byBjcmVhdGUgaXQuXG4gKlxuICogQGZ1bmN0aW9uXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGxheW91dFxuICpcbiAqIEByZXR1cm4ge0FycmF5LjxzdHJpbmd8ZnVuY3Rpb24+fVxuICovXG5sZXQgX2dldENvbXBpbGVkTGF5b3V0ID0gZnVuY3Rpb24gKGxheW91dCkge1xuXG5cdGlmIChfY29tcGlsZWRMYXlvdXRzW2xheW91dF0pIHtcblx0XHRyZXR1cm4gX2NvbXBpbGVkTGF5b3V0c1tsYXlvdXRdO1xuXHR9XG5cblx0cmV0dXJuIF9jb21waWxlTGF5b3V0KGxheW91dCk7XG5cbn07XG5cbi8qKlxuICogQ29tcGlsZXMgYSBsYXlvdXQgaW50byBhbiBhcnJheS4gVGhlIGFycmF5IGNvbnRhaW5zIGZ1bmN0aW9uc1xuICpcbiAqIEBmdW5jdGlvblxuICogQG1lbWJlck9mIGZvcm1hdHRlclxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBsYXlvdXRcbiAqXG4gKiBAcmV0dXJuIHtBcnJheS48c3RyaW5nfGZ1bmN0aW9uPn1cbiAqL1xubGV0IF9jb21waWxlTGF5b3V0ID0gZnVuY3Rpb24gKGxheW91dCkge1xuXG5cdGxldCBpbmRleCA9IGxheW91dC5pbmRleE9mKCclJyk7XG5cdGxldCBjdXJyZW50Rm9ybWF0U3RyaW5nID0gJyc7XG5cdGxldCBmb3JtYXRBcnJheSA9IFtdO1xuXG5cdGlmIChpbmRleCAhPSAwKSB7XG5cdFx0Zm9ybWF0QXJyYXkucHVzaChsYXlvdXQuc3Vic3RyaW5nKDAsIGluZGV4KSk7XG5cdH1cblxuXHRkbyB7XG5cblx0XHRsZXQgc3RhcnRJbmRleCA9IGluZGV4O1xuXHRcdGxldCBlbmRJbmRleCA9IGluZGV4ID0gbGF5b3V0LmluZGV4T2YoJyUnLCBpbmRleCArIDEpO1xuXG5cdFx0aWYgKGVuZEluZGV4IDwgMCkge1xuXHRcdFx0Y3VycmVudEZvcm1hdFN0cmluZyA9IGxheW91dC5zdWJzdHJpbmcoc3RhcnRJbmRleCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGN1cnJlbnRGb3JtYXRTdHJpbmcgPSBsYXlvdXQuc3Vic3RyaW5nKHN0YXJ0SW5kZXgsIGVuZEluZGV4KTtcblx0XHR9XG5cblx0XHRmb3JtYXRBcnJheS5wdXNoKF9nZXRGb3JtYXR0ZXJPYmplY3QoY3VycmVudEZvcm1hdFN0cmluZykpO1xuXG5cdH0gd2hpbGUgKGluZGV4ID4gLTEpO1xuXG4gICAgLy8gc2V0IHRoZSBmb3JtYXQgYXJyYXkgdG8gdGhlIHNwZWNpZmllZCBjb21waWxlZCBsYXlvdXRcblx0X2NvbXBpbGVkTGF5b3V0c1tsYXlvdXRdID0gZm9ybWF0QXJyYXk7XG5cblx0cmV0dXJuIGZvcm1hdEFycmF5O1xuXG59O1xuXG4vKipcbiAqIEBmdW5jdGlvblxuICogQG1lbWJlck9mIGZvcm1hdHRlclxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBmb3JtYXRTdHJpbmdcbiAqXG4gKiBAcmV0dXJuIHtPYmplY3R8c3RyaW5nfVxuICovXG5sZXQgX2dldEZvcm1hdHRlck9iamVjdCA9IGZ1bmN0aW9uIChmb3JtYXRTdHJpbmcpIHtcblxuXHRsZXQgcmVzdWx0ID0gX0NPTU1BTkRfUkVHRVguZXhlYyhmb3JtYXRTdHJpbmcpO1xuXHRpZiAocmVzdWx0ICE9IG51bGwgJiYgcmVzdWx0Lmxlbmd0aCA9PSAyKSB7XG5cblx0XHRsZXQgZm9ybWF0dGVyID0gX2dldEZvcm1hdHRlckZ1bmN0aW9uKHJlc3VsdFsxXSk7XG5cdFx0aWYgKCFmb3JtYXR0ZXIpIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdGxldCBwYXJhbXMgPSBfZ2V0TGF5b3V0VGFnUGFyYW1zKGZvcm1hdFN0cmluZyk7XG5cblx0XHRsZXQgYWZ0ZXIgPSAnJztcblx0XHRsZXQgZW5kSW5kZXggPSBmb3JtYXRTdHJpbmcubGFzdEluZGV4T2YoJ30nKTtcblx0XHRpZiAoZW5kSW5kZXggIT0gLTEpIHtcblx0XHRcdGFmdGVyID0gZm9ybWF0U3RyaW5nLnN1YnN0cmluZyhlbmRJbmRleCArIDEpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRhZnRlciA9IGZvcm1hdFN0cmluZy5zdWJzdHJpbmcocmVzdWx0LmluZGV4ICsgcmVzdWx0WzFdLmxlbmd0aCArIDEpO1xuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHQnZm9ybWF0dGVyJyA6IGZvcm1hdHRlcixcblx0XHRcdCdwYXJhbXMnIDogcGFyYW1zLFxuXHRcdFx0J2FmdGVyJyA6IGFmdGVyXG5cdFx0fTtcblxuXHR9XG5cblx0cmV0dXJuIGZvcm1hdFN0cmluZztcblxufTtcblxuLyoqXG4gKiBEZXRlcm1pbmVzIHdoYXQgZm9ybWF0dGVyIGZ1bmN0aW9uIGhhcyBiZWVuIGNvbmZpZ3VyZWRcbiAqXG4gKiBAZnVuY3Rpb25cbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gY29tbWFuZFxuICpcbiAqIEByZXR1cm4gez9zdHJpbmd9XG4gKi9cbmxldCBfZ2V0Rm9ybWF0dGVyRnVuY3Rpb24gPSBmdW5jdGlvbiAoY29tbWFuZCkge1xuXG5cdGxldCByZWdleDtcblx0Zm9yIChsZXQga2V5IGluIF9mb3JtYXR0ZXJzKSB7XG4gICAgICAgIGlmIChfZm9ybWF0dGVycy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICByZWdleCA9IG5ldyBSZWdFeHAoJ14oJyArIGtleSArICcpJCcpO1xuICAgICAgICAgICAgaWYgKHJlZ2V4LmV4ZWMoY29tbWFuZCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX2Zvcm1hdHRlcnNba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXHR9XG5cblx0cmV0dXJuIG51bGw7XG5cbn07XG5cbi8qKlxuICogR2V0cyB0aGUgbGF5b3V0IHRhZyBwYXJhbXMgYXNzb2NpYXRlZCB3aXRoIHRoZSBsYXlvdXQgdGFnLiBTbywgZm9yIGV4YW1wbGUsICclZHt5eXl5LU1NLWRkfWBcbiAqIHdvdWxkIG91dHB1dCBhbiBhcnJheSBvZiBbJ3l5eXktTU0tZGQnXVxuICpcbiAqIEBwcml2YXRlXG4gKiBAZnVuY3Rpb25cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gY29tbWFuZFxuICpcbiAqIEByZXR1cm4ge0FycmF5LjxzdHJpbmc+fVxuICovXG5sZXQgX2dldExheW91dFRhZ1BhcmFtcyA9IGZ1bmN0aW9uIChjb21tYW5kKSB7XG5cblx0bGV0IHBhcmFtcyA9IFtdO1xuXHRsZXQgcmVzdWx0ID0gY29tbWFuZC5tYXRjaCgvXFx7KFtefV0qKSg/PX0pL2cpO1xuXHRpZiAocmVzdWx0ICE9IG51bGwpIHtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHJlc3VsdC5sZW5ndGg7IGkrKykge1xuXHRcdFx0cGFyYW1zLnB1c2gocmVzdWx0W2ldLnN1YnN0cmluZygxKSk7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHBhcmFtcztcblxufTtcblxuLyoqXG4gKiBIYW5kbGVzIGZvcm1hdHRpbmcgdGhlIGxvZyBldmVudCB1c2luZyB0aGUgc3BlY2lmaWVkIGZvcm1hdHRlciBhcnJheVxuICpcbiAqIEBwcml2YXRlXG4gKiBAZnVuY3Rpb25cbiAqXG4gKiBAcGFyYW0ge0FycmF5LjxmdW5jdGlvbnxzdHJpbmc+fSBmb3JtYXR0ZXJcbiAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dFdmVudFxuICpcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xubGV0IF9mb3JtYXRMb2dFdmVudCA9IGZ1bmN0aW9uIChmb3JtYXR0ZXIsIGxvZ0V2ZW50KSB7XG5cblx0bGV0IHJlc3BvbnNlO1xuXHRsZXQgbWVzc2FnZSA9ICcnO1xuXHRsZXQgY291bnQgPSBmb3JtYXR0ZXIubGVuZ3RoO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcblx0XHRpZiAoZm9ybWF0dGVyW2ldICE9PSBudWxsKSB7XG5cblx0XHRcdGlmIChmb3JtYXR0ZXJbaV0gaW5zdGFuY2VvZiBPYmplY3QpIHtcblxuXHRcdFx0XHRyZXNwb25zZSA9IGZvcm1hdHRlcltpXS5mb3JtYXR0ZXIobG9nRXZlbnQsIGZvcm1hdHRlcltpXS5wYXJhbXMpO1xuXHRcdFx0XHRpZiAocmVzcG9uc2UgIT0gbnVsbCkge1xuXHRcdFx0XHRcdG1lc3NhZ2UgKz0gcmVzcG9uc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0bWVzc2FnZSArPSBmb3JtYXR0ZXJbaV0uYWZ0ZXI7XG5cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG1lc3NhZ2UgKz0gZm9ybWF0dGVyW2ldO1xuXHRcdFx0fVxuXG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIG1lc3NhZ2UudHJpbSgpO1xuXG59O1xuXG4vKipcbiAqXG4gKiBAcHJpdmF0ZVxuICogQGZ1bmN0aW9uXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXG4gKlxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XG4gKi9cbmxldCBfZ2V0RmlsZURldGFpbHMgPSBmdW5jdGlvbiAobG9nRXZlbnQpIHtcblxuXHRpZiAobG9nRXZlbnQubG9nRXJyb3JTdGFjaykge1xuXG5cdFx0bGV0IHBhcnRzID0gbG9nRXZlbnQubG9nRXJyb3JTdGFjay5zdGFjay5zcGxpdCgvXFxuL2cpO1xuXHRcdGxldCBmaWxlID0gcGFydHNbM107XG5cdFx0ZmlsZSA9IGZpbGUucmVwbGFjZSgvYXQgKC4qXFwofCkoZmlsZXxodHRwfGh0dHBzfCkoOnwpKFxcL3wpKi8sICcnKTtcblx0XHRmaWxlID0gZmlsZS5yZXBsYWNlKCcpJywgJycpO1xuXHRcdGZpbGUgPSBmaWxlLnJlcGxhY2UoKHR5cGVvZiBsb2NhdGlvbiAhPT0gJ3VuZGVmaW5lZCcpID8gbG9jYXRpb24uaG9zdCA6ICcnLCAnJykudHJpbSgpO1xuXG5cdFx0bGV0IGZpbGVQYXJ0cyA9IGZpbGUuc3BsaXQoL1xcOi9nKTtcblxuXHRcdGxvZ0V2ZW50LmNvbHVtbiA9IGZpbGVQYXJ0cy5wb3AoKTtcblx0XHRsb2dFdmVudC5saW5lTnVtYmVyID0gZmlsZVBhcnRzLnBvcCgpO1xuXG5cdFx0aWYgKHR5cGVvZiBkZWZpbmUgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRsZXQgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcblx0XHRcdGxldCBhcHBEaXIgPSBwYXRoLmRpcm5hbWUocmVxdWlyZS5tYWluLmZpbGVuYW1lKTtcblx0XHRcdGxvZ0V2ZW50LmZpbGVuYW1lID0gZmlsZVBhcnRzLmpvaW4oJzonKS5yZXBsYWNlKGFwcERpciwgJycpLnJlcGxhY2UoLyhcXFxcfFxcLykvLCAnJyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGxvZ0V2ZW50LmZpbGVuYW1lID0gZmlsZVBhcnRzLmpvaW4oJzonKTtcblx0XHR9XG5cblx0fSBlbHNlIHtcblxuXHRcdGxvZ0V2ZW50LmNvbHVtbiA9ICc/Jztcblx0XHRsb2dFdmVudC5maWxlbmFtZSA9ICdhbm9ueW1vdXMnO1xuXHRcdGxvZ0V2ZW50LmxpbmVOdW1iZXIgPSAnPyc7XG5cblx0fVxuXG59O1xuXG4vKipcbiAqIEBmdW5jdGlvblxuICogQG1lbWJlck9mIGZvcm1hdHRlclxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBsYXlvdXRcbiAqXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwcmVDb21waWxlKGxheW91dCkge1xuXHRfZ2V0Q29tcGlsZWRMYXlvdXQobGF5b3V0KTtcbn1cblxuLyoqXG4gKiBAZnVuY3Rpb25cbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbGF5b3V0XG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcbiAqXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXQobGF5b3V0LCBsb2dFdmVudCkge1xuXHRyZXR1cm4gX2Zvcm1hdExvZ0V2ZW50KF9nZXRDb21waWxlZExheW91dChsYXlvdXQpLCBsb2dFdmVudCk7XG59XG4iXX0=