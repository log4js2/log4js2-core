const formatter = require('../../dist/es6/formatter');

describe('map', function () {

    it('%K', function () {

        const tag = '%K';
        formatter.preCompile(tag);

    });

    it('%map', function () {

        const tag = '%map';
        formatter.preCompile(tag);

    });

    it('%MAP', function () {

        const tag = '%MAP';
        formatter.preCompile(tag);

    });

});