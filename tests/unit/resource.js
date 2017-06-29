define(function (require) {
    var registerSuite = require('intern!object');
    var assert = require('intern/chai!assert');

    var Client = require(
        'intern/dojo/node!../../dist/index.js'
    ).Client;

    var options = {
        api_root: 'https://jsonplaceholder.typicode.com'
    };
    var client = new Client(options);

    var Resource = require(
        'intern/dojo/node!../../dist/index.js'
    ).Resource;

    registerSuite({
        name: 'resource',
        test_isresourcedefined: function () {
            assert.isDefined(Resource);

        },
        test_defineresource: function () {
            var Photos = new Resource(
                client, {
		    api_version: null,
		    auth_required: false,
                    path: 'photos',
                    name: 'photos'
                }
            );

            return Photos.retrieve().then(
                function(response) {}, function(response) {
		    assert.isOk(false, 'Request failed!');

                }
            );

        }
    });

});
