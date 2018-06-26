import Logger from "../logger/logger";

let virtualConsole = console;

export const getVirtualConsole = (logger: Logger) => {

    class Log4JConsole extends Console {

        public debug() {
            logger.debug(arguments);
        }

        public error() {
            logger.error(arguments);
        }

        public exception() {
            logger.error(arguments);
        }

        public info() {
            logger.info(arguments);
        }

        public log() {
            logger.info(arguments);
        }

        public trace() {
            logger.debug(arguments);
        }

        public warn() {
            logger.warn(arguments);
        }

    }

    if (!virtualConsole) {
        virtualConsole = console;
        console = new Log4JConsole();
    }

    return virtualConsole;

};
