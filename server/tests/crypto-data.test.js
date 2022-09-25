const request = require("supertest");
const app = require("../app.js");
const db = require("./db");
const {
  addPrice,
  addHistories,
  match2ObjectsPropsAndValues,
} = require("./utils/helper.js");
// @ts-ignore
const data = require("./utils/data.json");

beforeAll(async () => await db.connect());
afterEach(async () => await db.clearDatabase());
afterAll(async () => await db.closeDatabase());

describe("First Group Of Tests", () => {
  const path = "/api/v1/crypto/";

  it("/Get api/v1/crypto/price should test crypto price", async () => {
    // add price doc
    await addPrice();

    // call api
    const res = await request(app).get(`${path}price`).send();

    //test responce status
    expect(res.statusCode).toEqual(200);
    const outputObject = { ...data.priceData };

    //test output properities and values
    match2ObjectsPropsAndValues(outputObject, res.body);
  });

  it("/Get api/v1/crypto/history should test crypto history", async () => {
    // add price doc
    await addHistories();

    // call api
    const res = await request(app)
      .get(
        `${path}history?from=2022-09-20 01:24:43&to=2022-09-28 22:24:43&page=1&limit=10`
      )
      .send();

    //test responce status
    expect(res.statusCode).toEqual(200);
    const outputObjects = data.historyData;

    //test output properities and values
    outputObjects.forEach((outputObject, index) => {
      //test output properities and values
      match2ObjectsPropsAndValues(outputObject, res.body[index]);
    });
  });
});
