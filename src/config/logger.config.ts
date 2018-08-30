import { LogLevel } from '..';

export default interface ILoggerConfiguration {

    tag?: string;
    async?: boolean;
    level?: LogLevel | number;
    patternLayout?: string;

}
