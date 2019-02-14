import { LogLevel, Marker } from '../..';
import { Log, LogMarker } from '../log';

export class TestLoggerClass {

    @LogMarker(Marker.getMarker('foobar'))
    @Log(LogLevel.ERROR, 'This is an error')
    public errorFunction(opt1: string) {
        console.dir(`My output is ${opt1}`);
    }

}
