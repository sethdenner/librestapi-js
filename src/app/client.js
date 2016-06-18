import http from 'http';
import https from 'https';
import querystring from 'querystring';
import extend from 'node.extend';
import Promise from 'promise';

class Client {
    constructor(options) {
        var defaults = {
            api_key: null,
            api_root: {},
            auth_uri: null,
            request_timeout: 5000,
            local_storage_credentials_key: 'api_credentials'
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
        if(typeof options.data == 'undefined'){
            return null;
        }

        if (
            null === options.data ||
            typeof options.data !== 'object'
        ) {
            options.data = null;

            return options;
        }

        if (
            'POST' !== options.method &&
            'PUT' !== options.method
        ) {
            options.path = [
                options.path,
                querystring.stringify(options.data)
            ].join('?');

            options.data = null;

        } else {
            options.path = [
                options.path
            ].join('?');

            options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            options.data = querystring.stringify(options.data);
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

            let reqCtx = {api:this, payload:[]};
            let options = this._prepare({
                    protocol: uri.protocol,
                    data: data,
                    host: uri.host,
                    headers: headers,
                    path: uri.path,
                    pathname: uri.path,
                    content_type: 'application/x-www-form-urlencoded',
                    method: method,
                    withCredentials: false
                });
            let conx = (options.protocol && options.protocol.match(/https/)) ? https : http;
            let req = conx.request(
                options,
                function(response) {
                    response.on('data', function(chunk){
                        reqCtx.payload.push(chunk);

                    });

                    response.on('end', function(){
                        if (
                            0 !== reqCtx.payload.length &&
                            response.headers['content-type'] == 'application/json'
                        ) {
                            reqCtx.payload = JSON.parse(reqCtx.payload.join(''));

                        } else{
                            reqCtx.payload = reqCtx.payload.join('');

                        }

                        resolve({
                            status_code: this.statusCode,
                            data: reqCtx.payload
                        });

                    });

                }
            );

            req.on('error', function(e) {
                reject(e);
            });

            if (
                options.method === 'POST' ||
                options.method === 'PUT'
            ) {
                req.write(options.data);
            }

            req.end();
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
