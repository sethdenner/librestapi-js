import extend from 'node.extend';


class Resource {
    constructor(
        client,
        options
    ) {
        let defaults = {
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

    _assembleUri(id){
	// returns a uri string with an ID if appropriate.

        let path = [
            this.client.options.api_root,
        ];

	let api_version = this.options.api_version;
	if (
            typeof(api_version) != 'undefined' &&
            null !== api_version
	) {
	    path.push(api_version);

        }

        path.push(this.options.path);

        if(
            typeof(id) != 'undefined' &&
            null !== id
        ){
            path.push(id);
        }

        path.push('');
        path = path.join('/');

        return path;
    };

    request(
        method,
        uri,
        data,
        headers,
        id
    ){
	/*
	 decorate with credentials, when needed
	 call's the API's request
	 */
        if (
            !this.options.auth_required &&
            null === this.client._credentials &&
	    this.client.options.api_key
        ){
            data.client_id = this.client.options.api_key;

        }

        uri = this._assembleUri(id);

        return this.client.request(
            method,
            uri,
            data,
            headers
        );
    }

    create(
        data,
        headers
    ) {
        let method = 'POST';
        let uri = this._assembleUri();

        return this.request(
            method,
            uri,
            data,
            headers
        );
    };

    update(
        id,
        data,
        headers
    ) {
        if (null === id) {
            throw 'Resource.update method requires id parameter.';
        }

        let method = 'PUT';
        let uri = this._assembleUri(id);

        return this.request(
            method,
            uri,
            data,
            headers,
            id
        );
    };

    retrieve(
        id,
        data,
        headers
    ) {
        let method = 'GET';
        let uri = this._assembleUri(id);

        return this.request(
            method,
            uri,
            data,
            headers,
            id
        );
    };

    destroy(
        id,
        data,
        headers
    ) {
        if (null === id) {
            throw 'Resource.destroy method requires id parameter.';
        }

        let method = 'DELETE';

        return this.request(
            method,
            uri,
            data,
            headers,
            id
        );
    }

    options(
        data,
        headers
    ) {
        let method = 'OPTIONS';

        let uri = this._assembleUri();

        return this.request(
            method,
            uri,
            data,
            headers
        );
    }
}

export default Resource;
