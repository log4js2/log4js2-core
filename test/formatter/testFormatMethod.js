const formatter = require('../../build/es6/formatter').Formatter;
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