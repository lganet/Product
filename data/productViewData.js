"use strict";

import { DatabaseClient } from "./databaseClient.js";

export class ProductViewData {

    constructor(databaseClient) {
        this._databaseClient = databaseClient || new DatabaseClient(); 
    }
    
    // Increment the product view count.
    async Increment(productId) {
        try {
            const pgClient = this._databaseClient.GetClient();
            await pgClient.connect();
            const res = await pgClient.query(`
                INSERT INTO 
	                productviews ("ProductId", "NumberOfViews") 
                VALUES ($1, 1)
                ON CONFLICT ("ProductId") DO UPDATE SET
                    "NumberOfViews" = ("productviews"."NumberOfViews")::int + 1;
            `, [productId]);
            await pgClient.end()
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}