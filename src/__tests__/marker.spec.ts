import { Marker } from '../marker';

describe('Marker', () => {

    test('test', () => {

        const parent = Marker.getMarker('parent');
        const child = Marker.getMarker('child').setParents(parent);

        expect(parent).toBeDefined();
        expect(parent.name).toEqual('parent');
        expect(parent.hasParents()).toBe(false);
        expect(parent.getParents()).toHaveLength(0);
        expect(Marker.getMarker('parent')).toBe(parent);

        expect(child).toBeDefined();
        expect(child.name).toEqual('child');
        expect(child.hasParents()).toBe(true);
        expect(child.getParents()).toHaveLength(1);
        expect(child.getParents()[0]).toBe(parent);
        expect(Marker.getMarker('child')).toBe(child);

        child.remove(parent);

        expect(child.hasParents()).toBe(false);

    });

});
