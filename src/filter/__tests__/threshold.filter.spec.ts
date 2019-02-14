import { ThresholdFilter } from '../../';
import { LogLevel } from '../../const/log.level';

describe('ThresholdFilter', () => {

    test('level', () => {

        const thresholdFilter = new ThresholdFilter({
            level: LogLevel.FATAL
        });

        expect(thresholdFilter.isMatch({
            level: LogLevel.INFO
        })).toEqual(false);

        expect(thresholdFilter.isMatch({
            level: LogLevel.FATAL
        })).toEqual(true);

    });

});
