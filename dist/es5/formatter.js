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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZvcm1hdHRlci5qcyJdLCJuYW1lcyI6WyJwcmVDb21waWxlIiwiZm9ybWF0IiwidXRpbGl0eSIsIl9DT01NQU5EX1JFR0VYIiwiX2NvbXBpbGVkTGF5b3V0cyIsIl9mb3JtYXRMb2dnZXIiLCJsb2dFdmVudCIsImxvZ2dlciIsIl9mb3JtYXREYXRlIiwicGFyYW1zIiwiZGF0ZSIsIl9mb3JtYXRFeGNlcHRpb24iLCJtZXNzYWdlIiwiZXJyb3IiLCJzdGFjayIsInVuZGVmaW5lZCIsInN0YWNrcyIsInNwbGl0IiwiZm9yRWFjaCIsIm5hbWUiLCJfZm9ybWF0RmlsZSIsImZpbGUiLCJfZ2V0RmlsZURldGFpbHMiLCJfZm9ybWF0TGluZU51bWJlciIsImxpbmVOdW1iZXIiLCJfZm9ybWF0TWFwTWVzc2FnZSIsInByb3BlcnRpZXMiLCJrZXkiLCJwdXNoIiwiam9pbiIsIl9mb3JtYXRMb2dNZXNzYWdlIiwiX2Zvcm1hdE1ldGhvZE5hbWUiLCJnZXRGdW5jdGlvbk5hbWUiLCJtZXRob2QiLCJfZm9ybWF0TGluZVNlcGFyYXRvciIsIl9mb3JtYXRMZXZlbCIsImxldmVsIiwiRkFUQUwiLCJFUlJPUiIsIldBUk4iLCJJTkZPIiwiREVCVUciLCJUUkFDRSIsIl9mb3JtYXRSZWxhdGl2ZSIsInJlbGF0aXZlIiwiX2Zvcm1hdFNlcXVlbmNlTnVtYmVyIiwic2VxdWVuY2UiLCJfZm9ybWF0dGVycyIsIl9nZXRDb21waWxlZExheW91dCIsImxheW91dCIsIl9jb21waWxlTGF5b3V0IiwiaW5kZXgiLCJpbmRleE9mIiwiY3VycmVudEZvcm1hdFN0cmluZyIsImZvcm1hdEFycmF5Iiwic3Vic3RyaW5nIiwic3RhcnRJbmRleCIsImVuZEluZGV4IiwiX2dldEZvcm1hdHRlck9iamVjdCIsImZvcm1hdFN0cmluZyIsInJlc3VsdCIsImV4ZWMiLCJsZW5ndGgiLCJmb3JtYXR0ZXIiLCJfZ2V0Rm9ybWF0dGVyRnVuY3Rpb24iLCJfZ2V0TGF5b3V0VGFnUGFyYW1zIiwiYWZ0ZXIiLCJsYXN0SW5kZXhPZiIsImNvbW1hbmQiLCJyZWdleCIsImhhc093blByb3BlcnR5IiwiUmVnRXhwIiwibWF0Y2giLCJpIiwiX2Zvcm1hdExvZ0V2ZW50IiwicmVzcG9uc2UiLCJjb3VudCIsIk9iamVjdCIsInRyaW0iLCJsb2dFcnJvclN0YWNrIiwicGFydHMiLCJyZXBsYWNlIiwibG9jYXRpb24iLCJob3N0IiwiZmlsZVBhcnRzIiwiY29sdW1uIiwicG9wIiwiZGVmaW5lIiwicGF0aCIsInJlcXVpcmUiLCJhcHBEaXIiLCJkaXJuYW1lIiwibWFpbiIsImZpbGVuYW1lIl0sIm1hcHBpbmdzIjoiOzs7UUFpZWdCQSxVLEdBQUFBLFU7Z0NBYUFDLE0sR0FBQUEsTTs7QUF2ZWhCOztBQUNBOzs0QkFBWUMsTzs7QUFDWjs7OztBQUVBO0FBQ0EsSUFBTUMsaUJBQWlCLHNCQUF2Qjs7QUFFQTtBQWRBOzs7Ozs7O0FBZUEsSUFBSUMsbUJBQW1CLEVBQXZCOztBQUVBOzs7Ozs7OztBQVFBLElBQUlDLGdCQUFnQixTQUFoQkEsYUFBZ0IsQ0FBVUMsUUFBVixFQUFvQjtBQUN2QyxTQUFPQSxTQUFTQyxNQUFoQjtBQUNBLENBRkQ7O0FBSUE7Ozs7Ozs7OztBQVNBLElBQUlDLGNBQWMsU0FBZEEsV0FBYyxDQUFVRixRQUFWLEVBQW9CRyxNQUFwQixFQUE0QjtBQUM3QyxTQUFPLHdEQUFXSCxTQUFTSSxJQUFwQixFQUEwQkQsT0FBTyxDQUFQLENBQTFCO0FBQVA7QUFDQSxDQUZEOztBQUlBOzs7Ozs7OztBQVFBLElBQUlFLG1CQUFtQixTQUFuQkEsZ0JBQW1CLENBQVVMLFFBQVYsRUFBb0I7O0FBRXZDLE1BQUlNLFVBQVUsRUFBZDs7QUFFQSxNQUFJTixTQUFTTyxLQUFULElBQWtCLElBQXRCLEVBQTRCOztBQUU5QixRQUFJUCxTQUFTTyxLQUFULENBQWVDLEtBQWYsSUFBd0JDLFNBQTVCLEVBQXVDO0FBQ3RDLFVBQUlDLFNBQVNWLFNBQVNPLEtBQVQsQ0FBZUMsS0FBZixDQUFxQkcsS0FBckIsQ0FBMkIsS0FBM0Is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QVA7O0FBRUEsUUFBSU0sWUFBWS9ELEtBQUtKLEtBQUwsQ0FBVyxLQUFYLENBQWhCOztBQUVBWCxhQUFTK0UsTUFBVCxHQUFrQkQsVUFBVUUsR0FBVixFQUFsQjtBQUNBaEYsYUFBU2tCLFVBQVQsR0FBc0I0RCxVQUFVRSxHQUFWLEVBQXRCOztBQUVBLFFBQUksT0FBT0MsTUFBUCxLQUFrQixXQUF0QixFQUFtQztBQUNsQyxVQUFJQyxPQUFPQyxRQUFRLE1BQVIsQ0FBWDtBQUNBLFVBQUlDLFNBQVNGLEtBQUtHLE9BQUwsQ0FBYUYsUUFBUUcsSUFBUixDQUFhQyxRQUExQixDQUFiO0FBQ0F2RixlQUFTdUYsUUFBVCxHQUFvQlQsVUFBVXZELElBQVYsQ0FBZSxHQUFmLEVBQW9Cb0QsT0FBcEIsQ0FBNEJTLE1BQTVCLEVBQW9DLEVBQXBDLEVBQXdDVCxPQUF4QyxDQUFnRCxTQUFoRCxFQUEyRCxFQUEzRCxDQUFwQjtBQUNBLEtBSkQsTUFJTztBQUNOM0UsZUFBU3VGLFFBQVQsR0FBb0JULFVBQVV2RCxJQUFWLENBQWUsR0FBZixDQUFwQjtBQUNBO0FBRUQsR0FyQkQsTUFxQk87O0FBRU52QixhQUFTK0UsTUFBVCxHQUFrQixHQUFsQjtBQUNBL0UsYUFBU3VGLFFBQVQsR0FBb0IsV0FBcEI7QUFDQXZGLGFBQVNrQixVQUFULEdBQXNCLEdBQXRCO0FBRUE7QUFFRCxDQS9CRDs7QUFpQ0E7Ozs7Ozs7O0FBUU8sU0FBU3hCLFVBQVQsQ0FBb0JpRCxNQUFwQixFQUE0QjtBQUNsQ0QscUJBQW1CQyxNQUFuQjtBQUNBOztBQUVEOzs7Ozs7Ozs7QUFTTyxTQUFTaEQsTUFBVCxDQUFnQmdELE1BQWhCLEVBQXdCM0MsUUFBeEIsRUFBa0M7QUFDeEMsU0FBT29FLGdCQUFnQjFCLG1CQUFtQkMsTUFBbkIsQ0FBaEIsRUFBNEMzQyxRQUE1QyxDQUFQO0FBQ0EiLCJmaWxlIjoiZm9ybWF0dGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBsb2c0anMgPGh0dHBzOi8vZ2l0aHViLmNvbS9hbmlnZW5lcm8vbG9nNGpzPlxuICpcbiAqIENvcHlyaWdodCAyMDE2LXByZXNlbnQgUm9iaW4gU2NodWx0eiA8aHR0cDovL2FuaWdlbmVyby5jb20+XG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2RhdGVGb3JtYXR9IGZyb20gJy4vZGF0ZUZvcm1hdHRlcic7XG5pbXBvcnQgKiBhcyB1dGlsaXR5IGZyb20gJy4vdXRpbGl0eSc7XG5pbXBvcnQge0xvZ0xldmVsfSBmcm9tICcuL2NvbnN0L2xvZ0xldmVsJztcblxuLyoqIEBjb25zdCAqL1xuY29uc3QgX0NPTU1BTkRfUkVHRVggPSAvJShbYS16LEEtWl0rKSg/PVxce3wpLztcblxuLyoqIEB0eXBlIHtPYmplY3R9ICovXG5sZXQgX2NvbXBpbGVkTGF5b3V0cyA9IHt9O1xuXG4vKipcbiAqIEBmdW5jdGlvblxuICogQG1lbWJlck9mIGZvcm1hdHRlclxuICpcbiAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dFdmVudFxuICpcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xubGV0IF9mb3JtYXRMb2dnZXIgPSBmdW5jdGlvbiAobG9nRXZlbnQpIHtcblx0cmV0dXJuIGxvZ0V2ZW50LmxvZ2dlcjtcbn07XG5cbi8qKlxuICogQGZ1bmN0aW9uXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXG4gKlxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XG4gKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSBwYXJhbXNcbiAqXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmxldCBfZm9ybWF0RGF0ZSA9IGZ1bmN0aW9uIChsb2dFdmVudCwgcGFyYW1zKSB7XG5cdHJldHVybiBkYXRlRm9ybWF0KGxvZ0V2ZW50LmRhdGUsIHBhcmFtc1swXSk7XG59O1xuXG4vKipcbiAqIEBmdW5jdGlvblxuICogQG1lbWJlck9mIGZvcm1hdHRlclxuICpcbiAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dFdmVudFxuICpcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xubGV0IF9mb3JtYXRFeGNlcHRpb24gPSBmdW5jdGlvbiAobG9nRXZlbnQpIHtcblxuICAgIGxldCBtZXNzYWdlID0gJyc7XG5cbiAgICBpZiAobG9nRXZlbnQuZXJyb3IgIT0gbnVsbCkge1xuXG5cdFx0aWYgKGxvZ0V2ZW50LmVycm9yLnN0YWNrICE9IHVuZGVmaW5lZCkge1xuXHRcdFx0bGV0IHN0YWNrcyA9IGxvZ0V2ZW50LmVycm9yLnN0YWNrLnNwbGl0KC9cXG4vZyk7XG4gICAgICAgICAgICBzdGFja3MuZm9yRWFjaChmdW5jdGlvbiAoc3RhY2spIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlICs9IGBcXHQke3N0YWNrfVxcbmA7XG4gICAgICAgICAgICB9KTtcblx0XHR9IGVsc2UgaWYgKGxvZ0V2ZW50LmVycm9yLm1lc3NhZ2UgIT0gbnVsbCAmJiBsb2dFdmVudC5lcnJvci5tZXNzYWdlICE9ICcnKSB7XG5cdFx0XHRtZXNzYWdlICs9IGBcXHQke2xvZ0V2ZW50LmVycm9yLm5hbWV9OiAke2xvZ0V2ZW50LmVycm9yLm1lc3NhZ2V9XFxuYDtcblx0XHR9XG5cblx0fVxuXG5cdHJldHVybiBtZXNzYWdlO1xuXG59O1xuXG4vKipcbiAqIEZvcm1hdHMgdGhlIGZpbGUgKGUuZy4gdGVzdC5qcykgdG8gdGhlIGZpbGVcbiAqXG4gKiBAcHJpdmF0ZVxuICogQGZ1bmN0aW9uXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXG4gKlxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XG4gKi9cbmxldCBfZm9ybWF0RmlsZSA9IGZ1bmN0aW9uIChsb2dFdmVudCkge1xuXG4gICAgaWYgKCFsb2dFdmVudC5maWxlKSB7XG5cdFx0X2dldEZpbGVEZXRhaWxzKGxvZ0V2ZW50KTtcblx0fVxuXG5cdHJldHVybiBsb2dFdmVudC5maWxlO1xuXG59O1xuXG4vKipcbiAqIEBmdW5jdGlvblxuICogQG1lbWJlck9mIGZvcm1hdHRlclxuICpcbiAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dFdmVudFxuICpcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xubGV0IF9mb3JtYXRMaW5lTnVtYmVyID0gZnVuY3Rpb24gKGxvZ0V2ZW50KSB7XG5cbiAgICBpZiAoIWxvZ0V2ZW50LmxpbmVOdW1iZXIpIHtcblx0XHRfZ2V0RmlsZURldGFpbHMobG9nRXZlbnQpO1xuXHR9XG5cblx0cmV0dXJuIGAke2xvZ0V2ZW50LmxpbmVOdW1iZXJ9YDtcblxufTtcblxuLyoqXG4gKiBAZnVuY3Rpb25cbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcbiAqXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcbiAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz59IHBhcmFtc1xuICpcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xubGV0IF9mb3JtYXRNYXBNZXNzYWdlID0gZnVuY3Rpb24gKGxvZ0V2ZW50LCBwYXJhbXMpIHtcblx0bGV0IG1lc3NhZ2UgPSBudWxsO1xuXHRpZiAobG9nRXZlbnQucHJvcGVydGllcykge1xuXG5cdFx0bWVzc2FnZSA9IFtdO1xuXHRcdGZvciAobGV0IGtleSBpbiBsb2dFdmVudC5wcm9wZXJ0aWVzKSB7XG5cdFx0XHRpZiAocGFyYW1zWzBdKSB7XG5cdFx0XHRcdGlmIChwYXJhbXNbMF0gPT0ga2V5KSB7XG5cdFx0XHRcdFx0bWVzc2FnZS5wdXNoKGxvZ0V2ZW50LnByb3BlcnRpZXNba2V5XSk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG1lc3NhZ2UucHVzaCgneycgKyBrZXkgKyAnLCcgKyBsb2dFdmVudC5wcm9wZXJ0aWVzW2tleV0gKyAnfScpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiAneycgKyBtZXNzYWdlLmpvaW4oJywnKSArICd9JztcblxuXHR9XG5cdHJldHVybiBtZXNzYWdlO1xufTtcblxuLyoqXG4gKiBAZnVuY3Rpb25cbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcbiAqXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcbiAqXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmxldCBfZm9ybWF0TG9nTWVzc2FnZSA9IGZ1bmN0aW9uIChsb2dFdmVudCkge1xuXHRyZXR1cm4gbG9nRXZlbnQubWVzc2FnZTtcbn07XG5cbi8qKlxuICogQGZ1bmN0aW9uXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXG4gKlxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XG4gKlxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5sZXQgX2Zvcm1hdE1ldGhvZE5hbWUgPSBmdW5jdGlvbiAobG9nRXZlbnQpIHtcblx0cmV0dXJuIHV0aWxpdHkuZ2V0RnVuY3Rpb25OYW1lKGxvZ0V2ZW50Lm1ldGhvZCk7XG59O1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBAZnVuY3Rpb25cbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcbiAqL1xubGV0IF9mb3JtYXRMaW5lU2VwYXJhdG9yID0gZnVuY3Rpb24gKCkge1xuXHRyZXR1cm4gJ1xcbic7XG59O1xuXG4vKipcbiAqIEBmdW5jdGlvblxuICogQG1lbWJlck9mIGZvcm1hdHRlclxuICpcbiAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dFdmVudFxuICpcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xubGV0IF9mb3JtYXRMZXZlbCA9IGZ1bmN0aW9uIChsb2dFdmVudCkge1xuXG4gICAgc3dpdGNoIChsb2dFdmVudC5sZXZlbCkge1xuXG4gICAgICAgIGNhc2UgTG9nTGV2ZWwuRkFUQUw6XG4gICAgICAgICAgICByZXR1cm4gJ0ZBVEFMJztcbiAgICAgICAgY2FzZSBMb2dMZXZlbC5FUlJPUjpcbiAgICAgICAgICAgIHJldHVybiAnRVJST1InO1xuICAgICAgICBjYXNlIExvZ0xldmVsLldBUk46XG4gICAgICAgICAgICByZXR1cm4gJ1dBUk4nO1xuICAgICAgICBjYXNlIExvZ0xldmVsLklORk86XG4gICAgICAgICAgICByZXR1cm4gJ0lORk8nO1xuICAgICAgICBjYXNlIExvZ0xldmVsLkRFQlVHOlxuICAgICAgICAgICAgcmV0dXJuICdERUJVRyc7XG4gICAgICAgIGNhc2UgTG9nTGV2ZWwuVFJBQ0U6XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gJ1RSQUNFJztcblxuICAgIH1cblxufTtcblxuLyoqXG4gKiBAZnVuY3Rpb25cbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcbiAqXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcbiAqXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmxldCBfZm9ybWF0UmVsYXRpdmUgPSBmdW5jdGlvbiAobG9nRXZlbnQpIHtcblx0cmV0dXJuICcnICsgbG9nRXZlbnQucmVsYXRpdmU7XG59O1xuXG4vKipcbiAqIEBmdW5jdGlvblxuICogQG1lbWJlck9mIGZvcm1hdHRlclxuICpcbiAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dFdmVudFxuICpcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xubGV0IF9mb3JtYXRTZXF1ZW5jZU51bWJlciA9IGZ1bmN0aW9uIChsb2dFdmVudCkge1xuXHRyZXR1cm4gJycgKyBsb2dFdmVudC5zZXF1ZW5jZTtcbn07XG5cbmxldCBfZm9ybWF0dGVycyA9IHtcblx0J2N8bG9nZ2VyJyA6IF9mb3JtYXRMb2dnZXIsXG5cdCdkfGRhdGUnIDogX2Zvcm1hdERhdGUsXG5cdCdleHxleGNlcHRpb258dGhyb3dhYmxlJyA6IF9mb3JtYXRFeGNlcHRpb24sXG5cdCdGfGZpbGUnIDogX2Zvcm1hdEZpbGUsXG5cdCdLfG1hcHxNQVAnIDogX2Zvcm1hdE1hcE1lc3NhZ2UsXG5cdCdMfGxpbmUnIDogX2Zvcm1hdExpbmVOdW1iZXIsXG5cdCdtfG1zZ3xtZXNzYWdlJyA6IF9mb3JtYXRMb2dNZXNzYWdlLFxuXHQnTXxtZXRob2QnIDogX2Zvcm1hdE1ldGhvZE5hbWUsXG5cdCduJyA6IF9mb3JtYXRMaW5lU2VwYXJhdG9yLFxuXHQncHxsZXZlbCcgOiBfZm9ybWF0TGV2ZWwsXG5cdCdyfHJlbGF0aXZlJyA6IF9mb3JtYXRSZWxhdGl2ZSxcblx0J3NufHNlcXVlbmNlTnVtYmVyJyA6IF9mb3JtYXRTZXF1ZW5jZU51bWJlclxufTtcblxuLyoqXG4gKiBHZXQgdGhlIGNvbXBpbGVkIGxheW91dCBmb3IgdGhlIHNwZWNpZmllZCBsYXlvdXQgc3RyaW5nLiBJZiB0aGUgY29tcGlsZWQgbGF5b3V0IGRvZXMgbm90XG4gKiBleGlzdCwgdGhlbiB3ZSB3YW50IHRvIGNyZWF0ZSBpdC5cbiAqXG4gKiBAZnVuY3Rpb25cbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbGF5b3V0XG4gKlxuICogQHJldHVybiB7QXJyYXkuPHN0cmluZ3xmdW5jdGlvbj59XG4gKi9cbmxldCBfZ2V0Q29tcGlsZWRMYXlvdXQgPSBmdW5jdGlvbiAobGF5b3V0KSB7XG5cblx0aWYgKF9jb21waWxlZExheW91dHNbbGF5b3V0XSkge1xuXHRcdHJldHVybiBfY29tcGlsZWRMYXlvdXRzW2xheW91dF07XG5cdH1cblxuXHRyZXR1cm4gX2NvbXBpbGVMYXlvdXQobGF5b3V0KTtcblxufTtcblxuLyoqXG4gKiBDb21waWxlcyBhIGxheW91dCBpbnRvIGFuIGFycmF5LiBUaGUgYXJyYXkgY29udGFpbnMgZnVuY3Rpb25zXG4gKlxuICogQGZ1bmN0aW9uXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGxheW91dFxuICpcbiAqIEByZXR1cm4ge0FycmF5LjxzdHJpbmd8ZnVuY3Rpb24+fVxuICovXG5sZXQgX2NvbXBpbGVMYXlvdXQgPSBmdW5jdGlvbiAobGF5b3V0KSB7XG5cblx0bGV0IGluZGV4ID0gbGF5b3V0LmluZGV4T2YoJyUnKTtcblx0bGV0IGN1cnJlbnRGb3JtYXRTdHJpbmcgPSAnJztcblx0bGV0IGZvcm1hdEFycmF5ID0gW107XG5cblx0aWYgKGluZGV4ICE9IDApIHtcblx0XHRmb3JtYXRBcnJheS5wdXNoKGxheW91dC5zdWJzdHJpbmcoMCwgaW5kZXgpKTtcblx0fVxuXG5cdGRvIHtcblxuXHRcdGxldCBzdGFydEluZGV4ID0gaW5kZXg7XG5cdFx0bGV0IGVuZEluZGV4ID0gaW5kZXggPSBsYXlvdXQuaW5kZXhPZignJScsIGluZGV4ICsgMSk7XG5cblx0XHRpZiAoZW5kSW5kZXggPCAwKSB7XG5cdFx0XHRjdXJyZW50Rm9ybWF0U3RyaW5nID0gbGF5b3V0LnN1YnN0cmluZyhzdGFydEluZGV4KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y3VycmVudEZvcm1hdFN0cmluZyA9IGxheW91dC5zdWJzdHJpbmcoc3RhcnRJbmRleCwgZW5kSW5kZXgpO1xuXHRcdH1cblxuXHRcdGZvcm1hdEFycmF5LnB1c2goX2dldEZvcm1hdHRlck9iamVjdChjdXJyZW50Rm9ybWF0U3RyaW5nKSk7XG5cblx0fSB3aGlsZSAoaW5kZXggPiAtMSk7XG5cbiAgICAvLyBzZXQgdGhlIGZvcm1hdCBhcnJheSB0byB0aGUgc3BlY2lmaWVkIGNvbXBpbGVkIGxheW91dFxuXHRfY29tcGlsZWRMYXlvdXRzW2xheW91dF0gPSBmb3JtYXRBcnJheTtcblxuXHRyZXR1cm4gZm9ybWF0QXJyYXk7XG5cbn07XG5cbi8qKlxuICogQGZ1bmN0aW9uXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGZvcm1hdFN0cmluZ1xuICpcbiAqIEByZXR1cm4ge09iamVjdHxzdHJpbmd9XG4gKi9cbmxldCBfZ2V0Rm9ybWF0dGVyT2JqZWN0ID0gZnVuY3Rpb24gKGZvcm1hdFN0cmluZykge1xuXG5cdGxldCByZXN1bHQgPSBfQ09NTUFORF9SRUdFWC5leGVjKGZvcm1hdFN0cmluZyk7XG5cdGlmIChyZXN1bHQgIT0gbnVsbCAmJiByZXN1bHQubGVuZ3RoID09IDIpIHtcblxuXHRcdGxldCBmb3JtYXR0ZXIgPSBfZ2V0Rm9ybWF0dGVyRnVuY3Rpb24ocmVzdWx0WzFdKTtcblx0XHRpZiAoIWZvcm1hdHRlcikge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXG5cdFx0bGV0IHBhcmFtcyA9IF9nZXRMYXlvdXRUYWdQYXJhbXMoZm9ybWF0U3RyaW5nKTtcblxuXHRcdGxldCBhZnRlciA9ICcnO1xuXHRcdGxldCBlbmRJbmRleCA9IGZvcm1hdFN0cmluZy5sYXN0SW5kZXhPZignfScpO1xuXHRcdGlmIChlbmRJbmRleCAhPSAtMSkge1xuXHRcdFx0YWZ0ZXIgPSBmb3JtYXRTdHJpbmcuc3Vic3RyaW5nKGVuZEluZGV4ICsgMSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGFmdGVyID0gZm9ybWF0U3RyaW5nLnN1YnN0cmluZyhyZXN1bHQuaW5kZXggKyByZXN1bHRbMV0ubGVuZ3RoICsgMSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdCdmb3JtYXR0ZXInIDogZm9ybWF0dGVyLFxuXHRcdFx0J3BhcmFtcycgOiBwYXJhbXMsXG5cdFx0XHQnYWZ0ZXInIDogYWZ0ZXJcblx0XHR9O1xuXG5cdH1cblxuXHRyZXR1cm4gZm9ybWF0U3RyaW5nO1xuXG59O1xuXG4vKipcbiAqIERldGVybWluZXMgd2hhdCBmb3JtYXR0ZXIgZnVuY3Rpb24gaGFzIGJlZW4gY29uZmlndXJlZFxuICpcbiAqIEBmdW5jdGlvblxuICogQG1lbWJlck9mIGZvcm1hdHRlclxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb21tYW5kXG4gKlxuICogQHJldHVybiB7P3N0cmluZ31cbiAqL1xubGV0IF9nZXRGb3JtYXR0ZXJGdW5jdGlvbiA9IGZ1bmN0aW9uIChjb21tYW5kKSB7XG5cblx0bGV0IHJlZ2V4O1xuXHRmb3IgKGxldCBrZXkgaW4gX2Zvcm1hdHRlcnMpIHtcbiAgICAgICAgaWYgKF9mb3JtYXR0ZXJzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIHJlZ2V4ID0gbmV3IFJlZ0V4cCgnXignICsga2V5ICsgJykkJyk7XG4gICAgICAgICAgICBpZiAocmVnZXguZXhlYyhjb21tYW5kKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfZm9ybWF0dGVyc1trZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cdH1cblxuXHRyZXR1cm4gbnVsbDtcblxufTtcblxuLyoqXG4gKiBHZXRzIHRoZSBsYXlvdXQgdGFnIHBhcmFtcyBhc3NvY2lhdGVkIHdpdGggdGhlIGxheW91dCB0YWcuIFNvLCBmb3IgZXhhbXBsZSwgJyVke3l5eXktTU0tZGR9YFxuICogd291bGQgb3V0cHV0IGFuIGFycmF5IG9mIFsneXl5eS1NTS1kZCddXG4gKlxuICogQHByaXZhdGVcbiAqIEBmdW5jdGlvblxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb21tYW5kXG4gKlxuICogQHJldHVybiB7QXJyYXkuPHN0cmluZz59XG4gKi9cbmxldCBfZ2V0TGF5b3V0VGFnUGFyYW1zID0gZnVuY3Rpb24gKGNvbW1hbmQpIHtcblxuXHRsZXQgcGFyYW1zID0gW107XG5cdGxldCByZXN1bHQgPSBjb21tYW5kLm1hdGNoKC9cXHsoW159XSopKD89fSkvZyk7XG5cdGlmIChyZXN1bHQgIT0gbnVsbCkge1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcmVzdWx0Lmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRwYXJhbXMucHVzaChyZXN1bHRbaV0uc3Vic3RyaW5nKDEpKTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gcGFyYW1zO1xuXG59O1xuXG4vKipcbiAqIEhhbmRsZXMgZm9ybWF0dGluZyB0aGUgbG9nIGV2ZW50IHVzaW5nIHRoZSBzcGVjaWZpZWQgZm9ybWF0dGVyIGFycmF5XG4gKlxuICogQHByaXZhdGVcbiAqIEBmdW5jdGlvblxuICpcbiAqIEBwYXJhbSB7QXJyYXkuPGZ1bmN0aW9ufHN0cmluZz59IGZvcm1hdHRlclxuICogQHBhcmFtIHtMT0dfRVZFTlR9IGxvZ0V2ZW50XG4gKlxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5sZXQgX2Zvcm1hdExvZ0V2ZW50ID0gZnVuY3Rpb24gKGZvcm1hdHRlciwgbG9nRXZlbnQpIHtcblxuXHRsZXQgcmVzcG9uc2U7XG5cdGxldCBtZXNzYWdlID0gJyc7XG5cdGxldCBjb3VudCA9IGZvcm1hdHRlci5sZW5ndGg7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuXHRcdGlmIChmb3JtYXR0ZXJbaV0gIT09IG51bGwpIHtcblxuXHRcdFx0aWYgKGZvcm1hdHRlcltpXSBpbnN0YW5jZW9mIE9iamVjdCkge1xuXG5cdFx0XHRcdHJlc3BvbnNlID0gZm9ybWF0dGVyW2ldLmZvcm1hdHRlcihsb2dFdmVudCwgZm9ybWF0dGVyW2ldLnBhcmFtcyk7XG5cdFx0XHRcdGlmIChyZXNwb25zZSAhPSBudWxsKSB7XG5cdFx0XHRcdFx0bWVzc2FnZSArPSByZXNwb25zZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRtZXNzYWdlICs9IGZvcm1hdHRlcltpXS5hZnRlcjtcblxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bWVzc2FnZSArPSBmb3JtYXR0ZXJbaV07XG5cdFx0XHR9XG5cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gbWVzc2FnZS50cmltKCk7XG5cbn07XG5cbi8qKlxuICpcbiAqIEBwcml2YXRlXG4gKiBAZnVuY3Rpb25cbiAqIEBtZW1iZXJPZiBmb3JtYXR0ZXJcbiAqXG4gKiBAcGFyYW0ge0xPR19FVkVOVH0gbG9nRXZlbnRcbiAqL1xubGV0IF9nZXRGaWxlRGV0YWlscyA9IGZ1bmN0aW9uIChsb2dFdmVudCkge1xuXG5cdGlmIChsb2dFdmVudC5sb2dFcnJvclN0YWNrKSB7XG5cblx0XHRsZXQgcGFydHMgPSBsb2dFdmVudC5sb2dFcnJvclN0YWNrLnN0YWNrLnNwbGl0KC9cXG4vZyk7XG5cdFx0bGV0IGZpbGUgPSBwYXJ0c1szXTtcblx0XHRmaWxlID0gZmlsZS5yZXBsYWNlKC9hdCAoLipcXCh8KShmaWxlfGh0dHB8aHR0cHN8KSg6fCkoXFwvfCkqLywgJycpO1xuXHRcdGZpbGUgPSBmaWxlLnJlcGxhY2UoJyknLCAnJyk7XG5cdFx0ZmlsZSA9IGZpbGUucmVwbGFjZSgodHlwZW9mIGxvY2F0aW9uICE9PSAndW5kZWZpbmVkJykgPyBsb2NhdGlvbi5ob3N0IDogJycsICcnKS50cmltKCk7XG5cblx0XHRsZXQgZmlsZVBhcnRzID0gZmlsZS5zcGxpdCgvXFw6L2cpO1xuXG5cdFx0bG9nRXZlbnQuY29sdW1uID0gZmlsZVBhcnRzLnBvcCgpO1xuXHRcdGxvZ0V2ZW50LmxpbmVOdW1iZXIgPSBmaWxlUGFydHMucG9wKCk7XG5cblx0XHRpZiAodHlwZW9mIGRlZmluZSAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdGxldCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuXHRcdFx0bGV0IGFwcERpciA9IHBhdGguZGlybmFtZShyZXF1aXJlLm1haW4uZmlsZW5hbWUpO1xuXHRcdFx0bG9nRXZlbnQuZmlsZW5hbWUgPSBmaWxlUGFydHMuam9pbignOicpLnJlcGxhY2UoYXBwRGlyLCAnJykucmVwbGFjZSgvKFxcXFx8XFwvKS8sICcnKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0bG9nRXZlbnQuZmlsZW5hbWUgPSBmaWxlUGFydHMuam9pbignOicpO1xuXHRcdH1cblxuXHR9IGVsc2Uge1xuXG5cdFx0bG9nRXZlbnQuY29sdW1uID0gJz8nO1xuXHRcdGxvZ0V2ZW50LmZpbGVuYW1lID0gJ2Fub255bW91cyc7XG5cdFx0bG9nRXZlbnQubGluZU51bWJlciA9ICc/JztcblxuXHR9XG5cbn07XG5cbi8qKlxuICogQGZ1bmN0aW9uXG4gKiBAbWVtYmVyT2YgZm9ybWF0dGVyXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGxheW91dFxuICpcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHByZUNvbXBpbGUobGF5b3V0KSB7XG5cdF9nZXRDb21waWxlZExheW91dChsYXlvdXQpO1xufVxuXG4vKipcbiAqIEBmdW5jdGlvblxuICogQG1lbWJlck9mIGZvcm1hdHRlclxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBsYXlvdXRcbiAqIEBwYXJhbSB7TE9HX0VWRU5UfSBsb2dFdmVudFxuICpcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdChsYXlvdXQsIGxvZ0V2ZW50KSB7XG5cdHJldHVybiBfZm9ybWF0TG9nRXZlbnQoX2dldENvbXBpbGVkTGF5b3V0KGxheW91dCksIGxvZ0V2ZW50KTtcbn1cbiJdfQ==