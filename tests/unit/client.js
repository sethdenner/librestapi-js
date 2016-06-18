define(function (require) {
    var registerSuite = require('intern!object');
    var assert = require('intern/chai!assert');

    var Client = require(
        'intern/dojo/node!../../dist/index.js'
    ).Client;

    registerSuite({
        name: 'client',
        test_isclientdefined: function () {
            assert.isDefined(Client);

        }
    });

});
