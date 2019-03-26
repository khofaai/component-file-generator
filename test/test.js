var assert = require('assert');
var ask = require('./ask');

it('when running generator by keyword as params `reactjs`\n', function() {
    try{
        var src = require('../index');
        src.exec('reactjs');
        assert.ok(true);
    }
    catch (e) {
        assert.fail(e.message)
    }
});
