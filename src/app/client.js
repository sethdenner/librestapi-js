import { Request } from 'whatwg-fetch';
import { URLSearchParams } from 'urlsearchparams';
import querystring from 'querystring';
import extend from 'node.extend';
import { Promise } from 'es6-promise';
import fetch from './compat/fetch';

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
            options.headers['Content-Type'] = 'application/x-www-form-urlencoded';

            let formData = new FormData();

            for (let i in options.body) {
                formData.append(
                    i,
                    options.body[i]
                );

            }

            options.body = formData;

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

            let options = this._prepare({
                uri: uri,
                method: method,
                headers: headers,
                body: data,
            });

            fetch(uri, options).then(
                function(response) {
                    if (response.ok) {
                        let contentType = response.headers.get('content-type');

                        if (
                            contentType &&
                            contentType.indexOf('application/json') !== -1
                        ) {
                            return repsonse.json().then((json) => {
                                resolve({
                                    status_code: response.status,
                                    data: JSON.parse(json)
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
                        reject(response);

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
