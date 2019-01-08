import { ILogEvent } from '../log.event';

export abstract class LogFilter<C> {

    constructor(protected readonly configuration: C) { }

    /**
     * Checks if the log event matches the filter configuration
     * @param {ILogEvent} logEvent
     */
    public abstract isMatch(logEvent?: ILogEvent): boolean;

}
