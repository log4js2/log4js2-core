import { LogLevel } from './const/log.level';
import { Method } from './def';
import Marker from './marker';

export interface ILogEvent {

    date?: Date;
    error?: Error;
    logErrorStack?: Error;
    file?: string;
    filename?: string;
    level?: LogLevel;
    lineNumber?: string | number;
    column?: string;
    logger?: string;
    marker?: Marker;
    message?: string;
    // tslint:disable-next-line:ban-types
    method?: Method<any> | Function | 0;
    properties?: { [key: string]: any };
    relative?: number;
    sequence?: number;

}
