import { LogAppender, Newable } from '..';
import { addAppender } from '../appender';

/**
 *
 * @returns {(target: Newable<LogAppender>) => void}
 * @constructor
 */
export function Appender<T extends LogAppender<any>>(): Function {
    return (target: Newable<T>) => {
        addAppender(target);
        return target;
    };
}
