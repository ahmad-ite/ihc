const mongoose = require("mongoose");

const CurrencyType = {
  USD: Number,
  GBP: Number,
};
const CryptoPriceSchema = new mongoose.Schema(
  {
    _id: String,
    ETH: {
      type: CurrencyType,
      required: true,
    },
    BSC: {
      type: CurrencyType,
      required: true,
    },
    BTC: {
      type: CurrencyType,
      required: true,
    },
    updatedAt : { type : Date, default: Date.now }
  },
  { _id: false }
);

const CryptoPrice = mongoose.model("CryptoPrice", CryptoPriceSchema);

module.exports = { CryptoPrice };
