define(function (require) {
    var registerSuite = require('intern!object');
    var assert = require('intern/chai!assert');

    var Resource = require(
        'intern/dojo/node!../../dist/index.js'
    ).Resource;

    registerSuite({
        name: 'resource',
        test_isresourcedefined: function () {
            assert.isDefined(Resource);

        },
    });

});
