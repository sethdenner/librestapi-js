let fetchCompatible = undefined;

if ('undefined' === typeof fetch) {
    fetchCompatible = require('fetch');

} else {
    fetchCompatible = fetch;

};

export default fetchCompatible;
