import { LogAppender, LogFilter, Newable } from '..';
import { LogLevel } from '..';
import { IFilterConfiguration } from './filter.configuration';

export default interface IAppenderConfiguration<C = any, T extends LogAppender<C> = LogAppender<C>> {

    appender: Newable<T> | string;
    config?: any;
    filters?: Array<IFilterConfiguration<any, LogFilter<any>>>;
    level?: LogLevel | number;
    patternLayout?: string;

}
