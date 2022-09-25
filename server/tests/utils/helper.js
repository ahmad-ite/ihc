const { priceCustomId } = require("../../const");
const { CryptoHistory } = require("../../models/crypto-history");
const { CryptoPrice } = require("../../models/crypto-price");
// @ts-ignore
const data = require("./data.json");

const addPrice = async () => {
  const _id = priceCustomId;
  await CryptoPrice.findOneAndUpdate(
    { _id: _id },
    { ...data.priceData, updatedAt: new Date() },
    { upsert: true }
  );
};

const addHistories = async () => {
  const inputData = data.historyData;
  inputData.forEach(async (input) => {
    await CryptoHistory.findOneAndUpdate(
      { _id: input?.BTC?.USD?.time },
      { ...input, updatedAt: new Date() },
      { upsert: true }
    );
  });
};

/**
 * to test if the  slave obj has all master object properities and values
 *
 * @param {*} masterObj the master object
 * @param {*} slaveObj the slave object
 */
const match2ObjectsPropsAndValues = (masterObj, slaveObj) => {
  for (const property in masterObj) {
    expect(slaveObj).toHaveProperty(property);

    let prop = masterObj[property];
    // for sub obj
    if (typeof prop == "object") {
      match2ObjectsPropsAndValues(masterObj[property], slaveObj[property]);
    } else {
      expect(slaveObj[property]).toEqual(masterObj[property]);
    }
  }
};

module.exports = { addPrice, addHistories, match2ObjectsPropsAndValues };
