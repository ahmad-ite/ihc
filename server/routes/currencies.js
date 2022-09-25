const express = require("express");
const router = express.Router();
const { validationResult, query } = require("express-validator");
const { of } = require("rxjs");
const {
  cryptoHistory,
  cryptoPrice,
} = require("../contollers/currencies.controller");

router.get(
  "/crypto/history",

  //filters validations
  query("from")
    .custom((d) => new Date(d).getTime() > 0)
    .optional({ nullable: true })
    .withMessage("from must be in correct format yyyy:mm:dd hh:mm:ss"),
  query("to")
    .custom((d) => new Date(d).getTime() > 0)
    .optional({ nullable: true })
    .withMessage("from must be in correct format yyyy:mm:dd hh:mm:ss"),
  query("page").isNumeric().optional({ nullable: true }),
  query("limit").isNumeric().optional({ nullable: true }),
  function (req, res) {
    // #swagger.tags = ['Crypto']

    //check filters errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return of(errors.array()).subscribe((errors) => {
        res.status(400).json({ errors: errors });
      });
    }

    return cryptoHistory(req, res);
  }
);

router.get(
  "/crypto/price",

  function (req, res) {
    // #swagger.tags = ['Crypto']
    return cryptoPrice(req, res);
  }
);

module.exports = router;
