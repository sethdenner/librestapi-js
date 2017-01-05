import querystring from 'querystring';
import extend from 'node.extend';

class Client {
    constructor(options) {
        var defaults = {
            api_key: null,
            api_root: {},
            auth_uri: null
        };

        this.options = extend(
            defaults,
            options
        );

        this._credentials = null;
    }

    getCredentials() {
        return this._credentials;
    }

    setCredentials(credentials) {
        this._credentials = extend(
            this._credentials,
            credentials
        );
    }

    invalidateCredentials() {
        this._credentials = null;
    }

    _assembleHeaders(headers){
        if(!headers){
            headers = {};
        }

        let credentials = this.getCredentials();
        if(credentials !== null){
            if(credentials.access_token){
                headers.Authorization =  [
                    'Bearer',
                    credentials.access_token
                ].join(' ');
            }

            if (credentials.current_identity) {
                headers['Current-Identity'] = credentials.current_identity;

            }
        }

        headers.Accept = 'application/json'

        return headers;
    }

    _prepare(options){
        if(typeof options.body == 'undefined'){
            return null;
        }

        if (
            null === options.body ||
            typeof options.body !== 'object'
        ) {
            options.body = null;
            return options;
        }

        if (
            'POST' !== options.method &&
            'PUT' !== options.method
        ) {
            if (-1 === options.uri.indexOf('?')) {
                options.uri += '?'
            }

            options.uri += querystring.stringify(options.body);
            options.body = undefined;

        } else {
            let contentType = options.headers['Content-Type'];
            if ('undefined' === typeof contentType) {
                if ('undefined' === typeof this.options.contentType) {
                    contentType = 'json';
                    
                } else {
                    contentType = this.options.contentType;

                }

            }
            
            if (
                contentType == 'json' ||
                contentType == 'application/json'
            ) {
                options.headers['Content-Type'] = 'application/json';
                options.body = JSON.stringify(options.body);

            } else if (
                contentType == 'formdata' ||
                contentType == 'application/x-www-form-urlencoded'
            ) {
                options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
                options.body = querystring.stringify(options.body)

            } else {
                throw [
                    'The Content-Type',
                    contentType,
                    'is not supported by this client.'
                ].join(' ');

            }

        }

        return options;
    }

    request(
        method,
        uri,
        data,
        headers
    ){
        return new Promise((resolve, reject) => {
            headers = this._assembleHeaders(headers);

            if(typeof data === 'undefined'){
                data = null;

            }

            let defaultPort = uri.protocol === 'https:' ? '443' : '80';

            let uriString = [
                uri.protocol,
                '//',
                uri.host,
                ':',
                uri.port ? uri.port : defaultPort,
                uri.path
            ].join('');

            let options = this._prepare({
                uri: uriString,
                method: method,
                headers: headers,
                body: data,
                credentials: 'omit'
            });

            fetch(options.uri, options).then(
                function(response) {
                    if (response.ok) {
                        let contentType = response.headers.get('content-type');

                        if (
                            contentType &&
                            contentType.indexOf('application/json') !== -1
                        ) {
                            return response.json().then((json) => {
                                resolve({
                                    status_code: response.status,
                                    data: json
                                });

                            }, (reason) => {
                                reject(reason);
                            });
                            
                        } else {
                            return response.text().then((text) => {
                                resolve({
                                    status_code: response.status,
                                    data: text
                                });

                            }, (reason) => {
                                reject(reason);
                            });
                        }
                        
                    } else {
                        resolve(response);

                    }

                }, (reason) => {
                    reject(reason);

                }
            );

        });

    }

    authenticate(credentials) {
        var method = 'POST';
        var uri = this.options.auth_uri;

        return this.request(
            method,
            uri,
            credentials
        );

    };
};


export default Client;
