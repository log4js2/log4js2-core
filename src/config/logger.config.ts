import {LogLevel} from "../const/logLevel";
import PatternLayout from "./pattern.layout";

export default interface LoggerConfiguration {

    tag?: string,
    async?: Boolean;
    level?: LogLevel|number;
    patternLayout?: PatternLayout|string;

}