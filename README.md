[![Build Status](https://travis-ci.org/anigenero/log4js2.svg?branch=typescript)](https://travis-ci.org/anigenero/log4js2)

# log4js2
log4js2 is a fast and lightweight logging library that enables logging flexibility within JavaScript/TypeScript applications, 
similar to Apache's [Log4j2 library](https://logging.apache.org/log4j/2.x/). This library is designed to mirror Log4j2 
functionality to the best ability that a JavaScript framework can. It can also serve as a drop-in replacement for log4js, 
since the namespace and functions are mostly similar.

## Installing & Building

If you're building from source, simply run

```bash
> npm install
> npm run build
```

Or, you can install log4js2 from npm.

```bash
npm install log4js2 --save
```

## Setup

Import _log4js_ from the module:

```javascript
import log4js from 'log4js2';
```

Or, for HTML implementations:

```html
<script type="text/javascript" src="log4js2.min.js"></script>
```

## Usage

Logging works out-of-the-box, with no configuration, however, __note that only error messages will display without 
specific configuration__

```javascript
const logger = log4js.getLogger('myLogger');
logger.error('This is a log');
```
Default layout will follow the pattern layout of `%d [%p] %c - %m`

```text
03-24-2016 12:00:18,670 [ERROR] myLogger - This is a log
```

## Configuration

Configure log4js using the configure() method. This must be the first thing you do. Otherwise, 
the first log you commit will not allow updates from this function

```javascript
log4js.configure({
    layout : '%d [%p] %c %M:%line:%column - %m %ex',
    appenders : [{
        appender: 'Console'
    }],
    loggers : [{
        logLevel : log4js.LogLevel.INFO
    }]
});
```

### Configuration Options

#### appenders
Type: `Array.<AppenderConfiguration>`
Default: `[{ appender: 'Console' }]`

Sets the appenders for the given log configuration. Packaged with log4js2 is the console appender
. You can develop your own appenders to add more functionality.

#### loggers
Type: `Array.<LoggerConfiguration>`
Default: `[{ logLevel : log4js.LogLevel.ERROR }]`

Specifies the loggers for log4js2. The `tag` property specifies what logger the appender pertains to 
(see below), and the `logLevel` specifies the logging level (use `log4js.LogLevel`). You can also
set a logger-specific layout using the `patternLayout` property. 

```javascript
log4js.configure({
    // ...
    loggers : [ {
	    logLevel : log4js.LogLevel.INFO
    }, {
		tag : 'debugLogger',
		logLevel : log4js.LogLevel.DEBUG
	}]
});

const logger = log4js.getLogger('myLogger');
const debugLogger = log4js.getLogger('debugLogger');

logger.debug('This message will not show');
debugLogger.debug('This message will show');
```

#### layout
Type: `String`
Default: `"%d [%p] %c - %m"`

Sets the pattern layout for the logs. Keep in mind that some of the layout tags are relatively more expensive, and 
should only really be used in a development environment - such as *%method* and *%line*.
Refer to the [wiki](https://github.com/anigenero/log4js2/wiki/Pattern-Layouts) for more information.

```javascript
log4js.configure({
    patternLayout : '%d{MM-dd-yyyy HH:mm:ss} [%p] %c.%M:%line - %message',
    // ...
});

const logger = log4js.getLogger('myLogger');
logger.warn('This is a log {}', 'with parameters');
```
```text
03-24-2016 16:04:41 [WARN] myLogger.anonymous:15 - This is a log with parameters
```

###### Note: Showing Method Names

In order to make the **%method** tag word, you must call from named function, like so:

```javascript
function callerFunction() {
    log.info('This is within a name function');
}
```

```text
03-24-2016 16:17:50,360 [INFO] myLogger.callerFunction:3 - This is within a name function
```

Otherwise, non-named functions will simply display an 'anonymous' placeholder:

```javascript
let callerFunction = function () {
    log.info('This is an anonymous function');
};
```

```text
03-24-2016 16:19:42,373 [INFO] myLogger.anonymous:3 - This is an anonymous function
```

## Custom Appenders
You can output logs to a specific location or methodology using a custom appender. The `@Appender` decorator
will handle registering the appender with log4js2.

```typescript
@Appender({
    name: 'CustomAppender'
})
class MyAppender extends LogAppender {
    
    static get name() {
        return 'myappender';
    }
    
    append(logEvent: LogEvent) {
        
        const message: string = this.format(logEvent);
        // ... handle formatted result
        
    }
    
}
```

## log4js

#### configure(configuration)
__configuration__ `Configuration`

Sets the configuration. If no configuration is set before the first log, then the default 
configuration will be used. See configuration for options.

#### getLogger(logger)
__logger?__ `String [optional]`

Gets a logger instance. If the logger is not set, the logger name will be pulled from the
containing named instance it was created in (anonymous if unnamed).

#### setLogLevel(logLevel, logger)

__logLevel__ `LogLevel|Number`,
__logger?__ `String`

Sets the log level for a specific logger, or all loggers (if logger is not set).