import { Marker } from '../../marker';
import { LogFilterAction } from '../log.filter.action';
import { MarkerFilter } from '../marker.filter';

describe('MarkerFilter', () => {

    const child = Marker.getMarker('child');
    const parent = Marker.getMarker('parent').setParents(child);

    test('child', () => {

        const markerFilter = new MarkerFilter({
            onMatch: LogFilterAction.ALLOW,
            onMismatch: LogFilterAction.DENY,
            marker: 'child'
        });

        expect(markerFilter.isMatch({
            marker: parent
        })).toEqual(true);

        expect(markerFilter.isMatch({
            marker: Marker.getMarker('oogieboogie')
        })).toEqual(false);

    });

    test('parent', () => {

        const markerFilter = new MarkerFilter({
            onMatch: LogFilterAction.ALLOW,
            onMismatch: LogFilterAction.DENY,
            marker: 'parent'
        });

        expect(markerFilter.isMatch({
            marker: parent
        })).toEqual(true);

    });

});
