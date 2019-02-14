import { getLogger, LogLevel, Marker, Method } from '../';

import 'reflect-metadata';

const logMarker = Symbol('logMarker');

/**
 * Sets the marker for the @Log decorator
 *
 * @constructor
 *
 * @param {Marker} marker
 */
export function LogMarker<T>(marker: Marker): Function {
    return (target: Method<T>, key: string) => {
        Reflect.defineMetadata(logMarker, marker, target, key);
    };
}

/**
 * Log an error on function entry
 *
 * @constructor
 *
 * @param {LogLevel} level
 * @param {string} message
 * @param {any[]} options
 *
 * @returns {Function}
 */
export function Log<T>(level: LogLevel, message: string, ...options: any[]): Function {
    return (target: Method<T>, key: string, descriptor: TypedPropertyDescriptor<Function>) => {

        const originalMethod = descriptor.value;
        descriptor.value = function (...args: any[]) {

            const marker = Reflect.getOwnMetadata(logMarker, target, key);

            const logger = getLogger(target);
            if (marker) {
                logger.log(level, marker, message, ...options);
            } else {
                logger.log(level, message, ...options);
            }

            return originalMethod.call(this, args);

        };

        return descriptor;

    };
}
