"use strict";
import { CurrencyData, AllowedCurrencies, DefaultCurrency, DefaultCurrencyObject, AllowedCurrenciesWithoutDefaultCurrency} from "../data/currencyData.js";
import { CurrencyResponse } from "../models/currencyResponse.js";
import { GenericError } from "../models/errorMessage.js";

export class CurrencyService {

    constructor(currencyData) {
        this._currencyData = currencyData || new CurrencyData();
    }

    async Get(currency) {

        if (! currency) {
            return this._CreateUnsuccessfulCurrencyResponse(this.GetDefaultCurrency(), 'The Currency parameter is missing.');
        }

        if (this._IsCurrencyValid(currency)) {
            return this._CreateUnsuccessfulCurrencyResponse(this.GetDefaultCurrency(), `We cannot convert the price to the currency '${currency}'. Currently we are able to convert to one of the following currencies: ${this._GetAllowedCurrencies().join(', ')}.`);
        }

        if (currency === DefaultCurrency) {
            return this._CreateSuccessfulCurrencyResponse(this.GetDefaultCurrency());
        }
        
        return await this._GetCurrency(currency);
    }

    async _GetCurrency(currency) {
        try {
            // Data is returning all allowed currencies
            const currencies = await this._currencyData.Get(currency);
            const desiredCurrency = currencies.find(c => c.name === currency);
        
            if (desiredCurrency) {
                return this._CreateSuccessfulCurrencyResponse(desiredCurrency);
            }
    
            return this._CreateUnsuccessfulCurrencyResponse(this.GetDefaultCurrency(), GenericError);;

        } catch (err) {
            console.error(err);
            return this._CreateUnsuccessfulCurrencyResponse(this.GetDefaultCurrency(), GenericError);;
        }
    }
    
    ConvertValueToCurrency(value, currency) {
        return Math.round(((value * currency.value) + Number.EPSILON) * 100) / 100;
    }

    GetDefaultCurrency() {
        return DefaultCurrencyObject();
    }

    _DefaultCurrencyObjectInArray() {
        return [DefaultCurrencyObject()];
    }

    _GetAllowedCurrencies() {
        return AllowedCurrenciesWithoutDefaultCurrency();
    }

    _IsCurrencyValid(currency) {
        return !(currency in AllowedCurrencies);
    }

    _CreateSuccessfulCurrencyResponse(currency) {
        return new CurrencyResponse(currency, true, null);
    }

    _CreateUnsuccessfulCurrencyResponse(currency, message) {
        return new CurrencyResponse(currency, false, message);
    }
}