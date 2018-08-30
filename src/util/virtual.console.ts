import { Logger } from '..';

let virtualConsole: Console;

export const getVirtualConsole = (logger?: Logger) => {

    class Log4JConsole implements Console {

        public Console: NodeJS.ConsoleConstructor;

        public memory: any = {};

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

        public debug(message?: any, ...optionalParams: any[]): void {
            logger.debug(message, ...optionalParams);
        }

        public error(message?: any, ...optionalParams: any[]): void {
            logger.error(message, ...optionalParams);
        }

        public exception(message?: string, ...optionalParams: any[]): void {
            logger.error(message, ...optionalParams);
        }

        public info(message?: any, ...optionalParams: any[]): void {
            logger.info(message, ...optionalParams);
        }

        public log(message?: any, ...optionalParams: any[]): void {
            logger.debug(message, ...optionalParams);
        }

        public trace(message?: any, ...optionalParams: any[]): void {
            logger.trace(message, ...optionalParams);
        }

        public warn(message?: any, ...optionalParams: any[]): void {
            logger.warn(message, ...optionalParams);
        }

    }

    if (!virtualConsole) {
        virtualConsole = console;
        console = new Log4JConsole();
    }

    return virtualConsole;

};
