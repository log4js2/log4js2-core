import { LogLevel } from '../../const/log.level';
import { format } from '../formatter';

// tslint:disable:no-duplicate-string no-big-function
describe('formatter', () => {

    describe('date', () => {

        const date = new Date();
        date.setMonth(12);
        date.setDate(31);
        date.setFullYear(2016);
        date.setHours(13);
        date.setMinutes(30);
        date.setSeconds(15);
        date.setMilliseconds(500);

        test('format', () => {

            expect(format('%d', {date})).toEqual('2016-01-31 13:30:15,500');
            expect(format('%date', {date})).toEqual('2016-01-31 13:30:15,500');

            expect(format('%date{yyyy-MM-dd}', {date})).toEqual('2016-01-31');

            expect(format('%d{DEFAULT}', {date})).toEqual('2016-01-31 13:30:15,500');
            expect(format('%d{ISO8601}', {date})).toEqual('2016-01-31T13:30:15,500');
            expect(format('%d{ISO8601_BASIC}', {date})).toEqual('20160131T133015,500');
            expect(format('%d{ABSOLUTE}', {date})).toEqual('13:30:15,500');
            expect(format('%d{DATE}', {date})).toEqual('31 Jan 2016 13:30:15,500');
            expect(format('%d{COMPACT}', {date})).toEqual('20160131133015500');

        });

    });

    describe('exception', () => {

        let testException: Error;
        try {
            throw new Error();
        } catch (e) {
            testException = e;
        }

        const testExceptionOutput = (layout: string) => {

            const formatted = format(layout, {error: testException});

            expect(formatted.split('\n').length).toBeGreaterThan(1);
            expect(formatted.split('\n')[0]).toContain('Error');

        };

        test('format', () => {

            testExceptionOutput('%ex');
            testExceptionOutput('%exception');
            testExceptionOutput('%throwable');

        });

    });

    describe('file', () => {

        test('format', () => {

            expect(format('%F', {file: 'test.js'})).toEqual('test.js');
            expect(format('%file', {file: 'test.js'})).toEqual('test.js');

        });

    });

    describe('level', () => {

        const testLevelOutput = (message: string) => {

            expect(format(message, {level: LogLevel.TRACE})).toEqual('TRACE');
            expect(format(message, {level: LogLevel.DEBUG})).toEqual('DEBUG');
            expect(format(message, {level: LogLevel.INFO})).toEqual('INFO');
            expect(format(message, {level: LogLevel.WARN})).toEqual('WARN');
            expect(format(message, {level: LogLevel.ERROR})).toEqual('ERROR');
            expect(format(message, {level: LogLevel.FATAL})).toEqual('FATAL');

        };

        test('format', () => {
            testLevelOutput('%level');
            testLevelOutput('%p');
        });

    });

    describe('line', () => {

        test('format', () => {

            expect(format('%L', {lineNumber: 20})).toEqual('20');
            expect(format('%line', {lineNumber: 20})).toEqual('20');

        });

    });

    describe('logger', () => {

        const testLoggerOutput = (message: string) => {
            expect(format(message, {logger: 'testLogger'})).toEqual('testLogger');
        };

        test('format', () => {

            testLoggerOutput('%c');
            testLoggerOutput('%logger');

        });

    });

    describe('map', () => {

        const testMap = {a: 1, foo: 'bar'};

        const testMapOutput = (message: string) => {
            expect(format(message, {properties: testMap})).toEqual('{{a,1},{foo,bar}}');
        };

        test('format', () => {

            testMapOutput('%K');
            testMapOutput('%map');
            testMapOutput('%MAP');

        });

    });

    describe('message', () => {

        const testMessage = 'This is a test message';

        const testMessageOutput = (message: string) => {
            expect(format(message, {message: testMessage})).toEqual(testMessage);
        };

        test('format', () => {

            testMessageOutput('%m');
            testMessageOutput('%msg');
            testMessageOutput('%message');

        });

    });

    describe('method', () => {

        test('format', () => {

            const methodTag = '%method';
            const arrowFunction = (): any => null;

            function namedFunction(): any {
                return null;
            }

            expect(format(methodTag, {method: arrowFunction})).toEqual('arrowFunction');
            expect(format(methodTag, {method: namedFunction})).toEqual('namedFunction');

        });

    });

    describe('new line', () => {

        test('format', () => {
            expect(format('foo %n bar', {})).toEqual('foo \n bar');
        });

    });

    describe('relative', () => {

        const testRelative = (message: string) => {
            expect(format(message, {relative: 100})).toEqual('100');
        };

        test('format', () => {

            testRelative('%r');
            testRelative('%relative');

        });

    });

    describe('sequence', () => {

        const testSequence = (message: string) => {
            expect(format(message, {sequence: 1})).toEqual('1');
        };

        test('format', () => {

            testSequence('%sn');
            testSequence('%sequenceNumber');

        });

    });

});
