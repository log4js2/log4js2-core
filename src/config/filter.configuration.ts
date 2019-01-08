import { LogFilter, LogFilterAction } from '..';
import { Newable } from '../def';

export interface IFilterConfiguration<C, T extends LogFilter<C> = LogFilter<C>> {

    filter: Newable<T> | string;
    config: C;
    onMatch: LogFilterAction;
    onMismatch: LogFilterAction;

}
