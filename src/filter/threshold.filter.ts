import { LogLevel } from '../const/log.level';
import { Filter } from '../decorator/filter';
import { ILogEvent } from '../log.event';
import { LogFilter } from './log.filter';

export interface IThresholdFilterConfiguration {
    level: LogLevel;
}

@Filter('Threshold')
export class ThresholdFilter extends LogFilter<IThresholdFilterConfiguration> {

    public isMatch(logEvent?: ILogEvent): boolean {
        return logEvent.level <= this.configuration.level;
    }

}
