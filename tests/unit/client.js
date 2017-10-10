define(function (require) {
    var registerSuite = require('intern!object');
    var querystring = require('intern/dojo/node!querystring');
    var assert = require('intern/chai!assert');

    var Client = require(
        'intern/dojo/node!../../dist/index.js'
    ).Client;

    registerSuite({
        name: 'client',
        test_isclientdefined: function () {
            assert.isDefined(Client);

        },
        
        test_constructor: function () {
            var options = {
                api_key: 'test_key',
		api_secret: 'test_secret',
                api_root: 'test_root',
                auth_uri: 'test_auth',
            };
            var client = new Client(options);

            assert.deepEqual(client.options, options);
            
        },

        test_credentials: function() {
            var client = new Client();

            assert.isNull(client.getCredentials());

            var credentials = {
                'some-key': 'and value',
                'pairs-that': 'represent credentials'
            };
            client.setCredentials(credentials);

            assert.deepEqual(
                credentials,
                client.getCredentials()
            );

            client.invalidateCredentials()

            assert.isNull(client.getCredentials());

        },

        test_assembleHeaders: function() {
            var client = new Client();

            assert.deepEqual(
                { Accept: 'application/json' },
                client._assembleHeaders()
            );

            var credentials = {
                access_token: 'test_access_token',
                current_identity: 'test_current_identity'
            };

            client.setCredentials(credentials);

            assert.deepEqual({
                Accept: 'application/json',
                'Current-Identity': credentials.current_identity,
                Authorization: 'Bearer ' + credentials.access_token,
                TestHeader: 'test_header'
            }, client._assembleHeaders({TestHeader: 'test_header'}));
                
        },

        test_prepare: function() {
            var client = new Client();

            var credentials = {
                access_token: 'test_access_token',
                current_identity: 'test_current_identity'
            };

            client.setCredentials(credentials);

            var headers = {
                TestHeader: 'test_header'
            }

            var body = {
                a: 1,
                b: 2,
                c: '3'
            }

            var preparedOptions = client._prepare({
                uri: 'https://example.com',
                method: 'GET',
                headers: headers,
                body: body
            });

            assert.isAbove(
                preparedOptions.uri.indexOf(
                    querystring.stringify(body)
                ),
                -1
            );

            assert.isUndefined(preparedOptions.body);

        },

        test_request: function () {
            var client = new Client();
            var credentials = {
                access_token: 'test_access_token',
                current_identity: 'test_current_identity'
            };

            client.setCredentials(credentials);
            return client.request(
                'get',
                'https://example.com', {
                }, {
                    testHeader: 'test-header=value'
                }
            ).then(function(response) {
            }, function(response) {
                assert.isOk(false, 'Http request failed: ' + response);

            });

        }
        
    });

});
