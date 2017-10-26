/**
 * Annotates an appender
 * @constructor
 * @param config {AppenderConfig} - the configuration for the appender
 */
export function Appender(config?: AppenderConfig) {
    return function (target: Function) {
        // TODO: Need to add appender not from index function
        // addAppender(target);
    }
}

interface AppenderConfig {
    name?: string;
}