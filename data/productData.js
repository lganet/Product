"use strict";
import { DatabaseClient } from "./databaseClient.js";
import { Product } from "./../models/product.js";

export class ProductData {

    constructor(databaseClient) {
        this._databaseClient = databaseClient || new DatabaseClient(); 
    }

    // Get Product 
    async Get(id) {

        try {
            const pgClient = this._databaseClient.GetClient();
            await pgClient.connect();
            const res = await pgClient.query('SELECT "Id", "Name", "Price" FROM product where "Id" = $1;', [id]);
            await pgClient.end();
            
            if (res.rows.length > 0) {
                return new Product(res.rows[0].Id, res.rows[0].Name, res.rows[0].Price);
            }
            else {
                return new Product();
            }
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
}