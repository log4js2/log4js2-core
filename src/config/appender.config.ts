import PatternLayout from "./pattern.layout";
import {LogLevel} from "../const/log.level";
import LogAppender from "../appender/appender";

export default interface IAppenderConfiguration {

    appender: Newable<typeof LogAppender> | string;
    level?: LogLevel | number;
    patternLayout?: PatternLayout | string;

}
