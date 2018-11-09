import { configure } from '../../';
import { getVirtualConsole } from '../virtual.console';

describe('Omit Virtual Console', () => {

    test('execute console logs', () => {

        configure({
            appenders: ['Console'],
            virtualConsole: false
        });

        const virtualConsole = getVirtualConsole();

        expect(virtualConsole).toBeDefined();
        expect((console as any).isVirtual).toBeUndefined();

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
        console.trace('');
        console.group();
        console.groupCollapsed();
        console.groupEnd();
        console.table();
        console.countReset();
        console.timeLog('');

    });

});
