import {DateTimeFormat, formatDate} from "../date.formatter";

// tslint:disable:no-duplicate-string
describe('date format', () => {

    const year = 2018;
    const month = 0;
    const day = 29;
    const hours = 13;
    const minutes = 27;
    const seconds = 33;
    const ms = 345;

    const testDate = new Date(year, month, day, hours, minutes, seconds, ms);

    test('empty input', () => {
        expect(formatDate(testDate)).toEqual('2018-01-29 13:27:33,345');
    });

    test('format standard', () => {

        expect(formatDate(testDate, DateTimeFormat.DEFAULT)).toEqual('2018-01-29 13:27:33,345');
        expect(formatDate(testDate, DateTimeFormat.ABSOLUTE)).toEqual('13:27:33,345');
        expect(formatDate(testDate, DateTimeFormat.COMPACT)).toEqual('20180129132733345');
        expect(formatDate(testDate, DateTimeFormat.DATE)).toEqual('29 Jan 2018 13:27:33,345');
        expect(formatDate(testDate, DateTimeFormat.ISO8601)).toEqual('2018-01-29T13:27:33,345');
        expect(formatDate(testDate, DateTimeFormat.ISO8601_BASIC)).toEqual('20180129T132733,345');

    });

    test('date formats', () => {

        expect(formatDate(testDate, 'd')).toEqual('29');
        expect(formatDate(testDate, 'dd')).toEqual('29');
        expect(formatDate(testDate, 'ddd')).toEqual('Mon');
        expect(formatDate(testDate, 'dddd')).toEqual('Monday');

    });

    test('month formats', () => {

        expect(formatDate(testDate, 'M')).toEqual('1');
        expect(formatDate(testDate, 'MM')).toEqual('01');
        expect(formatDate(testDate, 'MMM')).toEqual('Jan');
        expect(formatDate(testDate, 'MMMM')).toEqual('January');

    });

    test('year formats', () => {

        expect(formatDate(testDate, 'yy')).toEqual('18');
        expect(formatDate(testDate, 'yyyy')).toEqual('2018');

        // using UTC
        expect(formatDate(testDate, 'UTC:yy')).toEqual('18');
        expect(formatDate(testDate, 'UTC:yyyy')).toEqual('2018');

    });

    test('hour formats', () => {

        expect(formatDate(testDate, 'h')).toEqual('1');
        expect(formatDate(testDate, 'hh')).toEqual('01');

        expect(formatDate(testDate, 'H')).toEqual('13');
        expect(formatDate(testDate, 'HH')).toEqual('13');

        // show 12 instead of 0 at midnight when using 12 hour clock
        const morningDate = new Date();
        morningDate.setHours(0);

        expect(formatDate(morningDate, 'h')).toEqual('12');
        expect(formatDate(morningDate, 'hh')).toEqual('12');

    });

    test('minute formats', () => {

        expect(formatDate(testDate, 'm')).toEqual('27');
        expect(formatDate(testDate, 'mm')).toEqual('27');

    });

    test('seconds/milliseconds format', () => {

        expect(formatDate(testDate, 's')).toEqual('33');
        expect(formatDate(testDate, 'ss')).toEqual('33');
        expect(formatDate(testDate, 'S')).toEqual('345');

    });

    test('meridiem format', () => {

        expect(formatDate(testDate, 'a')).toEqual('p');
        expect(formatDate(testDate, 'aa')).toEqual('pm');
        expect(formatDate(testDate, 'A')).toEqual('P');
        expect(formatDate(testDate, 'AA')).toEqual('PM');

        // AM vs PM
        const morningDate = new Date();
        morningDate.setHours(1);

        expect(formatDate(morningDate, 'a')).toEqual('a');
        expect(formatDate(morningDate, 'aa')).toEqual('am');
        expect(formatDate(morningDate, 'A')).toEqual('A');
        expect(formatDate(morningDate, 'AA')).toEqual('AM');

    });

    test('test offset', () => {

        expect(formatDate(testDate, 'Z')).toEqual('EST');
        expect(formatDate(testDate, 'o')).toEqual('-0500');

        expect(formatDate(testDate, 'UTC:Z')).toEqual('UTC');
        expect(formatDate(testDate, 'UTC:o')).toEqual('+0000');

    });

    test('string input', () => {

        const inputDate = '2018-01-29T18:27:33.345Z';
        const result = 'Mon January 29, 2018';

        expect(formatDate(inputDate, 'ddd MMMM dd, yyyy')).toEqual(result);

    });

    test('reuse mask', () => {

        const result = 'Mon January 29, 2018';

        expect(formatDate(testDate, 'ddd MMMM dd, yyyy')).toEqual(result);
        expect(formatDate(testDate, 'ddd MMMM dd, yyyy')).toEqual(result);

    });

});
