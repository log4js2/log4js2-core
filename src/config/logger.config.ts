import {LogLevel} from "../const/logLevel";
export class LoggerConfiguration {

    level: LogLevel = LogLevel.ERROR;

    constructor(level: LogLevel) {
        this.level = level;
    }

}