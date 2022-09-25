const mongoose = require("mongoose");

const DataTypeHistory={
  time: Number,
  high: Number,
  low:Number,
  open: Number,
  volumefrom: Number,
  volumeto: Number,
  close: Number,
  conversionType: String,
  conversionSymbol: String
}

const CurrencyType = {
  USD: DataTypeHistory,
  GBP: DataTypeHistory,
};


const CryptoHistorySchema = new mongoose.Schema(
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
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const CryptoHistory = mongoose.model("CryptoHistory", CryptoHistorySchema);

module.exports = { CryptoHistory ,DataTypeHistory};
