// @ts-nocheck
const { from, catchError, switchMap, EMPTY, forkJoin, of } = require("rxjs");
const axios = require("axios").default;
const { CryptoHistory } = require("../models/crypto-history");
const { syncCryptoHistoryCall } = require("../services/cryptocompare.service");
const moment = require("moment");
/**
 * fetch hourly history and store in DB
 *
 */
const syncCryptoHistory = () => {
  //calc last complete hour timestamp
  var CurrentTimestamp = moment().unix();
  let lastHourTimestamp = CurrentTimestamp - (CurrentTimestamp % 3600);

  // check if last hour history fetched or not
  return from(CryptoHistory.findById(lastHourTimestamp)).pipe(
    switchMap((cryptoHistory) => {
      //fetched before {stop the function}
      if (cryptoHistory) return EMPTY;

      // fetch history 

      //crypto currencies
      const cryptos = ["BTC", "BSC", "ETH"];

      //currencies
      const curruncies = ["USD", "GBP"];

      let opsCryptoCurrencyCall = {};
      cryptos.forEach(function (cryptoCurruncy) {
        let opsCurrencyCall = {};
        curruncies.forEach(function (curruncy) {
          // call history func for  curruncy && cryptoCurruncy for last hour {--:00}
          opsCurrencyCall[curruncy] = syncCryptoHistoryCall(
            cryptoCurruncy,
            curruncy
          );
        });
        opsCryptoCurrencyCall[cryptoCurruncy] = forkJoin({
          ...opsCurrencyCall,
        });
      });

      //fetch history for all crypto currencies
      return forkJoin({ ...opsCryptoCurrencyCall }).pipe(
        switchMap((res) => {
          if (!res) return EMPTY;

          // create or update history for last hour {--:00}
          return from(
            CryptoHistory.findOneAndUpdate(
              { _id: lastHourTimestamp},
              { ...res, updatedAt: new Date() },
              { upsert: true }
            )
          );
        })
      );
    }),
    catchError((error) => {
      console.log("[syncCryptoHistory Error]", JSON.stringify(error));
      return error;
    })
  );
};

module.exports = { syncCryptoHistory };
