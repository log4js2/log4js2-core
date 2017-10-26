import {LogLevel} from "./const/logLevel";
import Marker from "./marker";

export default class LogEvent {

    date: Date;
    error: Error;
    logErrorStack: Error;
    file: string;
    filename: string;
    level: LogLevel;
    lineNumber: string;
    column: string;
    logger: string;
    marker: Marker;
    message: string;
    method: Function;
    properties: Map<string, any>;
    relative: number;
    sequence: number;

}