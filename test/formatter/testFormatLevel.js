const formatter = require('../../dist/es6/formatter');
const LogLevel = require('../../dist/es6/const/logLevel').LogLevel;

const assert = require('assert');

describe('level', function () {

    let testLevelOutput = function (levelTag) {

        assert.equal('TRACE', formatter.format(levelTag, { level : LogLevel.TRACE }));
        assert.equal('DEBUG', formatter.format(levelTag, { level : LogLevel.DEBUG }));
        assert.equal('INFO', formatter.format(levelTag, { level : LogLevel.INFO }));
        assert.equal('WARN', formatter.format(levelTag, { level : LogLevel.WARN }));
        assert.equal('ERROR', formatter.format(levelTag, { level : LogLevel.ERROR }));
        assert.equal('FATAL', formatter.format(levelTag, { level : LogLevel.FATAL }));

    };

    it('%level', function () {

        const levelTag = '%level';

        formatter.preCompile(levelTag);
        testLevelOutput(levelTag);


    });

    it('%p', function () {

        const levelTag = '%p';

        formatter.preCompile(levelTag);
        testLevelOutput(levelTag);

    });


});