const { forkJoin, from, of, catchError, map } = require("rxjs");
const { CryptoPrice } = require("../models/crypto-price");
const { priceCustomId } = require("../const");
const { CryptoHistory } = require("../models/crypto-history");
const moment = require("moment");

/**
 *  fetch crypto history
 * @param {*} req : request
 * @param {*} res : responce
 * @returns
 */
const cryptoHistory = (req, res) => {
  // generate query conditions
  const fromFilter = req.query.from ?? null;
  const toFolter = req.query.to ?? null;
  let cond = {};
  if (fromFilter || toFolter) {
    cond["_id"] = {};
    //convert from filter to timestamp
    fromFilter
      ? (cond._id["$gte"] = moment(moment(fromFilter).format()).format("X"))
      : null;
    //convert to filter to timestamp
    toFolter
      ? (cond._id["$lte"] = moment(moment(toFolter).format()).format("X"))
      : null;
  }
  const { page = 1, limit = 10 } = req.query;
  return from(
    CryptoHistory.find(cond)
      .sort({ _id: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
  ).subscribe(
    (result) => {
      res.json(result);
    },
    (error) => {
      console.log("[ERROR]", JSON.stringify(error));
      res.status(500).json({ errors: "Internal Server Error" });
    }
  );
};
/**
 *  fetch crypto Prices
 * @param {*} req :request
 * @param {*} res :responce
 * @returns
 */
const cryptoPrice = (req, res) => {
  return from(CryptoPrice.findById(priceCustomId)).subscribe(
    (result) => {
      res.json(result);
    },
    (error) => {
      console.log("[ERROR]", JSON.stringify(error));
      res.status(500).json({ errors: "Internal Server Error" });
    }
  );
};

module.exports = { cryptoHistory, cryptoPrice };
