import { LogFilter } from '..';
import { Newable } from '../def';

const _filterMethods: Set<FunctionProps<LogFilter<any>>> = new Set<FunctionProps<LogFilter<any>>>();
_filterMethods.add('isMatch');

const _filters: Map<string, Newable<LogFilter<any>>> = new Map<string, Newable<LogFilter<any>>>();

/**
 * Validates that the appender
 *
 * @private
 * @function
 *
 * @params {APPENDER} appender
 * @throws {Error} if the appender is invalid
 */
const _validateFilter = <C, T extends LogFilter<C>>(filter: Newable<T>) => {

    // if we are running ES6, we can make sure it extends LogAppender
    // otherwise, it must be a function
    if (!(filter instanceof LogFilter)) {
        return;
    }

    // instantiate the appender function
    const filterObj: LogFilter<C> = new (filter as any)();

    // ensure that the appender methods are present (and are functions)
    _filterMethods.forEach((element) => {
        if (!(filterObj as any)[element] || !((filterObj as any)[element] instanceof Function)) {
            throw new Error(`Invalid filter: missing/invalid method: ${element}`);
        }
    });

};

export const addFilter = <C, T extends LogFilter<C>>(filter: Newable<T>, name: string): Newable<T> => {

    _validateFilter(filter);

    // only put the appender into the set if it doesn't exist already
    if (!_filters.has(name)) {
        _filters.set(name, filter);
    }

    return filter;

};

export const getFilter = (name: string): Newable<LogFilter<any>> => _filters.get(name);
