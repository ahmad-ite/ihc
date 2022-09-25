const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(  process.env.DB_URL).then(() => {
    console.log("MongoDB is connected");
}).catch((e) => {
    console.log("MongoDB is not connected");
})