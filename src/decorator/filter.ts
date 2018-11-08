import { LogAppender, Newable } from '..';
import { addFilter } from '../filter';

/**
 * @returns {(target: Newable<LogAppender>) => void}
 * @constructor
 */
export function Filter<T extends LogAppender<any>>(name: string): Function {
    return (target: Newable<T>) => {
        addFilter(target, name);
        return target;
    };
}
