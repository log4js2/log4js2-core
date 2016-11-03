const formatter = require('../../dist/es6/formatter');
const assert = require('assert');

describe('file', function () {

    it('%F', function () {

        let formatted = formatter.format('%F', { file : 'test.js' });
        assert.equal(formatted, 'test.js');

    });

    it('%file', function () {

        let formatted = formatter.format('%file', { file : 'test.js' });
        assert.equal(formatted, 'test.js');

    });

});