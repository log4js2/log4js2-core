import {LoggerConfiguration} from "./logger.config";
import {AppenderConfiguration} from "./appender.config";

export class Configuration {

    allowAppenderInjection: boolean;
    appenders: AppenderConfiguration[]|string[];
    application: Object;
    loggers: LoggerConfiguration[];
    layout: string;

}