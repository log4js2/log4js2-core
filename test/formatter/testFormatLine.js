const formatter = require('../../dist/es6/formatter');

describe('line', function () {

    it('%L', function () {

        const tag = '%L';
        formatter.preCompile(tag);

    });

    it('%line', function () {

        const tag = '%line';
        formatter.preCompile(tag);

    });

});