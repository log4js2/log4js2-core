import LogAppender from "../appender/appender";
import {addAppender} from "../log4js";

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
