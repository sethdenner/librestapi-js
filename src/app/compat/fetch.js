import { fetch as fetchBrowser } from 'whatwg-fetch';
import fetchNode from 'node-fetch';

let fetch = (
    'undefined' === typeof XMLHttpRequest ? fetchNode : fetchBrowser
);
export default fetch;
