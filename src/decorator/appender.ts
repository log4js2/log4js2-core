import LogAppender from "../appender/appender";
import {addAppender} from "../log4js";

/**
 *
 * @param {string} name
 * @returns {(target: Newable<LogAppender>) => void}
 * @constructor
 */
export function Appender(name?: string) {
    return (target: Newable<LogAppender>) => {
        addAppender(target, name);
        return target;
    };
}
