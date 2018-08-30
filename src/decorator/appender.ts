import { LogAppender, Newable } from '..';
import { addAppender } from '../appender';

/**
 *
 * @param {string} name
 * @returns {(target: Newable<LogAppender>) => void}
 * @constructor
 */
export function Appender<T extends LogAppender>(name?: string): Function {
    return (target: Newable<T>) => {
        addAppender(target, name);
        return target;
    };
}
