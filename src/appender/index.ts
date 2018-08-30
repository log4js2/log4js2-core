import LogAppender from "./log.appender";

const _appenderMethods: Set<FunctionProps<LogAppender>> = new Set<FunctionProps<LogAppender>>();
_appenderMethods.add('append');
_appenderMethods.add('isActive');
_appenderMethods.add('setLogLevel');
_appenderMethods.add('setLayout');
_appenderMethods.add('getLayout');
_appenderMethods.add('format');

/** @type {Object} */
const _appenders: Map<string, Newable<LogAppender>> = new Map<string, Newable<LogAppender>>();

/**
 * Adds an appender to the appender queue
 *
 * @function
 *
 * @params {LogAppender} appender
 */
export const addAppender = <T extends LogAppender>(appender: Newable<T>, name?: string) => {

    _validateAppender(appender);

    const appenderName = name || (appender as any).appenderName || appender;

    // only put the appender into the set if it doesn't exist already
    if (!_appenders.has(appenderName)) {
        _appenders.set(appenderName, appender);
    }

};

/**
 * Validates that the appender
 *
 * @private
 * @function
 *
 * @params {APPENDER} appender
 * @throws {Error} if the appender is invalid
 */
const _validateAppender = <T extends LogAppender>(appender: Newable<T>) => {

    // if we are running ES6, we can make sure it extends LogAppender
    // otherwise, it must be a function
    if (!(appender instanceof LogAppender)) {
        return;
    }

    // instantiate the appender function
    const appenderObj: LogAppender = new (appender as any)();

    // ensure that the appender methods are present (and are functions)
    ['append', 'isActive', 'setLogLevel', 'setLayout'].forEach((element) => {
        if (!(appenderObj as any)[element] || !((appenderObj as any)[element] instanceof Function)) {
            throw new Error(`Invalid appender: missing/invalid method: ${element}`);
        }
    });

};

export const getAppender = (name: string): Newable<LogAppender> => _appenders.get(name);

export const getAppenders = (): Map<string, Newable<LogAppender>> => _appenders;
