let fetchCompatible = undefined;
try {
    fetchCompatible = require('fetch');

} catch (e) {
    // Fetch not installed try to use native.
    fetchCompatible = fetch;
}

export default fetchCompatible;
