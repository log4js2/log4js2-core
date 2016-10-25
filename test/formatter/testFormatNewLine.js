const formatter = require('../../dist/es6/formatter');
const assert = require('assert');

describe('new line', function () {

    it('%n', function () {

        const tag = '%n';
        formatter.preCompile(tag);

        // TODO: fix
        // assert.equal('\n', formatter.format(tag, {}));

    });

});