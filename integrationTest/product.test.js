import { CurrencyService } from "../services/currencyService.js";
import { CurrencyData, DefaultCurrencyObject, AllowedCurrencies, AllowedCurrenciesWithoutDefaultCurrency, DefaultCurrency } from "../data/currencyData.js";
import { Currency } from "../models/currency.js"
import sinon from "sinon";
import should from "should";

describe('CurrencyService', function() {

    const notAllowedCurrencyName = 'BLR';
    const expectedCurrency = AllowedCurrenciesWithoutDefaultCurrency()[0];
    const expectedCurrencyValue = 3;

    const currencies = [];

    const allowedCurrenciesKeys = Object.keys(AllowedCurrencies);
    allowedCurrenciesKeys.forEach(currency => {
        currencies.push(new Currency(currency, AllowedCurrencies[currency], expectedCurrencyValue));
    });
    

    beforeEach(() => {
        this.callback = sinon.stub(CurrencyData.prototype, 'Get');

        this.callback.withArgs(expectedCurrency).returns(currencies);
       
        this.currencyData = new CurrencyData();
        this.currencyService = new CurrencyService(this.currencyData);
    });

    afterEach(() => {
        this.currencyData.Get.restore();
        this.callback.restore();
    });

    describe('CurrencyService.Get', () => {
        describe('Invalid Parameters', () => {
        
            it('when parameter is undefined, it is expected the default currency with the correct message and the API not called.', async () => {
                // Arrange
                const expectedMessage = 'The Currency parameter is missing.';
                
                // Act
                const currency = await this.currencyService.Get(undefined);
                
                // Assert
                currency.currency.name.should.be.equal(DefaultCurrency);
                currency.message.should.be.equal(expectedMessage);
                sinon.assert.notCalled(this.currencyData.Get);
            });

            it('when parameter is a not allowed currency, it is expected the default currency with the correct message and the API not called.', async () => {
                // Arrange
                const expectedMessage = `We cannot convert the price to the currency '${notAllowedCurrencyName}'. Currently we are able to convert to one of the following currencies: CAD, EUR, GBP.`;
                
                // Act
                const currency = await this.currencyService.Get(notAllowedCurrencyName);
                
                // Assert
                currency.currency.name.should.be.equal(DefaultCurrency);
                currency.message.should.be.equal(expectedMessage);
                sinon.assert.notCalled(this.currencyData.Get);
            });

        });

        describe('Valid Parameters', () => {
        
            it('when parameter is the default currency, it is expected the default currency with no message and the API not called.', async () => {
                // Act
                const currency = await this.currencyService.Get(DefaultCurrency);
                
                // Assert
                currency.currency.name.should.be.equal(DefaultCurrency);
                (currency.message === null).should.be.true();
                sinon.assert.notCalled(this.currencyData.Get);
            });

            it('when parameter is a valid and allowed currency, it is expected the currency details returned with no message and the API called once.', async () => {
                // Act
                const currency = await this.currencyService.Get(expectedCurrency);
                
                // Assert
                currency.currency.name.should.be.equal(expectedCurrency);
                currency.currency.value.should.be.equal(expectedCurrencyValue);
                (currency.message === null).should.be.true();
                sinon.assert.calledOnce(this.currencyData.Get);
                sinon.assert.calledWith(this.currencyData.Get, expectedCurrency);
            });

        });
    });
});
