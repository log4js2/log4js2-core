import { LogAppender, Newable } from '..';
import { LogLevel } from '..';

export default interface IAppenderConfiguration<T extends LogAppender = LogAppender> {

    appender: Newable<T> | string;
    config?: any;
    level?: LogLevel | number;
    patternLayout?: string;

}
