import fetchNode from 'node-fetch';

let fetchCompatible = (
    'undefined' === typeof fetch ? fetchNode : fetch
);
export default fetchCompatible;
