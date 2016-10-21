import {format} from '../formatter';

export class LogAppender {

    /**
     *
     * @returns {null}
     */
    static get name() {
        return null;
    }

    /**
     *
     * @param logEvent
     */
    append(logEvent) {

    }

    getLogLevel() {
        return this.logLevel;
    }

    /**
     *
     * @param {number} logLevel
     */
    setLogLevel(logLevel) {
        this.logLevel = logLevel;
    }

    /**
     *
     * @param layout
     */
    setLayout(layout) {
        this.layout = layout;
    }

    getLayout() {
        return this.layout;
    }

    /**
     *
     * @param logEvent
     */
    format(logEvent) {
        return format(this.getLayout(), logEvent);
    }

}
