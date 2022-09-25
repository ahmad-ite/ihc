const { map } = require("rxjs");
const { cryptocompare } = require("../const");
const {
  syncCryptoHistoryCall,
  syncCryptoPriceCall,
} = require("../services/cryptocompare.service");

test("test syncCryptoHistoryCall API that Gets open, high, low, close, volumefrom and volumeto from the hourly historical data", () => {
  return syncCryptoHistoryCall()
    .pipe(
      map((data) => {
        expect(data).toHaveProperty("time");
        expect(data).toHaveProperty("high");
        expect(data).toHaveProperty("low");
        expect(data).toHaveProperty("open");
        expect(data).toHaveProperty("volumefrom");
        expect(data).toHaveProperty("volumeto");
        expect(data).toHaveProperty("close");
        expect(data).toHaveProperty("conversionType");
        expect(data).toHaveProperty("conversionSymbol");
        return null;
      })
    )
    .toPromise();
});

test("test syncCryptoPriceCall API that Gets the current price of multiple cryptocurrency in multiple currency", () => {
  return syncCryptoPriceCall()
    .pipe(
      map((data) => {
        expect(data).toHaveProperty("ETH");
        expect(data).toHaveProperty("BSC");
        expect(data).toHaveProperty("BTC");

        expect(data.ETH).toHaveProperty("USD");
        expect(data.ETH).toHaveProperty("GBP");

        expect(data.BSC).toHaveProperty("USD");
        expect(data.BSC).toHaveProperty("GBP");

        expect(data.BTC).toHaveProperty("USD");
        expect(data.BTC).toHaveProperty("GBP");
        return null;
      })
    )
    .toPromise();
});
