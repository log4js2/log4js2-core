import { ILogFilterConfiguration, LogFilter } from '..';
import { Newable } from '../def';

export interface IFilterConfiguration<C extends ILogFilterConfiguration, T extends LogFilter<C> = LogFilter<C>> {

    filter: Newable<T> | string;
    config: C;

}
