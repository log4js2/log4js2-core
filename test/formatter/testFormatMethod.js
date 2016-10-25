const formatter = require('../../dist/es6/formatter');
const assert = require('assert');

describe('method', function () {

    it('%method', function () {

        const methodTag = '%method';
        const anonymousFunction = function () {};
        const namedFunction = function namedFunction() {};

        formatter.preCompile(methodTag);

        assert.equal('anonymous', formatter.format(methodTag, { method : anonymousFunction }));
        assert.equal('namedFunction', formatter.format(methodTag, { method : namedFunction }));

    });

});