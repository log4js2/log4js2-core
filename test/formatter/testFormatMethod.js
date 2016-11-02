const formatter = require('../../dist/es6/formatter');
const assert = require('assert');

describe('method', function () {

    it('%method', function () {

        const methodTag = '%method';
        const anonymousFunction = function () {};
        const namedFunction = function namedFunction() {};

        assert.equal(formatter.format(methodTag, { method : anonymousFunction }), 'anonymous');
        assert.equal(formatter.format(methodTag, { method : namedFunction }), 'namedFunction');

    });

});