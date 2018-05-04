import Logger from "./logger";

export default class AsyncLogger extends Logger {

    public async error() {
        await super.error();
    }

    public async warn() {
        await super.warn();
    }

    public async info() {
        await super.info();
    }

    public async debug() {
        await super.debug();
    }

    public async trace() {
        await super.trace();
    }

}
