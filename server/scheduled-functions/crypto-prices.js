const { from, catchError, switchMap, EMPTY } = require("rxjs");
const { CryptoPrice } = require("../models/crypto-price");
const { priceCustomId } = require("../const");
const { syncCryptoPriceCall } = require("../services/cryptocompare.service");

//const id to update latest prices on same document
const _id = priceCustomId;

const syncCryptoPrice = () => {
  //fetch updated prices
  return syncCryptoPriceCall().pipe(
    switchMap((res) => {
      if (!res) return EMPTY;
      //update or create(if not found) prices in DB
      return from(
        CryptoPrice.findOneAndUpdate(
          { _id: _id },
          { ...res, updatedAt: new Date() },
          { upsert: true }
        )
      );
    }),
    catchError((error) => {
      console.log("error11", error);
      throw Error(JSON.stringify(error));
    })
  );
};

module.exports = { syncCryptoPrice };
