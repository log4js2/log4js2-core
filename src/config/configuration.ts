import { LogLevel } from '..';
import { LogAppender } from '..';
import IAppenderConfiguration from './appender.config';
import ILoggerConfiguration from './logger.config';

export default interface IConfiguration {

    level?: LogLevel;
    appenders?: Array<IAppenderConfiguration<LogAppender>> | string[];
    loggers?: ILoggerConfiguration[];
    patternLayout?: string;
    virtualConsole?: boolean;

}
