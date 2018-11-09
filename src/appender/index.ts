import IAppenderConfiguration from '../config/appender.config';
import { Newable } from '../def';
import { getFunctionName } from '../util/utility';
import { AppenderWrapper } from './appender.wrapper';
import { LogAppender } from './log.appender';

const _appenderMethods: Set<FunctionProps<LogAppender<any>>> = new Set<FunctionProps<LogAppender<any>>>();
_appenderMethods.add('append');
_appenderMethods.add('isActive');
_appenderMethods.add('setLogLevel');
_appenderMethods.add('setLayout');
_appenderMethods.add('getLayout');
_appenderMethods.add('format');

const _appenders: Map<string, Newable<LogAppender<any>>> = new Map<string, Newable<LogAppender<any>>>();
const _registeredLoggerAppenders: Map<string, IAppenderConfiguration> = new Map<string, IAppenderConfiguration>();

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
    const appenderObj: LogAppender<C> = new (appender as any)();

    // ensure that the appender methods are present (and are functions)
    _appenderMethods.forEach((element) => {
        if (!(appenderObj as any)[element] || !((appenderObj as any)[element] instanceof Function)) {
            throw new Error(`Invalid appender: missing/invalid method: ${element}`);
        }
    });

};

export const getAppenderName = (appender: Newable<LogAppender<any>>) => appender.name || getFunctionName(appender as any);

/**
 * Adds an appender to the appender queue
 *
 * @function
 *
 * @param {LogAppender} appender
 * @param {string} name
 */
export const addAppender = <C, T extends LogAppender<C>>(appender: Newable<T>, name?: string): Newable<T> => {

    _validateAppender(appender);

    const appenderName = name || getAppenderName(appender);

    // only put the appender into the set if it doesn't exist already
    if (!_appenders.has(appenderName)) {
        _appenders.set(appenderName, appender);
    }

    return appender;

};

/**
 * Registers an appender
 *
 * @param {Newable} appender
 */
export const registerAppender = <C, T extends LogAppender<C>>(appender: Newable<T>): Newable<T> => {

    const name = getAppenderName(appender);
    if (_appenders.has(name)) {
        addAppender(appender);
    }

    _appenders.set(name, appender);

    return appender;

};

/**
 * Gets the appender with the specified name
 *
 * @param name
 */
export const getAppender = (name: string): Newable<LogAppender<any>> => _appenders.get(name);

/**
 * Gets the appender instances. If the appenders parameter is set, then it will only fetch those within the array, otherwise return all
 *
 * @param {string[]} appenders
 */
export const getLoggerAppenderInstances = (appenders?: string[]): AppenderWrapper[] => {

    if (appenders && appenders.length > 0) {

        return appenders.map((value) => {

            if (_registeredLoggerAppenders.has(value)) {
                const appenderConfig = _registeredLoggerAppenders.get(value);
                return new AppenderWrapper(appenderConfig.appender as Newable<LogAppender<any>>, appenderConfig.config);
            }

            throw new Error(`Invalid appender reference '${value}'`);

        });

    } else {

        const result: AppenderWrapper[] = [];
        _registeredLoggerAppenders.forEach((appenderConfig) =>
            result.push(new AppenderWrapper(appenderConfig.appender as Newable<LogAppender<any>>, appenderConfig.config))
        );

        return result;

    }

};

/**
 * Sets the appender configuration for a specified appender name
 *
 * @param {string} appenderName
 * @param {IAppenderConfiguration} config
 */
export const setLoggerAppenderConfig = (appenderName: string, config: IAppenderConfiguration) => {
    _registeredLoggerAppenders.set(appenderName, config);
};
