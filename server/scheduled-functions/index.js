"use strict";
const CronJob = require("node-cron");
const { syncCryptoHistory } = require("./crypto-history");
const { syncCryptoPrice } = require("./crypto-prices");

module.exports.initScheduledJobs = () => {
  /**
   *   scheduler Jobs
   */

  // sync crypto prices
  CronJob.schedule("*/10 * * * * *", () => {
    // run every 10 seconds
    console.log("11111111", new Date());
    syncCryptoPrice().subscribe();
  }).start();

  // sync crypto history hourly
  //call on minutes 0,1,10,30 for every hour 
  CronJob.schedule("0 0,1,10,30 * * * *", () => {
    // run every hour {n} times
    // console.log("11111111", new Date());
    syncCryptoHistory().subscribe();
  }).start();
};
