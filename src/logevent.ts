import {LogLevel} from "./const/logLevel";
export class LogEvent {

    date: Date;
    error: Error;
    logErrorStack: Error;
    file: string;
    filename: string;
    level: LogLevel;
    lineNumber: string;
    column: string;
    logger: string;
    message: string;
    method: Function;
    properties: Map<string, any>;
    relative: number;
    sequence: number;

}