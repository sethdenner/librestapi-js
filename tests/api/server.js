import jsonServer from 'json-server';


let server = jsonServer.create();
let router = jsonServer.router('db.js');
let middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);
server.listen(3000, () => {
    console.log('JSON SERVER IS STATUS UP!');
});
