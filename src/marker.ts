export default class Marker {

    /**
     * Gets the marker for the specified name
     * @param {string} name
     * @returns {Marker}
     */
    public static getMarker(name: string) {

        if (!Marker._markers.hasOwnProperty(name)) {
            Marker._markers[name] = new Marker(name);
        }

        return Marker._markers[name];

    }

    private static _markers: { [key: string]: Marker; } = {};

    private _parents: Set<Marker> = null;
    private _name: string;

    /**
     * Hide the constructor. We don't want people to arbitrarily make these without access to Marker#getMarker
     * @param {string} name
     */
    private constructor(name: string) {
        this._name = name;
    }

    /**
     * The name of the marker
     * @returns {string}
     */
    public get name() {
        return this._name;
    }

    /**
     * Gets the parents of the marker. This converts the WeakSet into an array
     * @returns {Marker[]}
     */
    public getParents(): Marker[] {

        if (this._parents === null) {
            return [];
        }

        const result: Marker[] = [];
        this._parents.forEach((marker) => result.push(marker));

        return result;

    }

    /**
     * Returns whether or not the marker has parents
     * @returns {boolean}
     */
    public hasParents(): boolean {
        return this._parents !== null;
    }

    /**
     * Removes the specified marker as a parent
     * @param {Marker} marker
     */
    public remove(marker: Marker) {
        this._parents.delete(marker);
    }

    /**
     * Sets the parent markers by replacing the current set
     * @param {Marker} markers
     */
    public setParents(...markers: Marker[]) {

        this._parents = new Set<Marker>();

        let index = markers.length;
        while (index--) {
            this._parents.add(markers[index]);
        }

    }

}
