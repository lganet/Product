import pg from "pg";
import { PostgresConnection } from "../configuration.js";

export class DatabaseClient {

    constructor(databaseClient, configuration) {
        this._databaseClient = databaseClient || pg;
        this._configuration = configuration || PostgresConnection;
    }

    GetClient() {
        return new this._databaseClient.Client(this._configuration);
    }
}
