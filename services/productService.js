"use strict";
import { ProductData } from "./../data/productData.js";
import { ProductViewService } from "./productViewService.js";
import { CurrencyService } from "./currencyService.js";
import { ProductResponse } from "../models/productResponse.js";
import { ServiceResponse } from "../models/serviceResponse.js";
import { PriceResponse } from "../models/priceResponse.js";

export class ProductService {

    constructor(productData, productViewService, currencyService){
        this._productData = productData || new ProductData();
        this._productViewService = productViewService || new ProductViewService();
        this._currencyService = currencyService || new CurrencyService();
    }

    // Get Product by id.
    // id = Product id, numeric value.
    async Get(id, currency) {

        if (isNaN(id)) {
            return this._ReturnServiceResponse({}, 'Invalid Product Id.', 400, 'InvalidParameter');
        }

        const product = await this._productData.Get(id);

        if (product && product.id) {
            await this._Increment(product);
            return this._ReturnProductWithCurrencyConverted(product, currency);
        }

        return this._ReturnServiceResponse({}, 'Product not found.', 404, 'NotFound');
    }

    async _ReturnProductWithCurrencyConverted(product, currency) {      
        if (!currency) {
            currency = this._currencyService.GetDefaultCurrency().name;
        }

        const currencyDesired = await this._currencyService.Get(currency);

        const productResponse = new ProductResponse(
            product.id, 
            product.name, 
            new PriceResponse(
                this._currencyService.ConvertValueToCurrency(product.price, currencyDesired.currency),
                currencyDesired.currency.symbol,
                currencyDesired.currency.name
            )
        );

        return  this._ReturnServiceResponse(
            productResponse,
            !currencyDesired.success ? currencyDesired.message : null, // It will display an error message if it was failed to retrieve the currency.
            currencyDesired.success ? 200 : 207, // It still showing the product if it was failed to retrieve the currency.
            "success"
        );
    }

    _ReturnServiceResponse(data, message, code, status) {
        return new ServiceResponse(
            data,
            message,
            code,
            status
        ); 
    }

    async _Increment(product) {
        if (product && product.id > 0) {
            try {
                await this._productViewService.Increment(product);
            } catch (err) {
                console.error(err);
                // If the Increment fail the code will only log the error and not rethrow the exception.
            }
        }
    }
}