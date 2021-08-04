export const CurrencyAPI = {
    url: process.env.CURRENCYAPIHOST,
    apiKey: process.env.CURRENCYAPIKEY,
    timeOut: process.env.CURRENCYAPITIMEOUT
}

export const PostgresConnection = {
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT
}
