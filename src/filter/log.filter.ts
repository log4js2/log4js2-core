import { ILogEvent } from '../log.event';
import { LogFilterAction } from './log.filter.action';

export interface ILogFilterConfiguration {

    onMatch: LogFilterAction;
    onMismatch: LogFilterAction;

}

export abstract class LogFilter<C extends ILogFilterConfiguration> {

    constructor(protected readonly configuration: C) { }

    /**
     * Checks if the log event matches the filter configuration
     * @param {ILogEvent} logEvent
     */
    public abstract isMatch(logEvent?: ILogEvent): boolean;

}
