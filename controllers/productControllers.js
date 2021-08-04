import { ProductService } from "../services/productService.js";
import { ServiceResponse } from "../models/serviceResponse.js";
import { GenericError } from "../models/errorMessage.js";

export const productControllers = async (app) => {

    const paramsJsonSchema = {
        type: 'object',
        properties: {
            userId: { type: 'number' }
        },
        required: ['productId']
    };

    const schema = {
        params: paramsJsonSchema
      }

    app.get('/product/:productId', { schema }, async (request, reply) => {
        const productService = new ProductService();
        let currency = null;

        if (request.query && request.query.currency) {
            currency = request.query.currency;
        }

        let serviceResponse = null;

        try{
            serviceResponse = await productService.Get(request.params.productId, currency);
        }
        catch(err){
            console.error(err);
            serviceResponse = new ServiceResponse(
                {},
                GenericError,
                500,
                "error"
            );
        }

        reply.code(serviceResponse.code)
        return serviceResponse;
    });

    return app;
}