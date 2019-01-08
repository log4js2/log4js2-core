import { LogLevel } from '..';

export default interface ILoggerConfiguration {

    appenders?: string[];
    level?: LogLevel | number;
    layout?: string;
    tag?: string;

}
