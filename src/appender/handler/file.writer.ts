const FS = 'fs';
const PATH = 'path';

export abstract class FileWriter {

    public static fs = require(`${FS}`);
    public static path = require(`${PATH}`);

    public static createDirectories(dir: string) {

        const separator = FileWriter.path.sep;
        const initDirectory = FileWriter.path.isAbsolute(dir) ? separator : '';
        const baseDirectory = '.';

        return dir.split(separator).reduce((parentDir, childDir) => {

            const currentDirectory = FileWriter.path.resolve(baseDirectory, parentDir, childDir);
            try {
                FileWriter.fs.mkdirSync(currentDirectory);
            } catch (err) {
                if (err.code === 'EEXIST') {
                    return currentDirectory;
                }

                if (err.code === 'ENOENT') {
                    throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`);
                }

                const caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;
                if (!caughtErr || caughtErr && currentDirectory === FileWriter.path.resolve(dir)) {
                    throw err; // Throw if it's just the last created dir.
                }
            }

            return currentDirectory;
        }, initDirectory);
    }

    protected _logFile: NodeJS.WriteStream;

    protected _appendToFile(messages: string[]): number {

        let size = 0;

        this._logFile.cork();

        messages.forEach((message) => {
            size += Buffer.byteLength(message);
            this._logFile.write(message + '\n');
        });

        process.nextTick(() => this._logFile.uncork());

        return size;

    }

    protected _createStream(fileName: string): NodeJS.WriteStream {
        return FileWriter.fs.createWriteStream(fileName, {
            autoClose: true,
            encoding: 'utf8',
            flags: 'w+'
        });
    }

}
