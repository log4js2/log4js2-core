import IAppenderConfiguration from "../appender/appender.config";
import ILoggerConfiguration from "./logger.config";
import PatternLayout from "./pattern.layout";

export default interface IConfiguration {

    appenders?: IAppenderConfiguration[] | string[];
    loggers?: ILoggerConfiguration[];
    patternLayout?: PatternLayout | string;
    virtualConsole?: boolean;

}
