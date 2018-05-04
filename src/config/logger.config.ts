import {LogLevel} from "../const/log.level";
import PatternLayout from "./pattern.layout";

export default interface ILoggerConfiguration {

    tag?: string;
    async?: boolean;
    level?: LogLevel|number;
    patternLayout?: PatternLayout|string;

}
