import {LogLevel} from "../const/logLevel";
import PatternLayout from "../config/pattern.layout";

export default interface AppenderConfiguration {

    appender: Function|string;
    level?: LogLevel|number;
    patternLayout?: PatternLayout|string;

}