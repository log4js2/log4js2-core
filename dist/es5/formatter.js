/*istanbul ignore next*/'use strict';

exports.__esModule = true;
exports.preCompile = preCompile;
/*istanbul ignore next*/exports.format = format;

var /*istanbul ignore next*/_dateFormatter = require('./dateFormatter');

var /*istanbul ignore next*/_utility = require('./utility');

/*istanbul ignore next*/var utility = _interopRequireWildcard(_utility);

var /*istanbul ignore next*/_logLevel = require('./const/logLevel');

/*istanbul ignore next*/function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/** @const */
var _COMMAND_REGEX = /%([a-z,A-Z]+)(?=\{|)/;

/** @type {Object} */
/**
 * log4js <https://github.com/anigenero/log4js>
 *
 * Copyright 2016-present Robin Schultz <http://anigenero.com>
 * Released under the MIT License
 */

var _compiledLayouts = {};

/**
 * @function
 * @memberOf formatter
 *
 * @param {LOG_EVENT} logEvent
 *
 * @return {string}
 */
var _formatLogger = function _formatLogger(logEvent) {
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
var _formatDate = function _formatDate(logEvent, params) {
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
var _formatException = function _formatException(logEvent) {

  var message = '';

  if (logEvent.error != null) {

    if (logEvent.error.stack != undefined) {
      var stacks = logEvent.error.stack.split(/\n/g);
      stacks.forEach(function (stack) {
        message += /*istanbul ignore next*/'\t' + stack + '\n';
      });
    } else if (logEvent.error.message != null && logEvent.error.message != '') {
      message += /*istanbul ignore next*/'\t' + logEvent.error.name + ': ' + logEvent.error.message + '\n';
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
var _formatFile = function _formatFile(logEvent) {

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
var _formatLineNumber = function _formatLineNumber(logEvent) {

  if (!logEvent.lineNumber) {
    _getFileDetails(logEvent);
  }

  return (/*istanbul ignore next*/'' + logEvent.lineNumber
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
var _formatColumn = function _formatColumn(logEvent) {

  if (!logEvent.column) {
    _getFileDetails(logEvent);
  }

  return (/*istanbul ignore next*/'' + logEvent.column
  );
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
var _formatMapMessage = function _formatMapMessage(logEvent, params) {
  var message = null;
  if (logEvent.properties) {

    message = [];
    for (var key in logEvent.properties) {
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
var _formatLogMessage = function _formatLogMessage(logEvent) {
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
var _formatMethodName = function _formatMethodName(logEvent) {
  return utility.getFunctionName(logEvent.method);
};

/**
 * @private
 * @function
 * @memberOf formatter
 */
var _formatLineSeparator = function _formatLineSeparator() {
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
var _formatLevel = function _formatLevel(logEvent) {

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
var _formatRelative = function _formatRelative(logEvent) {
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
var _formatSequenceNumber = function _formatSequenceNumber(logEvent) {
  return '' + logEvent.sequence;
};

var _formatters = {
  'c|logger': _formatLogger,
  'd|date': _formatDate,
  'ex|exception|throwable': _formatException,
  'F|file': _formatFile,
  'K|map|MAP': _formatMapMessage,
  'L|line': _formatLineNumber,
  'column': _formatColumn,
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
var _getCompiledLayout = function _getCompiledLayout(layout) {

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
var _compileLayout = function _compileLayout(layout) {

  var index = layout.indexOf('%');
  var currentFormatString = '';
  var formatArray = [];

  if (index != 0) {
    formatArray.push(layout.substring(0, index));
  }

  do {

    var startIndex = index;
    var endIndex = index = layout.indexOf('%', index + 1);

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
var _getFormatterObject = function _getFormatterObject(formatString) {

  var result = _COMMAND_REGEX.exec(formatString);
  if (result != null && result.length == 2) {

    var formatter = _getFormatterFunction(result[1]);
    if (!formatter) {
      return null;
    }

    var params = _getLayoutTagParams(formatString);

    var after = '';
    var endIndex = formatString.lastIndexOf('}');
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
var _getFormatterFunction = function _getFormatterFunction(command) {

  var regex = /*istanbul ignore next*/void 0;
  for (var key in _formatters) {
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
var _getLayoutTagParams = function _getLayoutTagParams(command) {

  var params = [];
  var result = command.match(/\{([^}]*)(?=})/g);
  if (result != null) {
    for (var i = 0; i < result.length; i++) {
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
var _formatLogEvent = function _formatLogEvent(formatter, logEvent) {

  var response = /*istanbul ignore next*/void 0;
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

/**
 *
 * @private
 * @function
 * @memberOf formatter
 *
 * @param {LOG_EVENT} logEvent
 */
var _getFileDetails = function _getFileDetails(logEvent) {

  if (logEvent.logErrorStack) {

    var parts = logEvent.logErrorStack.stack.split(/\n/g);
    var file = parts[3];
    file = file.replace(/at (.*\(|)(file|http|https|)(:|)(\/|)*/, '');
    file = file.replace(')', '');
    file = file.replace(typeof location !== 'undefined' ? location.host : '', '').trim();

    var fileParts = file.split(/\:/g);

    logEvent.column = fileParts.pop();
    logEvent.lineNumber = fileParts.pop();

    if (typeof define !== 'undefined') {
      var path = require('path');
      var appDir = path.dirname(require.main.filename);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZvcm1hdHRlci5qcyJdLCJuYW1lcyI6WyJwcmVDb21waWxlIiwiZm9ybWF0IiwidXRpbGl0eSIsIl9DT01NQU5EX1JFR0VYIiwiX2NvbXBpbGVkTGF5b3V0cyIsIl9mb3JtYXRMb2dnZXIiLCJsb2dFdmVudCIsImxvZ2dlciIsIl9mb3JtYXREYXRlIiwicGFyYW1zIiwiZGF0ZSIsIl9mb3JtYXRFeGNlcHRpb24iLCJtZXNzYWdlIiwiZXJyb3IiLCJzdGFjayIsInVuZGVmaW5lZCIsInN0YWNrcyIsInNwbGl0IiwiZm9yRWFjaCIsIm5hbWUiLCJfZm9ybWF0RmlsZSIsImZpbGUiLCJfZ2V0RmlsZURldGFpbHMiLCJfZm9ybWF0TGluZU51bWJlciIsImxpbmVOdW1iZXIiLCJfZm9ybWF0Q29sdW1uIiwiY29sdW1uIiwiX2Zvcm1hdE1hcE1lc3NhZ2UiLCJwcm9wZXJ0aWVzIiwia2V5IiwicHVzaCIsImpvaW4iLCJfZm9ybWF0TG9nTWVzc2FnZSIsIl9mb3JtYXRNZXRob2ROYW1lIiwiZ2V0RnVuY3Rpb25OYW1lIiwibWV0aG9kIiwiX2Zvcm1hdExpbmVTZXBhcmF0b3IiLCJfZm9ybWF0TGV2ZWwiLCJsZXZlbCIsIkZBVEFMIiwiRVJST1IiLCJXQVJOIiwiSU5GTyIsIkRFQlVHIiwiVFJBQ0UiLCJfZm9ybWF0UmVsYXRpdmUiLCJyZWxhdGl2ZSIsIl9mb3JtYXRTZXF1ZW5jZU51bWJlciIsInNlcXVlbmNlIiwiX2Zvcm1hdHRlcnMiLCJfZ2V0Q29tcGlsZWRMYXlvdXQiLCJsYXlvdXQiLCJfY29tcGlsZUxheW91dCIsImluZGV4IiwiaW5kZXhPZiIsImN1cnJlbnRGb3JtYXRTdHJpbmciLCJmb3JtYXRBcnJheSIsInN1YnN0cmluZyIsInN0YXJ0SW5kZXgiLCJlbmRJbmRleCIsIl9nZXRGb3JtYXR0ZXJPYmplY3QiLCJmb3JtYXRTdHJpbmciLCJyZXN1bHQiLCJleGVjIiwibGVuZ3RoIiwiZm9ybWF0dGVyIiwiX2dldEZvcm1hdHRlckZ1bmN0aW9uIiwiX2dldExheW91dFRhZ1BhcmFtcyIsImFmdGVyIiwibGFzdEluZGV4T2YiLCJjb21tYW5kIiwicmVnZXgiLCJoYXNPd25Qcm9wZXJ0eSIsIlJlZ0V4cCIsIm1hdGNoIiwiaSIsIl9mb3JtYXRMb2dFdmVudCIsInJlc3BvbnNlIiwiY291bnQiLCJPYmplY3QiLCJ0cmltIiwibG9nRXJyb3JTdGFjayIsInBhcnRzIiwicmVwbGFjZSIsImxvY2F0aW9uIiwiaG9zdCIsImZpbGVQYXJ0cyIsInBvcCIsImRlZmluZSIsInBhdGgiLCJyZXF1aXJlIiwiYXBwRGlyIiwiZGlybmFtZSIsIm1haW4iLCJmaWxlbmFtZSIsInN0YXJ0c1dpdGgiXSwibWFwcGluZ3MiOiI7OztRQXVmZ0JBLFUsR0FBQUEsVTtnQ0FhQUMsTSxHQUFBQSxNOztBQTdmaEI7O0FBQ0E7OzRCQUFZQyxPOztBQUNaOzs7O0FBRUE7QUFDQSxJQUFNQyxpQkFBaUIsc0JBQXZCOztBQUVBO0FBZEE7Ozs7Ozs7QUFlQSxJQUFJQyxtQkFBbUIsRUFBdkI7O0FBRUE7Ozs7Ozs7O0FBUUEsSUFBSUMsZ0JBQWdCLFNBQWhCQSxhQUFnQixDQUFVQyxRQUFWLEVBQW9CO0FBQ3ZDLFNBQU9BLFNBQVNDLE1BQWhCO0FBQ0EsQ0FGRDs7QUFJQTs7Ozs7Ozs7O0FBU0EsSUFBSUMsY0FBYyxTQUFkQSxXQUFjLENBQVVGLFFBQVYsRUFBb0JHLE1BQXBCLEVBQTRCO0FBQzdDLFNBQU8sd0RBQVdILFNBQVNJLElBQXBCLEVBQTBCRCxPQUFPLENBQVAsQ0FBMUI7QUFBUDtBQUNBLENBRkQ7O0FBSUE7Ozs7Ozs7O0FBUUEsSUFBSUUsbUJBQW1CLFNBQW5CQSxnQkFBbUIsQ0FBVUwsUUFBVixFQUFvQjs7QUFFdkMsTUFBSU0sVUFBVSxFQUFkOztBQUVBLE1BQUlOLFNBQVNPLEtBQVQsSUFBa0IsSUFBdEIsRUFBNEI7O0FBRTlCLFFBQUlQLFNBQVNPLEtBQVQsQ0FBZUMsS0FBZixJQUF3QkMsU0FBNUIsRUFBdUM7QUFDdEMsVUFBSUMsU0FBU1YsU0FBU08sS0FBVCxDQUFlQyxL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ZSxJQUFULEdBQWdCZixTQUFTd0YsUUFBekI7QUFDQSxDQWxDRDs7QUFvQ0E7Ozs7Ozs7O0FBUU8sU0FBUzlGLFVBQVQsQ0FBb0JtRCxNQUFwQixFQUE0QjtBQUNsQ0QscUJBQW1CQyxNQUFuQjtBQUNBOztBQUVEOzs7Ozs7Ozs7QUFTTyxTQUFTbEQsTUFBVCxDQUFnQmtELE1BQWhCLEVBQXdCN0MsUUFBeEIsRUFBa0M7QUFDeEMsU0FBT3NFLGdCQUFnQjFCLG1CQUFtQkMsTUFBbkIsQ0FBaEIsRUFBNEM3QyxRQUE1QyxDQUFQO0FBQ0EiLCJmaWxlIjoiZm9ybWF0dGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBsb2c0anMgPGh0dHBzOi8vZ2l0aHViLmNvbS9hbmlnZW5lcm8vbG9nNGpzPlxuICpcbiAqIENvcHlyaWdodCAyMDE2LXByZXNlbnQgUm9iaW4gU2NodWx0eiA8aHR0cDovL2FuaWdlbmVyby5jb20+XG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2RhdGVGb3JtYXR9IGZyb20gJy4vZGF0ZUZvcm1hdHRlcic7XG5pbXBvcnQgKiBhcyB1dGlsaXR5IGZyb20gJy4vdXRpbGl0eSc7XG5pbXBvcnQge0xvZ0xldmVsfSBmcm9tICcuL2NvbnN0L2xvZ0xldmVsJztcblxuLyoqIEBjb25zdCAqL1xuY29uc3QgX0NPTU1BTkRfUkVHRVggPSAvJShbYS16LEEtWl0rKSg/PVxce3wpLztcblxuLyoqIEB0eXBlIHtPYmplY3R9ICovXG5sZXQgX2NvbXBpbGVkTGF5b3V0cyA9IHt9O1xuXG4vKipcbiAqIEBmdW5jdGlvblxuICogQG1lbWJlck9mIGZvcm1hdHRlclxuICpcbiAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dFdmVudFxuICpcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xubGV0IF9mb3JtYXRMb2dnZXIgPSBmdW5jdGlvbiAobG9nRXZlbnQpIHtcblx0cmV0dXJuIGxvZ0V2ZW50LmxvZ2dlcjtcbn07XG5cbi8qKlxuICogQGZ1bmN0aW9uXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXG4gKlxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XG4gKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSBwYXJhbXNcbiAqXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmxldCBfZm9ybWF0RGF0ZSA9IGZ1bmN0aW9uIChsb2dFdmVudCwgcGFyYW1zKSB7XG5cdHJldHVybiBkYXRlRm9ybWF0KGxvZ0V2ZW50LmRhdGUsIHBhcmFtc1swXSk7XG59O1xuXG4vKipcbiAqIEBmdW5jdGlvblxuICogQG1lbWJlck9mIGZvcm1hdHRlclxuICpcbiAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dFdmVudFxuICpcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xubGV0IF9mb3JtYXRFeGNlcHRpb24gPSBmdW5jdGlvbiAobG9nRXZlbnQpIHtcblxuICAgIGxldCBtZXNzYWdlID0gJyc7XG5cbiAgICBpZiAobG9nRXZlbnQuZXJyb3IgIT0gbnVsbCkge1xuXG5cdFx0aWYgKGxvZ0V2ZW50LmVycm9yLnN0YWNrICE9IHVuZGVmaW5lZCkge1xuXHRcdFx0bGV0IHN0YWNrcyA9IGxvZ0V2ZW50LmVycm9yLnN0YWNrLnNwbGl0KC9cXG4vZyk7XG4gICAgICAgICAgICBzdGFja3MuZm9yRWFjaChmdW5jdGlvbiAoc3RhY2spIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlICs9IGBcXHQke3N0YWNrfVxcbmA7XG4gICAgICAgICAgICB9KTtcblx0XHR9IGVsc2UgaWYgKGxvZ0V2ZW50LmVycm9yLm1lc3NhZ2UgIT0gbnVsbCAmJiBsb2dFdmVudC5lcnJvci5tZXNzYWdlICE9ICcnKSB7XG5cdFx0XHRtZXNzYWdlICs9IGBcXHQke2xvZ0V2ZW50LmVycm9yLm5hbWV9OiAke2xvZ0V2ZW50LmVycm9yLm1lc3NhZ2V9XFxuYDtcblx0XHR9XG5cblx0fVxuXG5cdHJldHVybiBtZXNzYWdlO1xuXG59O1xuXG4vKipcbiAqIEZvcm1hdHMgdGhlIGZpbGUgKGUuZy4gdGVzdC5qcykgdG8gdGhlIGZpbGVcbiAqXG4gKiBAcHJpdmF0ZVxuICogQGZ1bmN0aW9uXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXG4gKlxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XG4gKi9cbmxldCBfZm9ybWF0RmlsZSA9IGZ1bmN0aW9uIChsb2dFdmVudCkge1xuXG4gICAgaWYgKCFsb2dFdmVudC5maWxlKSB7XG5cdFx0X2dldEZpbGVEZXRhaWxzKGxvZ0V2ZW50KTtcblx0fVxuXG5cdHJldHVybiBsb2dFdmVudC5maWxlO1xuXG59O1xuXG4vKipcbiAqIEBmdW5jdGlvblxuICogQG1lbWJlck9mIGZvcm1hdHRlclxuICpcbiAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dFdmVudFxuICpcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xubGV0IF9mb3JtYXRMaW5lTnVtYmVyID0gZnVuY3Rpb24gKGxvZ0V2ZW50KSB7XG5cbiAgICBpZiAoIWxvZ0V2ZW50LmxpbmVOdW1iZXIpIHtcblx0XHRfZ2V0RmlsZURldGFpbHMobG9nRXZlbnQpO1xuXHR9XG5cblx0cmV0dXJuIGAke2xvZ0V2ZW50LmxpbmVOdW1iZXJ9YDtcblxufTtcblxuLyoqXG4gKiBAZnVuY3Rpb25cbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcbiAqXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcbiAqXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmxldCBfZm9ybWF0Q29sdW1uID0gZnVuY3Rpb24gKGxvZ0V2ZW50KSB7XG5cbiAgICBpZiAoIWxvZ0V2ZW50LmNvbHVtbikge1xuXHRcdF9nZXRGaWxlRGV0YWlscyhsb2dFdmVudCk7XG5cdH1cblxuXHRyZXR1cm4gYCR7bG9nRXZlbnQuY29sdW1ufWA7XG5cbn07XG5cbi8qKlxuICogQGZ1bmN0aW9uXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXG4gKlxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XG4gKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSBwYXJhbXNcbiAqXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmxldCBfZm9ybWF0TWFwTWVzc2FnZSA9IGZ1bmN0aW9uIChsb2dFdmVudCwgcGFyYW1zKSB7XG5cdGxldCBtZXNzYWdlID0gbnVsbDtcblx0aWYgKGxvZ0V2ZW50LnByb3BlcnRpZXMpIHtcblxuXHRcdG1lc3NhZ2UgPSBbXTtcblx0XHRmb3IgKGxldCBrZXkgaW4gbG9nRXZlbnQucHJvcGVydGllcykge1xuXHRcdFx0aWYgKHBhcmFtc1swXSkge1xuXHRcdFx0XHRpZiAocGFyYW1zWzBdID09IGtleSkge1xuXHRcdFx0XHRcdG1lc3NhZ2UucHVzaChsb2dFdmVudC5wcm9wZXJ0aWVzW2tleV0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRtZXNzYWdlLnB1c2goJ3snICsga2V5ICsgJywnICsgbG9nRXZlbnQucHJvcGVydGllc1trZXldICsgJ30nKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gJ3snICsgbWVzc2FnZS5qb2luKCcsJykgKyAnfSc7XG5cblx0fVxuXHRyZXR1cm4gbWVzc2FnZTtcbn07XG5cbi8qKlxuICogQGZ1bmN0aW9uXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXG4gKlxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XG4gKlxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5sZXQgX2Zvcm1hdExvZ01lc3NhZ2UgPSBmdW5jdGlvbiAobG9nRXZlbnQpIHtcblx0cmV0dXJuIGxvZ0V2ZW50Lm1lc3NhZ2U7XG59O1xuXG4vKipcbiAqIEBmdW5jdGlvblxuICogQG1lbWJlck9mIGZvcm1hdHRlclxuICpcbiAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dFdmVudFxuICpcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xubGV0IF9mb3JtYXRNZXRob2ROYW1lID0gZnVuY3Rpb24gKGxvZ0V2ZW50KSB7XG5cdHJldHVybiB1dGlsaXR5LmdldEZ1bmN0aW9uTmFtZShsb2dFdmVudC5tZXRob2QpO1xufTtcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogQGZ1bmN0aW9uXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXG4gKi9cbmxldCBfZm9ybWF0TGluZVNlcGFyYXRvciA9IGZ1bmN0aW9uICgpIHtcblx0cmV0dXJuICdcXG4nO1xufTtcblxuLyoqXG4gKiBAZnVuY3Rpb25cbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcbiAqXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcbiAqXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmxldCBfZm9ybWF0TGV2ZWwgPSBmdW5jdGlvbiAobG9nRXZlbnQpIHtcblxuICAgIHN3aXRjaCAobG9nRXZlbnQubGV2ZWwpIHtcblxuICAgICAgICBjYXNlIExvZ0xldmVsLkZBVEFMOlxuICAgICAgICAgICAgcmV0dXJuICdGQVRBTCc7XG4gICAgICAgIGNhc2UgTG9nTGV2ZWwuRVJST1I6XG4gICAgICAgICAgICByZXR1cm4gJ0VSUk9SJztcbiAgICAgICAgY2FzZSBMb2dMZXZlbC5XQVJOOlxuICAgICAgICAgICAgcmV0dXJuICdXQVJOJztcbiAgICAgICAgY2FzZSBMb2dMZXZlbC5JTkZPOlxuICAgICAgICAgICAgcmV0dXJuICdJTkZPJztcbiAgICAgICAgY2FzZSBMb2dMZXZlbC5ERUJVRzpcbiAgICAgICAgICAgIHJldHVybiAnREVCVUcnO1xuICAgICAgICBjYXNlIExvZ0xldmVsLlRSQUNFOlxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuICdUUkFDRSc7XG5cbiAgICB9XG5cbn07XG5cbi8qKlxuICogQGZ1bmN0aW9uXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXG4gKlxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XG4gKlxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5sZXQgX2Zvcm1hdFJlbGF0aXZlID0gZnVuY3Rpb24gKGxvZ0V2ZW50KSB7XG5cdHJldHVybiAnJyArIGxvZ0V2ZW50LnJlbGF0aXZlO1xufTtcblxuLyoqXG4gKiBAZnVuY3Rpb25cbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcbiAqXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcbiAqXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmxldCBfZm9ybWF0U2VxdWVuY2VOdW1iZXIgPSBmdW5jdGlvbiAobG9nRXZlbnQpIHtcblx0cmV0dXJuICcnICsgbG9nRXZlbnQuc2VxdWVuY2U7XG59O1xuXG5sZXQgX2Zvcm1hdHRlcnMgPSB7XG5cdCdjfGxvZ2dlcicgOiBfZm9ybWF0TG9nZ2VyLFxuXHQnZHxkYXRlJyA6IF9mb3JtYXREYXRlLFxuXHQnZXh8ZXhjZXB0aW9ufHRocm93YWJsZScgOiBfZm9ybWF0RXhjZXB0aW9uLFxuXHQnRnxmaWxlJyA6IF9mb3JtYXRGaWxlLFxuXHQnS3xtYXB8TUFQJyA6IF9mb3JtYXRNYXBNZXNzYWdlLFxuXHQnTHxsaW5lJyA6IF9mb3JtYXRMaW5lTnVtYmVyLFxuXHQnY29sdW1uJyA6IF9mb3JtYXRDb2x1bW4sXG5cdCdtfG1zZ3xtZXNzYWdlJyA6IF9mb3JtYXRMb2dNZXNzYWdlLFxuXHQnTXxtZXRob2QnIDogX2Zvcm1hdE1ldGhvZE5hbWUsXG5cdCduJyA6IF9mb3JtYXRMaW5lU2VwYXJhdG9yLFxuXHQncHxsZXZlbCcgOiBfZm9ybWF0TGV2ZWwsXG5cdCdyfHJlbGF0aXZlJyA6IF9mb3JtYXRSZWxhdGl2ZSxcblx0J3NufHNlcXVlbmNlTnVtYmVyJyA6IF9mb3JtYXRTZXF1ZW5jZU51bWJlclxufTtcblxuLyoqXG4gKiBHZXQgdGhlIGNvbXBpbGVkIGxheW91dCBmb3IgdGhlIHNwZWNpZmllZCBsYXlvdXQgc3RyaW5nLiBJZiB0aGUgY29tcGlsZWQgbGF5b3V0IGRvZXMgbm90XG4gKiBleGlzdCwgdGhlbiB3ZSB3YW50IHRvIGNyZWF0ZSBpdC5cbiAqXG4gKiBAZnVuY3Rpb25cbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbGF5b3V0XG4gKlxuICogQHJldHVybiB7QXJyYXkuPHN0cmluZ3xmdW5jdGlvbj59XG4gKi9cbmxldCBfZ2V0Q29tcGlsZWRMYXlvdXQgPSBmdW5jdGlvbiAobGF5b3V0KSB7XG5cblx0aWYgKF9jb21waWxlZExheW91dHNbbGF5b3V0XSkge1xuXHRcdHJldHVybiBfY29tcGlsZWRMYXlvdXRzW2xheW91dF07XG5cdH1cblxuXHRyZXR1cm4gX2NvbXBpbGVMYXlvdXQobGF5b3V0KTtcblxufTtcblxuLyoqXG4gKiBDb21waWxlcyBhIGxheW91dCBpbnRvIGFuIGFycmF5LiBUaGUgYXJyYXkgY29udGFpbnMgZnVuY3Rpb25zXG4gKlxuICogQGZ1bmN0aW9uXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGxheW91dFxuICpcbiAqIEByZXR1cm4ge0FycmF5LjxzdHJpbmd8ZnVuY3Rpb24+fVxuICovXG5sZXQgX2NvbXBpbGVMYXlvdXQgPSBmdW5jdGlvbiAobGF5b3V0KSB7XG5cblx0bGV0IGluZGV4ID0gbGF5b3V0LmluZGV4T2YoJyUnKTtcblx0bGV0IGN1cnJlbnRGb3JtYXRTdHJpbmcgPSAnJztcblx0bGV0IGZvcm1hdEFycmF5ID0gW107XG5cblx0aWYgKGluZGV4ICE9IDApIHtcblx0XHRmb3JtYXRBcnJheS5wdXNoKGxheW91dC5zdWJzdHJpbmcoMCwgaW5kZXgpKTtcblx0fVxuXG5cdGRvIHtcblxuXHRcdGxldCBzdGFydEluZGV4ID0gaW5kZXg7XG5cdFx0bGV0IGVuZEluZGV4ID0gaW5kZXggPSBsYXlvdXQuaW5kZXhPZignJScsIGluZGV4ICsgMSk7XG5cblx0XHRpZiAoZW5kSW5kZXggPCAwKSB7XG5cdFx0XHRjdXJyZW50Rm9ybWF0U3RyaW5nID0gbGF5b3V0LnN1YnN0cmluZyhzdGFydEluZGV4KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y3VycmVudEZvcm1hdFN0cmluZyA9IGxheW91dC5zdWJzdHJpbmcoc3RhcnRJbmRleCwgZW5kSW5kZXgpO1xuXHRcdH1cblxuXHRcdGZvcm1hdEFycmF5LnB1c2goX2dldEZvcm1hdHRlck9iamVjdChjdXJyZW50Rm9ybWF0U3RyaW5nKSk7XG5cblx0fSB3aGlsZSAoaW5kZXggPiAtMSk7XG5cbiAgICAvLyBzZXQgdGhlIGZvcm1hdCBhcnJheSB0byB0aGUgc3BlY2lmaWVkIGNvbXBpbGVkIGxheW91dFxuXHRfY29tcGlsZWRMYXlvdXRzW2xheW91dF0gPSBmb3JtYXRBcnJheTtcblxuXHRyZXR1cm4gZm9ybWF0QXJyYXk7XG5cbn07XG5cbi8qKlxuICogQGZ1bmN0aW9uXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGZvcm1hdFN0cmluZ1xuICpcbiAqIEByZXR1cm4ge09iamVjdHxzdHJpbmd9XG4gKi9cbmxldCBfZ2V0Rm9ybWF0dGVyT2JqZWN0ID0gZnVuY3Rpb24gKGZvcm1hdFN0cmluZykge1xuXG5cdGxldCByZXN1bHQgPSBfQ09NTUFORF9SRUdFWC5leGVjKGZvcm1hdFN0cmluZyk7XG5cdGlmIChyZXN1bHQgIT0gbnVsbCAmJiByZXN1bHQubGVuZ3RoID09IDIpIHtcblxuXHRcdGxldCBmb3JtYXR0ZXIgPSBfZ2V0Rm9ybWF0dGVyRnVuY3Rpb24ocmVzdWx0WzFdKTtcblx0XHRpZiAoIWZvcm1hdHRlcikge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXG5cdFx0bGV0IHBhcmFtcyA9IF9nZXRMYXlvdXRUYWdQYXJhbXMoZm9ybWF0U3RyaW5nKTtcblxuXHRcdGxldCBhZnRlciA9ICcnO1xuXHRcdGxldCBlbmRJbmRleCA9IGZvcm1hdFN0cmluZy5sYXN0SW5kZXhPZignfScpO1xuXHRcdGlmIChlbmRJbmRleCAhPSAtMSkge1xuXHRcdFx0YWZ0ZXIgPSBmb3JtYXRTdHJpbmcuc3Vic3RyaW5nKGVuZEluZGV4ICsgMSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGFmdGVyID0gZm9ybWF0U3RyaW5nLnN1YnN0cmluZyhyZXN1bHQuaW5kZXggKyByZXN1bHRbMV0ubGVuZ3RoICsgMSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdCdmb3JtYXR0ZXInIDogZm9ybWF0dGVyLFxuXHRcdFx0J3BhcmFtcycgOiBwYXJhbXMsXG5cdFx0XHQnYWZ0ZXInIDogYWZ0ZXJcblx0XHR9O1xuXG5cdH1cblxuXHRyZXR1cm4gZm9ybWF0U3RyaW5nO1xuXG59O1xuXG4vKipcbiAqIERldGVybWluZXMgd2hhdCBmb3JtYXR0ZXIgZnVuY3Rpb24gaGFzIGJlZW4gY29uZmlndXJlZFxuICpcbiAqIEBmdW5jdGlvblxuICogQG1lbWJlck9mIGZvcm1hdHRlclxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb21tYW5kXG4gKlxuICogQHJldHVybiB7P3N0cmluZ31cbiAqL1xubGV0IF9nZXRGb3JtYXR0ZXJGdW5jdGlvbiA9IGZ1bmN0aW9uIChjb21tYW5kKSB7XG5cblx0bGV0IHJlZ2V4O1xuXHRmb3IgKGxldCBrZXkgaW4gX2Zvcm1hdHRlcnMpIHtcbiAgICAgICAgaWYgKF9mb3JtYXR0ZXJzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIHJlZ2V4ID0gbmV3IFJlZ0V4cCgnXignICsga2V5ICsgJykkJyk7XG4gICAgICAgICAgICBpZiAocmVnZXguZXhlYyhjb21tYW5kKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfZm9ybWF0dGVyc1trZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cdH1cblxuXHRyZXR1cm4gbnVsbDtcblxufTtcblxuLyoqXG4gKiBHZXRzIHRoZSBsYXlvdXQgdGFnIHBhcmFtcyBhc3NvY2lhdGVkIHdpdGggdGhlIGxheW91dCB0YWcuIFNvLCBmb3IgZXhhbXBsZSwgJyVke3l5eXktTU0tZGR9YFxuICogd291bGQgb3V0cHV0IGFuIGFycmF5IG9mIFsneXl5eS1NTS1kZCddXG4gKlxuICogQHByaXZhdGVcbiAqIEBmdW5jdGlvblxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb21tYW5kXG4gKlxuICogQHJldHVybiB7QXJyYXkuPHN0cmluZz59XG4gKi9cbmxldCBfZ2V0TGF5b3V0VGFnUGFyYW1zID0gZnVuY3Rpb24gKGNvbW1hbmQpIHtcblxuXHRsZXQgcGFyYW1zID0gW107XG5cdGxldCByZXN1bHQgPSBjb21tYW5kLm1hdGNoKC9cXHsoW159XSopKD89fSkvZyk7XG5cdGlmIChyZXN1bHQgIT0gbnVsbCkge1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcmVzdWx0Lmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRwYXJhbXMucHVzaChyZXN1bHRbaV0uc3Vic3RyaW5nKDEpKTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gcGFyYW1zO1xuXG59O1xuXG4vKipcbiAqIEhhbmRsZXMgZm9ybWF0dGluZyB0aGUgbG9nIGV2ZW50IHVzaW5nIHRoZSBzcGVjaWZpZWQgZm9ybWF0dGVyIGFycmF5XG4gKlxuICogQHByaXZhdGVcbiAqIEBmdW5jdGlvblxuICpcbiAqIEBwYXJhbSB7QXJyYXkuPGZ1bmN0aW9ufHN0cmluZz59IGZvcm1hdHRlclxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XG4gKlxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5sZXQgX2Zvcm1hdExvZ0V2ZW50ID0gZnVuY3Rpb24gKGZvcm1hdHRlciwgbG9nRXZlbnQpIHtcblxuXHRsZXQgcmVzcG9uc2U7XG5cdGxldCBtZXNzYWdlID0gJyc7XG5cdGxldCBjb3VudCA9IGZvcm1hdHRlci5sZW5ndGg7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuXHRcdGlmIChmb3JtYXR0ZXJbaV0gIT09IG51bGwpIHtcblxuXHRcdFx0aWYgKGZvcm1hdHRlcltpXSBpbnN0YW5jZW9mIE9iamVjdCkge1xuXG5cdFx0XHRcdHJlc3BvbnNlID0gZm9ybWF0dGVyW2ldLmZvcm1hdHRlcihsb2dFdmVudCwgZm9ybWF0dGVyW2ldLnBhcmFtcyk7XG5cdFx0XHRcdGlmIChyZXNwb25zZSAhPSBudWxsKSB7XG5cdFx0XHRcdFx0bWVzc2FnZSArPSByZXNwb25zZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRtZXNzYWdlICs9IGZvcm1hdHRlcltpXS5hZnRlcjtcblxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bWVzc2FnZSArPSBmb3JtYXR0ZXJbaV07XG5cdFx0XHR9XG5cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gbWVzc2FnZS50cmltKCk7XG5cbn07XG5cbi8qKlxuICpcbiAqIEBwcml2YXRlXG4gKiBAZnVuY3Rpb25cbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcbiAqXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcbiAqL1xubGV0IF9nZXRGaWxlRGV0YWlscyA9IGZ1bmN0aW9uIChsb2dFdmVudCkge1xuXG5cdGlmIChsb2dFdmVudC5sb2dFcnJvclN0YWNrKSB7XG5cblx0XHRsZXQgcGFydHMgPSBsb2dFdmVudC5sb2dFcnJvclN0YWNrLnN0YWNrLnNwbGl0KC9cXG4vZyk7XG5cdFx0bGV0IGZpbGUgPSBwYXJ0c1szXTtcblx0XHRmaWxlID0gZmlsZS5yZXBsYWNlKC9hdCAoLipcXCh8KShmaWxlfGh0dHB8aHR0cHN8KSg6fCkoXFwvfCkqLywgJycpO1xuXHRcdGZpbGUgPSBmaWxlLnJlcGxhY2UoJyknLCAnJyk7XG5cdFx0ZmlsZSA9IGZpbGUucmVwbGFjZSgodHlwZW9mIGxvY2F0aW9uICE9PSAndW5kZWZpbmVkJykgPyBsb2NhdGlvbi5ob3N0IDogJycsICcnKS50cmltKCk7XG5cblx0XHRsZXQgZmlsZVBhcnRzID0gZmlsZS5zcGxpdCgvXFw6L2cpO1xuXG5cdFx0bG9nRXZlbnQuY29sdW1uID0gZmlsZVBhcnRzLnBvcCgpO1xuXHRcdGxvZ0V2ZW50LmxpbmVOdW1iZXIgPSBmaWxlUGFydHMucG9wKCk7XG5cblx0XHRpZiAodHlwZW9mIGRlZmluZSAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdGxldCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuXHRcdFx0bGV0IGFwcERpciA9IHBhdGguZGlybmFtZShyZXF1aXJlLm1haW4uZmlsZW5hbWUpO1xuXHRcdFx0aWYgKCFmaWxlUGFydHNbMF0uc3RhcnRzV2l0aChhcHBEaXIpKSB7XG5cdFx0XHRcdGFwcERpciA9ICcnO1xuXHRcdFx0fVxuXHRcdFx0bG9nRXZlbnQuZmlsZW5hbWUgPSBmaWxlUGFydHMuam9pbignOicpLnJlcGxhY2UoYXBwRGlyLCAnJykucmVwbGFjZSgvXihcXFxcfFxcLykvLCAnJyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGxvZ0V2ZW50LmZpbGVuYW1lID0gZmlsZVBhcnRzLmpvaW4oJzonKTtcblx0XHR9XG5cblx0fSBlbHNlIHtcblxuXHRcdGxvZ0V2ZW50LmNvbHVtbiA9ICc/Jztcblx0XHRsb2dFdmVudC5maWxlbmFtZSA9ICdhbm9ueW1vdXMnO1xuXHRcdGxvZ0V2ZW50LmxpbmVOdW1iZXIgPSAnPyc7XG5cblx0fVxuXHRsb2dFdmVudC5maWxlID0gbG9nRXZlbnQuZmlsZW5hbWU7XG59O1xuXG4vKipcbiAqIEBmdW5jdGlvblxuICogQG1lbWJlck9mIGZvcm1hdHRlclxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBsYXlvdXRcbiAqXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwcmVDb21waWxlKGxheW91dCkge1xuXHRfZ2V0Q29tcGlsZWRMYXlvdXQobGF5b3V0KTtcbn1cblxuLyoqXG4gKiBAZnVuY3Rpb25cbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbGF5b3V0XG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcbiAqXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXQobGF5b3V0LCBsb2dFdmVudCkge1xuXHRyZXR1cm4gX2Zvcm1hdExvZ0V2ZW50KF9nZXRDb21waWxlZExheW91dChsYXlvdXQpLCBsb2dFdmVudCk7XG59XG4iXX0=