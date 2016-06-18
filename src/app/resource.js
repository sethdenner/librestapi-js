import extend from 'node.extend';


class Resource {
    constructor(
        client,
        options
    ) {
        var defaults = {
            api_version: 'v0',
            path: null,
            auth_required: true,
            name: null,
            cache: false,
            cache_response: false
        };

        this.options = extend(
            defaults,
            options
        );

        this.client = client;
    }

    // returns a uri with an appropriate .path element
    _assembleUri(
        id
    ){
        var path = [
            this.client.options.api_root.pathname,
            this.options.api_version
        ];
        path.push(this.options.path);

        if(
            id!==undefined &&
            id!==null
        ){
            path.push(id);
        }

        path.push('');
        path = path.join('/');

        var uri = extend(
            {},
            this.client.options.api_root, {
                path : path,
                pathname : path
            }
        );

        return uri;
    };

    // Throws an error if action required credentials
    //
    // TO DONT!: make a call to an action <--- don't do this.
    //
    _handle_required_credentials(){
        var credentials = this.client.getCredentials();

        if (
            credentials &&
            true === this.options.auth_required &&
            !credentials.access_token
        ) {
            throw [
                'Resource',
                this.options.name,
                'requires authentication.'
            ].join(' ');
        }
    }

    /*
     * decorate with credentials, when needed
     * call's the API's request
     */
    request(
        method,
        uri,
        data,
        headers
    ){
        this._handle_required_credentials();

        if (
            !this.options.auth_required &&
            null === this.client._credentials
        ){
            if (
                'undefined' === typeof data ||
                null === data
            ){
                var data = [];
            }

            data.client_id = this.client.options.api_key;
        }

        return this.client.request(
            method,
            uri,
            data,
            headers
        );
    }

    create(
        data
    ) {
        var method = 'POST';
        var uri = this._assembleUri();

        return this.request(
            method,
            uri,
            data
        );
    };

    update(
        id,
        data
    ) {
        if (null === id) {
            throw 'Resource.update method requires id parameter.';
        }

        var method = 'PUT';
        var uri = this._assembleUri(id);

        return this.request(
            method,
            uri,
            data
        );
    };


    retrieve(
        id,
        data
    ) {
        var method = 'GET';
        var uri = this._assembleUri(id);

        return this.request(
            method,
            uri,
            data
        );
    };

    destroy(
        id
    ) {
        if (null === id) {
            throw 'Resource.destroy method requires id parameter.';
        }

        var method = 'DELETE';
        var uri = this._assembleUri(id);

        return this.request(
            method,
            uri
        );
    }

    options() {
        var method = 'OPTIONS';

        var uri = this._assembleUri();

        return this.request(
            method,
            uri
        );
    }
}

export default Resource;
