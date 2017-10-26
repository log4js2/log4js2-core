export default class Marker {

    private static _markers: { [key: string]: Marker; } = {};

    private _parents: WeakSet<Marker> = null;
    private _name: string;

    /**
     * Hide the constructor. We don't want people to arbitrarily make these without access to Marker#getMarker
     * @param {string} name
     */
    private constructor(name: string) {
        this._name = name;
    }

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

        let result = [];
        for (let marker in this._parents) {
            result.push(marker);
        }

        return result;

    }

    /**
     * Returns whether or not the marker has parents
     * @returns {boolean}
     */
    public hasParents(): boolean {
        return this._parents instanceof Array;
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

        this._parents = new WeakSet();

        let index = markers.length;
        while (index--) {
            this._parents.add(markers[index]);
        }

    }

}