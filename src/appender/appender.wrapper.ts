import IAppenderConfiguration from '../config/appender.config';
import { Newable } from '../def';
import { getFilter } from '../filter';
import { LogFilter } from '../filter/log.filter';
import { LogFilterAction } from '../filter/log.filter.action';
import { ILogEvent } from '../log.event';
import { LogAppender } from './log.appender';

interface IFilterRegister<T> {
    filter: LogFilter<T>;
    config: T;
    onMatch: LogFilterAction;
    onMismatch: LogFilterAction;
}

export class AppenderWrapper {

    private readonly _appender: LogAppender<any>;
    private readonly _isPassThrough: boolean;
    private readonly _filters: Array<IFilterRegister<any>>;

    constructor(appender: Newable<LogAppender<any>>, private readonly _config: IAppenderConfiguration) {

        this._appender = new (appender as any)(_config.config);

        this._isPassThrough = (!_config || !_config.filters || _config.filters.length === 0);
        if (!this._isPassThrough) {

            this._filters = _config.filters.map((filter) => ({
                filter: new (getFilter(filter.filter as string) as any)(filter.config),
                config: filter.config,
                onMatch: filter.onMatch,
                onMismatch: filter.onMismatch
            }));

        } else {
            this._filters = [];
        }

    }

    public get appender() {
        return this._appender;
    }

    public append(event: ILogEvent) {
        if (this.isMatch(event)) {
            this._appender.append(event);
        }
    }

    public isMatch(event: ILogEvent): boolean {
        return this._isPassThrough || this._isMatch(event);
    }

    private _isMatch(event: ILogEvent): boolean {

        let item: IFilterRegister<any>;
        const count = this._filters.length;
        for (let i = 0; i < count; i++) {

            item = this._filters[i];
            if (!item.filter.isMatch(event)) {
                if (item.onMismatch === LogFilterAction.DENY) {
                    return false;
                } else if (item.onMismatch === LogFilterAction.ALLOW) {
                    return true;
                }
            } else {
                if (item.onMatch === LogFilterAction.DENY) {
                    return false;
                } else if (item.onMatch === LogFilterAction.ALLOW) {
                    return true;
                }
            }

        }

        return true;

    }

}
