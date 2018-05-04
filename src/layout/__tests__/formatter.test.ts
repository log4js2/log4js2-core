import {LogLevel} from "../../const/log.level";
import {Formatter} from "../formatter";

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

            expect(Formatter.format('%d', {date})).toEqual('2016-01-31 13:30:15,500');
            expect(Formatter.format('%date', {date})).toEqual('2016-01-31 13:30:15,500');

            expect(Formatter.format('%d{DEFAULT}', {date})).toEqual('2016-01-31 13:30:15,500');
            expect(Formatter.format('%d{ISO8601}', {date})).toEqual('2016-01-31T13:30:15,500');
            expect(Formatter.format('%d{ISO8601_BASIC}', {date})).toEqual('20160131T133015,500');
            expect(Formatter.format('%d{ABSOLUTE}', {date})).toEqual('13:01:15,500');
            expect(Formatter.format('%d{DATE}', {date})).toEqual('31 Jan 2016 13:30:15,500');
            expect(Formatter.format('%d{COMPACT}', {date})).toEqual('20160131133015500');

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

            const formatted = Formatter.format(layout, {error: testException});

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

            expect(Formatter.format('%F', {file: 'test.js'})).toEqual('test.js');
            expect(Formatter.format('%file', {file: 'test.js'})).toEqual('test.js');

        });

    });

    describe('level', () => {

        const testLevelOutput = (format: string) => {

            expect(Formatter.format(format, {level: LogLevel.TRACE})).toEqual('TRACE');
            expect(Formatter.format(format, {level: LogLevel.DEBUG})).toEqual('DEBUG');
            expect(Formatter.format(format, {level: LogLevel.INFO})).toEqual('INFO');
            expect(Formatter.format(format, {level: LogLevel.WARN})).toEqual('WARN');
            expect(Formatter.format(format, {level: LogLevel.ERROR})).toEqual('ERROR');
            expect(Formatter.format(format, {level: LogLevel.FATAL})).toEqual('FATAL');

        };

        test('format', () => {
            testLevelOutput('%level');
            testLevelOutput('%p');
        });

    });

    describe('line', () => {

        test('format', () => {

            expect(Formatter.format('%L', {lineNumber: 20})).toEqual('20');
            expect(Formatter.format('%line', {lineNumber: 20})).toEqual('20');

        });

    });

    describe('logger', () => {

        const testLoggerOutput = (format: string) => {
            expect(Formatter.format(format, {logger: 'testLogger'})).toEqual('testLogger');
        };

        test('format', () => {

            testLoggerOutput('%c');
            testLoggerOutput('%logger');

        });

    });

    describe('map', () => {

        const testMap = {a: 1, foo: 'bar'};

        const testMapOutput = (format: string) => {
            expect(Formatter.format(format, {properties: testMap})).toEqual('{{a,1},{foo,bar}}');
        };

        test('format', () => {

            testMapOutput('%K');
            testMapOutput('%map');
            testMapOutput('%MAP');

        });

    });

    describe('message', () => {

        const testMessage = 'This is a test message';

        const testMessageOutput = (format: string) => {
            expect(Formatter.format(format, {message: testMessage})).toEqual(testMessage);
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
            const anonymousFunction = (): any => null;

            function namedFunction() {
                return;
            }

            expect(Formatter.format(methodTag, {method: anonymousFunction})).toEqual('anonymous');
            expect(Formatter.format(methodTag, {method: namedFunction})).toEqual('namedFunction');

        });

    });

    describe('new line', () => {

        test('format', () => {
            expect(Formatter.format('foo %n bar', {})).toEqual("foo \n bar");
        });

    });

    describe('relative', () => {

        const testRelative = (format: string) => {
            expect(Formatter.format(format, {relative: 100})).toEqual('100');
        };

        test('format', () => {

            testRelative('%r');
            testRelative('%relative');

        });

    });

    describe('sequence', () => {

        const testSequence = (format: string) => {
            expect(Formatter.format(format, {sequence: 1})).toEqual('1');
        };

        test('format', () => {

            testSequence('%sn');
            testSequence('%sequenceNumber');

        });

    });

});
