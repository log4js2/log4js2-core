import LogAppender from "../appender/log.appender";
import {LogLevel} from "../const/log.level";
import PatternLayout from "./pattern.layout";

export default interface IAppenderConfiguration<T extends LogAppender> {

    appender: Newable<T> | string;
    level?: LogLevel | number;
    patternLayout?: PatternLayout | string;

}
