import { Logger } from '..';

let _virtualConsole: Console;
let _isUseVirtualConsole = true;

export const useVirtualConsole = (state: boolean) => {
    _isUseVirtualConsole = state;
};

export const getVirtualConsole = (logger?: Logger) => {

    if (!_isUseVirtualConsole) {
        return console;
    }

    class Log4JConsole implements Console {

        public readonly isVirtual = true;

        public Console: NodeJS.ConsoleConstructor;

        public memory: any = {};

        public assert(condition?: boolean, message?: string, ...data: any[]): void;
        public assert(value: any, message?: string, ...optionalParams: any[]): void;
        public assert(condition?: boolean | any, message?: string, ...data: any[]): void {
            _virtualConsole.assert.call(arguments);
        }

        public clear(): void {
            _virtualConsole.clear();
        }

        public count(label?: string): void {
            _virtualConsole.count(label);
        }

        public dir(value?: any, ...optionalParams: any[]): void;
        public dir(obj: any, options?: NodeJS.InspectOptions): void;
        public dir(value?: any, ...optionalParams: Array<any | NodeJS.InspectOptions>): void {
            _virtualConsole.dir.call(arguments);
        }

        public dirxml(value: any): void {
            _virtualConsole.dirxml(value);
        }

        public group(groupTitle?: string, ...optionalParams: any[]): void {
            _virtualConsole.group(groupTitle, ...optionalParams);
        }

        public groupCollapsed(groupTitle?: string, ...optionalParams: any[]): void {
            _virtualConsole.groupCollapsed(groupTitle, ...optionalParams);
        }

        public groupEnd(): void {
            _virtualConsole.groupEnd();
        }

        public markTimeline(label?: string): void {
            if (typeof _virtualConsole.markTimeline === 'function') {
                _virtualConsole.markTimeline(label);
            }
        }

        public msIsIndependentlyComposed(element: Element): boolean {
            return false;
        }

        public profile(reportName?: string): void {
            if (typeof _virtualConsole.profile === 'function') {
                _virtualConsole.profile(reportName);
            }
        }

        public profileEnd(): void {
            if (typeof _virtualConsole.profileEnd === 'function') {
                _virtualConsole.profileEnd();
            }
        }

        public table(...tabularData: any[]): void {
            _virtualConsole.table(...tabularData);
        }

        public time(label?: string): void;
        public time(label: string): void;
        public time(label?: string): void {
            _virtualConsole.time(label);
        }

        public timeEnd(label?: string): void;
        public timeEnd(label: string): void;
        public timeEnd(label?: string): void {
            if (typeof _virtualConsole.timeEnd === 'function') {
                _virtualConsole.timeEnd(label);
            }
        }

        public timeStamp(label?: string): void {
            if (typeof _virtualConsole.timeStamp === 'function') {
                _virtualConsole.timeStamp(label);
            }
        }

        public timeline(label?: string): void {
            if (typeof _virtualConsole.timeline === 'function') {
                _virtualConsole.timeline(label);
            }
        }

        public timelineEnd(label?: string): void {
            if (typeof _virtualConsole.timelineEnd === 'function') {
                _virtualConsole.timelineEnd(label);
            }
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

        public countReset(label?: string): void {
            _virtualConsole.countReset(label);
        }

        public timeLog(label: string, ...data: any[]): void {
            _virtualConsole.timeLog(label, ...data);
        }

    }

    if (!_virtualConsole) {
        _virtualConsole = console;
        console = new Log4JConsole();
    }

    return _virtualConsole;

};
