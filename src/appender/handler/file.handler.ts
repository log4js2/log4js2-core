import { throttle } from 'lodash';
import { IFileAppenderConfig } from '../file.appender';
import { FileWriter } from './file.writer';

export class FileHandler extends FileWriter {

    private readonly _throttledFunction: any;

    private _inProcess: boolean = false;
    private _queue: string[] = [];

    constructor(private _config: IFileAppenderConfig) {

        super();

        const directory = FileWriter.path.dirname(this._config.fileName);

        if (!FileWriter.fs.existsSync(directory)) {
            FileWriter.createDirectories(directory);
        }

        this._logFile = this._createStream(_config.fileName);

        this._throttledFunction = throttle(() => {
            if (!this._inProcess) {
                this._appendFromQueue();
            }
        }, 100);

        process.on('beforeExit', () => {
            this._appendFromQueue(true);
        });

    }

    public append(message: string) {
        this._queue.push(message);
        this._throttledFunction();
    }

    private _appendFromQueue(forceEnd: boolean = false) {

        this._inProcess = true;

        this._appendToFile([
            ...this._queue.splice(0)
        ]);

        if (forceEnd) {
            this._logFile.end(() => {
                this._inProcess = false;
            });
        } else {
            this._inProcess = false;
        }

    }

}
