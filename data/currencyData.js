"use strict";
import fetch from "node-fetch";
import { CurrencyAPI } from "./../configuration.js";
import { Currency } from "../models/currency.js";

export const AllowedCurrencies = {'USD': '$', 'CAD': '$', 'EUR': '€', 'GBP': '£'};

export const DefaultCurrency = 'USD';

export const DefaultCurrencyObject = () => { return new Currency(DefaultCurrency, AllowedCurrencies[DefaultCurrency], 1); };

export const AllowedCurrenciesWithoutDefaultCurrency = (currencySelected) => {
    let currencies = Object.keys(AllowedCurrencies);
    const usdIndex = currencies.indexOf(DefaultCurrency);
    currencies.splice(usdIndex, 1);
    if (currencySelected) {
        // Moving the selected currency to be the first element.
        currencies.sort((x,y) => { return x == currencySelected ? -1 : y == currencySelected ? 1 : 0; });
    }
    return currencies;
}

export class CurrencyData {

    constructor(nodeFetch, configuration){
        this._nodeFetch = nodeFetch || fetch;
        this._configuration = configuration || CurrencyAPI;
    }

    // Get the Currency converted to another foreign currency. 
    async Get(currency) {
        const CurrencyAPI_URL = `${this._configuration.url}?access_key=${this._configuration.apiKey}&currencies=${this._CreateQueryString(currency)}`;
        const CurrencyAPI_Options = {timeout: this._configuration.timeOut}
        const result = await this._nodeFetch(CurrencyAPI_URL, CurrencyAPI_Options);
        const currencyLayerResult = await result.json();
        return this._ReturnCurrencyFromCurrencyLayerResult(currencyLayerResult);
    }

    _ReturnCurrencyFromCurrencyLayerResult(currencyLayerResult) {
        if (!(currencyLayerResult && currencyLayerResult.success && currencyLayerResult.quotes)) {
            console.error(`The JSON returned by the CurrencyAPI is not valid: ${JSON.stringify(currencyLayerResult)}`);
            throw "Invalid CurrencyAPI return.";
        }

        const currencies = [];
        const notDefaultCurrency = AllowedCurrenciesWithoutDefaultCurrency();
        notDefaultCurrency.forEach(currency => {
            const currencyNameOnCurrencyAPI = `${DefaultCurrency}${currency}`;
            if (currencyLayerResult.quotes.hasOwnProperty(currencyNameOnCurrencyAPI)) {
                currencies.push(new Currency(currency, AllowedCurrencies[currency], currencyLayerResult.quotes[currencyNameOnCurrencyAPI]));
            }
        });
        return currencies;
    }

    _CreateQueryString(currency) {
        return AllowedCurrenciesWithoutDefaultCurrency(currency).join(',');
    }

}