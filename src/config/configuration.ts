import { LogLevel, Newable } from '..';
import { LogAppender } from '..';
import IAppenderConfiguration from './appender.config';
import ILoggerConfiguration from './logger.config';

export type AppenderConfigurationItem = Newable<LogAppender<any>> | IAppenderConfiguration | string;

export default interface IConfiguration {

    level?: LogLevel;
    appenders?: AppenderConfigurationItem[] | string[];
    loggers?: ILoggerConfiguration[];
    layout?: string;
    virtualConsole?: boolean;

}
