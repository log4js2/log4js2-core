import { LogAppender, Newable } from '..';
import { LogLevel } from '..';

export default interface IAppenderConfiguration<C = any, T extends LogAppender<C> = LogAppender<C>> {

    appender: Newable<T> | string;
    config?: any;
    level?: LogLevel | number;
    patternLayout?: string;

}
