const formatter = require('../dist/es6/formatter');

describe('Formatter', function () {

    require('./formatter/testFormatDate');
    require('./formatter/testFormatException');
    require('./formatter/testFormatFile');
    require('./formatter/testFormatLevel');
    require('./formatter/testFormatLine');
    require('./formatter/testFormatLogger');
    require('./formatter/testFormatMap');
    require('./formatter/testFormatMessage');
    require('./formatter/testFormatMethod');
    require('./formatter/testFormatNewLine');
    require('./formatter/testFormatRelative');
    require('./formatter/testFormatSequence');

});