import {LogLevel} from "../const/logLevel";
export class AppenderConfiguration {

    appender: Function|string;
    level: LogLevel;

    constructor(appender: Function, level: LogLevel) {
        this.appender = appender;
        this.level = level;
    }

}