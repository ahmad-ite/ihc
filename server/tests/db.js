const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

// const mongo = new MongoMemoryServer();
let mongo = null;
// connect to db
module.exports.connect = async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri, { dbName: "test" });
};

// disconnect && close the connection
module.exports.closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
};

// clear   db && data
module.exports.clearDatabase = async () => {
  if (mongo) {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
};
