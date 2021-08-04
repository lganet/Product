import jsonServer from "json-server";

const server = jsonServer.create();
const router = jsonServer.router('currencyLive.json');
const middlewares = jsonServer.defaults();

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

server.use((req, res, next) => {
    if (req.query.currencies.startsWith('CAD')) {
        res.status(500).jsonp({
            error: "error message here"
        });
    }
    next() // continue to JSON Server router
})

// Use default router
server.use(router)
server.listen(3000, () => {
  console.log('JSON Server is running')
})