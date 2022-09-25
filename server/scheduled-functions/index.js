"use strict";
const CronJob = require("node-cron");
const { syncCryptoHistory } = require("./crypto-history");
const { syncCryptoPrice } = require("./crypto-prices");

module.exports.initScheduledJobs = () => {
  /**
   *   scheduler Jobs
   */

  /**
   * - sync crypto prices
   * - call function every 10 seconds
   */
  CronJob.schedule("*/10 * * * * *", () => {
    syncCryptoPrice().subscribe();
  }).start();

  /**
   * - sync crypto history hourly
   * - we need only one call to fetch last hour data but some times there is a delay from cryptocompare to fetch
   *   the data for last hour so that we call it every minute
   * - if the data for last hour fetched before the function will stop the cryptocompare call
   */
  CronJob.schedule("0 * * * * *", () => {
    syncCryptoHistory().subscribe();
  }).start();
};
