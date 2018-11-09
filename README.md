# log4js2
log4js2 is a fast and lightweight logging library that enables logging flexibility within JavaScript/TypeScript applications, 
similar to Apache's [Log4j2 library](https://logging.apache.org/log4j/2.x/). It can also serve as a drop-in replacement for log4js, 
since the namespace and functions are mostly similar.

[![Build Status](https://travis-ci.org/anigenero/log4js2.svg?branch=master)](https://travis-ci.org/anigenero/log4js2)
[![codecov](https://codecov.io/gh/anigenero/log4js2/branch/master/graph/badge.svg)](https://codecov.io/gh/anigenero/log4js2)

- [Read the Docs](https://anigenero.github.io/log4js2/)

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

## Getting Started

Logging works out-of-the-box, with no configuration. However, note that only error messages will display without 
specific configuration.

```javascript
import {getLogger} from 'log4js2';

const logger = getLogger('myLogger');

console.error('Console error'); // this will show

logger.error('This is an error log'); // this will show
logger.debug('This is a debug log'); // this will not show
```

#### Configuration

Configure log4js using the `configure()` method. _This must be the first thing you do_. Otherwise, 
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

## Virtual Console

This library utilizes a virtual console to intercept `console` logs from other libraries/scripts. This is intended to
allow usage of this library without having to replace all console.log commands within your code - or to intercept logs
from third-party libraries to input into your own logs bucket. Make sure `log4js2` is loaded at the top of the page to 
ensure that all logs are caught.

```typescript
import * from 'log4js2';

console.log('console log');

// outputs: 08-30-2018 12:38:00 [INFO] main - console log
```

To disable this feature, set the `virtualConsole` property to false when configuring log4js2.

```typescript
configure({
    // ...
    virtualConsole: false
});
```

## Contributors
Library built and maintained by [Robin Schultz](http://anigenero.com)

If you would like to contribute (aka buy me a beer), you can send funds via PayPal at the link below.

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=SLT7SZ2XFNEUQ)