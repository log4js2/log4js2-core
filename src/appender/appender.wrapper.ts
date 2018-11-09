import IAppenderConfiguration from '../config/appender.config';
import { getFilter } from '../filter';
import { ILogFilterConfiguration, LogFilter } from '../filter/log.filter';
import { LogFilterAction } from '../filter/log.filter.action';
import { ILogEvent } from '../log.event';
import { LogAppender } from './log.appender';
import { Newable } from '../def';

interface IFilterRegister<T extends ILogFilterConfiguration> {
    filter: LogFilter<T>;
    config: T;
}

export class AppenderWrapper {

    private readonly _appender: LogAppender<any>;
    private readonly _isPassThrough: boolean;
    private readonly _filters: Array<IFilterRegister<any>>;

    constructor(appender: Newable<LogAppender<any>>, private readonly _config: IAppenderConfiguration) {

        this._appender = new (appender as any)(_config);

        this._isPassThrough = (!_config || !_config.filters || _config.filters.length === 0);
        if (!this._isPassThrough) {

            this._filters = _config.filters.map((filter) => ({
                filter: new (getFilter(filter.filter as string) as any)(filter.config),
                config: filter.config
            }));

        } else {
            this._filters = [];
        }

    }

    public get appender() {
        return this._appender;
    }

    public append(event: ILogEvent) {
        this._appender.append(event);
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
                if (item.config.onMismatch === LogFilterAction.DENY) {
                    return false;
                } else if (item.config.onMismatch === LogFilterAction.ALLOW) {
                    return true;
                }
            } else {
                if (item.config.onMatch === LogFilterAction.DENY) {
                    return false;
                } else if (item.config.onMatch === LogFilterAction.ALLOW) {
                    return true;
                }
            }

        }

        return true;

    }

}
