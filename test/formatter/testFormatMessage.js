const formatter = require('../../dist/es6/formatter');

describe('message', function () {

    it('%m', function () {

        const tag = '%m';
        formatter.preCompile(tag);

    });

    it('%msg', function () {

        const tag = '%msg';
        formatter.preCompile(tag);

    });

    it('%message', function () {

        const tag = '%message';
        formatter.preCompile(tag);

    });

});