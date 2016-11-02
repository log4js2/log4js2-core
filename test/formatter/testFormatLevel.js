const formatter = require('../../dist/es6/formatter');
const LogLevel = require('../../dist/es6/const/logLevel').LogLevel;

const assert = require('assert');

describe('level', function () {

    let testLevelOutput = function (levelTag) {

        assert.equal(formatter.format(levelTag, { level : LogLevel.TRACE }), 'TRACE');
        assert.equal(formatter.format(levelTag, { level : LogLevel.DEBUG }), 'DEBUG');
        assert.equal(formatter.format(levelTag, { level : LogLevel.INFO }), 'INFO');
        assert.equal(formatter.format(levelTag, { level : LogLevel.WARN }), 'WARN');
        assert.equal(formatter.format(levelTag, { level : LogLevel.ERROR }), 'ERROR');
        assert.equal(formatter.format(levelTag, { level : LogLevel.FATAL }), 'FATAL');

    };

    it('%level', function () {
        testLevelOutput('%level');
    });

    it('%p', function () {
        testLevelOutput('%p');
    });

});