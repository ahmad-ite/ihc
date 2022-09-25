const { from, catchError, switchMap, EMPTY } = require("rxjs");
const { CryptoPrice } = require("../models/crypto-price");
const { cryptocompare, priceCustomId } = require("../const");
const axios = require("axios").default;

//const id to update latest prices on same document
const _id = priceCustomId;

const syncCryptoPrice = () => {
  const url = `${cryptocompare.apiRoot}data/pricemulti?fsyms=ETH,BSC,BTC&tsyms=USD,GBP&extraParams=${cryptocompare.appName}&api_key=${cryptocompare.apiKey}`;
  //fetch updated prices
  return from(axios.get(url)).pipe(
    switchMap((res) => {
      if (!res ) return EMPTY;
      //update or create(if not found) prices in DB
      return from(
        CryptoPrice.findOneAndUpdate(
          { _id: _id },
          { ...res.data, updatedAt: new Date() },
          { upsert: true }
        )
      );
    }),
    catchError((error) => {
      console.log("error", JSON.stringify(error));
      return error;
    })
  );
};

module.exports = { syncCryptoPrice};
