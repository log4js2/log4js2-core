import LogAppender from "../appender/appender";
import {LogLevel} from "../const/log.level";
import PatternLayout from "./pattern.layout";

export default interface IAppenderConfiguration {

    appender: Newable<typeof LogAppender> | string;
    level?: LogLevel | number;
    patternLayout?: PatternLayout | string;

}
