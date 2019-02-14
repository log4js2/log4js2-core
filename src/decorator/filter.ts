import { Newable } from '../def';
import { addFilter } from '../filter';
import { LogFilter } from '../filter/log.filter';

/**
 * @returns {(target: Newable<LogAppender>) => void}
 * @constructor
 */
export function Filter<T extends LogFilter<any>>(name: string): Function {
    return (target: Newable<T>) => {
        addFilter(target, name);
        return target;
    };
}
