# log4js
A fast, JavaScript logger that is designed to mirror Apache's Log4j 2. Currently, this project is in the early, alpha stage.

## Configuration

Place the log4js distirbution in your HTML ```<head>``` tag.

```html
<script type="text/javascript" src="log4js.min.js"></script>
```

Configure your log4js.

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
var log = log4js.getLogger('myLogger');
log.info("This is a log');
```