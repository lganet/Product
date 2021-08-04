"use strict";
import { ProductViewData } from "./../data/productViewData.js";

export class ProductViewService {

    constructor(productViewData){
        this._productViewData = productViewData || new ProductViewData();
    }

    async Increment(product) {
        if (product && product.id > 0) {
            await this._productViewData.Increment(product.id);
        }
    }
}