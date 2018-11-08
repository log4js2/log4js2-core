import { Newable } from '../def';
import { LogAppender } from './log.appender';

const _appenderMethods: Set<FunctionProps<LogAppender<any>>> = new Set<FunctionProps<LogAppender<any>>>();
_appenderMethods.add('append');
_appenderMethods.add('isActive');
_appenderMethods.add('setLogLevel');
_appenderMethods.add('setLayout');
_appenderMethods.add('getLayout');
_appenderMethods.add('format');

const _appenders: Map<string, Newable<LogAppender<any>>> = new Map<string, Newable<LogAppender<any>>>();
const _registeredAppenders: Map<string, Newable<LogAppender<any>>> = new Map<string, Newable<LogAppender<any>>>();
const _appenderConfigs: Map<string, any> = new Map<string, any>();

/**
 * Validates that the appender
 *
 * @private
 * @function
 *
 * @params {APPENDER} appender
 * @throws {Error} if the appender is invalid
 */
const _validateAppender = <C, T extends LogAppender<C>>(appender: Newable<T>) => {

    // if we are running ES6, we can make sure it extends LogAppender
    // otherwise, it must be a function
    if (!(appender instanceof LogAppender)) {
        return;
    }

    // instantiate the appender function
    const appenderObj: LogAppender<C> = new (appender as any)(_appenderConfigs.get((appender as any).appenderName || appender.name));

    // ensure that the appender methods are present (and are functions)
    _appenderMethods.forEach((element) => {
        if (!(appenderObj as any)[element] || !((appenderObj as any)[element] instanceof Function)) {
            throw new Error(`Invalid appender: missing/invalid method: ${element}`);
        }
    });

};

export const getAppenderName = (appender: Newable<LogAppender<any>>) => (appender as any).appenderName || appender.name;

/**
 * Adds an appender to the appender queue
 *
 * @function
 *
 * @params {LogAppender} appender
 */
export const addAppender = <C, T extends LogAppender<C>>(appender: Newable<T>): Newable<T> => {

    _validateAppender(appender);

    const appenderName = getAppenderName(appender);

    // only put the appender into the set if it doesn't exist already
    if (!_appenders.has(appenderName)) {
        _appenders.set(appenderName, appender);
    }

    return appender;

};

export const registerAppender = <C, T extends LogAppender<C>>(appender: Newable<T>): Newable<T> => {

    const name = getAppenderName(appender);
    if (_appenders.has(name)) {
        addAppender(appender);
    }

    _registeredAppenders.set(name, appender);

    return appender;

};

export const getAppender = (name: string): Newable<LogAppender<any>> => _appenders.get(name);

export const getAppenderInstances = (): Array<LogAppender<any>> => {

    const result: Array<LogAppender<any>> = [];
    _registeredAppenders.forEach((value, key) =>
        result.push(new (value as any)(_appenderConfigs.get(key)))
    );

    return result;

};

export const setAppenderConfig = <C extends {}>(appender: string, config: C) => {
    _appenderConfigs.set(appender, config);
};
