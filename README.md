[![Build Status](https://travis-ci.org/anigenero/log4js2.svg?branch=master)](https://travis-ci.org/anigenero/log4js2)

# log4js2
log4js2 came about because of the lack of logging frameworks that did anything beyond a simple 
`console.log`. This library is designed to mirror Apache Log4j 2 functionality (to the best 
ability that a JavaScript framework can), while remaining fast, lightweight (~14KB compressed), 
and void of any external dependencies. It can also serve as a drop-in replacement for log4js, 
since the namespace and functions are mostly similar.

## Installing & Building

If you're building from source, simply run

```bash
npm install && npm run build
```

Or, you can install log4js2 from either bower or npm.

```bash
bower install log4js2 --save
```

```bash
npm install log4js2 --save
```

## Setup

Simply require the log4js2 module.

```javascript
var log4js = require('log4js2');
```

Or, for HTML implementations, place the log4js distribution in your HTML ```<head>``` tag.

```html
<script type="text/javascript" src="log4js2.min.js"></script>
```

Then, log some stuff!!

```javascript

// create the logger
var log = log4js.getLogger('myLogger');

// log an event
log.info('This is a log');

// output: "03-24-2016 12:00:18,670|myLogger:anonymous:3|This is a log"
```

## Configuration

Configure log4js using the configure() method. This must be the first thing you do. Otherwise, 
the first log you commit will not allow updates from this function

```javascript
log4js.configure({
    layout : '%d{MM-dd-yyyy HH:mm:ss,S}|%logger:%M:%line|%message',
    appenders : [ 'consoleAppender' ],
    loggers : [ {
        logLevel : log4js.LogLevel.INFO
    } ],
    allowAppenderInjection : true
});
```

### Configuration Options

#### allowAppenderInjection
Type: `Boolean`
Default: `false`

Turn on or off the ability to inject appenders. If set to false, no appenders can be added after 
the first log. This may be useful if you need to add an appender during runtime.

#### appenders
Type: `Array.<String>`
Default: `[ 'consoleAppender' ]`

Sets the appenders for the given log configuration. Packaged with log4js2 is the console appender
. You can develop your own appenders to add more functionality.

#### loggers
Type: `Array.<Object>`
Default: `[{ tag : 'main', logLevel : log4js.LogLevel.INFO }]`

Sets the loggers for log4js2. The `tag` property specifies what logger the appender pertains to 
(see below), and the `logLevel` specifies the logging level (use `log4js.LogLevel`). You can also
set a logger-specific layout using the `layout` property. 

```javascript
log4js.configure({
    // ...
    loggers : [ {
	    logLevel : log4js.LogLevel.INFO
    }, {
		tag : 'debugLogger',
		logLevel : log4js.LogLevel.DEBUG
	} ]
});

var log = log4js.getLogger('myLogger');
var debugLog = log4js.getLogger('debugLogger');

log.debug('This message will not show');
debugLog.debug('This message will show');
```

#### layout
Type: `String`
Default: `"%d{HH:mm:ss} [%level] %logger - %message"`

Sets the tagging layout for the logs. Refer to 
[Apache's Log4j2 documentation](https://logging.apache.org/log4j/2.x/manual/layouts.html) for how
to set the tag layout. Keep in mind that some of the layout tags are relatively more expensive, 
and should only really be used in a development environment - such as *%method* and *%line*.
There are also a few layouts that are not yet implemented with log4js2:

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
    layout : '%d{MM-dd-yyyy HH:mm:ss,S} [%level] %logger.%M:%line - %message',
    // ...
});

var log = log4js.getLogger('myLogger');
log.warn('This is a log {}', 'with parameters');

// output: 03-24-2016 16:04:41,440 [WARN] myLogger.anonymous:15 - This is a log with parameters

```

###### Note: Showing Method Names

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

## Custom Appenders
You can output logs to a specific location or methodology using a custom appender. In ES6, you 
just need to extend `LogAppender`. If you cannot utilize ES6, then simply create a function that 
returns an object with the methods specified in the `LogAppender` class.

```javascript
class MyAppender extends log4js.LogAppender {

    static get name() {
        return 'myappender';
    }
    
    append(logEvent) {
        let result = this.format(logEvent);
        // ... handle formatted result
    }
    
    // ... override methods
    
}

log4js.addAppender(MyAppender); // register the appender

```

## log4js

#### addAppender(appender)
*appender* `LogAppender|function` 

Adds an appender to the log4js2 registry. This must be called before the first log, otherwise the 
configuration option `allowAppenderInjection` must be set to `true`.

#### configure(configuration)
*configuration* `Object`

Sets the configuration. If no configuration is set before the first log, then the default 
configuration will be used. See configuration for options.

#### getLogger(logger)
*logger* `String [optional]`

Gets a logger instance. If the logger is not set, the logger name will be pulled from the
containing named instance it was created in (anonymous if unnamed).

#### setLogLevel(logLevel, logger)

*logLevel* `Number` *(use log4js.LogLevel)*
*logger* `String [optional]`

Sets the log level for a specific logger, or all loggers (if logger is not set).