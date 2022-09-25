// @ts-nocheck
const { from, catchError, switchMap, EMPTY, forkJoin, of } = require("rxjs");
const { CryptoPrice } = require("../models/crypto-price");
const { cryptocompare } = require("../const");
const axios = require("axios").default;
const { CryptoHistory } = require("../models/crypto-history");

/**
 * use to sync history in DB
 *
 */
const syncCryptoHistory = () => {
  //crypto currencies
  const cryptos = ["BTC", "BSC", "ETH"];

  //currencies
  const curruncies = ["USD", "GBP"];

  let opsCryptoCurrencyCall = {};
  cryptos.forEach(function (cryptoCurruncy) {
    let opsCurrencyCall = {};
    curruncies.forEach(function (curruncy) {
      // generate URL with curruncy && cryptoCurruncy for last hour {--:00}
      let url = `${cryptocompare.apiRoot}data/v2/histohour?fsym=${cryptoCurruncy}&tsym=${curruncy}&limit=1&extraParams=${cryptocompare.appName}&api_key=${cryptocompare.apiKey}`;

      opsCurrencyCall[curruncy] = syncCryptoHistoryCall(url);
    });
    opsCryptoCurrencyCall[cryptoCurruncy] = forkJoin({ ...opsCurrencyCall });
  });
 
  //fetch history for all crypto currencies
  return forkJoin({ ...opsCryptoCurrencyCall }).pipe(
    switchMap((res) => {
      if (!res ) return EMPTY;
     
      // create or update history for last hour {--:00}
      return from(
        CryptoHistory.findOneAndUpdate(
          { _id: res?.BTC?.USD?.time },
          { ...res, updatedAt: new Date() },
          { upsert: true }
        )
      );
    }),
    catchError((error) => {
      console.log("[syncCryptoHistory Error]", JSON.stringify(error));
      return error;
    })
  );
};

/**
 * Get open, high, low, close, volumefrom and volumeto from the hourly historical data
 *
 * @param  url: url call with appropirate url's params
 * @returns Observable<DataTypeHistory> |EMPTY | throw Error
 */
const syncCryptoHistoryCall = (url) => {
  return from(axios.get(url)).pipe(
    switchMap((res) => {
      if (!res) return EMPTY;
      return of(res.data?.Data?.Data?.pop());
    }),
    catchError((error) => {
      console.log("[syncCryptoHistoryCall Error]", JSON.stringify(error));
      console.log("url", url);
      throw new Error(JSON.stringify(error));
    })
  );
};

module.exports = { syncCryptoHistory };
