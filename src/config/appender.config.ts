import { LogAppender, Newable } from '..';
import { LogLevel } from '..';

export default interface IAppenderConfiguration<T extends LogAppender> {

    appender: Newable<T> | string;
    level?: LogLevel | number;
    patternLayout?: string;

}
