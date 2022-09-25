var createError = require("http-errors");
var express = require("express");
const mongoose = require("mongoose");

const scheduledFunctions = require("./scheduled-functions");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var currenciesRouter = require("./routes/currencies");
var app = express();
var cors = require("cors");
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

var swaggerUi = require("swagger-ui-express");
// @ts-ignore
var swaggerFile = require("./swagger_output.json");

require("dotenv").config();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

//routs
app.use("/", indexRouter);
app.use("/api/v1", currenciesRouter);

// documentation
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

const PORT = process.env.PORT || 8080;
const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, { dbName: process.env.DB_NAME });
    app.listen(PORT, () => {
      console.log(`App running on port http://localhost:${PORT}`);
      console.log(
        `OpenAPI documentation available in http://localhost:${PORT}/doc`
      );
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

if (process.env.NODE_ENV != "test") {
  start();
  // scheduled functions
  scheduledFunctions.initScheduledJobs();
}

module.exports = app;
