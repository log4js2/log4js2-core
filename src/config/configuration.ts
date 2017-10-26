import AppenderConfiguration from "../appender/appender.config";
import LoggerConfiguration from "./logger.config";
import PatternLayout from "./pattern.layout";

export default interface Configuration {

    appenders: AppenderConfiguration[] | string[];
    loggers: LoggerConfiguration[];
    patternLayout: PatternLayout | string;

}