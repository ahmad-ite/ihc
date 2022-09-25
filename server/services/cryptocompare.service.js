const { from, switchMap, EMPTY, of, catchError } = require("rxjs");
const axios = require("axios").default;
const { cryptocompare } = require("../const");

/**
 * Get open, high, low, close, volumefrom and volumeto from the hourly historical data
 * @param {*} fsyms crypto currency
 * @param {*} tsyms real currency
 * @returns Observable<DataTypeHistory> |EMPTY | throw Error
 */
const syncCryptoHistoryCall = (fsyms = "ETH", tsyms = "USD") => {
  const url = `${cryptocompare.apiRoot}data/v2/histohour?fsym=${fsyms}&tsym=${tsyms}&limit=1&extraParams=${cryptocompare.appName}&api_key=${cryptocompare.apiKey}`;

  return from(axios.get(url)).pipe(
    switchMap((res) => {
      if (!res) return EMPTY;
      return of(res.data?.Data?.Data?.pop());
    }),
    catchError((error) => {
      console.log("[syncCryptoHistoryCall Error]", JSON.stringify(error));
      throw new Error(JSON.stringify(error));
    })
  );
};

/**
 * Get the current price of multiple cryptocurrency in multiple currency
 * @param {*} fsyms crypto currency :{ETH,BSC,BTC}
 * @param {*} tsyms real currency   :{USD,GBP}
 */
const syncCryptoPriceCall = (fsyms = "ETH,BSC,BTC", tsyms = "USD,GBP") => {
  const url = `${cryptocompare.apiRoot}data/pricemulti?fsyms=${fsyms}&tsyms=${tsyms}&extraParams=${cryptocompare.appName}&api_key=${cryptocompare.apiKey}`;
  console.log("url", url);

  return from(axios.get(url)).pipe(
    switchMap((res) => {
      if (!res || !res.data) return EMPTY;
      return of(res.data);
    }),
    catchError((error) => {
      console.log("[syncCryptoHistoryCall Error]", JSON.stringify(error));
      throw new Error(JSON.stringify(error));
    })
  );
};

module.exports = { syncCryptoHistoryCall, syncCryptoPriceCall };
