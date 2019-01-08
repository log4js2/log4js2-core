import { Filter } from '../decorator/filter';
import { ILogEvent } from '../log.event';
import { Marker } from '../marker';
import { LogFilter } from './log.filter';

export interface IMarkerFilterConfiguration {
    marker: string;
}

@Filter('Marker')
export class MarkerFilter extends LogFilter<IMarkerFilterConfiguration> {

    /**
     * Checks to see if the marker matches the filter configuration
     *
     * @param {ILogEvent} logEvent
     */
    public isMatch(logEvent?: ILogEvent): boolean {

        if (!logEvent.marker) {
            return false;
        } else {
            return logEvent.marker.name === this.configuration.marker || this._isParentMarkerMatch(logEvent.marker);
        }

    }

    /**
     * Checks if the parent markers match the filter criteria
     *
     * @private
     *
     * @param {Marker} marker
     * @return {boolean}
     */
    private _isParentMarkerMatch(marker: Marker): boolean {
        if (!marker.hasParents()) {
            return false;
        } else {
            return marker.getParents().every((parent) =>
                (parent.name === this.configuration.marker || this._isParentMarkerMatch(parent))
            );
        }
    }

}
