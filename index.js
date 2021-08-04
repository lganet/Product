import fastify from "fastify";
import { productControllers } from "./controllers/productControllers.js";

const PORT = 3000;

const server = fastify({logger: true});
server.register(productControllers);
server.listen(PORT, err => {
    if (err) console.log(err);
    console.log(`Server listening on port ${PORT}`);
});