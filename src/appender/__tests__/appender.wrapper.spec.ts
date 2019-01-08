import { LogFilterAction, Marker } from '../..';
import { AppenderWrapper } from '../appender.wrapper';
import { ConsoleAppender } from '../console.appender';

describe('AppenderWrapper', () => {

    test('filter', () => {

        const sqlMarker = Marker.getMarker('sql');
        const saveMarker = Marker.getMarker('save').setParents(sqlMarker);
        const updateMarker = Marker.getMarker('update').setParents(sqlMarker);

        const wrapper = new AppenderWrapper(ConsoleAppender, {
            appender: ConsoleAppender,
            filters: [{
                filter: 'Marker',
                config: {
                    marker: 'sql'
                },
                onMismatch: LogFilterAction.DENY,
                onMatch: LogFilterAction.NEUTRAL
            }, {
                filter: 'Marker',
                config: {
                    marker: 'update'
                },
                onMismatch: LogFilterAction.NEUTRAL,
                onMatch: LogFilterAction.DENY
            }, {
                filter: 'Marker',
                config: {
                    marker: 'save'
                },
                onMismatch: LogFilterAction.NEUTRAL,
                onMatch: LogFilterAction.ALLOW
            }]
        });

        expect(wrapper.isMatch({
            marker: saveMarker,
            message: ''
        })).toBe(true);

        expect(wrapper.isMatch({
            marker: updateMarker,
            message: ''
        })).toBe(false);

        expect(wrapper.isMatch({
            marker: sqlMarker,
            message: ''
        })).toBe(true);

    });

});
