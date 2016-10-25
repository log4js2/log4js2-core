const formatter = require('../../dist/es6/formatter');

describe('exception', function () {

    it('%ex', function () {

        const tag = '%ex';
        formatter.preCompile(tag);

    });

    it('%exception', function () {

        const tag = '%exception';
        formatter.preCompile(tag);

    });

    it('%throwable', function () {

        const tag = '%throwable';
        formatter.preCompile(tag);

    });

});