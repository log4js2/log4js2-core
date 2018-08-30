import Logger from "../logger/logger";

let virtualConsole = console;

export const getVirtualConsole = (logger: Logger) => {

    class Log4JConsole implements Console {

        public Console: NodeJS.ConsoleConstructor;

        public memory: any = {};

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

        public assert(condition?: boolean, message?: string, ...data: any[]): void;
        public assert(value: any, message?: string, ...optionalParams: any[]): void;
        public assert(condition?: boolean | any, message?: string, ...data: any[]): void {
            virtualConsole.assert(...arguments);
        }

        public clear(): void {
            virtualConsole.clear();
        }

        public count(label?: string): void {
            virtualConsole.count(label);
        }

        public dir(value?: any, ...optionalParams: any[]): void;
        public dir(obj: any, options?: NodeJS.InspectOptions): void;
        public dir(value?: any, ...optionalParams: Array<any | NodeJS.InspectOptions>): void {
            virtualConsole.dir(...arguments);
        }

        public dirxml(value: any): void {
            virtualConsole.dirxml(value);
        }

        public group(groupTitle?: string, ...optionalParams: any[]): void {
            virtualConsole.group(groupTitle, ...optionalParams);
        }

        public groupCollapsed(groupTitle?: string, ...optionalParams: any[]): void {
            virtualConsole.groupCollapsed(groupTitle, ...optionalParams);
        }

        public groupEnd(): void {
            virtualConsole.groupEnd();
        }

        public markTimeline(label?: string): void {
            virtualConsole.markTimeline(label);
        }

        public msIsIndependentlyComposed(element: Element): boolean {
            return false;
        }

        public profile(reportName?: string): void {
            virtualConsole.profile(reportName);
        }

        public profileEnd(): void {
            virtualConsole.profileEnd();
        }

        public select(element: Element): void {
            virtualConsole.select(element);
        }

        public table(...tabularData: any[]): void {
            virtualConsole.table(...tabularData);
        }

        public time(label?: string): void;
        public time(label: string): void;
        public time(label?: string): void {
            virtualConsole.time(label);
        }

        public timeEnd(label?: string): void;
        public timeEnd(label: string): void;
        public timeEnd(label?: string): void {
            virtualConsole.timeEnd(label);
        }

        public timeStamp(label?: string): void {
            virtualConsole.timeStamp(label);
        }

        public timeline(label?: string): void {
            virtualConsole.timeline(label);
        }

        public timelineEnd(label?: string): void {
            virtualConsole.timelineEnd(label);
        }

    }

    if (!virtualConsole) {
        virtualConsole = console;
        console = new Log4JConsole();
    }

    return virtualConsole;

};
