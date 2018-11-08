import { LogLevel } from '..';

export default interface ILoggerConfiguration {

    appenders?: string[];
    level?: LogLevel | number;
    patternLayout?: string;
    tag?: string;

}
