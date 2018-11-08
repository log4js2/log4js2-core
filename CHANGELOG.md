# Changelog

log4js2 follows a semantic versioning. If there seems to be a missing note on some change, or you have a question on 
migrating from an older version, feel free to ask us and the community.

## 2.0.0

__BREAKING CHANGES__

- project rewritten using TypeScript
- `configure()` parameter updated to include new features. See documentation for details
- `registerAppender` method removed and replaced with `@Appender` decorator
- `Marker` added for log events
- `VirtualConsole` created to intercept non-log4js2 logs
- `RollingFileAppender` and `FileAppender` added
- `%marker`, `%markerSimpleName` added to pattern layout tags
- `LogFilterAction`, `LogFilter`, `MarkerFilter` added for appender filtering. `filters` attribute added to appender configuration
- `@Filter` decorator added
- appenders can now be configured with `name` attribute
- removed `AsyncLogger`