const formatter = require('../../build/es6/formatter').Formatter;
const assert = require('assert');

describe('date', function () {

    let date = new Date();
    date.setMonth(12);
    date.setDate(31);
    date.setYear(2016);
    date.setHours(13);
    date.setMinutes(30);
    date.setSeconds(15);
    date.setMilliseconds(500);

    it('%d', function () {

        let formatted = formatter.format('%d', { date : date });
        assert.equal(formatted, '2016-01-31 13:30:15,500');

    });

    it('%date', function () {

        let formatted = formatter.format('%date', { date : date });
        assert.equal(formatted, '2016-01-31 13:30:15,500');

    });

    describe('predefined', function () {

        it('%d{DEFAULT}', function () {
            let formatted = formatter.format('%d{DEFAULT}', { date : date });
            assert.equal(formatted, '2016-01-31 13:30:15,500');
        });

        it('%d{ISO8601}', function () {
            let formatted = formatter.format('%d{ISO8601}', { date : date });
            assert.equal(formatted, '2016-01-31T13:30:15,500');
        });

        it('%d{ISO8601_BASIC}', function () {
            let formatted = formatter.format('%d{ISO8601_BASIC}', { date : date });
            assert.equal(formatted, '20160131T133015,500');
        });

        it('%d{ABSOLUTE}', function () {
            let formatted = formatter.format('%d{ABSOLUTE}', { date : date });
            assert.equal(formatted, '13:01:15,500');
        });

        it('%d{DATE}', function () {
            let formatted = formatter.format('%d{DATE}', { date : date });
            assert.equal(formatted, '31 Jan 2016 13:30:15,500');
        });

        it('%d{COMPACT}', function () {
            let formatted = formatter.format('%d{COMPACT}', { date : date });
            assert.equal(formatted, '20160131133015500');
        });

    });

});