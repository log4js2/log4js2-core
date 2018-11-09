import { configure } from '../../';
import { getVirtualConsole } from '../virtual.console';

describe('Virtual Console', () => {

    test('execute console logs', () => {

        configure({
            appenders: ['Console']
        });

        const virtualConsole = getVirtualConsole();

        expect(virtualConsole).toBeDefined();
        expect((console as any).isVirtual).toBe(true);

        console.dir('test');
        console.dirxml('test');
        console.error('');
        console.info('');
        console.log('');
        console.debug('');
        console.warn('');
        console.count();
        console.clear();
        console.assert();
        console.time();
        console.timelineEnd();
        console.timeStamp();
        console.timeEnd();
        console.timeline();
        console.trace('');
        console.exception();
        console.group();
        console.groupCollapsed();
        console.groupEnd();
        console.markTimeline();
        console.profile();
        console.profileEnd();
        console.table();
        console.countReset();
        console.timeLog('');

    });

});
