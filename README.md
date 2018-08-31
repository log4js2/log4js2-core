# log4js2
log4js2 is a fast and lightweight logging library that enables logging flexibility within JavaScript/TypeScript applications, 
similar to Apache's [Log4j2 library](https://logging.apache.org/log4j/2.x/). This library is designed to mirror Log4j2 
functionality to the best ability that a JavaScript framework can. It can also serve as a drop-in replacement for log4js, 
since the namespace and functions are mostly similar.

[![Build Status](https://travis-ci.org/anigenero/log4js2.svg?branch=master)](https://travis-ci.org/anigenero/log4js2)
[![codecov](https://codecov.io/gh/anigenero/log4js2/branch/master/graph/badge.svg)](https://codecov.io/gh/anigenero/log4js2)

## Installing & Building

If you're building from source, simply run

```bash
> npm install
> npm run build
```

Or, you can install log4js2 from npm.

```bash
> npm install --save log4js2
```

## Usage

Logging works out-of-the-box, with no configuration, however, note that only error messages will display without 
specific configuration

```javascript
import {getLogger} from 'log4js2';


const logger = getLogger('myLogger');
logger.error('This is a log');
```
Default layout will follow the pattern layout of `%d [%p] %c - %m`

```text
03-24-2016 12:00:18,670 [ERROR] myLogger - This is a log
```


## Virtual Console

ConsoleAppender utilizes a virtual console that "hijacks" `console` and inputs it into the log4js2 stream. Make sure
`log4js2` is loaded at the top of the page to ensure all logs are caught.

```typescript
console.log('console log');

// outputs: 08-30-2018 12:38:00 [INFO] main - console log
```


## Configuration

Configure log4js using the configure() method. This must be the first thing you do. Otherwise, 
the first log you commit will not allow updates from this function

```typescript
import {configure, LogLevel} from 'log4js2';

configure({
    layout : '%d [%p] %c %M:%line:%column - %m %ex',
    appenders : [{
        appender: 'Console'
    }],
    loggers : [{
        tag: 'App',
        logLevel : LogLevel.INFO
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
configure({
    // ...
    loggers : [ {
        logLevel : LogLevel.INFO
    }, {
        tag : 'debugLogger',
        logLevel : LogLevel.DEBUG
	}]
});

const logger = getLogger('myLogger');
const debugLogger = getLogger('debugLogger');

logger.debug('This message will not show');
debugLogger.debug('This message will show');
```

#### layout
Type: `string`
Default: `"%d [%p] %c - %m"`

Sets the pattern layout for the logs. Keep in mind that some of the layout tags are relatively more expensive, and 
should only really be used in a development environment - such as *%method* and *%line*.
Refer to the [wiki](https://github.com/anigenero/log4js2/wiki/Pattern-Layouts) for more information.

```javascript
configure({
    patternLayout : '%d{MM-dd-yyyy HH:mm:ss} [%p] %c.%M:%line - %message',
    // ...
});

const logger = getLogger('myLogger');
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

// outputs [INFO] myLogger.callerFunction:3 - This is within a name function
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
@Appender()
class MyAppender extends LogAppender {
    
    static get appenderName() {
        return 'myappender';
    }
    
    append(logEvent: LogEvent) {
        
        const message: string = this.format(logEvent);
        // ... handle formatted result
        
    }
    
}
```

### Custom Appender Configuration
In the case that your appender needs special configuration, the `config` element of `IAppenderConfiguration` allows
for configuration to be passed.

```typescript
interface IAjaxAppenderConfig {
    endpoint: string;
}

class AjaxAppender extends LogAppender {
    
    constructor(config?: IAjaxAppenderConfig) {
        
        super(config);
        
        // ...handle config
        
    }
    
}
```

When configuring, use the `config` key to pass configuration for that appender.
```typescript
configure({
    appenders: [{
        appender: MyAppender,
        config: {
            endpoint: 'http://example.com/logs'
        }
    }]
})
```

## log4js

#### configure(configuration)
__configuration__ `Configuration`

Sets the configuration. If no configuration is set before the first log, then the default 
configuration will be used. See configuration for options.

#### getLogger(logger)
__logger?__ `string [optional]`

Gets a logger instance. If the logger is not set, the logger name will be pulled from the
containing named instance it was created in (anonymous if unnamed).

#### setLogLevel(logLevel, logger)

__logLevel__ `LogLevel|number`,
__logger?__ `string`

Sets the log level for a specific logger, or all loggers (if logger is not set).