const formatter = require('../../dist/es6/formatter');

describe('date', function () {

    let testDateOutput = function () {

    };

    it('%d', function () {

        const tag = '%d';
        formatter.preCompile(tag);

    });

    it('%date', function () {

        const tag = '%date';
        formatter.preCompile(tag);


    });

    describe('predefined', function () {

        it('%d{DEFAULT}', function () {



        });

        it('%d{ISO8601}', function () {



        });

        it('%d{ISO8601_BASIC}', function () {



        });

        it('%d{ABSOLUTE}', function () {



        });

        it('%d{DATE}', function () {



        });

        it('%d{COMPACT}', function () {



        });

    });

});