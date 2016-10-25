const formatter = require('../../dist/es6/formatter');

describe('file', function () {

    it('%F', function () {

        const tag = '%F';
        formatter.preCompile(tag);

    });

    it('%file', function () {

        const tag = '%file';
        formatter.preCompile(tag);

    });

});