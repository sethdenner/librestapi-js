let fetchCompatible = undefined;

if ('undefined' === typeof fetch) {
    fetchCompatible = require('whatwg-fetch');

} else {
    fetchCompatible = fetch;

};

export default fetchCompatible;
