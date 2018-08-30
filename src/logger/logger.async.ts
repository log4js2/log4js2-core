import { Logger } from './logger';

export default class AsyncLogger extends Logger {

    public async error() {
        super.error();
    }

    public async warn() {
        super.warn();
    }

    public async info() {
        super.info();
    }

    public async debug() {
        super.debug();
    }

    public async trace() {
        super.trace();
    }

}
