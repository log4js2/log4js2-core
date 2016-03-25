# log4js2
A fast, lightweight (~12KB compressed) JavaScript logger with no runtime dependencies that is designed to mirror Apache Log4j 2 functionality.

## Setup

Simply require the log4js 

```javascript
var log4js = require('log4js2');
```

Or, for HTML implementations, place the log4js distirbution in your HTML ```<head>``` tag.

```html
<script type="text/javascript" src="log4js2.min.js"></script>
```

## Configuration

Configure log4js using the configure() method. This must be the first thing you do. Otherwise, the first log you commit will not allow updates from this function

```javascript
log4js.configure({
    tagLayout : '%d{MM-dd-yyyy HH:mm:ss,S}|%logger:%M:%line|%message',
    appenders : [ 'consoleAppender' ],
    loggers : [ {
        logLevel : log4js.LogLevel.INFO
    } ],
    allowAppenderInjection : true
});
```

Log some stuff

```javascript

// create the logger
var log = log4js.getLogger('myLogger');

// log an event
log.info('This is a log');

// output: "03-24-2016 12:00:18,670|myLogger:anonymous:3|This is a log"
```

## Layout

log4js2 allows for you to format your logs similarly to Log4j2, documented [here](https://logging.apache.org/log4j/2.x/manual/layouts.html). Keep in mind that some of the layout tags are relatively more expensive, and should only really be used in a development environment - such as *%method* and *%line*.

There are also a few layouts that are not implemented with log4js2:

1. Callers
2. Encoders
3. Equals
4. Highlight
5. Marker
6. Nano Time
7. Not Empty
8. Replace
9. Style
10. Threads/Thread Context Maps

```javascript
log4js.configure({
    tagLayout : '%d{MM-dd-yyyy HH:mm:ss,S} [%level] %logger.%M:%line - %message',
    // ...
});

var log = log4js.getLogger('myLogger');
log.warn('This is a log {}', 'with parameters');

// output: 03-24-2016 16:04:41,440 [WARN] myLogger.anonymous:15 - This is a log with parameters

```

### Note: Showing Method Names

In order to make the **%method** tag word, you must call from named function, like so:

```javascript
function callerFunction() {
    log.info('This is within a name function');
}
// output: 03-24-2016 16:17:50,360 [INFO] myLogger.callerFunction:3 - This is within a name function
```

Otherwise, non-named functions will simply display an 'anonymous' placeholder:

```javascript
var callerFunction = function () {
    log.info('This is an anonymous function');
};
// outputs: 03-24-2016 16:19:42,373 [INFO] myLogger.anonymous:3 - This is an anonymous function
```