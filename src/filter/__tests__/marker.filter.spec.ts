import { Marker } from '../../marker';
import { MarkerFilter } from '../marker.filter';

describe('MarkerFilter', () => {

    const child = Marker.getMarker('child');
    const parent = Marker.getMarker('parent').setParents(child);

    test('child', () => {

        const markerFilter = new MarkerFilter({
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
            marker: 'parent'
        });

        expect(markerFilter.isMatch({
            marker: parent
        })).toEqual(true);

    });

});
